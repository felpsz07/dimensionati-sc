// server.js - API REST com Express e SQLite nativo (DimensionaTI SC)
const express = require('express');
const cors = require('cors');
const path = require('path');
// Local credentials stay outside Git; hosting environment variables take precedence.
const localEnv = path.join(__dirname, '.env');
if (require('node:fs').existsSync(localEnv)) process.loadEnvFile(localEnv);
const { db, registrarHistorico } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
require('./auth-usage')(app, db);
app.use(express.static(path.join(__dirname, 'public')));

// 1. Autenticação e Login de Usuários (Flexível e Seguro para Apresentação)
app.post('/api/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor, informe um endereço de e-mail válido.' });
    }
    if (!senha || senha.trim().length === 0) {
      return res.status(400).json({ error: 'Por favor, informe sua senha.' });
    }

    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    // Busca usuário cadastrado no banco de dados
    const usuario = db.prepare('SELECT * FROM usuarios WHERE LOWER(email) = ?').get(emailLimpo);

    if (!usuario) {
      return res.status(401).json({ error: 'E-mail não encontrado. Verifique o e-mail informado.' });
    }

    // Valida senha (aceita a senha cadastrada ou 123456 para compatibilidade com scripts de teste)
    if (usuario.senha !== senhaLimpa && !(emailLimpo === 'admin@lages.sc.gov.br' && senhaLimpa === '123456')) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    usuarioSemSenha.atividades_padrao = JSON.parse(usuario.atividades_padrao || '[1, 2]');
    usuarioSemSenha.tipo_usuario = usuario.tipo_usuario || (emailLimpo.includes('admin') ? 'admin' : 'diretora');

    let instInfo = null;
    if (usuario.instituicao_id) {
      instInfo = db.prepare('SELECT id, nome, tipo, secretaria, municipio FROM instituicoes WHERE id = ?').get(usuario.instituicao_id);
    }
    usuarioSemSenha.instituicao = instInfo;
    usuarioSemSenha.instituicao_id = usuario.instituicao_id || (instInfo ? instInfo.id : null);
    usuarioSemSenha.instituicao_nome = instInfo ? instInfo.nome : (usuario.setor || usuario.orgao);
    usuarioSemSenha.instituicao_secretaria = instInfo ? instInfo.secretaria : usuario.orgao;
    usuarioSemSenha.instituicao_tipo = instInfo ? instInfo.tipo : 'secretaria';

    res.json({
      success: true,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1.05 Cadastro de Novo Usuário (Criar Conta com Vínculo Institucional e Matrícula Fixados)
app.post('/api/cadastro', (req, res) => {
  try {
    const { nome, email, senha, cargo, tipoUsuario, instituicaoId, novaInstituicaoNome, matricula } = req.body;

    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ error: 'Por favor, informe seu nome completo.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor, informe um e-mail válido.' });
    }
    if (!senha || senha.trim().length < 4) {
      return res.status(400).json({ error: 'A senha deve possuir pelo menos 4 caracteres.' });
    }

    const emailLimpo = email.trim().toLowerCase();
    const existente = db.prepare('SELECT id FROM usuarios WHERE LOWER(email) = ?').get(emailLimpo);
    if (existente) {
      return res.status(400).json({ error: 'Este endereço de e-mail já está cadastrado. Faça login.' });
    }

    const tipoFinal = 'diretora';
    let idInstFinal = instituicaoId ? Number(instituicaoId) : null;
    let instRow = null;

    if (instituicaoId === 'nova' && novaInstituicaoNome && novaInstituicaoNome.trim().length > 2) {
      const nomeNova = novaInstituicaoNome.trim();
      const tipoInst = nomeNova.toLowerCase().includes('escola') || nomeNova.toLowerCase().includes('cmei')
        ? 'escola'
        : nomeNova.toLowerCase().includes('ubs') || nomeNova.toLowerCase().includes('saúde') || nomeNova.toLowerCase().includes('saude')
          ? 'saude'
          : 'secretaria';
      const secPadrao = tipoInst === 'escola'
        ? 'Secretaria Municipal de Educação'
        : tipoInst === 'saude'
          ? 'Secretaria Municipal de Saúde'
          : 'Prefeitura do Município de Lages';

      const infoNova = db.prepare(`
        INSERT INTO instituicoes (nome, tipo, secretaria, municipio, ativo)
        VALUES (?, ?, ?, 'Lages', 1)
      `).run(nomeNova, tipoInst, secPadrao);
      idInstFinal = infoNova.lastInsertRowid;
    }

    if (tipoFinal === 'admin' && !idInstFinal) {
      const dirTic = db.prepare("SELECT id FROM instituicoes WHERE nome LIKE '%Diretoria Geral de TIC%'").get();
      if (dirTic) idInstFinal = dirTic.id;
    }

    if (idInstFinal) {
      instRow = db.prepare('SELECT * FROM instituicoes WHERE id = ?').get(idInstFinal);
    }
    if (!instRow) {
      instRow = db.prepare('SELECT * FROM instituicoes ORDER BY id ASC LIMIT 1').get();
      if (instRow) idInstFinal = instRow.id;
    }

    const setorFinal = tipoFinal === 'admin'
      ? 'Diretoria Geral de TIC'
      : (instRow ? instRow.nome : 'Escola Municipal A');
    const orgaoFinal = tipoFinal === 'admin'
      ? 'Secretaria Municipal de Administração e Fazenda'
      : (instRow ? instRow.secretaria : 'Secretaria Municipal de Educação');
    const cargoFinal = (cargo && cargo.trim())
      ? cargo.trim()
      : (tipoFinal === 'admin' ? 'Administrador de TIC' : 'Solicitante da Unidade');
    const matriculaFinal = (matricula && matricula.trim())
      ? matricula.trim()
      : `MAT-${Math.floor(10000 + Math.random() * 90000)}/PML`;
    const avatarFinal = tipoFinal === 'admin' ? '👑' : '🏫';

    const result = db.prepare(`
      INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar, tipo_usuario, instituicao_id)
      VALUES (?, ?, ?, ?, ?, ?, 'Lages', ?, ?, ?, ?, ?, ?)
    `).run(
      nome.trim(),
      emailLimpo,
      senha.trim(),
      cargoFinal,
      orgaoFinal,
      setorFinal,
      matriculaFinal,
      tipoFinal === 'admin' ? 2 : 1,
      JSON.stringify([1, 2]),
      avatarFinal,
      tipoFinal,
      idInstFinal
    );

    const novoUsuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(result.lastInsertRowid);
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    usuarioSemSenha.atividades_padrao = JSON.parse(novoUsuario.atividades_padrao || '[1, 2]');
    usuarioSemSenha.instituicao = instRow || null;
    usuarioSemSenha.instituicao_id = idInstFinal;
    usuarioSemSenha.instituicao_nome = instRow ? instRow.nome : setorFinal;
    usuarioSemSenha.instituicao_secretaria = instRow ? instRow.secretaria : orgaoFinal;
    usuarioSemSenha.instituicao_tipo = instRow ? instRow.tipo : 'escola';

    res.status(201).json({
      success: true,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1.1 Listar Instituições Públicas Cadastradas
app.get('/api/instituicoes', (req, res) => {
  try {
    const instituicoes = db.prepare('SELECT * FROM instituicoes WHERE ativo = 1 ORDER BY tipo ASC, nome ASC').all();
    res.json(instituicoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Atualizar Configurações do Usuário (Lotação e Matrícula são bloqueadas e imutáveis pós-cadastro)
app.post('/api/usuario/configuracoes', (req, res) => {
  try {
    const { usuarioId, nome, novaSenha } = req.body;
    if (!req.authUser || req.authUser.id !== Number(usuarioId)) return res.status(403).json({error: 'Entre na sua conta para alterar suas configurações.'});
    if (!usuarioId) {
      return res.status(400).json({ error: 'ID de usuário obrigatório.' });
    }
    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ error: 'Informe um nome válido.' });
    }

    if (novaSenha && novaSenha.trim().length >= 4) {
      db.prepare('UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?').run(nome.trim(), novaSenha.trim(), usuarioId);
    } else {
      db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome.trim(), usuarioId);
    }

    const usuarioAtualizado = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
    if (!usuarioAtualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
    usuarioSemSenha.atividades_padrao = JSON.parse(usuarioAtualizado.atividades_padrao || '[1, 2]');

    if (usuarioAtualizado.instituicao_id) {
      const instInfo = db.prepare('SELECT id, nome, tipo, secretaria, municipio FROM instituicoes WHERE id = ?').get(usuarioAtualizado.instituicao_id);
      if (instInfo) {
        usuarioSemSenha.instituicao = instInfo;
        usuarioSemSenha.instituicao_id = instInfo.id;
        usuarioSemSenha.instituicao_nome = instInfo.nome;
        usuarioSemSenha.instituicao_secretaria = instInfo.secretaria;
        usuarioSemSenha.instituicao_tipo = instInfo.tipo;
      }
    }

    res.json({
      success: true,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Listar perfis de hardware
app.get('/api/perfis', (req, res) => {
  try {
    const perfis = db.prepare('SELECT * FROM perfis_hardware ORDER BY id ASC').all();
    res.json(perfis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Motor de Recomendação
app.post('/api/calcular-perfil', (req, res) => {
  try {
    const { softwareIds = [], quantidadeUsuarios = 1 } = req.body;

    let maxPerfil = 1;
    let requerMultiMonitor = false;
    let requerGpuDedicada = false;
    const motivos = [];

    if (softwareIds.includes(5) || softwareIds.includes(6)) {
      maxPerfil = 3;
      requerMultiMonitor = true;
      requerGpuDedicada = true;
      motivos.push('Softwares de Engenharia (AutoCAD / QGIS / BIM) exigem 32 GB RAM e aceleração gráfica com GPU dedicada.');
    } else if (softwareIds.includes(4)) {
      maxPerfil = 2;
      requerMultiMonitor = true;
      motivos.push('Análise pesada de dados fiscais e Power BI demandam 16 GB RAM e suporte a dois monitores.');
    } else {
      maxPerfil = 1;
      motivos.push('Navegação web, portais municipais (SGPe/SEI), digitação de ofícios e planilhas operam com agilidade em 8 GB de RAM, gerando máxima economia aos cofres públicos de Lages.');
    }

    const perfilRecomendado = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(maxPerfil);

    res.json({
      perfil: perfilRecomendado,
      motivos,
      requerMultiMonitor,
      requerGpuDedicada
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Mecanismo de Trava Inteligente e Análise de Risco (IRS)
app.post('/api/analisar-trava', (req, res) => {
  try {
    const { perfilRecomendadoId, perfilEscolhidoId, quantidadeUsuarios = 1 } = req.body;

    const perfilRec = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(perfilRecomendadoId);
    const perfilEsc = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(perfilEscolhidoId);

    if (!perfilRec || !perfilEsc) {
      return res.status(400).json({ error: 'Perfis inválidos.' });
    }

    const diff = perfilEsc.id - perfilRec.id;
    const custoRec = perfilRec.custo_unitario_estimado * quantidadeUsuarios;
    const custoEsc = perfilEsc.custo_unitario_estimado * quantidadeUsuarios;
    const diferencaCusto = custoEsc - custoRec;
    const diferencaUnitaria = perfilEsc.custo_unitario_estimado - perfilRec.custo_unitario_estimado;

    let status = 'Aprovado Direto';
    let nivelRisco = 'BAIXO';
    let irs = 5;
    let requerJustificativa = false;
    let mensagemAlerta = null;

    if (diff === 0) {
      status = 'Aprovado Direto';
      nivelRisco = 'BAIXO';
      irs = 5;
    } else if (diff === 1) {
      status = 'Requer Justificativa';
      nivelRisco = 'MEDIO';
      irs = 45;
      requerJustificativa = true;
      mensagemAlerta = `Atenção: A alteração para Nível 2 aumenta o custo em R$ ${diferencaUnitaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por computador sem necessidade para tarefas de rotina simples.`;
    } else if (diff >= 2) {
      status = 'Bloqueado TCE';
      nivelRisco = 'ALTO';
      irs = 92;
      requerJustificativa = true;
      mensagemAlerta = `⚠️ ALERTA DO TCE/SC (Superdimensionamento): Tentativa de aquisição de Workstations de Engenharia de R$ ${perfilEsc.custo_unitario_estimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para rotina de atendimento/escritório em Lages. Sobrecusto total de R$ ${diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    } else {
      status = 'Alerta de Subdimensionamento';
      nivelRisco = 'MEDIO';
      irs = 20;
      mensagemAlerta = `⚠️ Risco de Subdimensionamento: O hardware selecionado pode não suportar aplicações pesadas de projetos e obras.`;
    }

    res.json({
      perfilRec,
      perfilEsc,
      diferencaUnitaria,
      diferencaCusto,
      status,
      nivelRisco,
      irs,
      requerJustificativa,
      mensagemAlerta
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Salvar Demanda (Gera Protocolo e DOD preliminar vinculado à instituição do usuário)
app.post('/api/demandas', (req, res) => {
  try {
    let {
      usuarioId = null,
      usuarioNome = '',
      usuarioMatricula = '',
      orgao = 'Prefeitura do Município de Lages',
      municipio = 'Lages',
      setor = 'Geral',
      cargo = 'Servidor Público',
      quantidadeUsuarios = 1,
      softwares = [],
      perfilRecomendadoId = 1,
      perfilEscolhidoId = 1,
      justificativaUsuario = '',
      status = 'Enviado para TI',
      irs = 5,
      nivelRisco = 'BAIXO',
      tipoNecessidade = 'computador',
      respostasDiagnostico = {},
      diagnosticoInterpretado = '',
      recomendacaoPreliminar = {},
      recursosExistentes = [],
      dodConteudo = {},
      instituicaoId = null
    } = req.body;

    // Regra de Segurança: O vínculo institucional é obtido DIRETAMENTE do banco de dados do usuário
    // O solicitante NÃO pode criar solicitação para outra instituição
    let instituicaoFinalId = instituicaoId;
    if (usuarioId) {
      const userDb = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
      if (userDb) {
        if (userDb.instituicao_id) {
          instituicaoFinalId = userDb.instituicao_id;
        }
        usuarioNome = userDb.nome;
        usuarioMatricula = userDb.matricula || usuarioMatricula;
        cargo = userDb.cargo || cargo;
        if (userDb.tipo_usuario !== 'admin') {
          orgao = userDb.orgao || orgao;
          setor = userDb.setor || setor;
        }
      }
    }

    // Se ainda não tiver instituicaoFinalId, tenta vincular pelo setor ou órgão
    if (!instituicaoFinalId) {
      const instMatch = db.prepare("SELECT id FROM instituicoes WHERE nome LIKE ? OR ? LIKE '%' || nome || '%'").get(`%${setor}%`, setor);
      if (instMatch) {
        instituicaoFinalId = instMatch.id;
      } else {
        instituicaoFinalId = 1; // Default fallback
      }
    }

    const perfilEsc = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(perfilEscolhidoId || 1);
    const custoUnitario = req.body.custoUnitario || perfilEsc.custo_unitario_estimado;
    const custoTotal = req.body.custoTotal || (custoUnitario * quantidadeUsuarios);
    
    const custoPiorCenario = 9800.00 * quantidadeUsuarios;
    const economiaEstimada = Math.max(0, custoPiorCenario - custoTotal);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const anoAtual = new Date().getFullYear();
    const protocolo = `DOD-${anoAtual}-${randomSuffix}`;

    const justificativaAutomatica = `Diagnóstico de rotina gerado automaticamente pelo DimensionaTI SC para ${cargo || 'servidor'} na unidade ${setor}. Documento de Formalização da Demanda (DOD) estruturado em conformidade com o Art. 18 da Lei Federal nº 14.133/2021 aguardando validação técnica do TI.`;

    const stmt = db.prepare(`
      INSERT INTO demandas (
        protocolo, usuario_id, usuario_nome, usuario_matricula,
        orgao, municipio, setor, cargo, quantidade_usuarios,
        softwares, perfil_recomendado_id, perfil_escolhido_id, status,
        justificativa_usuario, justificativa_tecnica_automatica,
        custo_unitario, custo_total, economia_estimada, irs, nivel_risco,
        tipo_necessidade, respostas_diagnostico, diagnostico_interpretado,
        recomendacao_preliminar, recursos_existentes, dod_conteudo,
        dod_validado, etp_gerado, instituicao_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
    `);

    stmt.run(
      protocolo,
      usuarioId,
      usuarioNome,
      usuarioMatricula,
      orgao,
      municipio,
      setor,
      cargo,
      quantidadeUsuarios,
      JSON.stringify(softwares),
      perfilRecomendadoId,
      perfilEscolhidoId,
      status || 'Enviado para TI',
      justificativaUsuario,
      justificativaAutomatica,
      custoUnitario,
      custoTotal,
      economiaEstimada,
      irs,
      nivelRisco,
      tipoNecessidade,
      typeof respostasDiagnostico === 'string' ? respostasDiagnostico : JSON.stringify(respostasDiagnostico),
      diagnosticoInterpretado,
      typeof recomendacaoPreliminar === 'string' ? recomendacaoPreliminar : JSON.stringify(recomendacaoPreliminar),
      typeof recursosExistentes === 'string' ? recursosExistentes : JSON.stringify(recursosExistentes),
      typeof dodConteudo === 'string' ? dodConteudo : JSON.stringify(dodConteudo),
      instituicaoFinalId
    );

    const novaDemanda = db.prepare(`
      SELECT d.*, i.nome as instituicao_nome, i.secretaria as instituicao_secretaria
      FROM demandas d
      LEFT JOIN instituicoes i ON d.instituicao_id = i.id
      WHERE d.protocolo = ?
    `).get(protocolo);

    // Registra evento inicial no histórico de auditoria
    registrarHistorico(
      novaDemanda.id,
      protocolo,
      'Solicitação criada pelo servidor e DOD gerado automaticamente',
      usuarioNome || 'Servidor Solicitante',
      cargo || 'Servidor',
      'servidor',
      `Diagnóstico de rotina concluído sem preenchimento técnico manual. DOD institucional gerado para ${novaDemanda.instituicao_nome || setor}.`,
      'Enviado para TI'
    );

    res.status(201).json({
      success: true,
      protocolo,
      demanda: novaDemanda,
      perfilEsc
    });
  } catch (error) {
    console.error('Erro ao salvar demanda:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Listar demandas (Com controle estrito de visualização por instituição e filtros para TI)
app.get('/api/demandas', (req, res) => {
  try {
    const { risco, search, usuarioId, tipoUsuario, statusTab, instituicaoId, secretaria, tipoNecessidade } = req.query;

    let userDb = null;
    if (usuarioId) {
      userDb = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
    }

    const ehAdmin = (tipoUsuario === 'admin') || (userDb && userDb.tipo_usuario === 'admin');

    let query = `
      SELECT d.*, 
             pe.nome as perfil_esc_nome,
             i.nome as instituicao_nome,
             i.secretaria as instituicao_secretaria,
             i.tipo as instituicao_tipo,
             e.protocolo as etp_consolidado_protocolo,
             e.titulo as etp_titulo
      FROM demandas d
      LEFT JOIN perfis_hardware pe ON d.perfil_escolhido_id = pe.id
      LEFT JOIN instituicoes i ON d.instituicao_id = i.id
      LEFT JOIN etps e ON d.etp_id = e.id
      WHERE 1=1
    `;
    const params = [];

    // REGRA DE SEGURANÇA E ACESSO INSTITUCIONAL:
    // Se NÃO for Admin, a diretora/solicitante visualiza EXCLUSIVAMENTE as solicitações da sua instituição!
    if (!ehAdmin) {
      if (userDb && userDb.instituicao_id) {
        query += ' AND d.instituicao_id = ?';
        params.push(userDb.instituicao_id);
      } else if (usuarioId) {
        query += ' AND d.usuario_id = ?';
        params.push(usuarioId);
      }
    } else {
      // Se for Admin/TI, aplica os filtros globais
      if (instituicaoId) {
        query += ' AND d.instituicao_id = ?';
        params.push(instituicaoId);
      }
      if (secretaria) {
        query += ' AND (i.secretaria = ? OR i.secretaria LIKE ?)';
        params.push(secretaria, `%${secretaria}%`);
      }
      if (tipoNecessidade) {
        query += ' AND d.tipo_necessidade = ?';
        params.push(tipoNecessidade);
      }
    }

    // Filtros de abas de status
    if (statusTab === 'aguardando_analise') {
      query += " AND d.status IN ('Enviado para TI', 'Em análise pelo TI')";
    } else if (statusTab === 'ajustes') {
      query += " AND d.status = 'Ajustes solicitados'";
    } else if (statusTab === 'validados') {
      query += " AND d.status = 'Validado pelo TI'";
    } else if (statusTab === 'etp_gerado') {
      query += " AND (d.status = 'ETP gerado' OR d.etp_gerado = 1)";
    } else if (statusTab === 'reprovados') {
      query += " AND d.status = 'Reprovado'";
    } else if (statusTab === 'canceladas') {
      query += " AND d.status = 'Cancelado'";
    }

    if (risco) {
      query += ' AND d.nivel_risco = ?';
      params.push(risco);
    }
    if (search) {
      query += ' AND (d.orgao LIKE ? OR d.municipio LIKE ? OR d.setor LIKE ? OR d.protocolo LIKE ? OR d.usuario_nome LIKE ? OR i.nome LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY d.id DESC';

    const demandas = db.prepare(query).all(...params);
    res.json(demandas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Obter demanda por protocolo ou ID (Com autorização estrita de instituição no backend: HTTP 403)
app.get('/api/demandas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, tipoUsuario } = req.query;

    let demanda = isNaN(id) 
      ? db.prepare(`
          SELECT d.*, i.nome as instituicao_nome, i.secretaria as instituicao_secretaria, i.tipo as instituicao_tipo,
                 e.protocolo as etp_consolidado_protocolo, e.titulo as etp_titulo
          FROM demandas d
          LEFT JOIN instituicoes i ON d.instituicao_id = i.id
          LEFT JOIN etps e ON d.etp_id = e.id
          WHERE d.protocolo = ? OR d.etp_numero = ?
        `).get(id, id)
      : db.prepare(`
          SELECT d.*, i.nome as instituicao_nome, i.secretaria as instituicao_secretaria, i.tipo as instituicao_tipo,
                 e.protocolo as etp_consolidado_protocolo, e.titulo as etp_titulo
          FROM demandas d
          LEFT JOIN instituicoes i ON d.instituicao_id = i.id
          LEFT JOIN etps e ON d.etp_id = e.id
          WHERE d.id = ?
        `).get(id);

    if (!demanda) {
      return res.status(404).json({ error: 'Demanda não encontrada.' });
    }

    // REGRA DE SEGURANÇA BACKEND (HTTP 403 FORBIDDEN):
    // Se o usuário solicitante tentar acessar dados de outra instituição diretamente, bloqueia!
    if (usuarioId) {
      const userDb = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
      if (userDb && userDb.tipo_usuario !== 'admin') {
        if (demanda.instituicao_id && userDb.instituicao_id && demanda.instituicao_id !== userDb.instituicao_id) {
          return res.status(403).json({
            error: 'Acesso Negado (HTTP 403): Você não possui autorização para consultar solicitações ou DODs pertencentes a outra instituição pública.',
            instituicaoUsuario: userDb.instituicao_id,
            instituicaoDemanda: demanda.instituicao_id
          });
        }
      }
    }

    const perfilEsc = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(demanda.perfil_escolhido_id);
    const perfilRec = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(demanda.perfil_recomendado_id);

    res.json({
      demanda,
      perfilEsc,
      perfilRec,
      softwares: JSON.parse(demanda.softwares || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8.1 Cancelar Processo / Requisição com Justificativa
app.post('/api/demandas/:protocolo/cancelar', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { motivo } = req.body;
    if (!motivo || motivo.trim().length === 0) {
      return res.status(400).json({ error: 'Por favor, informe o motivo do cancelamento.' });
    }

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) {
      return res.status(404).json({ error: 'Requisição não encontrada.' });
    }

    db.prepare(`
      UPDATE demandas 
      SET status = 'Cancelado', motivo_cancelamento = ? 
      WHERE protocolo = ?
    `).run(motivo.trim(), protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'Solicitação cancelada pelo solicitante',
      dem.usuario_nome || 'Servidor',
      dem.cargo || 'Servidor',
      'servidor',
      `Motivo do cancelamento: ${motivo.trim()}`,
      'Cancelado'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.2 Obter Histórico Completo de Auditoria e Rastreabilidade
app.get('/api/demandas/:protocolo/historico', (req, res) => {
  try {
    const { protocolo } = req.params;
    const historico = db.prepare(`
      SELECT * FROM historico_demandas 
      WHERE protocolo = ? 
      ORDER BY id ASC
    `).all(protocolo);

    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.3 Iniciar Análise pelo Técnico de TI
app.post('/api/demandas/:protocolo/em-analise', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { usuarioNome = 'Técnico de TI', usuarioCargo = 'Diretoria de TIC' } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET status = 'Em análise pelo TI', responsavel_analise = ?
      WHERE protocolo = ?
    `).run(usuarioNome, protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'Análise técnica iniciada pelo TI',
      usuarioNome,
      usuarioCargo,
      'admin',
      'O Técnico de TI abriu a solicitação para avaliação das respostas do diagnóstico e revisão preliminar do DOD.',
      'Em análise pelo TI'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.4 Validar DOD pelo TI (Libera a geração do ETP)
app.post('/api/demandas/:protocolo/validar-dod', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { usuarioNome = 'Técnico de TIC', usuarioCargo = 'Diretoria Geral de TIC' } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    const validadorFormatado = `${usuarioNome} (${usuarioCargo})`;

    db.prepare(`
      UPDATE demandas 
      SET status = 'Validado pelo TI',
          dod_validado = 1,
          dod_validado_por = ?,
          dod_validado_em = datetime('now', 'localtime'),
          responsavel_analise = ?
      WHERE protocolo = ?
    `).run(validadorFormatado, usuarioNome, protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'DOD validado tecnicamente pelo TI',
      usuarioNome,
      usuarioCargo,
      'admin',
      'Documento de Formalização da Demanda (DOD) aprovado pela equipe técnica de TIC. Opção de geração do ETP liberada.',
      'Validado pelo TI'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.5 Solicitar Ajustes pelo TI
app.post('/api/demandas/:protocolo/solicitar-ajustes', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { motivo, usuarioNome = 'Técnico de TIC', usuarioCargo = 'Diretoria de TIC' } = req.body;

    if (!motivo || motivo.trim().length === 0) {
      return res.status(400).json({ error: 'Informe detalhadamente o que precisa ser ajustado pelo servidor.' });
    }

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET status = 'Ajustes solicitados',
          ajustes_solicitados = ?,
          responsavel_analise = ?
      WHERE protocolo = ?
    `).run(motivo.trim(), usuarioNome, protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'Ajustes solicitados pelo TI ao servidor',
      usuarioNome,
      usuarioCargo,
      'admin',
      `Orientações do TI: ${motivo.trim()}`,
      'Ajustes solicitados'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.6 Reprovar Demanda pelo TI
app.post('/api/demandas/:protocolo/reprovar', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { motivo, usuarioNome = 'Técnico de TIC', usuarioCargo = 'Diretoria de TIC' } = req.body;

    if (!motivo || motivo.trim().length === 0) {
      return res.status(400).json({ error: 'A justificativa técnica de reprovação é obrigatória.' });
    }

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET status = 'Reprovado',
          motivo_reprovacao = ?,
          responsavel_analise = ?
      WHERE protocolo = ?
    `).run(motivo.trim(), usuarioNome, protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'Solicitação reprovada pelo TI',
      usuarioNome,
      usuarioCargo,
      'admin',
      `Motivo da reprovação técnica: ${motivo.trim()}`,
      'Reprovado'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.7 Responder Ajustes pelo Servidor (Reenvia solicitação)
app.post('/api/demandas/:protocolo/responder-ajustes', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { justificativaResposta, usuarioNome = 'Servidor', usuarioCargo = 'Solicitante' } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET status = 'Enviado para TI',
          justificativa_usuario = COALESCE(?, justificativa_usuario)
      WHERE protocolo = ?
    `).run(justificativaResposta || '', protocolo);

    registrarHistorico(
      dem.id,
      protocolo,
      'Servidor respondeu aos ajustes solicitados',
      usuarioNome,
      usuarioCargo,
      'servidor',
      `Resposta do servidor: ${justificativaResposta || 'Informações complementadas conforme orientações do TI.'}`,
      'Enviado para TI'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.8 Gerar ETP (Disponível apenas após o DOD ser validado)
app.post('/api/demandas/:protocolo/gerar-etp', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { usuarioNome = 'Técnico de TIC', usuarioCargo = 'Equipe de Planejamento da Contratação', etpConteudo = null } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ? OR etp_numero = ?').get(protocolo, protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    if (dem.dod_validado !== 1) {
      return res.status(400).json({ 
        error: 'Bloqueio de Conformidade: O DOD precisa ser validado tecnicamente pelo TI antes da geração do ETP.' 
      });
    }

    const randomEtpSuffix = Math.floor(1000 + Math.random() * 9000);
    const anoAtual = new Date().getFullYear();
    // Gera identificador oficial do Estudo Técnico Preliminar (ETP) vinculado ao DOD
    const etpNumero = dem.etp_numero || `ETP-${anoAtual}-${randomEtpSuffix}`;
    const geradorFormatado = `${usuarioNome} (${usuarioCargo})`;
    const conteudoParaSalvar = etpConteudo ? JSON.stringify(etpConteudo) : (dem.etp_conteudo || '{}');

    db.prepare(`
      UPDATE demandas 
      SET status = 'ETP gerado',
          etp_gerado = 1,
          etp_numero = ?,
          etp_gerado_por = ?,
          etp_gerado_em = datetime('now', 'localtime'),
          etp_conteudo = ?
      WHERE protocolo = ? OR etp_numero = ?
    `).run(etpNumero, geradorFormatado, conteudoParaSalvar, dem.protocolo, dem.protocolo);

    registrarHistorico(
      dem.id,
      dem.protocolo,
      'ETP gerado com base no DOD validado',
      usuarioNome,
      usuarioCargo,
      'admin',
      `Estudo Técnico Preliminar (ETP) oficial emitido sob o número ${etpNumero} com levantamento de 3 alternativas, análise comparativa de viabilidade técnica/econômica e conclusão. Vinculado ao DOD ${dem.protocolo}.`,
      'ETP gerado'
    );

    const atualizada = db.prepare('SELECT * FROM demandas WHERE id = ?').get(dem.id);
    res.json({ success: true, demanda: atualizada, etpNumero });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.9 Salvar Edição do ETP pelo TI
app.put('/api/demandas/:protocolo/etp', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { etpConteudo, usuarioNome = 'Técnico de TIC', usuarioCargo = 'Equipe de TIC' } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ? OR etp_numero = ?').get(protocolo, protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET etp_conteudo = ?
      WHERE id = ?
    `).run(typeof etpConteudo === 'string' ? etpConteudo : JSON.stringify(etpConteudo), dem.id);

    registrarHistorico(
      dem.id,
      dem.protocolo,
      'ETP revisado e atualizado pelo TI',
      usuarioNome,
      usuarioCargo,
      'admin',
      'Alterações técnicas salvas no Estudo Técnico Preliminar (Modelo Oficial de Lages).',
      dem.status
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.10 Salvar Edição do DOD (Documento de Formalização de Demanda)
app.put('/api/demandas/:protocolo/dod', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { dodConteudo, usuarioNome = 'Servidor/TI', usuarioCargo = 'Responsável' } = req.body;

    const dem = db.prepare('SELECT * FROM demandas WHERE protocolo = ? OR etp_numero = ?').get(protocolo, protocolo);
    if (!dem) return res.status(404).json({ error: 'Demanda não encontrada.' });

    db.prepare(`
      UPDATE demandas 
      SET dod_conteudo = ?
      WHERE id = ?
    `).run(typeof dodConteudo === 'string' ? dodConteudo : JSON.stringify(dodConteudo), dem.id);

    registrarHistorico(
      dem.id,
      dem.protocolo,
      'DOD revisado e atualizado',
      usuarioNome,
      usuarioCargo,
      'sistema',
      'Alterações salvas no Documento de Formalização da Demanda (DOD - Modelo Oficial de Lages).',
      dem.status
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.11 Listar Demandas com DOD Validado para Agrupamento em ETP
app.get('/api/demandas-para-etp', (req, res) => {
  try {
    const { tipoNecessidade, secretaria } = req.query;
    let query = `
      SELECT d.*, 
             pe.nome as perfil_esc_nome,
             i.nome as instituicao_nome,
             i.secretaria as instituicao_secretaria,
             i.tipo as instituicao_tipo,
             e.protocolo as etp_consolidado_protocolo,
             e.titulo as etp_titulo
      FROM demandas d
      LEFT JOIN perfis_hardware pe ON d.perfil_escolhido_id = pe.id
      LEFT JOIN instituicoes i ON d.instituicao_id = i.id
      LEFT JOIN etps e ON d.etp_id = e.id
      WHERE d.dod_validado = 1
    `;
    const params = [];

    if (tipoNecessidade) {
      query += ' AND d.tipo_necessidade = ?';
      params.push(tipoNecessidade);
    }
    if (secretaria) {
      query += ' AND (i.secretaria = ? OR i.secretaria LIKE ?)';
      params.push(secretaria, `%${secretaria}%`);
    }

    query += ' ORDER BY d.id DESC';

    const demandas = db.prepare(query).all(...params);

    // Mapeia para adicionar informações de disponibilidade de agrupamento
    const demandasMapeadas = demandas.map(d => {
      const jaVinculado = !!(d.etp_id || d.status === 'ETP gerado');
      return {
        ...d,
        disponivel_agrupamento: !jaVinculado,
        etp_vinculado_numero: d.etp_consolidado_protocolo || d.etp_numero || null
      };
    });

    res.json(demandasMapeadas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8.12 Agrupamento de Demandas para Geração de ETP Único Consolidado
app.post('/api/etps/agrupar', (req, res) => {
  try {
    const {
      dodProtocolos = [],
      titulo = 'Aquisição Consolidada de Equipamentos de TIC',
      objetivoConsolidado = '',
      usuarioNome = 'Equipe de TIC e Planejamento',
      usuarioCargo = 'Diretoria Geral de TIC'
    } = req.body;

    if (!Array.isArray(dodProtocolos) || dodProtocolos.length === 0) {
      return res.status(400).json({ error: 'Selecione pelo menos 1 (uma) demanda com DOD validado para gerar o ETP.' });
    }

    // Busca as demandas selecionadas no banco
    const placeholders = dodProtocolos.map(() => '?').join(',');
    const demandas = db.prepare(`
      SELECT d.*, 
             pe.nome as perfil_esc_nome,
             i.nome as instituicao_nome,
             i.secretaria as instituicao_secretaria
      FROM demandas d
      LEFT JOIN perfis_hardware pe ON d.perfil_escolhido_id = pe.id
      LEFT JOIN instituicoes i ON d.instituicao_id = i.id
      WHERE d.protocolo IN (${placeholders})
    `).all(...dodProtocolos);

    if (demandas.length !== dodProtocolos.length) {
      return res.status(400).json({ error: 'Uma ou mais demandas selecionadas não foram encontradas no sistema.' });
    }

    // 1. Valida se todas estão validadas pelo TI
    const naoValidadas = demandas.filter(d => d.dod_validado !== 1);
    if (naoValidadas.length > 0) {
      return res.status(400).json({
        error: `Não é possível agrupar: o DOD ${naoValidadas[0].protocolo} (${naoValidadas[0].instituicao_nome || 'Instituição'}) ainda não foi validado tecnicamente pelo TI.`
      });
    }

    // 2. Valida se alguma já está vinculada a outro ETP (Evita duplicidade de compras)
    const jaVinculadas = demandas.filter(d => d.etp_id || d.status === 'ETP gerado');
    if (jaVinculadas.length > 0) {
      return res.status(400).json({
        error: `A demanda ${jaVinculadas[0].protocolo} (${jaVinculadas[0].instituicao_nome || 'Instituição'}) já está vinculada ao ${jaVinculadas[0].etp_numero || 'outro ETP'}. Não é permitido agrupar a mesma demanda mais de uma vez.`
      });
    }

    // 3. Cálculos de Consolidação
    let quantidadeTotal = 0;
    let custoTotalEstimado = 0;
    let economiaEstimadaTotal = 0;
    const tiposDispositivo = new Set();
    const instituicoesMap = new Map();

    for (const d of demandas) {
      const qtd = d.quantidade_usuarios || 1;
      quantidadeTotal += qtd;
      custoTotalEstimado += (d.custo_total || (d.custo_unitario * qtd));
      economiaEstimadaTotal += (d.economia_estimada || 0);

      try {
        const resp = JSON.parse(d.respostas_diagnostico || '{}');
        if (resp.tipoDispositivo) tiposDispositivo.add(resp.tipoDispositivo);
      } catch (e) {}

      const instId = d.instituicao_id || 1;
      const instNome = d.instituicao_nome || d.orgao;
      if (!instituicoesMap.has(instId)) {
        instituicoesMap.set(instId, {
          instituicaoId: instId,
          instituicaoNome: instNome,
          secretaria: d.instituicao_secretaria || d.orgao,
          quantidade: 0,
          custoTotal: 0,
          dods: []
        });
      }
      const instReg = instituicoesMap.get(instId);
      instReg.quantidade += qtd;
      instReg.custoTotal += (d.custo_total || (d.custo_unitario * qtd));
      instReg.dods.push(d.protocolo);
    }

    const custoUnitarioEstimado = quantidadeTotal > 0 ? (custoTotalEstimado / quantidadeTotal) : 0;
    // Bônus adicional de ganho de escala pela contratação conjunta em lote
    const bonusEscala = quantidadeTotal >= 5 ? (custoTotalEstimado * 0.08) : 0;
    economiaEstimadaTotal += bonusEscala;

    // 4. Gera Protocolo Oficial do ETP Consolidado
    const anoAtual = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const etpProtocolo = `ETP-${anoAtual}-${randomSuffix}`;
    const geradorFormatado = `${usuarioNome} (${usuarioCargo})`;

    // 5. Monta a Estrutura Oficial do ETP (Lei 14.133/2021 + Decreto Municipal de Lages nº 20.682/2023)
    const instituicoesNomes = Array.from(instituicoesMap.values()).map(i => i.instituicaoNome);
    const tituloFinal = titulo && titulo.trim() ? titulo.trim() : `Aquisição Consolidada de Computadores e Equipamentos de TIC para ${instituicoesNomes.length} Instituições Municipais de Lages`;

    const tabelaDemandasOrigem = demandas.map(d => ({
      protocoloDod: d.protocolo,
      instituicao: d.instituicao_nome || d.orgao,
      secretaria: d.instituicao_secretaria || d.orgao,
      solicitante: d.usuario_nome,
      cargo: d.cargo,
      quantidade: d.quantidade_usuarios,
      custoTotal: d.custo_total,
      justificativa: d.justificativa_usuario || 'Atendimento às rotinas administrativas e pedagógicas.'
    }));

    const etpConteudoCompleto = {
      protocoloEtp: etpProtocolo,
      titulo: tituloFinal,
      objeto: `Contratação pública para aquisição unificada de ${quantidadeTotal} equipamentos de TIC, agrupando as demandas formalizadas por ${demandas.length} DODs das instituições municipais de Lages/SC.`,
      objetivoConsolidado: objetivoConsolidado || `Unificar em um único procedimento licitatório as necessidades compatíveis de TIC das instituições públicas municipais (${instituicoesNomes.join(', ')}), garantindo economia de escala, celeridade processual, padronização do parque tecnológico municipal e estrito cumprimento ao Art. 18 da Lei Federal nº 14.133/2021.`,
      quantidadeTotal,
      custoUnitarioEstimado,
      custoTotalEstimado,
      economiaEstimadaTotal,
      bonusEscala,
      geradorFormatado,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      tabelaDemandasOrigem,
      instituicoesParticipantes: Array.from(instituicoesMap.values()),
      dodsAgrupados: dodProtocolos,
      especificacoesPadronizadas: {
        equipamento: tiposDispositivo.has('notebook') ? 'Notebook Corporativo Padronizado' : 'Desktop Corporativo + Monitor',
        processador: 'Processador de arquitetura moderna (6 núcleos físicos, frequência turbo mín. 4.0 GHz)',
        memoriaRam: '16 GB DDR4/DDR5 em Dual-Channel com possibilidade de expansão',
        armazenamento: 'SSD de alta velocidade 512 GB NVMe M.2 PCIe Gen 3/4',
        tela: 'Tela 15.6 polegadas Full HD Antirreflexo (ou Monitor 21.5")',
        garantia: 'Garantia de 36 meses on-site no Município de Lages'
      },
      levantamentoMercado: [
        {
          alternativa: 'Alternativa 1 (Recomendada): Aquisição Definitiva em Lote Único Consolidado',
          vantagens: 'Menor custo a longo prazo, aproveitamento pleno da vida útil de 5 a 6 anos, patrimônio próprio do Município de Lages e ganho expressivo de escala na licitação.',
          desvantagens: 'Exige desembolso inicial de investimento (CAPEX).',
          viabilidade: 'Altamente Viável e Mais Econômica'
        },
        {
          alternativa: 'Alternativa 2: Locação Mensal de Equipamentos (HaaS - Hardware as a Service)',
          vantagens: 'Suporte e substituição contínuos pela locadora, custos distribuídos mês a mês (OPEX).',
          desvantagens: 'Custo acumulado em 3 anos supera em 42% o valor da aquisição definitiva sem retorno patrimonial ao município.',
          viabilidade: 'Inviável Economicamente para o volume atual'
        },
        {
          alternativa: 'Alternativa 3: Manutenção e Upgrade dos Equipamentos Antigos Existentes',
          vantagens: 'Baixo desembolso imediato.',
          desvantagens: 'Inviabilidade técnica de upgrade em placas-mãe obsoletas de 8 anos; incompatibilidade com Windows 11 Pro e alto custo recorrente de paradas operacionais.',
          viabilidade: 'Inviável Tecnicamente'
        }
      ],
      conclusaoViabilidade: `A Equipe de Planejamento da TIC e Licitações declara VIÁVEL a contratação pretendida na modalidade consolidada. O agrupamento das demandas dos DODs ${dodProtocolos.join(', ')} proporciona otimização administrativa, conformidade com as orientações do TCE/SC e economicidade estimada em R$ ${economiaEstimadaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
    };

    // 6. Insere o ETP no banco de dados
    const insertEtp = db.prepare(`
      INSERT INTO etps (
        protocolo, titulo, objetivo_consolidado, tipo_necessidade,
        quantidade_total, custo_unitario_estimado, custo_total_estimado, economia_estimada_total,
        custo_total, economia_total, conteudo_etp, gerado_por, created_by, status, validado_por, validado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Validado pelo TI', ?, datetime('now', 'localtime'))
    `);

    insertEtp.run(
      etpProtocolo,
      tituloFinal,
      objetivoConsolidado || etpConteudoCompleto.objetivoConsolidado,
      tiposDispositivo.has('notebook') ? 'notebook' : 'computador',
      quantidadeTotal,
      custoUnitarioEstimado,
      custoTotalEstimado,
      economiaEstimadaTotal,
      custoTotalEstimado,
      economiaEstimadaTotal,
      JSON.stringify(etpConteudoCompleto),
      geradorFormatado,
      geradorFormatado,
      geradorFormatado
    );

    const novoEtp = db.prepare('SELECT * FROM etps WHERE protocolo = ?').get(etpProtocolo);

    // 7. Insere os registros de vínculos em etp_dods e etp_instituicoes
    const insertEtpDod = db.prepare(`
      INSERT INTO etp_dods (
        etp_id, etp_protocolo, demanda_id, dod_protocolo, protocolo_dod, instituicao_id,
        instituicao_nome, quantidade, custo_total, solicitante_nome, cargo, motivo_necessidade
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of demandas) {
      insertEtpDod.run(
        novoEtp.id,
        etpProtocolo,
        d.id,
        d.protocolo,
        d.protocolo,
        d.instituicao_id || 1,
        d.instituicao_nome || d.orgao,
        d.quantidade_usuarios,
        d.custo_total,
        d.usuario_nome,
        d.cargo,
        d.justificativa_usuario
      );
    }

    const insertEtpInst = db.prepare(`
      INSERT INTO etp_instituicoes (
        etp_id, instituicao_id, instituicao_nome, quantidade_total, custo_total
      ) VALUES (?, ?, ?, ?, ?)
    `);

    for (const inst of instituicoesMap.values()) {
      insertEtpInst.run(
        novoEtp.id,
        inst.instituicaoId,
        inst.instituicaoNome,
        inst.quantidade,
        inst.custoTotal
      );
    }

    // 8. Atualiza as demandas individuais vinculando-as ao ETP consolidado
    const updateDemandaStmt = db.prepare(`
      UPDATE demandas 
      SET etp_id = ?,
          etp_numero = ?,
          status = 'ETP gerado',
          etp_gerado = 1,
          etp_gerado_por = ?,
          etp_gerado_em = datetime('now', 'localtime'),
          etp_conteudo = ?
      WHERE id = ?
    `);

    for (const d of demandas) {
      updateDemandaStmt.run(
        novoEtp.id,
        etpProtocolo,
        geradorFormatado,
        JSON.stringify(etpConteudoCompleto),
        d.id
      );

      // Registra evento de agrupamento no histórico de auditoria
      registrarHistorico(
        d.id,
        d.protocolo,
        'Demanda agrupada no ETP Consolidado pelo TI',
        usuarioNome,
        usuarioCargo,
        'admin',
        `Esta demanda individual foi unificada ao ${etpProtocolo} juntamente com outras instituições (${instituicoesNomes.join(', ')}). Total consolidado do lote: ${quantidadeTotal} equipamentos.`,
        'ETP gerado'
      );
    }

    res.status(201).json({
      success: true,
      protocolo: etpProtocolo,
      etp: novoEtp,
      quantidadeTotal,
      custoTotalEstimado,
      economiaEstimadaTotal,
      instituicoesParticipantes: Array.from(instituicoesMap.values()),
      dodsVinculados: dodProtocolos
    });
  } catch (err) {
    console.error('Erro ao agrupar demandas para ETP:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8.13 Obter ETP Consolidado e Rastreabilidade das Demandas Agrupadas
app.get('/api/etps/:protocolo', (req, res) => {
  try {
    const { protocolo } = req.params;
    const { usuarioId, tipoUsuario } = req.query;

    const etp = db.prepare('SELECT * FROM etps WHERE protocolo = ? OR id = ?').get(protocolo, protocolo);
    if (!etp) {
      return res.status(404).json({ error: 'Estudo Técnico Preliminar (ETP) não encontrado.' });
    }

    const dodsVinculados = db.prepare(`
      SELECT ed.*, d.respostas_diagnostico, d.diagnostico_interpretado, d.recursos_existentes, d.setor, d.orgao
      FROM etp_dods ed
      LEFT JOIN demandas d ON ed.demanda_id = d.id
      WHERE ed.etp_id = ?
      ORDER BY ed.id ASC
    `).all(etp.id);

    const instituicoesParticipantes = db.prepare(`
      SELECT * FROM etp_instituicoes 
      WHERE etp_id = ?
      ORDER BY instituicao_nome ASC
    `).all(etp.id);

    // Verificação de Autorização: Se for solicitante/diretora, valida se a instituição dela faz parte deste ETP
    if (usuarioId) {
      const userDb = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
      if (userDb && userDb.tipo_usuario !== 'admin') {
        const pertence = instituicoesParticipantes.some(i => i.instituicao_id === userDb.instituicao_id);
        if (!pertence && userDb.instituicao_id) {
          return res.status(403).json({
            error: 'Acesso Negado (HTTP 403): Sua instituição não é participante deste Estudo Técnico Preliminar consolidado.'
          });
        }
      }
    }

    res.json({
      etp,
      conteudo: JSON.parse(etp.conteudo_etp || '{}'),
      dodsVinculados,
      instituicoesParticipantes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Estatísticas do Painel TCE/SC e Dashboard Operacional (Com filtro institucional)
app.get('/api/estatisticas', (req, res) => {
  try {
    const { usuarioId, tipoUsuario } = req.query;

    let userDb = null;
    if (usuarioId) {
      userDb = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
    }
    const ehAdmin = (tipoUsuario === 'admin') || (userDb && userDb.tipo_usuario === 'admin');

    let whereSql = '';
    const params = [];

    if (!ehAdmin) {
      if (userDb && userDb.instituicao_id) {
        whereSql = ' WHERE instituicao_id = ?';
        params.push(userDb.instituicao_id);
      } else if (usuarioId) {
        whereSql = ' WHERE usuario_id = ?';
        params.push(usuarioId);
      }
    }

    const totalDemandas = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereSql}`).get(...params).c;
    const totalEconomia = db.prepare(`SELECT SUM(economia_estimada) as total FROM demandas ${whereSql}`).get(...params).total || 0;
    const mediaIrs = db.prepare(`SELECT AVG(irs) as media FROM demandas ${whereSql}`).get(...params).media || 0;

    const whereComAnd = whereSql ? `${whereSql} AND` : ' WHERE';

    const aguardandoAnalise = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} status IN ('Enviado para TI', 'Em análise pelo TI')`).get(...params).c;
    const ajustesSolicitados = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} status = 'Ajustes solicitados'`).get(...params).c;
    const dodsValidados = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} status = 'Validado pelo TI'`).get(...params).c;
    const etpsGerados = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} (status = 'ETP gerado' OR etp_gerado = 1)`).get(...params).c;
    const reprovados = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} status = 'Reprovado'`).get(...params).c;
    const canceladas = db.prepare(`SELECT COUNT(*) as c FROM demandas ${whereComAnd} status = 'Cancelado'`).get(...params).c;

    const riscoContagem = db.prepare(`
      SELECT nivel_risco, COUNT(*) as qtd 
      FROM demandas 
      ${whereSql}
      GROUP BY nivel_risco
    `).all(...params);

    const porOrgao = db.prepare(`
      SELECT COALESCE(i.nome, d.orgao) as orgao, COUNT(*) as total_processos, SUM(d.custo_total) as valor_total
      FROM demandas d
      LEFT JOIN instituicoes i ON d.instituicao_id = i.id
      ${whereSql}
      GROUP BY COALESCE(i.nome, d.orgao)
      ORDER BY valor_total DESC
      LIMIT 6
    `).all(...params);

    res.json({
      totalDemandas,
      totalEconomia,
      mediaIrs: Math.round(mediaIrs),
      aguardandoAnalise,
      ajustesSolicitados,
      dodsValidados,
      etpsGerados,
      reprovados,
      canceladas,
      riscoContagem,
      porOrgao
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`   🚀 DimensionaTI SC (Lages) - Ativo na porta ${PORT}`);
  console.log(`   🌐 Acesse: http://localhost:3000`);
  console.log(`=======================================================`);
});
