// conformidade/index.js
// Persistência, versionamento, rotas e integração ao fluxo:
// Solicitação → Diagnóstico → Recomendação → Verificação de conformidade → Análise do TI → Validação do DOD → ETP.
const crypto = require('node:crypto');
const CAT = require('./catalogo');
const { avaliar } = require('./motor');

const STATUS_EXCECAO_ABERTA = ['aguardando_ti', 'ajustes_solicitados'];
const ROTULO_EXCECAO = {
  aguardando_ti: 'Aguardando análise do TI', ajustes_solicitados: 'Ajustes solicitados ao servidor',
  aprovada: 'Excepcionalidade aprovada', rejeitada: 'Solução excepcional rejeitada'
};

function serializarCatalogo(catalogo) {
  return JSON.stringify(catalogo, (k, v) => (v instanceof RegExp ? v.toString() : v));
}

function install(app, db, registrarHistorico, catalogo = CAT) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conformidade_versoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, rotulo TEXT NOT NULL, hash TEXT UNIQUE NOT NULL,
      catalogo_json TEXT NOT NULL, perfis_json TEXT NOT NULL, criado_em TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verificacoes_conformidade (
      id INTEGER PRIMARY KEY AUTOINCREMENT, demanda_id INTEGER NOT NULL, protocolo TEXT NOT NULL,
      versao_id INTEGER NOT NULL, origem TEXT NOT NULL, resultado TEXT NOT NULL, resultado_json TEXT NOT NULL,
      perfil_snapshot_json TEXT, entrada_snapshot_json TEXT NOT NULL, criado_por TEXT NOT NULL, criado_em TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS verif_conf_demanda ON verificacoes_conformidade(demanda_id);
    CREATE TABLE IF NOT EXISTS excepcionalidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT, demanda_id INTEGER NOT NULL, protocolo TEXT NOT NULL,
      verificacao_id INTEGER, origem TEXT NOT NULL, status TEXT NOT NULL,
      requisito_nao_atendido TEXT NOT NULL, perfil_referencia_id INTEGER, motivo TEXT NOT NULL,
      alternativas_sugeridas_json TEXT, requer_complementacao INTEGER NOT NULL DEFAULT 0,
      informacoes_complementares_json TEXT NOT NULL DEFAULT '[]',
      justificativa_tecnica TEXT, alternativas_avaliadas_json TEXT, solucao_aprovada TEXT, decisao TEXT,
      decidido_por TEXT, decidido_por_id INTEGER, decidido_em TEXT, criado_em TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS excecao_demanda ON excepcionalidades(demanda_id);
    CREATE TABLE IF NOT EXISTS decisoes_conformidade (
      id INTEGER PRIMARY KEY AUTOINCREMENT, demanda_id INTEGER NOT NULL, protocolo TEXT NOT NULL,
      excepcionalidade_id INTEGER, verificacao_id INTEGER, acao TEXT NOT NULL,
      autor TEXT NOT NULL, autor_id INTEGER, autor_cargo TEXT, detalhes_json TEXT NOT NULL, criado_em TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS decisoes_conf_demanda ON decisoes_conformidade(demanda_id);
    CREATE TRIGGER IF NOT EXISTS verif_conf_sem_update BEFORE UPDATE ON verificacoes_conformidade
      BEGIN SELECT RAISE(ABORT, 'Verificações de conformidade são imutáveis.'); END;
    CREATE TRIGGER IF NOT EXISTS verif_conf_sem_delete BEFORE DELETE ON verificacoes_conformidade
      BEGIN SELECT RAISE(ABORT, 'Verificações de conformidade são imutáveis.'); END;
    CREATE TRIGGER IF NOT EXISTS decisoes_conf_sem_update BEFORE UPDATE ON decisoes_conformidade
      BEGIN SELECT RAISE(ABORT, 'Decisões registradas são imutáveis.'); END;
    CREATE TRIGGER IF NOT EXISTS decisoes_conf_sem_delete BEFORE DELETE ON decisoes_conformidade
      BEGIN SELECT RAISE(ABORT, 'Decisões registradas são imutáveis.'); END;
    CREATE TRIGGER IF NOT EXISTS conf_versoes_sem_update BEFORE UPDATE ON conformidade_versoes
      BEGIN SELECT RAISE(ABORT, 'Versões de regras são imutáveis.'); END;
  `);

  const agora = () => new Date().toISOString();
  const json = (v, fb) => { try { return v ? JSON.parse(v) : fb; } catch { return fb; } };
  const perfisAtuais = () => db.prepare('SELECT * FROM perfis_hardware ORDER BY id').all();

  // Versão = hash(catálogo + perfis cadastrados). Mudou perfil ou regra → nova versão; o histórico mantém a antiga.
  function versaoAtual() {
    const perfis = perfisAtuais();
    const catJson = serializarCatalogo(catalogo);
    const perfisJson = JSON.stringify(perfis);
    const hash = crypto.createHash('sha256').update(catJson + '|' + perfisJson).digest('hex');
    let v = db.prepare('SELECT * FROM conformidade_versoes WHERE hash = ?').get(hash);
    if (!v) {
      const id = db.prepare('INSERT INTO conformidade_versoes (rotulo, hash, catalogo_json, perfis_json, criado_em) VALUES (?,?,?,?,?)')
        .run(catalogo.CATALOGO_ROTULO, hash, catJson, perfisJson, agora()).lastInsertRowid;
      v = db.prepare('SELECT * FROM conformidade_versoes WHERE id = ?').get(id);
    }
    return { versao: v, perfis };
  }

  const buscarDemanda = (p) => db.prepare('SELECT * FROM demandas WHERE protocolo = ? OR etp_numero = ? OR id = ?').get(p, p, Number(p) || -1);
  const excecaoAtual = (demandaId) => db.prepare('SELECT * FROM excepcionalidades WHERE demanda_id = ? ORDER BY id DESC LIMIT 1').get(demandaId);
  const ultimaVerificacao = (demandaId) => db.prepare('SELECT * FROM verificacoes_conformidade WHERE demanda_id = ? ORDER BY id DESC LIMIT 1').get(demandaId);

  function registrarDecisao(dem, { excepcionalidadeId = null, verificacaoId = null, acao, autor, detalhes = {} }) {
    db.prepare(`INSERT INTO decisoes_conformidade (demanda_id, protocolo, excepcionalidade_id, verificacao_id, acao, autor, autor_id, autor_cargo, detalhes_json, criado_em)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(dem.id, dem.protocolo, excepcionalidadeId, verificacaoId, acao,
      autor?.nome || 'DimensionaTI (automático)', autor?.id || null, autor?.cargo || null, JSON.stringify(detalhes), agora());
  }

  function verificarDemanda(demandaOuId, origem = 'automatica', autor = null) {
    const dem = typeof demandaOuId === 'object' ? demandaOuId : db.prepare('SELECT * FROM demandas WHERE id = ?').get(demandaOuId);
    if (!dem) return null;
    const { versao, perfis } = versaoAtual();
    const r = avaliar({ demanda: dem, perfis }, catalogo);
    const perfilSnap = perfis.find(p => Number(p.id) === r.perfil_referencia_id) || null;
    const entrada = {
      tipo_necessidade: dem.tipo_necessidade, respostas_diagnostico: dem.respostas_diagnostico, recursos_existentes: dem.recursos_existentes,
      softwares: dem.softwares, perfil_recomendado_id: dem.perfil_recomendado_id, perfil_escolhido_id: dem.perfil_escolhido_id,
      quantidade_usuarios: dem.quantidade_usuarios, justificativa_usuario: dem.justificativa_usuario, cargo: dem.cargo
    };
    const criadoPor = autor ? `${autor.nome}${autor.cargo ? ' (' + autor.cargo + ')' : ''}` : 'DimensionaTI (verificação automática)';
    const vid = db.prepare(`INSERT INTO verificacoes_conformidade (demanda_id, protocolo, versao_id, origem, resultado, resultado_json, perfil_snapshot_json, entrada_snapshot_json, criado_por, criado_em)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(dem.id, dem.protocolo, versao.id, origem, r.resultado, JSON.stringify(r),
      perfilSnap ? JSON.stringify(perfilSnap) : null, JSON.stringify(entrada), criadoPor, agora()).lastInsertRowid;

    // Excepcionalidade: o sistema apenas ENCAMINHA ao TI. Nunca aprova nem rejeita automaticamente.
    const ex = excecaoAtual(dem.id);
    if (r.excecoes.length) {
      if (!ex || (!STATUS_EXCECAO_ABERTA.includes(ex.status) && ex.verificacao_id !== null && origem !== 'retroativa' && ex.status !== 'aprovada')) {
        const requisito = r.excecoes.map(e => e.requisito).join('; ');
        const motivo = r.excecoes.map(e => e.motivo).join(' ');
        const alternativas = [...new Set(r.excecoes.flatMap(e => e.alternativas || []))];
        const eid = db.prepare(`INSERT INTO excepcionalidades (demanda_id, protocolo, verificacao_id, origem, status, requisito_nao_atendido, perfil_referencia_id, motivo, alternativas_sugeridas_json, requer_complementacao, criado_em)
          VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(dem.id, dem.protocolo, vid, 'automatica', 'aguardando_ti', requisito, r.perfil_referencia_id, motivo,
          JSON.stringify(alternativas), r.excecoes.some(e => e.requerComplementacao) ? 1 : 0, agora()).lastInsertRowid;
        registrarDecisao(dem, { excepcionalidadeId: eid, verificacaoId: vid, acao: 'excecao_encaminhada_ao_ti', detalhes: { requisito, motivo } });
      } else {
        registrarDecisao(dem, { excepcionalidadeId: ex.id, verificacaoId: vid, acao: 'nova_verificacao_vinculada', detalhes: { resultado: r.resultado, status_excecao: ex.status } });
      }
    } else if (ex && STATUS_EXCECAO_ABERTA.includes(ex.status)) {
      registrarDecisao(dem, { excepcionalidadeId: ex.id, verificacaoId: vid, acao: 'verificacao_sem_excecao', detalhes: { observacao: 'Nova verificação não identificou excepcionalidade; decisão permanece com o TI.' } });
    }

    if (registrarHistorico) {
      registrarHistorico(dem.id, dem.protocolo, `Verificação de conformidade: ${r.rotulo}`, 'DimensionaTI', origem === 'automatica' ? 'Verificação automática' : criadoPor, 'sistema',
        `${r.explicacao} Versão de regras ${versao.rotulo} (#${versao.id}).${r.pendencias.length ? ' Pendências: ' + r.pendencias.join(' ') : ''}`, dem.status);
    }
    return db.prepare('SELECT * FROM verificacoes_conformidade WHERE id = ?').get(vid);
  }

  function montarDetalhe(dem) {
    let atual = ultimaVerificacao(dem.id);
    if (!atual) atual = verificarDemanda(dem, 'retroativa');
    const historico = db.prepare(`SELECT v.id, v.origem, v.resultado, v.criado_por, v.criado_em, v.versao_id, cv.rotulo AS versao_rotulo, cv.hash AS versao_hash
      FROM verificacoes_conformidade v JOIN conformidade_versoes cv ON cv.id = v.versao_id WHERE v.demanda_id = ? ORDER BY v.id DESC`).all(dem.id);
    const versao = db.prepare('SELECT id, rotulo, hash, criado_em FROM conformidade_versoes WHERE id = ?').get(atual.versao_id);
    const vigente = versaoAtual().versao;
    const perfilSnap = json(atual.perfil_snapshot_json, null);
    const perfilAgora = perfilSnap ? db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(perfilSnap.id) : null;
    const camposAlterados = perfilSnap && perfilAgora ? Object.keys(perfilSnap).filter(k => String(perfilSnap[k]) !== String(perfilAgora[k])) : [];
    const ex = excecaoAtual(dem.id);
    return {
      protocolo: dem.protocolo,
      atual: { id: atual.id, origem: atual.origem, criado_em: atual.criado_em, criado_por: atual.criado_por, ...json(atual.resultado_json, {}) },
      versao, versao_vigente: { id: vigente.id, rotulo: vigente.rotulo, hash: vigente.hash },
      regras_desatualizadas: vigente.id !== atual.versao_id,
      perfil_snapshot: perfilSnap, perfil_alterado_desde_verificacao: camposAlterados,
      fundamentacao_perfil: perfilSnap ? (catalogo.FUNDAMENTACAO_PERFIS[perfilSnap.id] || null) : null,
      historico,
      excepcionalidade: ex ? { ...ex, rotulo_status: ROTULO_EXCECAO[ex.status] || ex.status,
        alternativas_sugeridas: json(ex.alternativas_sugeridas_json, []), alternativas_avaliadas: json(ex.alternativas_avaliadas_json, []),
        informacoes_complementares: json(ex.informacoes_complementares_json, []) } : null,
      decisoes: db.prepare('SELECT * FROM decisoes_conformidade WHERE demanda_id = ? ORDER BY id DESC').all(dem.id)
        .map(x => ({ ...x, detalhes: json(x.detalhes_json, {}) })),
      referencias: catalogo.REFERENCIAS
    };
  }

  // Resumo estruturado para inclusão nos documentos oficiais (DOD/DFD e ETP) e listagem.
  function resumoParaDocumento(dem) {
    if (!dem || !dem.id) return null;
    let v = ultimaVerificacao(dem.id);
    if (!v) v = verificarDemanda(dem, 'retroativa');
    if (!v) return null;
    const r = json(v.resultado_json, {});
    const versao = db.prepare('SELECT id, rotulo, hash, criado_em FROM conformidade_versoes WHERE id = ?').get(v.versao_id);
    const perfilSnap = json(v.perfil_snapshot_json, null);
    const ex = excecaoAtual(dem.id);
    const ultimaDecisao = db.prepare('SELECT * FROM decisoes_conformidade WHERE demanda_id = ? ORDER BY id DESC LIMIT 1').get(dem.id);
    return {
      verificacao_id: v.id,
      versao_regras: versao ? `${versao.rotulo} (#${versao.id})` : String(v.versao_id),
      verificado_em: v.criado_em,
      resultado: v.resultado,
      rotulo: r.rotulo || catalogo.ROTULOS_RESULTADO[v.resultado],
      explicacao: r.explicacao || '',
      perfil_recomendado_id: r.perfil_recomendado_id,
      perfil_referencia_id: r.perfil_referencia_id,
      perfil_snapshot: perfilSnap,
      fundamentacao_perfil: perfilSnap ? (catalogo.FUNDAMENTACAO_PERFIS[perfilSnap.id] || null) : null,
      criterios: (r.criterios || []).map(c => ({ id: c.id, titulo: c.titulo, resultado: c.resultado, explicacao: c.explicacao, referencias: c.referencias })),
      pendencias: r.pendencias || [],
      divergencias: r.divergencias || [],
      respostas_chave: r.respostas || {},
      excepcionalidade: ex ? {
        id: ex.id,
        status: ex.status,
        rotulo_status: ROTULO_EXCECAO[ex.status] || ex.status,
        requisito_nao_atendido: ex.requisito_nao_atendido,
        motivo: ex.motivo,
        justificativa_tecnica: ex.justificativa_tecnica,
        solucao_aprovada: ex.solucao_aprovada,
        alternativas_avaliadas: json(ex.alternativas_avaliadas_json, []),
        decisao: ex.decisao,
        decidido_por: ex.decidido_por,
        decidido_em: ex.decidido_em
      } : null,
      ultima_decisao: ultimaDecisao ? {
        acao: ultimaDecisao.acao,
        autor: ultimaDecisao.autor,
        autor_cargo: ultimaDecisao.autor_cargo,
        criado_em: ultimaDecisao.criado_em,
        detalhes: json(ultimaDecisao.detalhes_json, {})
      } : null
    };
  }

  // Regras para validar o DOD. A recomendação automática nunca substitui a decisão humana:
  // ela exige que o TI analise exceções em aberto e registre parecer quando há superdimensionamento ou não conformidade.
  function checarValidacao(dem, parecer, autor) {
    let v = ultimaVerificacao(dem.id) || verificarDemanda(dem, 'retroativa');
    const ex = excecaoAtual(dem.id);
    if (ex && STATUS_EXCECAO_ABERTA.includes(ex.status)) {
      return { ok: false, status: 409, codigo: 'EXCECAO_EM_ABERTO', error: `Há uma análise de excepcionalidade em aberto (${ROTULO_EXCECAO[ex.status]}). Registre a decisão técnica antes de validar o DOD.` };
    }
    if (ex && ex.status === 'rejeitada') {
      return { ok: false, status: 409, codigo: 'EXCECAO_REJEITADA', error: 'A excepcionalidade técnica foi rejeitada pelo TI. Solicite ajustes ao servidor ou reprove a demanda.' };
    }
    if (v.resultado === 'nao_conforme') {
      return { ok: false, status: 409, codigo: 'NAO_CONFORME', error: 'A verificação identificou descumprimento de regra aplicável (necessidade não descrita). Solicite ajustes ao servidor e reexecute a verificação.' };
    }
    const exigeParecer = v.resultado === 'superdimensionamento' || (v.resultado === 'excepcionalidade' && (!ex || ex.status !== 'aprovada'));
    const texto = String(parecer || '').trim();
    if (exigeParecer && texto.length < 20) {
      const r = json(v.resultado_json, {});
      return { ok: false, status: 409, codigo: 'PARECER_OBRIGATORIO', resultado: v.resultado, rotulo: r.rotulo, pendencias: r.pendencias || [],
        error: `Resultado da verificação: ${r.rotulo}. Registre um parecer técnico fundamentado (mínimo 20 caracteres) para validar o DOD.` };
    }
    if (texto) registrarDecisao(dem, { verificacaoId: v.id, excepcionalidadeId: ex?.id || null, acao: 'parecer_validacao_dod', autor, detalhes: { parecer: texto, resultado_verificado: v.resultado } });
    return { ok: true, verificacao: v, resumo: `${catalogo.ROTULOS_RESULTADO[v.resultado]} (verificação #${v.id})` + (texto ? ` • Parecer: ${texto}` : '') };
  }

  function aoResponderAjustes(dem, texto, autorNome) {
    const ex = excecaoAtual(dem.id);
    if (ex && ex.status === 'ajustes_solicitados') {
      const infos = json(ex.informacoes_complementares_json, []);
      infos.push({ data: agora(), autor: autorNome || dem.usuario_nome || 'Servidor', texto: String(texto || '').slice(0, 2000) });
      db.prepare("UPDATE excepcionalidades SET status = 'aguardando_ti', informacoes_complementares_json = ? WHERE id = ?").run(JSON.stringify(infos), ex.id);
      registrarDecisao(dem, { excepcionalidadeId: ex.id, acao: 'complementacao_recebida', autor: { nome: autorNome || dem.usuario_nome }, detalhes: { texto } });
    }
    return verificarDemanda(db.prepare('SELECT * FROM demandas WHERE id = ?').get(dem.id), 'complementacao');
  }

  // ---------- Autenticação/Autorização (suporta sessão por cookie OU identificação explícita do usuário no banco) ----------
  function resolverUsuario(req) {
    if (req.authUser) return req.authUser;
    const uid = req.body?.usuarioId || req.query?.usuarioId || req.headers['x-usuario-id'];
    if (uid) {
      const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(Number(uid));
      if (u) return u;
    }
    return null;
  }

  const exigirAdmin = (req, res) => {
    const u = resolverUsuario(req);
    if (!u) { res.status(401).json({ error: 'Sessão expirada ou usuário não autenticado. Entre novamente.' }); return null; }
    if (u.tipo_usuario !== 'admin') { res.status(403).json({ error: 'Acesso Negado (HTTP 403): Permissão exclusiva da equipe técnica de TIC.' }); return null; }
    return u;
  };

  const comDemanda = (req, res) => {
    const dem = buscarDemanda(req.params.protocolo);
    if (!dem) res.status(404).json({ error: 'Demanda não encontrada.' });
    return dem;
  };

  app.get('/api/conformidade/catalogo', (req, res) => {
    if (!exigirAdmin(req, res)) return;
    const { versao, perfis } = versaoAtual();
    res.json({ versao: { id: versao.id, rotulo: versao.rotulo, hash: versao.hash, criado_em: versao.criado_em },
      referencias: catalogo.REFERENCIAS, fundamentacao_perfis: catalogo.FUNDAMENTACAO_PERFIS, perfis,
      necessidades_especiais: catalogo.NECESSIDADES_ESPECIAIS });
  });

  app.get('/api/conformidade/resumo', (req, res) => {
    if (!exigirAdmin(req, res)) return;
    const protocolos = String(req.query.protocolos || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 200);
    const itens = protocolos.map(p => {
      const dem = buscarDemanda(p); if (!dem) return null;
      const v = ultimaVerificacao(dem.id) || verificarDemanda(dem, 'retroativa');
      const r = json(v.resultado_json, {}); const ex = excecaoAtual(dem.id);
      return { protocolo: dem.protocolo, resultado: v.resultado, rotulo: r.rotulo, verificacao_id: v.id, versao_id: v.versao_id,
        pendencias: r.pendencias || [], excecao: ex ? { status: ex.status, rotulo: ROTULO_EXCECAO[ex.status], decidido_por: ex.decidido_por, decidido_em: ex.decidido_em } : null };
    }).filter(Boolean);
    res.json({ itens });
  });

  app.get('/api/demandas/:protocolo/conformidade', (req, res) => {
    try {
      if (!exigirAdmin(req, res)) return;
      const dem = comDemanda(req, res); if (!dem) return;
      res.set('Cache-Control', 'no-store').json(montarDetalhe(dem));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/demandas/:protocolo/conformidade/verificar', (req, res) => {
    try {
      const u = exigirAdmin(req, res); if (!u) return;
      const dem = comDemanda(req, res); if (!dem) return;
      verificarDemanda(dem, 'reverificacao_ti', u);
      res.json({ success: true, conformidade: montarDetalhe(db.prepare('SELECT * FROM demandas WHERE id = ?').get(dem.id)) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Abertura manual de excepcionalidade pelo TI (quando o técnico identifica necessidade fora dos perfis).
  app.post('/api/demandas/:protocolo/excepcionalidade', (req, res) => {
    try {
      const u = exigirAdmin(req, res); if (!u) return;
      const dem = comDemanda(req, res); if (!dem) return;
      const requisito = String(req.body?.requisito || '').trim();
      const motivo = String(req.body?.motivo || '').trim();
      if (requisito.length < 5 || motivo.length < 10) return res.status(400).json({ error: 'Informe o requisito não atendido (mín. 5 caracteres) e o motivo (mín. 10 caracteres).' });
      const ex = excecaoAtual(dem.id);
      if (ex && STATUS_EXCECAO_ABERTA.includes(ex.status)) return res.status(409).json({ error: 'Já existe uma análise de excepcionalidade em aberto para esta demanda.' });
      const v = ultimaVerificacao(dem.id) || verificarDemanda(dem, 'retroativa');
      const eid = db.prepare(`INSERT INTO excepcionalidades (demanda_id, protocolo, verificacao_id, origem, status, requisito_nao_atendido, perfil_referencia_id, motivo, alternativas_sugeridas_json, criado_em)
        VALUES (?,?,?,?,?,?,?,?,?,?)`).run(dem.id, dem.protocolo, v.id, 'manual_ti', 'aguardando_ti', requisito.slice(0, 500), dem.perfil_escolhido_id, motivo.slice(0, 2000), '[]', agora()).lastInsertRowid;
      registrarDecisao(dem, { excepcionalidadeId: eid, verificacaoId: v.id, acao: 'excecao_aberta_pelo_ti', autor: u, detalhes: { requisito, motivo } });
      registrarHistorico?.(dem.id, dem.protocolo, 'Análise de excepcionalidade aberta pelo TI', u.nome, u.cargo, 'admin', `Requisito: ${requisito}. Motivo: ${motivo}`, dem.status);
      res.status(201).json({ success: true, conformidade: montarDetalhe(dem) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/demandas/:protocolo/excepcionalidade/decisao', (req, res) => {
    try {
      const u = exigirAdmin(req, res); if (!u) return;
      const dem = comDemanda(req, res); if (!dem) return;
      const ex = excecaoAtual(dem.id);
      if (!ex) return res.status(404).json({ error: 'Não há análise de excepcionalidade para esta demanda.' });
      if (ex.status === 'ajustes_solicitados') return res.status(409).json({ error: 'Aguardando a resposta do servidor aos ajustes solicitados.' });
      if (ex.status !== 'aguardando_ti') return res.status(409).json({ error: `Excepcionalidade já decidida (${ROTULO_EXCECAO[ex.status]}). Abra nova análise se necessário.` });

      const { decisao, justificativaTecnica, solucaoAprovada, orientacaoServidor } = req.body || {};
      const justificativa = String(justificativaTecnica || '').trim();
      const alternativas = Array.isArray(req.body?.alternativas) ? req.body.alternativas.slice(0, 10).map(a => ({
        descricao: String(a?.descricao || '').trim().slice(0, 300), viavel: a?.viavel === true ? true : a?.viavel === false ? false : null,
        observacao: String(a?.observacao || '').trim().slice(0, 500)
      })).filter(a => a.descricao) : [];
      if (!['aprovar', 'ajustes', 'rejeitar'].includes(decisao)) return res.status(400).json({ error: 'Decisão inválida.' });
      if (justificativa.length < 30) return res.status(400).json({ error: 'A justificativa técnica é obrigatória (mínimo 30 caracteres).' });
      if (decisao === 'aprovar' && String(solucaoAprovada || '').trim().length < 10) return res.status(400).json({ error: 'Descreva a solução excepcional aprovada (mínimo 10 caracteres).' });
      if (decisao === 'aprovar' && !alternativas.some(a => a.viavel !== null)) return res.status(400).json({ error: 'Avalie ao menos uma alternativa (viável ou não) antes de aprovar.' });
      if (decisao === 'ajustes' && String(orientacaoServidor || '').trim().length < 10) return res.status(400).json({ error: 'Escreva a orientação ao servidor em linguagem simples (mínimo 10 caracteres).' });

      const novoStatus = { aprovar: 'aprovada', ajustes: 'ajustes_solicitados', rejeitar: 'rejeitada' }[decisao];
      const autorFmt = `${u.nome}${u.cargo ? ' (' + u.cargo + ')' : ''}`;
      const quando = agora();
      db.exec('BEGIN');
      try {
        db.prepare(`UPDATE excepcionalidades SET status = ?, decisao = ?, justificativa_tecnica = ?, alternativas_avaliadas_json = ?, solucao_aprovada = ?,
          decidido_por = ?, decidido_por_id = ?, decidido_em = ? WHERE id = ?`)
          .run(novoStatus, decisao, justificativa, JSON.stringify(alternativas), decisao === 'aprovar' ? String(solucaoAprovada).trim() : null, autorFmt, u.id, quando, ex.id);
        registrarDecisao(dem, { excepcionalidadeId: ex.id, verificacaoId: ex.verificacao_id, acao: `excecao_${novoStatus}`, autor: u,
          detalhes: { decisao, justificativa, alternativas, solucaoAprovada: solucaoAprovada || null, orientacaoServidor: orientacaoServidor || null } });
        if (decisao === 'ajustes') {
          db.prepare("UPDATE demandas SET status = 'Ajustes solicitados', ajustes_solicitados = ?, responsavel_analise = ? WHERE id = ?").run(String(orientacaoServidor).trim(), u.nome, dem.id);
        }
        db.exec('COMMIT');
      } catch (e) { db.exec('ROLLBACK'); throw e; }

      const acaoHist = { aprovada: 'Excepcionalidade técnica aprovada pelo TI', ajustes_solicitados: 'Ajustes solicitados na análise de excepcionalidade', rejeitada: 'Solução excepcional rejeitada pelo TI' }[novoStatus];
      registrarHistorico?.(dem.id, dem.protocolo, acaoHist, u.nome, u.cargo, 'admin',
        `Justificativa técnica: ${justificativa}${decisao === 'aprovar' ? ' • Solução aprovada: ' + solucaoAprovada : ''}${decisao === 'ajustes' ? ' • Orientações do TI: ' + orientacaoServidor : ''}`,
        decisao === 'ajustes' ? 'Ajustes solicitados' : dem.status);
      res.json({ success: true, conformidade: montarDetalhe(db.prepare('SELECT * FROM demandas WHERE id = ?').get(dem.id)) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return { verificarDemanda, checarValidacao, aoResponderAjustes, montarDetalhe, resumoParaDocumento, versaoAtual, resolverUsuario };
}

module.exports = { install, STATUS_EXCECAO_ABERTA };
