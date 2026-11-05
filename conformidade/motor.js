// conformidade/motor.js
// Motor PURO de verificação de conformidade. Não acessa banco nem rede: recebe dados e catálogo,
// devolve resultado explicável. A decisão final permanece com a equipe de TI.
const CAT = require('./catalogo');

const PRECEDENCIA = ['compativel', 'pendente', 'superdimensionamento', 'excepcionalidade', 'nao_conforme'];

function parseJson(v, fallback) {
  if (v == null || v === '') return fallback;
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return fallback; }
}

function nivelDoSoftware(nome, catalogo) {
  for (const m of catalogo.MAPA_SOFTWARE) if (m.regex.test(String(nome))) return { nivel: m.nivel, rotulo: m.rotulo };
  return null;
}

function refInfo(ids, catalogo) {
  return ids.map(id => catalogo.REFERENCIAS.find(r => r.id === id)).filter(Boolean)
    .map(r => ({ id: r.id, titulo: r.titulo, tipo: r.tipo, aplicabilidade: r.aplicabilidade }));
}

/**
 * @param {object} entrada { demanda, perfis: [{id,...}] }
 * @param {object} catalogo catálogo (default: ./catalogo)
 */
function avaliar(entrada, catalogo = CAT) {
  const d = entrada.demanda || {};
  const perfis = entrada.perfis || [];
  const resp = parseJson(d.respostas_diagnostico, {}) || {};
  const recs = parseJson(d.recursos_existentes, {}) || {};
  const softwaresDecl = (Array.isArray(resp.programasUtilizados) && resp.programasUtilizados.length)
    ? resp.programasUtilizados : (parseJson(d.softwares, []) || []);
  const tipo = d.tipo_necessidade || resp.tipoNecessidade || 'computador';
  const perfilRecId = Number(d.perfil_recomendado_id) || 1;
  const perfilEscId = Number(d.perfil_escolhido_id) || perfilRecId;
  const perfilRef = perfis.find(p => Number(p.id) === perfilEscId) || null;
  const fund = catalogo.FUNDAMENTACAO_PERFIS[perfilEscId] || null;
  const formato = resp.formatoEquipamento || (resp.precisaMobilidade === true ? 'notebook' : (resp.precisaMobilidade === false ? 'desktop' : null));
  const especiais = Array.isArray(resp.necessidadesEspeciais) ? resp.necessidadesEspeciais.filter(x => x && x !== 'nenhuma') : [];
  const descEspecial = String(resp.necessidadeEspecialDescricao || '').trim();
  const justificativa = String(d.justificativa_usuario || '').trim();

  const criterios = [];
  const pendencias = [];
  const divergencias = [];
  const excecoes = [];
  const add = (c) => { c.referencias = refInfo(c.referencias || [], catalogo); criterios.push(c); };

  // C01 — Descrição da necessidade (norma aplicável confirmada)
  const temDescricao = softwaresDecl.length > 0 || justificativa.length >= 20 || Object.keys(resp).length > 0;
  add({
    id: 'C01_DESCRICAO_NECESSIDADE', titulo: 'Necessidade da contratação descrita',
    resultado: temDescricao ? 'atende' : 'nao_atende', efeito: temDescricao ? null : 'nao_conforme',
    explicacao: temDescricao
      ? 'A demanda contém respostas de diagnóstico, atividades/softwares ou justificativa que descrevem a necessidade.'
      : 'Não há respostas de diagnóstico, atividades nem justificativa que descrevam a necessidade. A fase preparatória exige a descrição da necessidade (art. 18, I).',
    referencias: ['LEI14133_ART18']
  });
  if (!temDescricao) pendencias.push('Complementar a descrição da necessidade com o servidor antes da validação.');

  // C02 — Escopo dos perfis
  let escopoOk = tipo === 'computador';
  if (tipo === 'outro') {
    add({ id: 'C02_ESCOPO_PERFIS', titulo: 'Necessidade coberta pelos perfis de estação de trabalho', resultado: 'nao_atende', efeito: 'excepcionalidade',
      explicacao: 'O servidor indicou "outro equipamento", que não corresponde a nenhum perfil cadastrado.', referencias: ['PADRAO_DIMENSIONATI'] });
    excecoes.push({ requisito: 'Equipamento não coberto pelos perfis de estação de trabalho', motivo: 'Tipo de necessidade "outro" informado pelo servidor.', alternativas: ['Enquadrar em perfil existente após contato com o servidor', 'Especificação própria elaborada pelo TI'] });
  } else if (!escopoOk) {
    add({ id: 'C02_ESCOPO_PERFIS', titulo: 'Necessidade coberta pelos perfis de estação de trabalho', resultado: 'pendente', efeito: 'pendente',
      explicacao: `Necessidade do tipo "${catalogo.TIPOS_FORA_DO_ESCOPO[tipo] || tipo}" não é objeto dos perfis de computador; requer triagem do TI.`, referencias: ['PADRAO_DIMENSIONATI'] });
    pendencias.push(`Triagem do TI para necessidade do tipo "${catalogo.TIPOS_FORA_DO_ESCOPO[tipo] || tipo}".`);
  } else {
    add({ id: 'C02_ESCOPO_PERFIS', titulo: 'Necessidade coberta pelos perfis de estação de trabalho', resultado: 'atende', efeito: null,
      explicacao: 'Solicitação de computador, objeto dos perfis cadastrados.', referencias: ['PADRAO_DIMENSIONATI'] });
  }

  // C03 — Softwares catalogados / nível exigido pelas atividades
  let nivelNecessario = 1;
  const naoCatalogados = [];
  const mapeados = [];
  for (const s of softwaresDecl) {
    const m = nivelDoSoftware(s, catalogo);
    if (!m) naoCatalogados.push(s); else { mapeados.push({ software: s, nivel: m.nivel, categoria: m.rotulo }); nivelNecessario = Math.max(nivelNecessario, m.nivel); }
  }
  if (resp.planilhasGrandes === true && resp.multitarefas === true) nivelNecessario = Math.max(nivelNecessario, 2);
  add({
    id: 'C03_SOFTWARES_CATALOGADOS', titulo: 'Softwares e atividades declarados constam do mapeamento de perfis',
    resultado: naoCatalogados.length ? 'pendente' : 'atende', efeito: naoCatalogados.length ? 'pendente' : null,
    explicacao: naoCatalogados.length
      ? `Sem mapeamento para: ${naoCatalogados.join(', ')}. Verificar requisitos mínimos do fabricante.`
      : `Atividades declaradas exigem, pelo padrão institucional, no mínimo o Perfil ${nivelNecessario}.`,
    referencias: ['PADRAO_DIMENSIONATI']
  });
  if (naoCatalogados.length) pendencias.push(`Verificar requisitos de: ${naoCatalogados.join(', ')}.`);

  // C04 — Aderência entre carga de trabalho e perfil indicado
  if (escopoOk || tipo === 'outro') {
    let r = 'atende', ef = null, ex;
    if (perfilEscId > nivelNecessario) {
      r = 'nao_atende'; ef = 'superdimensionamento';
      ex = `Perfil ${perfilEscId} indicado, mas as atividades declaradas (${softwaresDecl.slice(0, 4).join(', ') || 'não informadas'}) justificam o Perfil ${nivelNecessario}.`;
    } else if (perfilEscId < nivelNecessario) {
      r = 'pendente'; ef = 'pendente';
      ex = `Perfil ${perfilEscId} indicado, mas as atividades declaradas exigem o Perfil ${nivelNecessario} (possível subdimensionamento).`;
      pendencias.push(`Revisar perfil: atividades exigem Perfil ${nivelNecessario}.`);
    } else {
      ex = `Perfil ${perfilEscId} é o mínimo exigido pelas atividades declaradas.`;
    }
    if (perfilEscId !== perfilRecId) ex += ` Perfil escolhido (${perfilEscId}) difere do recomendado (${perfilRecId}).`;
    if (perfilEscId > perfilRecId && ef !== 'superdimensionamento') { r = 'nao_atende'; ef = 'superdimensionamento'; }
    add({ id: 'C04_ADERENCIA_CARGA', titulo: 'Perfil proporcional às atividades declaradas', resultado: r, efeito: ef, explicacao: ex,
      referencias: ['PADRAO_DIMENSIONATI', 'LEI14133_ART20'] });
  }

  // C05 — Formato do equipamento x formato especificado no perfil
  if (escopoOk && formato && fund) {
    const ok = fund.formatos_especificados.includes(formato);
    add({ id: 'C05_FORMATO', titulo: 'Formato solicitado está especificado no perfil', resultado: ok ? 'atende' : 'pendente', efeito: ok ? null : 'pendente',
      explicacao: ok ? `Formato ${formato} especificado no Perfil ${perfilEscId}.`
        : `Solicitado ${formato}, mas o Perfil ${perfilEscId} especifica apenas ${fund.formatos_especificados.join(', ')}. Requisitos do ${formato} (tela, bateria, peso) precisam ser definidos pelo TI.`,
      referencias: ['PADRAO_DIMENSIONATI'] });
    if (!ok) { pendencias.push(`Definir especificação de ${formato} para o Perfil ${perfilEscId}.`); divergencias.push(`Perfil ${perfilEscId} não possui especificação de ${formato}.`); }
  }

  // C06 — Segundo monitor
  if (escopoOk && recs.segundoMonitor === true && fund) {
    const justificado = fund.monitores_previstos >= 2 || nivelNecessario >= 2;
    add({ id: 'C06_SEGUNDO_MONITOR', titulo: 'Segundo monitor justificado pelas atividades', resultado: justificado ? 'atende' : 'nao_atende', efeito: justificado ? null : 'superdimensionamento',
      explicacao: justificado ? 'Segundo monitor previsto no perfil ou compatível com as atividades declaradas.'
        : `O Perfil ${perfilEscId} prevê ${fund.monitores_previstos} monitor e as atividades declaradas não justificam tela adicional.`,
      referencias: ['PADRAO_DIMENSIONATI'] });
  }

  // C07 — Reaproveitamento de recursos existentes (informativo)
  if (escopoOk) {
    const existentes = [];
    if (recs.monitor === 'none') existentes.push('monitor');
    if (recs.teclado === true) existentes.push('teclado');
    if (recs.mouse === true) existentes.push('mouse');
    if (recs.webcam === true) existentes.push('webcam');
    add({ id: 'C07_RECURSOS_EXISTENTES', titulo: 'Recursos já disponíveis considerados', resultado: 'informativo', efeito: null,
      explicacao: existentes.length ? `Itens já existentes no posto: ${existentes.join(', ')}. Avaliar dispensa desses itens na aquisição.` : 'Nenhum recurso existente declarado no posto.',
      referencias: ['PADRAO_DIMENSIONATI'] });
  }

  // C08 — Ergonomia do monitor (referência com aplicabilidade não confirmada: não decisiva)
  if (escopoOk && perfilEscId === 1) {
    add({ id: 'C08_ERGONOMIA_MONITOR', titulo: 'Monitor com ajuste de altura (NR-17 citada no perfil)', resultado: 'informativo', efeito: null, decisiva: false,
      explicacao: (recs.monitor === 'none' ? 'O posto reaproveitará monitor existente; não é possível verificar o ajuste de altura. ' : '')
        + 'Aplicabilidade da NR-17 a servidores estatutários não confirmada: tratada como referência técnica, não como obrigação legal.',
      referencias: ['NR17_ERGONOMIA'] });
  }

  // C09 — Indicação de marca na especificação do perfil (art. 41, I)
  if (perfilRef) {
    const texto = [perfilRef.processador, perfilRef.gpu, perfilRef.armazenamento, perfilRef.especificacao_tecnica_completa].filter(Boolean).join(' ');
    const marcas = [...new Set((texto.match(catalogo.MARCAS_HARDWARE) || []).map(m => m.toUpperCase()))];
    const temEquivalencia = /equivalente|similar|refer[eê]ncia|superior/i.test(texto);
    const alerta = marcas.length > 0 && !temEquivalencia;
    add({ id: 'C09_INDICACAO_MARCA', titulo: 'Especificação sem indicação de marca não justificada', resultado: alerta ? 'pendente' : 'atende', efeito: alerta ? 'pendente' : null,
      explicacao: alerta ? `A especificação do Perfil ${perfilEscId} cita ${marcas.join(', ')} sem "ou equivalente". Confirmar justificativa formal (art. 41, I) ou ajustar o texto no TR.`
        : (marcas.length ? 'Marcas citadas acompanhadas de critério de equivalência.' : 'Nenhuma marca de hardware citada na especificação.'),
      referencias: ['LEI14133_ART41'] });
    if (alerta) { pendencias.push(`Confirmar justificativa de marca (${marcas.join(', ')}) no Perfil ${perfilEscId}.`); divergencias.push(`Perfil ${perfilEscId} cita marca(s) ${marcas.join(', ')} sem critério de equivalência.`); }
  }

  // C10 — Necessidades especiais não cobertas pelos perfis
  if (especiais.length) {
    for (const cod of especiais) {
      const ne = catalogo.NECESSIDADES_ESPECIAIS[cod];
      if (!ne) continue;
      const semDescricao = cod === 'programa_nao_listado' && !descEspecial;
      add({ id: `C10_NECESSIDADE_${cod.toUpperCase()}`, titulo: `Necessidade especial: ${ne.rotulo}`, resultado: 'nao_atende', efeito: 'excepcionalidade',
        explicacao: ne.motivo + (descEspecial ? ` Relato do servidor: "${descEspecial}".` : ''), referencias: ne.referencias });
      excecoes.push({ requisito: ne.requisito, motivo: ne.motivo, alternativas: ne.alternativas, requerComplementacao: semDescricao, codigo: cod });
      if (semDescricao) pendencias.push('Solicitar ao servidor o nome do programa não listado.');
    }
  } else {
    add({ id: 'C10_NECESSIDADES_ESPECIAIS', titulo: 'Necessidades especiais não cobertas pelos perfis', resultado: 'atende', efeito: null,
      explicacao: resp.necessidadesEspeciais ? 'O servidor informou não haver necessidade especial.' : 'Pergunta não respondida (demanda anterior à funcionalidade); nenhuma necessidade especial registrada.',
      referencias: ['PADRAO_DIMENSIONATI'] });
  }

  // C11 — Quantidade (informativo para o ETP)
  const qtd = Number(d.quantidade_usuarios) || 1;
  if (qtd > 1) add({ id: 'C11_QUANTIDADE', titulo: 'Estimativa de quantidade com memória de cálculo', resultado: 'informativo', efeito: null,
    explicacao: `${qtd} equipamentos solicitados. O ETP deve conter estimativa de quantidades com memória de cálculo (elemento obrigatório).`,
    referencias: ['LEI14133_ART18'] });

  // Resultado: maior precedência entre efeitos; "não conforme" só a partir de referência com aplicabilidade confirmada.
  let resultado = 'compativel';
  for (const c of criterios) {
    if (!c.efeito || c.decisiva === false) continue;
    let ef = c.efeito;
    if (ef === 'nao_conforme' && !c.referencias.some(r => r.aplicabilidade === 'confirmada' && r.tipo === 'norma_obrigatoria')) ef = 'pendente';
    if (PRECEDENCIA.indexOf(ef) > PRECEDENCIA.indexOf(resultado)) resultado = ef;
  }

  const necessidade = {
    tipo, formato, nivel_necessario: nivelNecessario, softwares: softwaresDecl, softwares_mapeados: mapeados, nao_catalogados: naoCatalogados,
    necessidades_especiais: especiais, descricao_especial: descEspecial, segundo_monitor: recs.segundoMonitor === true,
    rotina: resp.rotinaDescricao || null, cargo: d.cargo || null, quantidade: qtd
  };
  const comparacao = [
    { aspecto: 'Carga de trabalho', perfil: perfilRef ? `Perfil ${perfilEscId}` : '—', necessidade: `Exige Perfil ${nivelNecessario}` },
    { aspecto: 'Formato', perfil: fund ? fund.formatos_especificados.join(', ') : '—', necessidade: formato || 'não informado' },
    { aspecto: 'Monitores', perfil: fund ? String(fund.monitores_previstos) : '—', necessidade: recs.segundoMonitor ? '2 (segundo monitor solicitado)' : (recs.monitor === 'none' ? 'Reaproveita existente' : '1') },
    { aspecto: 'Memória / processamento', perfil: perfilRef ? `${perfilRef.ram} • ${perfilRef.processador}` : '—', necessidade: mapeados.map(m => m.categoria).filter((v, i, a) => a.indexOf(v) === i).join(', ') || '—' },
    { aspecto: 'Necessidades especiais', perfil: 'Não previstas', necessidade: especiais.length ? especiais.map(c => catalogo.NECESSIDADES_ESPECIAIS[c]?.rotulo || c).join('; ') : 'Nenhuma' }
  ];

  return {
    resultado, rotulo: catalogo.ROTULOS_RESULTADO[resultado], explicacao: catalogo.EXPLICACAO_RESULTADO[resultado],
    perfil_referencia_id: perfilEscId, perfil_recomendado_id: perfilRecId,
    criterios, pendencias, divergencias, excecoes, necessidade, comparacao,
    respostas: perguntasChave(resultado, criterios, excecoes)
  };
}

