// conformidade.test.js
// Testes automatizados das regras de conformidade, excepcionalidades, rastreabilidade e permissões.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const { avaliar } = require('./conformidade/motor');
const CAT = require('./conformidade/catalogo');
const { install: installConformidade } = require('./conformidade');

function criarAmbienteTeste() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, senha TEXT,
      cargo TEXT, orgao TEXT, setor TEXT, municipio TEXT DEFAULT 'Lages',
      matricula TEXT, tipo_usuario TEXT DEFAULT 'padrao', instituicao_id INTEGER
    );
    CREATE TABLE instituicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, tipo TEXT, secretaria TEXT, municipio TEXT DEFAULT 'Lages', ativo INTEGER DEFAULT 1
    );
    CREATE TABLE perfis_hardware (
      id INTEGER PRIMARY KEY, nome TEXT, descricao TEXT, processador TEXT, ram TEXT,
      armazenamento TEXT, gpu TEXT, perifericos TEXT, custo_unitario_estimado REAL,
      especificacao_tecnica_completa TEXT, cor_identificadora TEXT
    );
    CREATE TABLE demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, protocolo TEXT UNIQUE, usuario_id INTEGER,
      usuario_nome TEXT, usuario_matricula TEXT, orgao TEXT, municipio TEXT, setor TEXT,
      cargo TEXT, quantidade_usuarios INTEGER, softwares TEXT, perfil_recomendado_id INTEGER,
      perfil_escolhido_id INTEGER, status TEXT, justificativa_usuario TEXT,
      justificativa_tecnica_automatica TEXT, custo_unitario REAL, custo_total REAL,
      economia_estimada REAL, irs INTEGER, nivel_risco TEXT, tipo_necessidade TEXT DEFAULT 'computador',
      respostas_diagnostico TEXT, diagnostico_interpretado TEXT, recomendacao_preliminar TEXT,
      recursos_existentes TEXT, dod_conteudo TEXT, dod_validado INTEGER DEFAULT 0,
      dod_validado_por TEXT, dod_validado_em DATETIME, etp_gerado INTEGER DEFAULT 0,
      etp_conteudo TEXT, etp_numero TEXT, ajustes_solicitados TEXT, responsavel_analise TEXT,
      instituicao_id INTEGER
    );
    CREATE TABLE historico_demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, demanda_id INTEGER, protocolo TEXT,
      data_hora DATETIME DEFAULT CURRENT_TIMESTAMP, acao TEXT, usuario_nome TEXT,
      usuario_cargo TEXT, tipo_usuario TEXT, detalhes TEXT, status_resultante TEXT
    );
    INSERT INTO instituicoes (id, nome, tipo, secretaria) VALUES (1, 'Escola Municipal A', 'escola', 'SME');
    INSERT INTO usuarios (id, nome, email, senha, cargo, orgao, setor, matricula, tipo_usuario, instituicao_id)
    VALUES
      (1, 'Téc. Roberto Valente', 'admin@lages.sc.gov.br', '123456', 'Diretor de TIC', 'PML', 'TIC', 'MAT-01', 'admin', 1),
      (2, 'Profa. Angelita', 'angelita@lages.sc.gov.br', '123456', 'Diretora Escolar', 'SME', 'Escola Municipal A', 'MAT-02', 'padrao', 1);
    INSERT INTO perfis_hardware VALUES
      (1, 'Perfil 1: Administrativo', 'Básico', 'Quad-Core x86-64 (PassMark 8.500+)', '8 GB DDR4', 'SSD 256 GB NVMe', 'Integrada', 'Monitor 23.8" IPS (NR-17)', 1850.0, 'Garantia 36 meses on-site', '#10B981'),
      (2, 'Perfil 2: Análise de Dados', 'Intermediário', 'Hexa-Core (PassMark 18.000+)', '16 GB DDR4', 'SSD 512 GB NVMe', 'Integrada Dual', '2x Monitores 23.8"', 3600.0, 'Garantia 36 meses on-site', '#2563EB'),
      (3, 'Perfil 3: Engenharia e Geoprocessamento', 'Avançado', 'Octa-Core (PassMark 30.000+)', '32 GB DDR5', 'SSD 1 TB NVMe + GPU NVIDIA RTX Dedicada', 'NVIDIA RTX 4060', '2x Monitores 27" QHD', 8200.0, 'Certificação ISV Autodesk', '#7C3AED');
  `);

  const registrarHistorico = (demandaId, protocolo, acao, usuarioNome, usuarioCargo, tipoUsuario, detalhes, statusResultante) => {
    db.prepare('INSERT INTO historico_demandas (demanda_id, protocolo, acao, usuario_nome, usuario_cargo, tipo_usuario, detalhes, status_resultante) VALUES (?,?,?,?,?,?,?,?)')
      .run(demandaId, protocolo, acao, usuarioNome, usuarioCargo, tipoUsuario, detalhes, statusResultante);
  };

  const app = express();
  app.use(express.json());
  const conformidade = installConformidade(app, db, registrarHistorico);

  app.post('/api/demandas/:protocolo/validar-dod', (req, res) => {
    const u = conformidade.resolverUsuario(req);
    if (!u) return res.status(401).json({ error: 'Não autenticado' });
    if (u.tipo_usuario !== 'admin') return res.status(403).json({ error: 'Acesso Negado (HTTP 403)' });
    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(req.params.protocolo);
    if (!dem) return res.status(404).json({ error: 'Não encontrada' });
    const chk = conformidade.checarValidacao(dem, req.body?.parecerConformidade, u);
    if (!chk.ok) return res.status(chk.status).json(chk);
    db.prepare("UPDATE demandas SET status = 'Validado pelo TI', dod_validado = 1 WHERE id = ?").run(dem.id);
    res.json({ success: true, resumo: chk.resumo });
  });

  app.post('/api/demandas/:protocolo/responder-ajustes', (req, res) => {
    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(req.params.protocolo);
    db.prepare("UPDATE demandas SET status = 'Enviado para TI', justificativa_usuario = COALESCE(?, justificativa_usuario) WHERE id = ?")
      .run(req.body.justificativaResposta || '', dem.id);
    const at = db.prepare('SELECT * FROM demandas WHERE id = ?').get(dem.id);
    conformidade.aoResponderAjustes(at, req.body.justificativaResposta, req.body.usuarioNome || 'Profa. Angelita');
    res.json({ success: true });
  });

  return { db, app, conformidade };
}

test('1. Solicitação compatível com o perfil padrão (Desktop rotina escolar)', () => {
  const { db } = criarAmbienteTeste();
  const perfis = db.prepare('SELECT * FROM perfis_hardware ORDER BY id').all();
  const res = avaliar({
    demanda: {
      tipo_necessidade: 'computador',
      perfil_recomendado_id: 1,
      perfil_escolhido_id: 1,
      quantidade_usuarios: 2,
      justificativa_usuario: 'Substituição de computador administrativo da secretaria escolar.',
      respostas_diagnostico: JSON.stringify({
        precisaMobilidade: false,
        formatoEquipamento: 'desktop',
        programasUtilizados: ['Word / Textos & Provas', 'Internet & SGPe'],
        necessidadesEspeciais: ['nenhuma']
      }),
      recursos_existentes: JSON.stringify({ monitor: 'none', teclado: true, mouse: true, segundoMonitor: false })
    },
    perfis
  });
  assert.equal(res.resultado, 'compativel');
  assert.equal(res.rotulo, 'Compatível');
  assert.equal(res.excecoes.length, 0);
  assert.match(res.respostas.atende_necessidade, /^Sim/);
  db.close();
});

test('2. Solicitação com possível superdimensionamento e exigência de parecer do TI', async () => {
  const { db, app, conformidade } = criarAmbienteTeste();
  db.prepare(`INSERT INTO demandas (protocolo, usuario_id, usuario_nome, cargo, orgao, setor, quantidade_usuarios, softwares, perfil_recomendado_id, perfil_escolhido_id, status, justificativa_usuario, respostas_diagnostico, recursos_existentes)
    VALUES ('DOD-2026-9002', 2, 'Profa. Angelita', 'Diretora', 'SME', 'Escola A', 1, '["Internet & SGPe"]', 1, 3, 'Enviado para TI', 'Solicitação de computador para secretaria.', '{"precisaMobilidade":false,"formatoEquipamento":"desktop","programasUtilizados":["Internet & SGPe"]}', '{"monitor":"none"}')`).run();
  const dem = db.prepare("SELECT * FROM demandas WHERE protocolo = 'DOD-2026-9002'").get();
  const v = conformidade.verificarDemanda(dem, 'automatica');
  assert.equal(v.resultado, 'superdimensionamento');

  const server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const base = 'http://localhost:' + server.address().port;
  try {
    // Sem parecer técnico, bloqueia validação com 409 PARECER_OBRIGATORIO
    const rSemParecer = await fetch(`${base}/api/demandas/DOD-2026-9002/validar-dod`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 1 })
    });
    assert.equal(rSemParecer.status, 409);
    const bodySem = await rSemParecer.json();
    assert.equal(bodySem.codigo, 'PARECER_OBRIGATORIO');

    // Com parecer fundamentado do TI, libera validação
    const rComParecer = await fetch(`${base}/api/demandas/DOD-2026-9002/validar-dod`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 1, parecerConformidade: 'Validado pelo TI após readequação orçamentária e justificativa técnica.' })
    });
    assert.equal(rComParecer.status, 200);
  } finally {
    await new Promise(r => server.close(r));
    db.close();
  }
});

test('3, 5 e 6. Necessidade fora dos perfis (Excepcionalidade), ciclo de ajustes e decisão do TI', async () => {
  const { db, app, conformidade } = criarAmbienteTeste();
  // Servidor declara necessidade de acessibilidade (tecnologia assistiva)
  db.prepare(`INSERT INTO demandas (protocolo, usuario_id, usuario_nome, cargo, orgao, setor, quantidade_usuarios, softwares, perfil_recomendado_id, perfil_escolhido_id, status, justificativa_usuario, respostas_diagnostico, recursos_existentes)
    VALUES ('DOD-2026-9003', 2, 'Profa. Angelita', 'Diretora', 'SME', 'Escola A', 1, '["Internet & SGPe"]', 1, 1, 'Enviado para TI', 'Atendimento a servidor com baixa visão.', '{"precisaMobilidade":false,"formatoEquipamento":"desktop","programasUtilizados":["Internet & SGPe"],"necessidadesEspeciais":["acessibilidade"],"necessidadeEspecialDescricao":"Necessita monitor ampliado e teclado em alto contraste"}', '{"monitor":"1x"}')`).run();
  const dem = db.prepare("SELECT * FROM demandas WHERE protocolo = 'DOD-2026-9003'").get();
  const v = conformidade.verificarDemanda(dem, 'automatica');
  assert.equal(v.resultado, 'excepcionalidade');
  // Verifica que NÃO foi rejeitada automaticamente e aguarda decisão do TI
  const detInicial = conformidade.montarDetalhe(dem);
  assert.equal(detInicial.excepcionalidade.status, 'aguardando_ti');

  const server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const base = 'http://localhost:' + server.address().port;
  try {
    // Não pode validar DOD enquanto a exceção está em aberto
    const rValBloq = await fetch(`${base}/api/demandas/DOD-2026-9003/validar-dod`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 1 })
    });
    assert.equal(rValBloq.status, 409);
    assert.equal((await rValBloq.json()).codigo, 'EXCECAO_EM_ABERTO');

    // TI solicita ajustes / informações complementares ao servidor
    const rAjuste = await fetch(`${base}/api/demandas/DOD-2026-9003/excepcionalidade/decisao`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: 1,
        decisao: 'ajustes',
        justificativaTecnica: 'Necessário confirmar o tamanho de tela recomendado pelo laudo ocupacional para especificação.',
        orientacaoServidor: 'Informe se há indicação de polegadas do monitor ou periférico específico.'
      })
    });
    assert.equal(rAjuste.status, 200);
    const confAjuste = (await rAjuste.json()).conformidade;
    assert.equal(confAjuste.excepcionalidade.status, 'ajustes_solicitados');

    // Servidor responde aos ajustes -> volta para aguardando_ti com a informação complementar
    const rResp = await fetch(`${base}/api/demandas/DOD-2026-9003/responder-ajustes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ justificativaResposta: 'Indicação de monitor 27 polegadas e teclado ampliado.' })
    });
    assert.equal(rResp.status, 200);

    // TI aprova a excepcionalidade avaliando alternativas
    const rAprova = await fetch(`${base}/api/demandas/DOD-2026-9003/excepcionalidade/decisao`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: 1,
        decisao: 'aprovar',
        justificativaTecnica: 'Excepcionalidade fundamentada no art. 34, §1º da Lei 13.146/2015 (LBI) para acessibilidade no posto de trabalho.',
        solucaoAprovada: 'Perfil 1 Desktop acrescido de Monitor 27" IPS e teclado adaptado de alto contraste.',
        alternativas: [
          { descricao: 'Perfil 1 padrão com monitor 23,8"', viavel: false, observacao: 'Área visual insuficiente para baixa visão severa' },
          { descricao: 'Perfil 1 + Monitor 27" + Teclado alto contraste', viavel: true, observacao: 'Atende com menor custo adicional' }
        ]
      })
    });
    assert.equal(rAprova.status, 200);
    const confAprov = (await rAprova.json()).conformidade;
    assert.equal(confAprov.excepcionalidade.status, 'aprovada');

    // Agora o DOD pode ser validado normalmente pelo TI
    const rValOk = await fetch(`${base}/api/demandas/DOD-2026-9003/validar-dod`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 1 })
    });
    assert.equal(rValOk.status, 200);

    // Resumo para documento (DOD/ETP) contém a excepcionalidade aprovada e alternativas
    const docResumo = conformidade.resumoParaDocumento(db.prepare("SELECT * FROM demandas WHERE protocolo = 'DOD-2026-9003'").get());
    assert.equal(docResumo.excepcionalidade.status, 'aprovada');
    assert.equal(docResumo.excepcionalidade.alternativas_avaliadas.length, 2);
  } finally {
    await new Promise(r => server.close(r));
    db.close();
  }
});

