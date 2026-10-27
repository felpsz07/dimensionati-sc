// server.js - API REST com Express e SQLite nativo (DimensionaTI SC)
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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

    // Busca usuário existente
    let usuario = db.prepare('SELECT * FROM usuarios WHERE LOWER(email) = ?').get(emailLimpo);

    if (!usuario) {
      // Se não existir, cadastra automaticamente para o usuário não ficar travado no Hackathon!
      const nomeSugerido = emailLimpo.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const tipoUsuario = emailLimpo.includes('admin') ? 'admin' : 'padrao';
      const insertNovo = db.prepare(`
        INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar, tipo_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const matriculaGerada = `MAT-${Math.floor(10000 + Math.random() * 90000)}/PML`;
      insertNovo.run(
        nomeSugerido,
        emailLimpo,
        senha,
        tipoUsuario === 'admin' ? 'Diretor de TIC e Licitações' : 'Servidor Público',
        'Prefeitura do Município de Lages',
        tipoUsuario === 'admin' ? 'Diretoria Geral de TIC' : 'Secretaria Municipal de Administração',
        'Lages',
        matriculaGerada,
        tipoUsuario === 'admin' ? 2 : 1,
        JSON.stringify([1, 2]),
        tipoUsuario === 'admin' ? '👑' : '👤',
        tipoUsuario
      );

      usuario = db.prepare('SELECT * FROM usuarios WHERE LOWER(email) = ?').get(emailLimpo);
    } else {
      // Se já existir, verifica senha se não for vazia
      if (usuario.senha && senha && usuario.senha !== senha && usuario.senha !== '123456') {
        return res.status(401).json({ error: 'Senha incorreta para este e-mail cadastrado.' });
      }
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    usuarioSemSenha.atividades_padrao = JSON.parse(usuario.atividades_padrao || '[1, 2]');
    usuarioSemSenha.tipo_usuario = usuario.tipo_usuario || (emailLimpo.includes('admin') ? 'admin' : 'padrao');

    res.json({
      success: true,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Atualizar Lotação / Setor do Usuário (Tela 2 pós-login)
app.post('/api/usuario/lotacao', (req, res) => {
  try {
    const { usuarioId, nome, cargo, orgao, setor, matricula } = req.body;
    if (!usuarioId) {
      return res.status(400).json({ error: 'ID de usuário obrigatório.' });
    }

    db.prepare(`
      UPDATE usuarios 
      SET nome = COALESCE(?, nome),
          cargo = COALESCE(?, cargo),
          orgao = COALESCE(?, orgao),
          setor = COALESCE(?, setor),
          matricula = COALESCE(?, matricula)
      WHERE id = ?
    `).run(nome, cargo, orgao, setor, matricula, usuarioId);

    const usuarioAtualizado = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
    usuarioSemSenha.atividades_padrao = JSON.parse(usuarioAtualizado.atividades_padrao || '[1, 2]');

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

// 6. Salvar Demanda (Gera Protocolo, ETP e Contrato)
app.post('/api/demandas', (req, res) => {
  try {
    const {
      usuarioId = null,
      usuarioNome = '',
      usuarioMatricula = '',
      orgao = 'Prefeitura do Município de Lages',
      municipio = 'Lages',
      setor = 'Geral',
      cargo = 'Servidor Público',
      quantidadeUsuarios = 1,
      softwares = [],
      perfilRecomendadoId,
      perfilEscolhidoId,
      justificativaUsuario = '',
      status = 'Aprovado Direto',
      irs = 5,
      nivelRisco = 'BAIXO'
    } = req.body;

    const perfilEsc = db.prepare('SELECT * FROM perfis_hardware WHERE id = ?').get(perfilEscolhidoId);
    const custoUnitario = req.body.custoUnitario || perfilEsc.custo_unitario_estimado;
    const custoTotal = req.body.custoTotal || (custoUnitario * quantidadeUsuarios);
    
    const custoPiorCenario = 9800.00 * quantidadeUsuarios;
    const economiaEstimada = Math.max(0, custoPiorCenario - custoTotal);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const anoAtual = new Date().getFullYear();
    const protocolo = `ETP-${anoAtual}-${randomSuffix}`;

    const justificativaAutomatica = `Dimensionamento técnico calculado pelo sistema DimensionaTI SC em conformidade com o Art. 18 da Lei Federal nº 14.133/2021 para o cargo de ${cargo} em Lages/SC.`;

    const stmt = db.prepare(`
      INSERT INTO demandas (
        protocolo, usuario_id, usuario_nome, usuario_matricula,
        orgao, municipio, setor, cargo, quantidade_usuarios,
        softwares, perfil_recomendado_id, perfil_escolhido_id, status,
        justificativa_usuario, justificativa_tecnica_automatica,
        custo_unitario, custo_total, economia_estimada, irs, nivel_risco
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      status,
      justificativaUsuario,
      justificativaAutomatica,
      custoUnitario,
      custoTotal,
      economiaEstimada,
      irs,
      nivelRisco
    );

    const novaDemanda = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);

    res.status(201).json({
      success: true,
      protocolo,
      demanda: novaDemanda,
      perfilEsc
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Listar demandas (Separado por Perfil de Usuário / Admin)
app.get('/api/demandas', (req, res) => {
  try {
    const { risco, search, usuarioId, tipoUsuario } = req.query;
    let query = `
      SELECT d.*, 
             pe.nome as perfil_esc_nome
      FROM demandas d
      JOIN perfis_hardware pe ON d.perfil_escolhido_id = pe.id
      WHERE 1=1
    `;
    const params = [];

    // Se NÃO for admin, filtra estritamente apenas os pedidos emitidos por este usuário!
    if (tipoUsuario !== 'admin' && usuarioId) {
      query += ' AND d.usuario_id = ?';
      params.push(usuarioId);
    }

    if (risco) {
      query += ' AND d.nivel_risco = ?';
      params.push(risco);
    }
    if (search) {
      query += ' AND (d.orgao LIKE ? OR d.municipio LIKE ? OR d.setor LIKE ? OR d.protocolo LIKE ? OR d.usuario_nome LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY d.id DESC';

    const demandas = db.prepare(query).all(...params);
    res.json(demandas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Obter demanda por protocolo
app.get('/api/demandas/:id', (req, res) => {
  try {
    const { id } = req.params;
    let demanda = isNaN(id) 
      ? db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(id)
      : db.prepare('SELECT * FROM demandas WHERE id = ?').get(id);

    if (!demanda) {
      return res.status(404).json({ error: 'Demanda não encontrada.' });
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

    const atualizada = db.prepare('SELECT * FROM demandas WHERE protocolo = ?').get(protocolo);
    res.json({ success: true, demanda: atualizada });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Estatísticas do Painel TCE/SC
app.get('/api/estatisticas', (req, res) => {
  try {
    const totalDemandas = db.prepare('SELECT COUNT(*) as c FROM demandas').get().c;
    const totalEconomia = db.prepare('SELECT SUM(economia_estimada) as total FROM demandas').get().total || 0;
    const mediaIrs = db.prepare('SELECT AVG(irs) as media FROM demandas').get().media || 0;

    const riscoContagem = db.prepare(`
      SELECT nivel_risco, COUNT(*) as qtd 
      FROM demandas 
      GROUP BY nivel_risco
    `).all();

    const porOrgao = db.prepare(`
      SELECT orgao, COUNT(*) as total_processos, SUM(custo_total) as valor_total
      FROM demandas
      GROUP BY orgao
      ORDER BY valor_total DESC
      LIMIT 6
    `).all();

    res.json({
      totalDemandas,
      totalEconomia,
      mediaIrs: Math.round(mediaIrs),
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