// As três perguntas que o sistema deve responder (apoio à decisão, não decisão).
function perguntasChave(resultado, criterios, excecoes) {
  const c04 = criterios.find(c => c.id === 'C04_ADERENCIA_CARGA');
  const normas = criterios.filter(c => c.referencias.some(r => r.tipo === 'norma_obrigatoria'));
  const pendNorma = normas.filter(c => c.resultado === 'pendente');
  const falhaNorma = normas.filter(c => c.resultado === 'nao_atende' && c.efeito === 'nao_conforme');
  return {
    atende_necessidade: excecoes.length ? 'Não totalmente: há necessidade não coberta pelos perfis.'
      : (!c04 ? 'Não avaliado (necessidade fora do escopo dos perfis).'
        : c04.resultado === 'atende' ? 'Sim, pelos critérios verificados.' : c04.resultado === 'pendente' ? 'Possivelmente não: risco de subdimensionamento.' : 'Sim, porém com possível superdimensionamento.'),
    alinhado_criterios: falhaNorma.length ? 'Não: há descumprimento de regra aplicável.'
      : pendNorma.length ? 'Parcialmente: há pontos normativos pendentes de confirmação.'
        : resultado === 'superdimensionamento' ? 'Não totalmente: diverge do padrão institucional de dimensionamento.' : 'Sim, quanto aos critérios automáticos verificados.',
    excecao_justificada: excecoes.length ? 'Depende da análise do TI: a justificativa técnica ainda precisa ser registrada e decidida.' : 'Não se aplica: não há excepcionalidade identificada.'
  };
}

module.exports = { avaliar, PRECEDENCIA };