test('4. Regra sem aplicabilidade normativa confirmada nunca gera Não conforme', () => {
  const { db } = criarAmbienteTeste();
  const perfis = db.prepare('SELECT * FROM perfis_hardware ORDER BY id').all();
  // NR-17, Portaria SGD/MGI 2.715/2023 e Decreto 20.682/2023 estão com aplicabilidade não confirmada / não aplicável diretamente
  const refsNaoConfirmadas = CAT.REFERENCIAS.filter(r => r.aplicabilidade !== 'confirmada').map(r => r.id);
  assert.ok(refsNaoConfirmadas.includes('NR17_ERGONOMIA'));
  assert.ok(refsNaoConfirmadas.includes('PORTARIA_SGD_2715_2023'));
  assert.ok(refsNaoConfirmadas.includes('DECRETO_LAGES_20682_2023'));

  const res = avaliar({
    demanda: {
      tipo_necessidade: 'computador',
      perfil_recomendado_id: 1,
      perfil_escolhido_id: 1,
      justificativa_usuario: 'Atendimento administrativo regular.',
      respostas_diagnostico: JSON.stringify({ precisaMobilidade: false, formatoEquipamento: 'desktop', programasUtilizados: ['Internet & SGPe'] }),
      recursos_existentes: JSON.stringify({ monitor: 'none' })
    },
    perfis
  });
  const c08 = res.criterios.find(c => c.id === 'C08_ERGONOMIA_MONITOR');
  assert.ok(c08);
  assert.equal(c08.decisiva, false);
  assert.notEqual(res.resultado, 'nao_conforme');
  db.close();
});

test('7. Preservação do histórico após alteração dos perfis e imutabilidade dos registros', () => {
  const { db, conformidade } = criarAmbienteTeste();
  db.prepare(`INSERT INTO demandas (protocolo, usuario_id, usuario_nome, cargo, orgao, setor, quantidade_usuarios, softwares, perfil_recomendado_id, perfil_escolhido_id, status, justificativa_usuario, respostas_diagnostico, recursos_existentes)
    VALUES ('DOD-2026-9007', 2, 'Profa. Angelita', 'Diretora', 'SME', 'Escola A', 1, '["Internet & SGPe"]', 1, 1, 'Enviado para TI', 'Rotina escolar.', '{"precisaMobilidade":false,"formatoEquipamento":"desktop","programasUtilizados":["Internet & SGPe"]}', '{"monitor":"none"}')`).run();
  const dem = db.prepare("SELECT * FROM demandas WHERE protocolo = 'DOD-2026-9007'").get();
  const vOriginal = conformidade.verificarDemanda(dem, 'automatica');

  // Altera o Perfil 1 posteriormente no banco
  db.prepare("UPDATE perfis_hardware SET ram = '16 GB DDR5', custo_unitario_estimado = 2500 WHERE id = 1").run();

  // Consulta o detalhe da demanda anterior: o snapshot original deve permanecer intacto com '8 GB DDR4'
  const det = conformidade.montarDetalhe(dem);
  assert.equal(det.atual.id, vOriginal.id);
  assert.equal(det.perfil_snapshot.ram, '8 GB DDR4');
  assert.ok(det.regras_desatualizadas);
  assert.ok(det.perfil_alterado_desde_verificacao.includes('ram'));

  // Tenta adulterar diretamente o registro de verificação (deve falhar pela trigger de imutabilidade)
  assert.throws(() => {
    db.prepare("UPDATE verificacoes_conformidade SET resultado = 'nao_conforme' WHERE id = ?").run(vOriginal.id);
  }, /imutáveis/);
  db.close();
});

test('8. Tentativa de validação ou decisão de conformidade por usuário sem permissão (HTTP 403)', async () => {
  const { db, app, conformidade } = criarAmbienteTeste();
  db.prepare(`INSERT INTO demandas (protocolo, usuario_id, usuario_nome, cargo, orgao, setor, quantidade_usuarios, softwares, perfil_recomendado_id, perfil_escolhido_id, status, justificativa_usuario, respostas_diagnostico, recursos_existentes)
    VALUES ('DOD-2026-9008', 2, 'Profa. Angelita', 'Diretora', 'SME', 'Escola A', 1, '["Internet & SGPe"]', 1, 1, 'Enviado para TI', 'Rotina escolar.', '{"precisaMobilidade":false,"formatoEquipamento":"desktop","programasUtilizados":["Internet & SGPe"]}', '{"monitor":"none"}')`).run();
  const dem = db.prepare("SELECT * FROM demandas WHERE protocolo = 'DOD-2026-9008'").get();
  conformidade.verificarDemanda(dem, 'automatica');

  const server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const base = 'http://localhost:' + server.address().port;
  try {
    // Usuário 2 (padrao/diretora) tenta validar o DOD
    const rVal = await fetch(`${base}/api/demandas/DOD-2026-9008/validar-dod`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 2 })
    });
    assert.equal(rVal.status, 403);

    // Usuário 2 tenta acessar o endpoint técnico de conformidade do TI
    const rConf = await fetch(`${base}/api/demandas/DOD-2026-9008/conformidade?usuarioId=2`);
    assert.equal(rConf.status, 403);

    // Usuário 2 tenta abrir excepcionalidade manual
    const rExc = await fetch(`${base}/api/demandas/DOD-2026-9008/excepcionalidade`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 2, requisito: 'Teste', motivo: 'Tentativa sem permissão' })
    });
    assert.equal(rExc.status, 403);
  } finally {
    await new Promise(r => server.close(r));
    db.close();
  }
});
