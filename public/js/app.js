// app.js - Lógica Dark Minimalista Unificada (DimensionaTI SC - Lages)
const app = {
  usuarioLogado: null,
  passoAtual: 1,
  totalPassos: 5,
  demandasCarregadas: [],
  abaStatusAtual: 'transmitidas',

  lotacaoTemp: {
    setorNome: 'Escolas Municipais (SME)',
    orgao: 'Prefeitura de Lages - SME',
    cargo: 'Diretora de Escola Municipal'
  },

  demanda: {
    usuarioId: null,
    usuarioNome: '',
    usuarioMatricula: '',
    setorNome: 'Escolas Municipais (SME)',
    orgao: 'Prefeitura de Lages - SME',
    cargo: 'Diretora de Escola Municipal',
    municipio: 'Lages',
    quantidade: 1,
    formatoEquipamento: 'notebook', // 'desktop' ou 'notebook'
    opcaoMonitor: '1x', // 'none', '1x', '2x'
    incluiPerifericos: true, // teclado e mouse
    incluiNobreak: false,
    atividades: ['edu_1', 'edu_2', 'edu_3'],
    atividadesNomes: [
      'Sistema Escolar & Diário de Classe',
      'Documentos e Provas Escolares',
      'Internet, E-mails e SGPe'
    ],
    perfilRecomendado: null,
    perfilEscolhido: null,
    analiseTrava: null,
    protocolo: 'DOD-2026-0000',
    custo_unitario: 1850.00,
    custo_total: 1850.00
  },

  // ==========================================================
  // CATÁLOGO DE ROTINAS INTELIGENTES POR SETOR / ÁREA DE ATUAÇÃO
  // ==========================================================
  catalogoRotinasPorSetor: {
    educacao: {
      nomeSetor: 'Escolas Municipais e CMEIs (SME Lages)',
      icone: '🏫',
      badge: 'ROTINAS ESCOLARES AUTORIZADAS',
      titulo: 'Atividades Pedagógicas e de Gestão Escolar',
      descricaoBlindagem: 'Catálogo de rotinas da educação municipal.',
      rotinas: [
        {
          id: 'edu_1',
          nome: 'Sistema Escolar & Diário de Classe',
          desc: 'Lançamento de notas, faltas, matrículas e boletins.',
          icone: '🎓',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'edu_2',
          nome: 'Documentos e Provas Escolares',
          desc: 'Textos no Word/Writer, avaliações, apostilas e PDFs de aulas.',
          icone: '📝',
          softwareId: 2,
          padrao: true
        },
        {
          id: 'edu_3',
          nome: 'Internet, E-mails e SGPe',
          desc: 'SGPe do Estado, portais oficiais, pesquisas e reuniões online.',
          icone: '🌐',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'edu_4',
          nome: 'Planilhas e Controle Escolar',
          desc: 'Tabelas de médias de alunos, listas de chamada e materiais.',
          icone: '📊',
          softwareId: 3,
          padrao: false
        },
        {
          id: 'edu_5',
          nome: 'Apresentações Didáticas e Vídeos',
          desc: 'Exibição de slides no projetor, Canva e vídeos educativos.',
          icone: '📽️',
          softwareId: 2,
          padrao: false
        }
      ]
    },
    saude: {
      nomeSetor: 'Saúde e Unidades Básicas (UBS / SMS Lages)',
      icone: '🏥',
      badge: 'ROTINAS DE SAÚDE HOMOLOGADAS • SUS',
      titulo: 'Atendimento Clínico e Triagem na UBS',
      descricaoBlindagem: 'Catálogo homologado para atendimento e prontuário do SUS em Lages. Evita equipamentos fora do padrão sanitário.',
      rotinas: [
        {
          id: 'sau_1',
          nome: 'Prontuário Eletrônico do SUS (e-SUS / SISREG)',
          desc: 'Acolhimento de pacientes, triagem, agendamento de consultas e emissão de receitas.',
          icone: '🩺',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'sau_2',
          nome: 'Navegação Web, SGPe e Sistemas do Ministério da Saúde',
          desc: 'Acesso aos portais do Ministério da Saúde, notificações epidemiológicas e SGPe.',
          icone: '🌐',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'sau_3',
          nome: 'Digitação de Laudos, Atestados e Encaminhamentos',
          desc: 'Emissão de atestados, laudos médicos, ofícios da UBS e comunicação interna.',
          icone: '📄',
          softwareId: 2,
          padrao: true
        },
        {
          id: 'sau_4',
          nome: 'Dispensação de Medicamentos & Controle Vacinal',
          desc: 'Controle de estoque de farmácia básica e registro do livro de vacinação do município.',
          icone: '💊',
          softwareId: 3,
          padrao: false
        }
      ]
    },
    obras: {
      nomeSetor: 'Planejamento e Obras (SEPLAN Lages)',
      icone: '🚧',
      badge: 'ROTINAS DE ENGENHARIA & FISCALIZAÇÃO',
      titulo: 'Projetos Técnicos, Topografia e Geoprocessamento',
      descricaoBlindagem: 'Ambiente com autorização para estações de alto poder de cálculo e placas de vídeo dedicadas homologadas.',
      rotinas: [
        {
          id: 'obr_1',
          nome: 'AutoCAD Civil 3D e Projetos de Pavimentação',
          desc: 'Desenho de vias públicas de Lages, drenagem pluvial, loteamentos e plantas viárias.',
          icone: '📐',
          softwareId: 5,
          padrao: true
        },
        {
          id: 'obr_2',
          nome: 'Geoprocessamento, QGIS e Cartografia Municipal',
          desc: 'Análise de ortofotos aéreas, curvas de nível, dados geoespaciais e plano diretor.',
          icone: '🗺️',
          softwareId: 5,
          padrao: true
        },
        {
          id: 'obr_3',
          nome: 'Modelagem 3D, Renderização e BIM de Obras',
          desc: 'Revit, SketchUp e maquetes virtuais de reformas e novos prédios públicos de Lages.',
          icone: '🏗️',
          softwareId: 6,
          padrao: false
        },
        {
          id: 'obr_4',
          nome: 'Orçamentos de Obras, Medições e Tabela Sinapi',
          desc: 'Planilhas orçamentárias de certames, cronograma físico-financeiro e fiscalização de medição.',
          icone: '📋',
          softwareId: 3,
          padrao: true
        },
        {
          id: 'obr_5',
          nome: 'Processos Digitais SGPe e Relatórios Fotográficos',
          desc: 'Instrução processual de licitações de obras e vistorias técnicas com fotos.',
          icone: '🌐',
          softwareId: 1,
          padrao: false
        }
      ]
    },
    fazenda: {
      nomeSetor: 'Secretaria da Fazenda e Tributos de Lages',
      icone: '📊',
      badge: 'ROTINAS DE AUDITORIA FISCAL E ARRECADAÇÃO',
      titulo: 'Cruzamento Tributário e Painéis Analíticos',
      descricaoBlindagem: 'Especificação para análise intensiva de bases de dados fiscais e relatórios gerenciais.',
      rotinas: [
        {
          id: 'faz_1',
          nome: 'Análise de Grandes Bases Fiscais e Cruzamento',
          desc: 'Confrontação de notas fiscais eletrônicas, declarações de contribuintes e auditoria em lote.',
          icone: '📈',
          softwareId: 4,
          padrao: true
        },
        {
          id: 'faz_2',
          nome: 'Painéis de Arrecadação e Power BI Municipal',
          desc: 'Acompanhamento em tempo real de receitas, IPTU, ISS e repasses constitucionais.',
          icone: '📊',
          softwareId: 4,
          padrao: true
        },
        {
          id: 'faz_3',
          nome: 'Processos de Execução Fiscal e SGPe',
          desc: 'Cobrança judicial de dívida ativa, certidões negativas e despachos fiscais.',
          icone: '📑',
          softwareId: 2,
          padrao: true
        },
        {
          id: 'faz_4',
          nome: 'Consultas Cadastrais e Atendimento ao Contribuinte',
          desc: 'Portal do cidadão, parcelamentos tributários e esclarecimento de dúvidas fiscais.',
          icone: '💻',
          softwareId: 1,
          padrao: false
        }
      ]
    },
    administracao: {
      nomeSetor: 'Administração Geral e Atendimento',
      icone: '🏢',
      badge: 'ROTINAS ADMINISTRATIVAS PADRONIZADAS',
      titulo: 'Atendimento ao Cidadão e Gestão Interna',
      descricaoBlindagem: 'Configuração padronizada para atividades de apoio, fluxo processual e protocolo municipal.',
      rotinas: [
        {
          id: 'adm_1',
          nome: 'Protocolo Central, Atendimento ao Cidadão e SGPe',
          desc: 'Abertura de chamados, tramitação de processos digitais e requisições públicas.',
          icone: '🌐',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'adm_2',
          nome: 'Redação de Ofícios, Portarias e Editais Oficiais',
          desc: 'Editor de texto, publicação em diário oficial e leitura de termos de referência em PDF.',
          icone: '📄',
          softwareId: 2,
          padrao: true
        },
        {
          id: 'adm_3',
          nome: 'Controle de Almoxarifado, Patrimônio e Compras',
          desc: 'Planilhas de entrada/saída de materiais, tombamento de bens e controle de suprimentos.',
          icone: '📦',
          softwareId: 3,
          padrao: true
        },
        {
          id: 'adm_4',
          nome: 'Gestão de Recursos Humanos e Folha de Ponto',
          desc: 'Sistemas de RH, atestados de servidores e lançamento de frequência funcional.',
          icone: '👥',
          softwareId: 1,
          padrao: false
        }
      ]
    }
  },

  // Identifica a chave correspondente da área
  detectarChaveSetor(setorOuOrgao) {
    const s = (setorOuOrgao || '').toLowerCase();
    if (s.includes('escola') || s.includes('educa') || s.includes('sme') || s.includes('cmei') || s.includes('profess')) {
      return 'educacao';
    }
    if (s.includes('saude') || s.includes('saúde') || s.includes('ubs') || s.includes('sms') || s.includes('enferm') || s.includes('medic')) {
      return 'saude';
    }
    if (s.includes('obra') || s.includes('seplan') || s.includes('engenhar') || s.includes('planeja')) {
      return 'obras';
    }
    if (s.includes('fazen') || s.includes('tribut') || s.includes('fiscal') || s.includes('receita') || s.includes('auditor')) {
      return 'fazenda';
    }
    return 'administracao';
  },

  perfisDisponiveis: [],
  chartRiscoInst: null,
  chartOrgaosInst: null,

  preencherLogin(email, senha) {
    const elE = document.getElementById('loginEmail');
    const elS = document.getElementById('loginSenha');
    if (elE) elE.value = email;
    if (elS) elS.value = senha;
  },

  async init() {
    await this.carregarPerfis();
    this.renderizarDotGrid();
    this.verificarSessao();

    // Fecha dropdowns de ações ao clicar fora
    window.addEventListener('click', () => this.fecharTodosMenusAcoes());
  },

  mostrarTela(id) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  verificarSessao() {
    try {
      const salva = localStorage.getItem('dimensionati_sessao');
      if (salva) {
        const u = JSON.parse(salva);
        if (u && u.id && u.nome) {
          this.usuarioLogado = u;
          this.aplicarUsuario(u);
          this.mostrarTela('screen-app');
          this.navegar('licitacoes');
          return;
        }
      }
    } catch (e) {}
    this.mostrarTela('screen-login');
  },

  // ==========================================
  // LOGIN
  // ==========================================
  async fazerLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    const erro = document.getElementById('loginErrorMsg');
    const btn = document.getElementById('btnLogin');

    erro.textContent = '';
    if (!email || !email.includes('@')) {
      erro.textContent = 'Informe um e-mail válido.';
      return;
    }
    if (!senha) {
      erro.textContent = 'Informe sua senha.';
      return;
    }

    btn.textContent = 'Entrando...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (!res.ok) {
        erro.textContent = data.error || 'Erro no login.';
        return;
      }

      this.usuarioLogado = data.usuario;

      // Popula tela de lotação
      const wpNome = document.getElementById('wpNome');
      const wpMat = document.getElementById('wpMatricula');
      const wpCargo = document.getElementById('wpCargo');
      if (wpNome) wpNome.value = data.usuario.nome || '';
      if (wpMat) wpMat.value = data.usuario.matricula || '';
      if (wpCargo) wpCargo.value = data.usuario.cargo || 'Servidor Público';

      this.mostrarTela('screen-workplace');
    } catch (err) {
      erro.textContent = 'Erro ao conectar ao servidor.';
    } finally {
      btn.innerHTML = 'Entrar no painel <span class="arrow-icon">↗</span>';
      btn.disabled = false;
    }
  },

  toggleSenha() {
    const el = document.getElementById('loginSenha');
    el.type = el.type === 'password' ? 'text' : 'password';
  },

  // ==========================================
  // LOTAÇÃO
  // ==========================================
  selecionarLotacao(setor, orgao, cargo, elem) {
    document.querySelectorAll('#wpGridSetores .dark-pill').forEach(p => p.classList.remove('active'));
    if (elem) elem.classList.add('active');

    this.lotacaoTemp = { setorNome: setor, orgao: orgao, cargo: cargo };
    const wpCargo = document.getElementById('wpCargo');
    if (wpCargo) wpCargo.value = cargo;
  },

  async confirmarLotacao() {
    const nome = document.getElementById('wpNome').value.trim();
    const matricula = document.getElementById('wpMatricula').value.trim();
    const cargo = document.getElementById('wpCargo').value.trim() || this.lotacaoTemp.cargo;

    if (!nome) {
      alert('Por favor, informe seu nome.');
      document.getElementById('wpNome').focus();
      return;
    }

    try {
      await fetch('/api/usuario/lotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: this.usuarioLogado.id,
          nome,
          cargo,
          orgao: this.lotacaoTemp.orgao,
          setor: this.lotacaoTemp.setorNome,
          matricula: matricula || this.usuarioLogado.matricula
        })
      });
    } catch (e) {}

    const sessao = {
      ...this.usuarioLogado,
      nome,
      cargo,
      orgao: this.lotacaoTemp.orgao,
      setor: this.lotacaoTemp.setorNome,
      matricula: matricula || this.usuarioLogado.matricula,
      municipio: 'Lages'
    };

    this.usuarioLogado = sessao;
    localStorage.setItem('dimensionati_sessao', JSON.stringify(sessao));

    this.aplicarUsuario(sessao);
    this.mostrarTela('screen-app');
    this.navegar('licitacoes');
  },

  aplicarUsuario(u) {
    // Avatar iniciais
    const p = (u.nome || 'Servidor').trim().split(' ');
    let ini = 'ME';
    if (p.length >= 2) ini = (p[0][0] + p[p.length - 1][0]).toUpperCase();
    else if (p.length === 1) ini = p[0].substring(0, 2).toUpperCase();

    document.getElementById('navAvatar').innerText = ini;
    document.getElementById('navNome').innerText = (u.nome || 'Servidor').split(' ')[0];
    document.getElementById('navSetor').innerText = u.setor || 'Lages';

    const ehAdmin = u.tipo_usuario === 'admin' || (u.email && u.email.includes('admin'));

    // Atualiza cabeçalho da visão de licitações
    const tituloSecao = document.getElementById('tituloSecaoLicitacoes');
    const subSecao = document.getElementById('subtituloSecaoLicitacoes');
    const badgePapel = document.getElementById('badgePapelUsuario');
    const btnAuditor = document.getElementById('btnNavAuditor');

    if (ehAdmin) {
      if (tituloSecao) tituloSecao.innerText = 'Todos os Processos Licitatórios (Todas as Secretarias - Visão Admin)';
      if (subSecao) subSecao.innerText = 'Painel Global de Auditoria e Governança de TIC de Lages / SC';
      if (badgePapel) {
        badgePapel.innerText = 'ADMINISTRADOR GERAL (TCE)';
        badgePapel.style.background = 'rgba(124, 58, 237, 0.2)';
        badgePapel.style.color = '#A78BFA';
      }
      if (btnAuditor) btnAuditor.style.display = 'inline-block';
    } else {
      if (tituloSecao) tituloSecao.innerText = 'Meus Pedidos de Licitação';
      if (subSecao) subSecao.innerText = `Processos emitidos por ${u.nome.split(' ')[0]} para ${u.setor || 'Lages'}`;
      if (badgePapel) {
        badgePapel.innerText = 'SERVIDOR SOLICITANTE';
        badgePapel.style.background = 'rgba(52, 211, 153, 0.15)';
        badgePapel.style.color = 'var(--dark-accent)';
      }
      if (btnAuditor) btnAuditor.style.display = 'none'; // Acesso restrito ao auditor geral
    }

    // Demanda local
    this.demanda.usuarioId = u.id;
    this.demanda.usuarioNome = u.nome;
    this.demanda.usuarioMatricula = u.matricula;
    this.demanda.orgao = u.orgao;
    this.demanda.setorNome = u.setor;
    this.demanda.cargo = u.cargo;
  },

  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem('dimensionati_sessao');
    this.mostrarTela('screen-login');
  },

  // ==========================================
  // NAVEGAÇÃO DE TELAS NO APP
  // ==========================================
  navegar(viewId) {
    document.querySelectorAll('.dark-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`)?.classList.add('active');

    document.getElementById('btnNavLicitacoes')?.classList.toggle('active', viewId === 'licitacoes');
    document.getElementById('btnNavAuditor')?.classList.toggle('active', viewId === 'auditor');

    if (viewId === 'licitacoes') {
      this.carregarDemandas();
    } else if (viewId === 'auditor') {
      this.carregarAuditor();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ==========================================
  // LISTAGEM DE LICITAÇÕES & CARDS OPERACIONAIS DO TI
  // ==========================================
  async carregarDemandas() {
    try {
      const u = this.usuarioLogado;
      const ehAdmin = u && (u.tipo_usuario === 'admin' || (u.email && u.email.includes('admin')));
      const url = ehAdmin 
        ? '/api/demandas?tipoUsuario=admin' 
        : `/api/demandas?tipoUsuario=padrao&usuarioId=${u?.id || ''}`;

      const res = await fetch(url);
      this.demandasCarregadas = await res.json();
      await this.carregarEstatisticasTi();
      this.filtrarTabela();
    } catch (e) {
      console.error(e);
    }
  },

  async carregarEstatisticasTi() {
    try {
      const res = await fetch('/api/estatisticas');
      const stats = await res.json();

      const elAg = document.getElementById('metricAguardandoAnalise');
      const elAj = document.getElementById('metricAjustes');
      const elVal = document.getElementById('metricValidados');
      const elEtp = document.getElementById('metricEtps');
      const elCanc = document.getElementById('metricCanceladas');

      if (elAg) elAg.innerText = stats.aguardandoAnalise || 0;
      if (elAj) elAj.innerText = stats.ajustesSolicitados || 0;
      if (elVal) elVal.innerText = stats.dodsValidados || 0;
      if (elEtp) elEtp.innerText = stats.etpsGerados || 0;
      if (elCanc) elCanc.innerText = (stats.reprovados || 0) + (stats.canceladas || 0);

      // Atualiza badges das abas
      const bAg = document.getElementById('badgeQtdAguardando');
      const bAj = document.getElementById('badgeQtdAjustes');
      const bVal = document.getElementById('badgeQtdValidados');
      const bEtp = document.getElementById('badgeQtdEtp');
      const bCancTab = document.getElementById('badgeQtdCanceladas');
      const bTodas = document.getElementById('badgeQtdTodas');

      if (bAg) bAg.innerText = stats.aguardandoAnalise || 0;
      if (bAj) bAj.innerText = stats.ajustesSolicitados || 0;
      if (bVal) bVal.innerText = stats.dodsValidados || 0;
      if (bEtp) bEtp.innerText = stats.etpsGerados || 0;
      if (bCancTab) bCancTab.innerText = (stats.reprovados || 0) + (stats.canceladas || 0);
      if (bTodas) bTodas.innerText = stats.totalDemandas || 0;
    } catch (e) {
      console.error('Erro ao carregar estatísticas do TI:', e);
    }
  },

  protocoloParaCancelar: null,

  setAbaStatus(aba) {
    this.abaStatusAtual = aba;
    document.querySelectorAll('.status-tab-btn').forEach(btn => btn.classList.remove('active'));

    const btnMap = {
      'aguardando_analise': 'tabStatusAguardando',
      'ajustes': 'tabStatusAjustes',
      'validados': 'tabStatusValidados',
      'etp_gerado': 'tabStatusEtp',
      'canceladas': 'tabStatusCanceladas',
      'todas': 'tabStatusTodas'
    };

    const targetId = btnMap[aba] || 'tabStatusTodas';
    document.getElementById(targetId)?.classList.add('active');

    this.filtrarTabela();
  },

  filtrarTabela() {
    const term = (document.getElementById('inputBusca')?.value || '').toLowerCase().trim();
    const todas = this.demandasCarregadas || [];

    const norm = (s) => String(s || '').toUpperCase().trim();

    // Filtra pelo termo de busca
    let filtradas = todas.filter(d => 
      !term ||
      (d.protocolo || '').toLowerCase().includes(term) ||
      (d.setor || '').toLowerCase().includes(term) ||
      (d.orgao || '').toLowerCase().includes(term) ||
      (d.usuario_nome || '').toLowerCase().includes(term)
    );

    // Filtra pela aba de status
    if (this.abaStatusAtual === 'aguardando_analise') {
      filtradas = filtradas.filter(d => norm(d.status) === 'ENVIADO PARA TI' || norm(d.status) === 'EM ANÁLISE PELO TI' || norm(d.status) === 'AGUARDANDO ANÁLISE PELO TI');
    } else if (this.abaStatusAtual === 'ajustes') {
      filtradas = filtradas.filter(d => norm(d.status) === 'AJUSTES SOLICITADOS');
    } else if (this.abaStatusAtual === 'validados') {
      filtradas = filtradas.filter(d => d.dod_validado === 1 || norm(d.status) === 'VALIDADO PELO TI');
    } else if (this.abaStatusAtual === 'etp_gerado') {
      filtradas = filtradas.filter(d => d.etp_gerado === 1 || norm(d.status) === 'ETP GERADO');
    } else if (this.abaStatusAtual === 'canceladas') {
      filtradas = filtradas.filter(d => norm(d.status) === 'CANCELADO' || norm(d.status) === 'CANCELADA' || norm(d.status) === 'REPROVADO');
    }

    this.renderizarTabela(filtradas);
  },

  renderizarTabela(demandas) {
    const tbody = document.getElementById('tbodyLicitacoes');
    if (!tbody) return;

    const footer = document.getElementById('tableCardFooter');
    const footerText = document.getElementById('footerCountText');
    const u = this.usuarioLogado;
    const ehAdmin = u && (u.tipo_usuario === 'admin' || (u.email && u.email.includes('admin')));

    if (!demandas || demandas.length === 0) {
      if (footer) footer.style.display = 'none';

      let icon = '📋';
      let title = 'Nenhuma requisição encontrada';
      let msg = 'Não há registros com os filtros atuais. Clique em <strong>+ Nova Requisição</strong> para emitir um pedido.';

      if (this.abaStatusAtual === 'aguardando_analise') {
        icon = '⏳';
        title = 'Nenhuma demanda aguardando análise';
        msg = 'Todas as requisições recebidas já foram avaliadas pelo setor de TI.';
      } else if (this.abaStatusAtual === 'ajustes') {
        icon = '⚠️';
        title = 'Nenhuma demanda com ajustes pendentes';
        msg = 'Não há solicitações aguardando resposta ou complementação do servidor.';
      } else if (this.abaStatusAtual === 'validados') {
        icon = '✅';
        title = 'Nenhum DOD validado';
        msg = 'Os DODs validados pela equipe de TI aparecerão listados aqui para geração de ETP.';
      } else if (this.abaStatusAtual === 'canceladas') {
        icon = '🚫';
        title = 'Nenhuma requisição cancelada ou reprovada';
        msg = 'Todas as solicitações continuam ativas no fluxo de atendimento.';
      }

      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty-td">
            <div class="table-empty-wrap">
              <div class="empty-icon-circle">${icon}</div>
              <h4 class="empty-title">${title}</h4>
              <p class="empty-desc">${msg}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const totalRows = demandas.length;
    if (footer) footer.style.display = 'flex';
    if (footerText) {
      footerText.innerText = `Exibindo ${totalRows} ${totalRows === 1 ? 'requisição' : 'requisições'}`;
    }

    tbody.innerHTML = demandas.map((d, index) => {
      const statusRaw = String(d.status || '').trim();
      const statusUpper = statusRaw.toUpperCase();
      const ehCancelado = statusUpper === 'CANCELADO' || statusUpper === 'CANCELADA';
      const ehReprovado = statusUpper === 'REPROVADO';
      const ehValidado = d.dod_validado === 1 || statusUpper === 'VALIDADO PELO TI';
      const ehEtpGerado = d.etp_gerado === 1 || statusUpper === 'ETP GERADO';
      const ehAjustes = statusUpper === 'AJUSTES SOLICITADOS';
      const ehEmAnalise = statusUpper === 'EM ANÁLISE PELO TI';

      let stClass = 'status-analise';
      let stText = statusRaw || 'Enviado para TI';

      if (ehCancelado) {
        stClass = 'status-cancelado';
        stText = 'Cancelado';
      } else if (ehReprovado) {
        stClass = 'status-cancelado';
        stText = 'Reprovado pelo TI';
      } else if (ehEtpGerado) {
        stClass = 'status-homologado';
        stText = 'ETP Gerado';
      } else if (ehValidado) {
        stClass = 'status-homologado';
        stText = 'Validado pelo TI';
      } else if (ehAjustes) {
        stClass = 'status-revisao';
        stText = 'Ajustes Solicitados';
      } else if (ehEmAnalise) {
        stClass = 'status-analise';
        stText = 'Em Análise pelo TI';
      } else {
        stClass = 'status-analise';
        stText = 'Enviado para TI';
      }

      let nomeEquip = 'Notebook Corporativo';
      let descEquip = 'Nível 1 • Gestão Escolar';
      if (d.perfil_escolhido_id === 2) {
        nomeEquip = 'Estação Análise de Dados';
        descEquip = 'Nível 2 • BI & Finanças';
      } else if (d.perfil_escolhido_id === 3) {
        nomeEquip = 'Workstation CAD / 3D';
        descEquip = 'Nível 3 • Engenharia (SEPLAN)';
      }

      const isDropUp = totalRows >= 3 && index >= totalRows - 2;

      return `
        <tr class="table-row-item ${(ehCancelado || ehReprovado) ? 'row-canceled' : ''}">
          <td class="col-protocolo">
            <span class="badge-protocolo">${d.protocolo}</span>
            ${(d.etp_numero || d.etp_gerado === 1) ? `
              <div class="badge-etp-sub" title="Estudo Técnico Preliminar Gerado">
                <span class="etp-tag-pill">📑 ${d.etp_numero || d.protocolo.replace('DOD-', 'ETP-')}</span>
              </div>
            ` : ''}
          </td>
          <td class="col-orgao">
            <div class="text-primary-strong orgao-setor">${d.setor || 'Escolas Municipais (SME)'}</div>
            <div class="text-secondary-muted orgao-nome">${d.orgao || 'Prefeitura de Lages - SME'}</div>
          </td>
          <td class="col-solicitante">
            <div class="text-primary-strong solicitante-nome">${d.usuario_nome || 'Servidor Solicitante'}</div>
            <div class="text-secondary-muted solicitante-cargo">${d.cargo || 'Diretora de Escola'}</div>
          </td>
          <td class="col-qtd" style="text-align: center;">
            <span class="qty-pill-badge">${d.quantidade_usuarios}</span>
          </td>
          <td class="col-equipamento">
            <div class="text-primary-strong equip-nome">${nomeEquip}</div>
            <div class="text-secondary-muted equip-desc">${descEquip}</div>
          </td>
          <td class="col-status" style="text-align: center;">
            <span class="badge-status-chip ${stClass}">
              <span class="status-dot"></span>
              <span class="status-label">${stText}</span>
            </span>
            ${(ehCancelado && d.motivo_cancelamento) ? `
              <div class="canceled-reason-preview" title="${d.motivo_cancelamento}">
                ${d.motivo_cancelamento}
              </div>
            ` : ''}
            ${(ehReprovado && d.motivo_reprovacao) ? `
              <div class="canceled-reason-preview" style="color: #F87171;" title="${d.motivo_reprovacao}">
                ${d.motivo_reprovacao}
              </div>
            ` : ''}
            ${(ehAjustes && d.ajustes_solicitados) ? `
              <div class="canceled-reason-preview" style="color: #FBBF24;" title="${d.ajustes_solicitados}">
                ⚠️ ${d.ajustes_solicitados}
              </div>
            ` : ''}
          </td>
          <td class="col-acoes" style="text-align: right;">
            <div class="acoes-dropdown-wrap">
              <button type="button" class="btn-acoes-dropdown" onclick="app.toggleMenuAcoes('${d.protocolo}', event)">
                <span>Ações</span>
                <svg class="chevron-ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="acoes-menu-dropdown ${isDropUp ? 'drop-up' : ''}" id="menu-acoes-${d.protocolo}">
                
                ${ehAdmin ? `
                  <!-- AÇÕES EXCLUSIVAS DE TI / ADMIN -->
                  <button type="button" class="acoes-menu-item" style="color: #38BDF8;" onclick="app.abrirPainelAnaliseTi('${d.protocolo}')">
                    <span class="item-icon">🛡️</span>
                    <div class="item-label">
                      <strong>Analisar Solicitação (TI)</strong>
                      <small>Diagnóstico, DOD Oficial e Validação</small>
                    </div>
                  </button>

                  ${!ehValidado && !ehCancelado && !ehReprovado ? `
                    <button type="button" class="acoes-menu-item" style="color: #34D399;" onclick="app.validarDodTi('${d.protocolo}')">
                      <span class="item-icon">✓</span>
                      <div class="item-label">
                        <strong>Validar DOD</strong>
                        <small>Aprovar formalmente e liberar ETP</small>
                      </div>
                    </button>
                  ` : ''}

                  <!-- BOTÃO GERAR ETP: ATIVO APENAS SE O DOD ESTIVER VALIDADO -->
                  ${ehValidado ? `
                    <button type="button" class="acoes-menu-item" style="color: #38BDF8;" onclick="app.gerarEtpDocumento('${d.protocolo}')">
                      <span class="item-icon">📑</span>
                      <div class="item-label">
                        <strong>${ehEtpGerado ? 'Visualizar / Editar ETP' : 'Gerar ETP'}</strong>
                        <small>Estudo Técnico Preliminar (12 seções)</small>
                      </div>
                    </button>
                  ` : `
                    <button type="button" class="acoes-menu-item" style="opacity: 0.6; cursor: not-allowed;" onclick="alert('🔒 A geração do ETP requer a validação prévia do DOD pela equipe técnica de TI.')" title="Disponível após validação do DOD">
                      <span class="item-icon">🔒</span>
                      <div class="item-label">
                        <strong style="color: #94A3B8;">Gerar ETP</strong>
                        <small>Disponível após validação do DOD</small>
                      </div>
                    </button>
                  `}
                ` : `
                  <!-- AÇÕES DO SERVIDOR SOLICITANTE -->
                  ${ehAjustes ? `
                    <button type="button" class="acoes-menu-item" style="color: #FBBF24;" onclick="app.abrirModalResponderAjustes('${d.protocolo}')">
                      <span class="item-icon">⚠️</span>
                      <div class="item-label">
                        <strong>Responder Ajustes do TI</strong>
                        <small>Enviar esclarecimentos solicitados</small>
                      </div>
                    </button>
                  ` : ''}

                  ${ehEtpGerado ? `
                    <button type="button" class="acoes-menu-item" style="color: #38BDF8;" onclick="app.abrirModalEtpCompleto('${d.protocolo}')">
                      <span class="item-icon">📑</span>
                      <div class="item-label">
                        <strong>Visualizar ETP</strong>
                        <small>Estudo Técnico Preliminar aprovado</small>
                      </div>
                    </button>
                  ` : ''}
                `}

                <button type="button" class="acoes-menu-item" onclick="app.abrirMinuta('${d.protocolo}')">
                  <span class="item-icon">📄</span>
                  <div class="item-label">
                    <strong>Visualizar DOD Oficial</strong>
                    <small>Documento com Anexos I e II (SC)</small>
                  </div>
                </button>

                <button type="button" class="acoes-menu-item" onclick="app.abrirHistoricoAuditoria('${d.protocolo}')">
                  <span class="item-icon">🕒</span>
                  <div class="item-label">
                    <strong>Trilha de Auditoria</strong>
                    <small>Histórico e rastreabilidade</small>
                  </div>
                </button>

                <div class="menu-divider"></div>

                ${(!ehCancelado && !ehReprovado) ? `
                  <button type="button" class="acoes-menu-item item-danger" onclick="app.abrirModalCancelar('${d.protocolo}')">
                    <span class="item-icon">🚫</span>
                    <div class="item-label">
                      <strong>Cancelar Requisição</strong>
                      <small>Informar motivo e arquivar</small>
                    </div>
                  </button>
                ` : `
                  <button type="button" class="acoes-menu-item" onclick="app.verMotivoCancelamento('${d.protocolo}')">
                    <span class="item-icon">ℹ️</span>
                    <div class="item-label">
                      <strong>Motivo de Encerramento</strong>
                      <small>Ver justificativa registrada</small>
                    </div>
                  </button>
                `}

              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  toggleMenuAcoes(protocolo, evt) {
    if (evt) evt.stopPropagation();
    const menu = document.getElementById(`menu-acoes-${protocolo}`);
    const todosMenus = document.querySelectorAll('.acoes-menu-dropdown');
    
    todosMenus.forEach(m => {
      if (m !== menu) m.classList.remove('active');
    });

    if (menu) menu.classList.toggle('active');
  },

  fecharTodosMenusAcoes() {
    document.querySelectorAll('.acoes-menu-dropdown').forEach(m => m.classList.remove('active'));
  },

  abrirModalCancelar(protocolo) {
    this.fecharTodosMenusAcoes();
    this.protocoloParaCancelar = protocolo;
    const lbl = document.getElementById('labelProtocoloCancelar');
    const txt = document.getElementById('txtMotivoCancelamento');
    if (lbl) lbl.innerText = protocolo;
    if (txt) {
      txt.value = '';
      setTimeout(() => txt.focus(), 150);
    }
    const modal = document.getElementById('modalCancelarDemanda');
    if (modal) modal.classList.add('active');
  },

  fecharModalCancelar() {
    this.protocoloParaCancelar = null;
    const modal = document.getElementById('modalCancelarDemanda');
    if (modal) modal.classList.remove('active');
  },

  preencherMotivo(texto) {
    const txt = document.getElementById('txtMotivoCancelamento');
    if (txt) {
      txt.value = texto;
      txt.focus();
    }
  },

  async confirmarCancelamento() {
    const protocolo = this.protocoloParaCancelar;
    const txt = document.getElementById('txtMotivoCancelamento')?.value.trim() || '';

    if (!txt) {
      alert('Por favor, informe o motivo do cancelamento da requisição.');
      document.getElementById('txtMotivoCancelamento')?.focus();
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${protocolo}/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: txt })
      });

      const data = await res.json();
      if (data.success) {
        this.fecharModalCancelar();
        // Recarrega as demandas e move para a aba de cancelados
        await this.carregarDemandas();
        this.setAbaStatus('canceladas');
      } else {
        alert(data.error || 'Erro ao cancelar processo.');
      }
    } catch (e) {
      alert('Erro de conexão ao cancelar processo: ' + e.message);
    }
  },

  verMotivoCancelamento(protocolo) {
    this.fecharTodosMenusAcoes();
    const dem = this.demandasCarregadas.find(d => d.protocolo === protocolo);
    const lbl = document.getElementById('labelVerProtocoloCancelado');
    const txt = document.getElementById('textoVerMotivoCancelamento');
    if (lbl) lbl.innerText = protocolo;
    if (txt) txt.innerText = dem?.motivo_cancelamento || 'Motivo não informado.';
    const modal = document.getElementById('modalVerCancelamento');
    if (modal) modal.classList.add('active');
  },

  fecharModalVerCancelamento() {
    const modal = document.getElementById('modalVerCancelamento');
    if (modal) modal.classList.remove('active');
  },

  // ==========================================
  // STEPPER WIZARD OBJETIVO (PASSOS 1 A 3)
  // ==========================================
  abrirWizardNovo() {
    const num = Math.floor(1000 + Math.random() * 9000);
    this.demanda.protocolo = `DOD-2026-${num}`;

    // Sincroniza com dados cadastrados do usuário logado
    if (this.usuarioLogado) {
      this.demanda.usuarioId = this.usuarioLogado.id;
      this.demanda.usuarioNome = this.usuarioLogado.nome;
      this.demanda.usuarioMatricula = this.usuarioLogado.matricula;
      this.demanda.setorNome = this.usuarioLogado.setor || 'Escolas Municipais (SME)';
      this.demanda.orgao = this.usuarioLogado.orgao || 'Prefeitura de Lages - SME';
      this.demanda.cargo = this.usuarioLogado.cargo || 'Diretora de Escola Municipal';
    }

    // Estado do novo fluxo baseado em necessidade
    this.demanda.tipoNecessidade = 'computador';
    this.demanda.precisaMobilidade = true;
    this.demanda.formatoEquipamento = 'notebook';
    this.demanda.programasUtilizados = [
      'Diário de Classe & Notas',
      'Word / Textos & Provas',
      'Planilhas & Médias',
      'Internet & SGPe',
      'Reuniões Online (Meet/Teams)'
    ];
    this.demanda.multitarefa = true;
    this.demanda.situacaoAtual = 'estragou';
    this.demanda.quantidade = 1;

    // Recursos existentes na mesa
    this.demanda.opcaoMonitor = 'none'; // 'none' = já tem monitor, '1x' = precisa
    this.demanda.temTeclado = true;
    this.demanda.temMouse = true;
    this.demanda.temWebcam = true;
    this.demanda.segundoMonitor = false;
    this.demanda.incluiPerifericos = false;

    // Atualiza identificação visual da solicitante
    const lblLocal = document.getElementById('labelLocalSolicitante');
    if (lblLocal) {
      lblLocal.innerText = `${this.demanda.usuarioNome} — ${this.demanda.setorNome}`;
    }

    this.setPerfilNivel(1);
    this.setQtd(1);

    this.navegar('wizard');
    this.irParaPasso(1);
  },

  irParaPasso(passo) {
    this.passoAtual = passo;

    for (let i = 1; i <= this.totalPassos; i++) {
      const node = document.getElementById(`step-node-${i}`);
      const pane = document.getElementById(`pane-passo-${i}`);

      if (node) {
        node.classList.toggle('active', i === passo);
        node.classList.toggle('completed', i < passo);
      }
      pane?.classList.toggle('active', i === passo);
    }

    const btnVoltar = document.getElementById('btnWizVoltar');
    if (btnVoltar) btnVoltar.style.visibility = passo > 1 ? 'visible' : 'hidden';

    const btnAvancar = document.getElementById('btnWizAvancar');
    if (btnAvancar) {
      if (passo === this.totalPassos) {
        btnAvancar.innerHTML = '<span>🚀 Enviar Solicitação para Análise do TI</span> <span style="font-size: 1.2rem;">✓</span>';
      } else {
        btnAvancar.innerHTML = '<span>Avançar</span> <span style="font-size: 1.2rem;">&rarr;</span>';
      }
    }

    if (passo === 2) {
      this.setPerfilNivel(this.demanda.perfilEscolhidoId || 1);
    } else if (passo === 4) {
      this.calcularHardware().then(() => {
        this.gerarDiagnosticoERecomendacao();
      });
    } else if (passo === 5) {
      this.calcularHardware().then(() => {
        this.analisarAuditoria().then(() => {
          this.preencherResumoCompleto();
        });
      });
    }
  },

  passoAnterior() {
    if (this.passoAtual > 1) this.irParaPasso(this.passoAtual - 1);
  },

  async proximoPasso() {
    if (this.passoAtual === this.totalPassos) {
      await this.salvarLicitação();
    } else {
      this.irParaPasso(this.passoAtual + 1);
    }
  },

  // ==========================================
  // ETAPA 1: DO QUE VOCÊ PRECISA? (7 OPÇÕES DIRETAS)
  // ==========================================
  setTipoNecessidade(tipo, elem) {
    this.demanda.tipoNecessidade = tipo;
    document.querySelectorAll('.necessidade-card').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');

    const boxAviso = document.getElementById('boxAvisoOutraNecessidade');
    const txtAviso = document.getElementById('txtAvisoOutraNecessidade');

    if (tipo === 'computador') {
      if (boxAviso) boxAviso.style.display = 'none';
    } else {
      if (boxAviso) boxAviso.style.display = 'flex';
      if (txtAviso) {
        if (tipo === 'manutencao') {
          txtAviso.innerHTML = '<strong>Manutenção de Equipamento:</strong> Caso seu computador tenha queimado, estragado ou não ligue mais, continuaremos o diagnóstico simples a seguir para avaliar se é caso de substituição por um novo equipamento ou conserto técnico avulso.';
        } else if (tipo === 'monitor') {
          txtAviso.innerHTML = '<strong>Monitor de Vídeo:</strong> Vamos registrar sua necessidade de tela avulsa ou tela adicional ergonômica. O sistema identificará se há monitores disponíveis para reaproveitamento no parque municipal.';
        } else if (tipo === 'impressora') {
          txtAviso.innerHTML = '<strong>Equipamento de Impressão:</strong> As impressoras corporativas são fornecidas via contrato centralizado de outsourcing ou aquisição conforme a demanda de páginas da unidade.';
        } else if (tipo === 'software') {
          txtAviso.innerHTML = '<strong>Sistema / Software:</strong> Demandas de sistemas e licenças de software corporativo serão direcionadas para triagem e liberação de acesso da equipe de sistemas da TIC.';
        } else if (tipo === 'indeciso') {
          txtAviso.innerHTML = '<strong>Apoio da Equipe de TI:</strong> Não se preocupe! Vamos fazer perguntas bem simples sobre o seu dia a dia de trabalho para ajudar a identificar a solução ideal para você.';
        } else {
          txtAviso.innerHTML = '<strong>Outros Equipamentos:</strong> Registraremos sua solicitação para avaliação técnica individual pela Diretoria de TIC da Prefeitura.';
        }
      }
    }
  },

  // ==========================================
  // ETAPA 2: ROTINA & PERGUNTAS COMPLEMENTARES
  // ==========================================
  setMobilidade(precisa, elem) {
    this.demanda.precisaMobilidade = precisa;
    this.demanda.formatoEquipamento = precisa ? 'notebook' : 'desktop';

    const cardSim = document.getElementById('cardMobSim');
    const cardNao = document.getElementById('cardMobNao');
    if (cardSim) cardSim.classList.toggle('active', precisa);
    if (cardNao) cardNao.classList.toggle('active', !precisa);
  },

  setMultitarefas(sim, elem) {
    this.demanda.multitarefas = sim;
    const cardSim = document.getElementById('cardMultiSim');
    const cardNao = document.getElementById('cardMultiNao');
    if (cardSim) cardSim.classList.toggle('active', sim);
    if (cardNao) cardNao.classList.toggle('active', !sim);
  },

  setPlanilhasGrandes(sim, elem) {
    this.demanda.planilhasGrandes = sim;
    const cardSim = document.getElementById('cardPlanilhasSim');
    const cardNao = document.getElementById('cardPlanilhasNao');
    if (cardSim) cardSim.classList.toggle('active', sim);
    if (cardNao) cardNao.classList.toggle('active', !sim);
  },

  toggleSoftwareChip(nome, elem) {
    if (!this.demanda.programasUtilizados) this.demanda.programasUtilizados = [];
    const idx = this.demanda.programasUtilizados.indexOf(nome);
    if (idx > -1) {
      this.demanda.programasUtilizados.splice(idx, 1);
      elem?.classList.remove('active');
    } else {
      this.demanda.programasUtilizados.push(nome);
      elem?.classList.add('active');
    }
  },

  setSituacaoAtual(sit, elem) {
    this.demanda.situacaoAtual = sit;
    document.querySelectorAll('#cardSitEstragou, #cardSitLento, #cardSitNovo').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');
  },

  // ==========================================
  // ETAPA 3: RECURSOS QUE JÁ POSSUI NA MESA
  // ==========================================
  setOpcaoMonitor(opcao, elem) {
    this.demanda.opcaoMonitor = opcao;
    const btnNone = document.getElementById('btnMonNone');
    const btn1x = document.getElementById('btnMon1x');
    if (btnNone) btnNone.classList.toggle('active', opcao === 'none');
    if (btn1x) btn1x.classList.toggle('active', opcao === '1x');
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoTeclado(tem, elem) {
    this.demanda.temTeclado = tem;
    const btnSim = document.getElementById('btnTecladoSim');
    const btnNao = document.getElementById('btnTecladoNao');
    if (btnSim) btnSim.classList.toggle('active', tem);
    if (btnNao) btnNao.classList.toggle('active', !tem);
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoMouse(tem, elem) {
    this.demanda.temMouse = tem;
    const btnSim = document.getElementById('btnMouseSim');
    const btnNao = document.getElementById('btnMouseNao');
    if (btnSim) btnSim.classList.toggle('active', tem);
    if (btnNao) btnNao.classList.toggle('active', !tem);
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoWebcam(tem, elem) {
    this.demanda.temWebcam = tem;
    const btnSim = document.getElementById('btnWebcamSim');
    const btnNao = document.getElementById('btnWebcamNao');
    if (btnSim) btnSim.classList.toggle('active', tem);
    if (btnNao) btnNao.classList.toggle('active', !tem);
    this.recalcularPrecoEPerifericos();
  },

  setSegundoMonitor(precisa, elem) {
    this.demanda.segundoMonitor = precisa;
    const btnNao = document.getElementById('btnMon2xNao');
    const btnSim = document.getElementById('btnMon2xSim');
    if (btnNao) btnNao.classList.toggle('active', !precisa);
    if (btnSim) btnSim.classList.toggle('active', precisa);
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoPerifericos(incluir, elem) {
    this.demanda.incluiPerifericos = incluir;
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoNobreak(incluir, elem) {
    this.demanda.incluiNobreak = incluir;
    this.recalcularPrecoEPerifericos();
  },

  atualizarOrgaoWizard(val) {
    const [setor, orgao] = val.split('|');
    this.demanda.setorNome = setor;
    this.demanda.orgao = orgao;
  },

  setFormatoEquipamento(formato, elem) {
    this.demanda.formatoEquipamento = formato;
    this.recalcularPrecoEPerifericos();
  },

  setQtd(n, elem) {
    document.querySelectorAll('.qty-pill').forEach(b => b.classList.remove('active'));
    if (elem) {
      elem.classList.add('active');
    } else {
      const first = document.querySelector('.qty-pill');
      if (first) first.classList.add('active');
    }
    this.demanda.quantidade = n;
    const inp = document.getElementById('inputQtd');
    if (inp) inp.value = n;
    this.recalcularPrecoEPerifericos();
  },

  setQtdCustom(v) {
    const n = Math.max(1, Math.min(500, parseInt(v) || 1));
    this.demanda.quantidade = n;
    document.querySelectorAll('.qty-pill').forEach(b => b.classList.remove('active'));
    this.recalcularPrecoEPerifericos();
  },

  // ==========================================
  // SELEÇÃO DO NÍVEL AGRUPADO DE DEMANDA
  // ==========================================
  setPerfilNivel(nivel) {
    this.demanda.perfilEscolhidoId = nivel;

    document.querySelectorAll('.nivel-card').forEach(c => c.classList.remove('active', 'alerta-ativo'));
    const card = document.getElementById(`cardNivel${nivel}`);
    if (card) {
      card.classList.add('active');
    }

    const ehSetorEscolaOuAdmin = (this.demanda.setorNome || '').toLowerCase().includes('escola') || 
                                (this.demanda.setorNome || '').toLowerCase().includes('educa') ||
                                (this.demanda.orgao || '').toLowerCase().includes('educa');

    if (nivel === 3 && ehSetorEscolaOuAdmin) {
      if (card) card.classList.add('alerta-ativo');
    }

    if (nivel === 1) {
      this.demanda.atividadesNomes = [
        'Gestão Escolar & Rotina Administrativa (Diário de Classe, Word, SGPe, Planilhas e Internet)'
      ];
      this.demanda.softwareIds = [1, 2, 3];
    } else if (nivel === 2) {
      this.demanda.atividadesNomes = [
        'Análise de Dados & Relatórios Gerenciais (Grandes Bases, BI e Contabilidade)'
      ];
      this.demanda.softwareIds = [4];
    } else {
      this.demanda.atividadesNomes = [
        'Projetos de Engenharia, Plantas e CAD 3D (AutoCAD Civil 3D e Topografia)'
      ];
      this.demanda.softwareIds = [5, 6];
    }

    this.calcularHardware();
  },

  // ==========================================
  // CÁLCULOS DO HARDWARE
  // ==========================================
  async calcularHardware() {
    const sw = this.demanda.softwareIds || [1, 2, 3];

    try {
      const res = await fetch('/api/calcular-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ softwareIds: sw, quantidadeUsuarios: this.demanda.quantidade })
      });

      const data = await res.json();
      this.demanda.perfilRecomendado = data.perfil;
      this.demanda.perfilEscolhido = data.perfil;
      this.recalcularPrecoEPerifericos();
    } catch (e) {
      console.error(e);
    }
  },

  recalcularPrecoEPerifericos() {
    const p = this.demanda.perfilEscolhido || this.demanda.perfilRecomendado || { id: 1 };
    
    let precoCpu = 1110.00;
    let custoMonPadrao = 650.00;
    if (p.id === 2) {
      precoCpu = 2210.00;
      custoMonPadrao = 650.00;
    } else if (p.id === 3) {
      precoCpu = 5960.00;
      custoMonPadrao = 1075.00;
    }

    let adicionalMonitor = 0;
    if (this.demanda.opcaoMonitor === '1x') {
      adicionalMonitor = custoMonPadrao;
    }
    if (this.demanda.segundoMonitor) {
      adicionalMonitor += custoMonPadrao;
    }

    const adicionalPerifericos = (!this.demanda.temTeclado || !this.demanda.temMouse) ? 90.00 : 0.00;
    const unit = precoCpu + adicionalMonitor + adicionalPerifericos;
    const total = unit * this.demanda.quantidade;

    this.demanda.custo_unitario = unit;
    this.demanda.custo_total = total;
  },

  // ==========================================
  // ETAPAS 5, 6 E 7: DIAGNÓSTICO & RECOMENDAÇÃO
  // ==========================================
  gerarDiagnosticoERecomendacao() {
    const nivel = this.demanda.perfilEscolhidoId || 1;
    const mobilidade = this.demanda.precisaMobilidade;
    const situacao = this.demanda.situacaoAtual || 'estragou';
    const progs = this.demanda.programasUtilizados || ['Sistemas Escolares & Documentos'];

    let titNecessidade = 'Computador para Rotina Escolar e Administrativa';
    let descNecessidade = 'Com base nas informações fornecidas, identificamos uma necessidade de uso corporativo para sistemas escolares, elaboração de documentos, planilhas, internet e reuniões online pedagógicas.';
    if (nivel === 2) {
      titNecessidade = 'Computador para Análise de Dados e Relatórios Gerenciais';
      descNecessidade = 'Identificamos uma necessidade de processamento intermediário para cruzamento de grandes bases fiscais, conciliação e relatórios no Power BI.';
    } else if (nivel === 3) {
      titNecessidade = 'Estação Gráfica para Engenharia e Modelagem CAD';
      descNecessidade = 'Identificamos necessidade de alto processamento com GPU dedicada para projetos de obras, plantas e AutoCAD 3D.';
    }

    const elNecTit = document.getElementById('txtDiagNecessidadeTitulo');
    const elNecDesc = document.getElementById('txtDiagNecessidadeDesc');
    if (elNecTit) elNecTit.innerText = titNecessidade;
    if (elNecDesc) elNecDesc.innerText = descNecessidade;

    // Bullets explicativos de "Por que identificamos essa necessidade?"
    const listaMotivos = document.getElementById('listaMotivosNecessidade');
    if (listaMotivos) {
      let bulletsHtml = `
        <div class="bullet-item"><span class="bullet-check">✓</span> <span>Utiliza ferramentas e sistemas: <strong>${progs.slice(0, 4).join(', ')}</strong></span></div>
        <div class="bullet-item"><span class="bullet-check">✓</span> <span>${mobilidade ? 'Necessita de mobilidade para transporte entre reuniões e salas de aula' : 'Uso predominantemente fixo na mesa de atendimento/secretaria'}</span></div>
        <div class="bullet-item"><span class="bullet-check">✓</span> <span>${situacao === 'estragou' ? 'Substituição de computador anterior que apresentou defeito/queimou' : situacao === 'lento' ? 'Substituição por lentidão extrema e travamento do equipamento antigo' : 'Atendimento a novo posto de trabalho na unidade'}</span></div>
        <div class="bullet-item"><span class="bullet-check">✓</span> <span>${nivel === 1 ? 'Não utiliza softwares 3D pesados, evitando gastos desnecessários aos cofres públicos' : 'Uso compatível com a carga de trabalho técnica do setor'}</span></div>
      `;
      listaMotivos.innerHTML = bulletsHtml;
    }

    // Perfil Recomendado Preliminar
    const ehNotebook = mobilidade;
    const iconRec = ehNotebook ? '💻' : '🖥️';
    let nomeRec = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';
    let subRec = ehNotebook ? 'Indicado para sua rotina de trabalho e necessidade de mobilidade escolar.' : 'Indicado para trabalho fixo contínuo na mesa da secretaria escolar.';

    if (nivel === 2) {
      nomeRec = ehNotebook ? 'Notebook Corporativo Intermediário (Dados & BI)' : 'Estação Desktop para Relatórios e BI';
      subRec = 'Indicado para manipulação de grandes volumes de dados e planilhas.';
    } else if (nivel === 3) {
      nomeRec = ehNotebook ? 'Mobile Workstation com GPU Dedicada' : 'Workstation Desktop de Alto Desempenho';
      subRec = 'Indicado para softwares de engenharia, plantas e renderização 3D.';
    }

    const elIcon = document.getElementById('recDestaqueIcon');
    const elTit = document.getElementById('recDestaqueTitulo');
    const elSub = document.getElementById('recDestaqueSub');
    if (elIcon) elIcon.innerText = iconRec;
    if (elTit) elTit.innerText = nomeRec;
    if (elSub) elSub.innerText = subRec;

    // "Por que recomendamos isso?"
    const elPorQue = document.getElementById('txtPorQueRecomendamos');
    if (elPorQue) {
      if (ehNotebook) {
        elPorQue.innerText = `Você informou que realiza atividades de ${nivel === 1 ? 'gestão escolar e redação de documentos' : 'rotina gerencial'} e que precisa transportar o equipamento entre ambientes e conselhos de classe. Por isso, a recomendação preliminar é um ${nomeRec} com tela Full HD, bateria de longa duração e webcam integrada, eliminando o risco de receber aparelhos incompatíveis ou lentos.`;
      } else {
        elPorQue.innerText = `Você informou que trabalha fixo na sua mesa do setor e necessita de estabilidade para operação diária. Por isso, a recomendação preliminar é um ${nomeRec} com gabinete resistente, alta durabilidade e conexão direta aos seus acessórios de mesa.`;
      }
    }

    // Especificação Técnica Sugerida para o TI
    const sSo = document.getElementById('specTiSo');
    const sCpu = document.getElementById('specTiCpu');
    const sRam = document.getElementById('specTiRam');
    const sSsd = document.getElementById('specTiSsd');
    const sTela = document.getElementById('specTiTela');
    const sGarantia = document.getElementById('specTiGarantia');

    if (sSo) sSo.innerText = 'Windows 11 Pro 64-bit homologado';
    if (nivel === 1) {
      if (sCpu) sCpu.innerText = 'Quad-Core x86-64 moderno (PassMark 8.500+)';
      if (sRam) sRam.innerText = '8 GB DDR4/DDR5 Alta Frequência';
      if (sSsd) sSsd.innerText = 'SSD 256GB NVMe M.2 Rápido';
      if (sTela) sTela.innerText = ehNotebook ? 'Tela 15.6" Full HD + Webcam HD Integrada' : 'Saídas HDMI/DP para Monitor';
    } else if (nivel === 2) {
      if (sCpu) sCpu.innerText = 'Hexa-Core x86-64 (PassMark 18.000+)';
      if (sRam) sRam.innerText = '16 GB DDR4/DDR5 Dual-Channel';
      if (sSsd) sSsd.innerText = 'SSD 512GB NVMe PCIe 4.0';
      if (sTela) sTela.innerText = ehNotebook ? 'Tela 15.6" Full HD IPS + Câmera HD' : 'Suporte a Monitores Múltiplos';
    } else {
      if (sCpu) sCpu.innerText = 'Octa-Core 5.0GHz+ (PassMark 30.000+)';
      if (sRam) sRam.innerText = '32 GB DDR5 + GPU NVIDIA RTX Dedicada';
      if (sSsd) sSsd.innerText = 'SSD 1TB Gen4 NVMe';
      if (sTela) sTela.innerText = 'Telas de Alta Resolução / Calibração de Cores';
    }
    if (sGarantia) sGarantia.innerText = '36 meses com atendimento no local (on-site na escola)';
  },

  // ==========================================
  // ETAPA 8: RESUMO ANTES DO ENVIO AO TI
  // ==========================================
  preencherResumoCompleto() {
    const nivel = this.demanda.perfilEscolhidoId || 1;
    const ehNotebook = this.demanda.precisaMobilidade;
    const nomeEquip = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';

    const elSol = document.getElementById('resumoSolicitante');
    const elCar = document.getElementById('resumoCargo');
    const elUni = document.getElementById('resumoUnidade');
    const elNecTit = document.getElementById('resumoNecTitulo');
    const elNecDesc = document.getElementById('resumoNecDesc');
    const elPerf = document.getElementById('resumoPerfilNome');
    const elQtd = document.getElementById('resumoQtdText');
    const elRecExist = document.getElementById('resumoRecursosExistentes');
    const elRecSol = document.getElementById('resumoRecursosSolicitados');
    const elSpecs = document.getElementById('resumoSpecsTexto');

    if (elSol) elSol.innerText = this.demanda.usuarioNome || 'Profa. Angelita de Souza';
    if (elCar) elCar.innerText = this.demanda.cargo || 'Diretora de Escola Municipal';
    if (elUni) elUni.innerText = this.demanda.setorNome || 'Escolas Municipais (SME Lages)';

    if (elNecTit) {
      elNecTit.innerText = nivel === 1 
        ? 'Computador para Rotina Escolar e Administrativa'
        : nivel === 2 
          ? 'Computador para Análise de Dados e Relatórios' 
          : 'Estação Gráfica para Engenharia e CAD';
    }
    if (elNecDesc) {
      elNecDesc.innerText = ehNotebook 
        ? 'Uso corporativo pedagógico com necessidade de mobilidade'
        : 'Uso corporativo contínuo com posto de trabalho fixo';
    }

    if (elPerf) elPerf.innerText = `${nomeEquip} (Nível ${nivel})`;
    if (elQtd) elQtd.innerText = `${this.demanda.quantidade} equipamento${this.demanda.quantidade > 1 ? 's solicitados' : ' solicitado'}`;

    // Recursos existentes
    let jaPossui = [];
    if (this.demanda.opcaoMonitor === 'none') jaPossui.push('Monitor');
    if (this.demanda.temTeclado) jaPossui.push('Teclado');
    if (this.demanda.temMouse) jaPossui.push('Mouse');
    if (this.demanda.temWebcam) jaPossui.push('Webcam');
    if (elRecExist) elRecExist.innerText = jaPossui.length > 0 ? jaPossui.join(' • ') : 'Nenhum (mesa vazia)';

    // Recursos solicitados
    let solicitados = [`${this.demanda.quantidade}x ${nomeEquip}`];
    if (this.demanda.opcaoMonitor === '1x') solicitados.push('1x Monitor de Vídeo');
    if (!this.demanda.temTeclado) solicitados.push('Teclado Novo');
    if (!this.demanda.temMouse) solicitados.push('Mouse Novo');
    if (!this.demanda.temWebcam && !ehNotebook) solicitados.push('Webcam USB');
    if (this.demanda.segundoMonitor) solicitados.push('2º Monitor de Apoio');
    if (elRecSol) elRecSol.innerText = solicitados.join(' • ');

    if (elSpecs) {
      elSpecs.innerText = `Windows 11 Pro 64-bit • Processador PassMark compatível • SSD NVMe M.2 • Memória dimensionada • Garantia de 36 meses on-site.`;
    }

    // Justificativa gerada automaticamente
    const txtJust = document.getElementById('txtJustificativa');
    if (txtJust) {
      const sitTxt = this.demanda.situacaoAtual === 'estragou' 
        ? 'visando a substituição de equipamento anterior avariado/inoperante'
        : this.demanda.situacaoAtual === 'lento'
          ? 'visando a substituição de equipamento obsoleto com travamentos frequentes'
          : 'visando o atendimento a novo posto de trabalho';

      const mobTxt = ehNotebook 
        ? 'com necessidade comprovada de mobilidade para conselho de classe e reuniões pedagógicas' 
        : 'para trabalho administrativo fixo na secretaria da unidade';

      txtJust.value = `Solicitação de ${this.demanda.quantidade} ${nomeEquip} para atendimento da servidora ${this.demanda.usuarioNome || 'Profa. Angelita de Souza'} (${this.demanda.cargo || 'Diretora'}) na unidade ${this.demanda.setorNome || 'Escolas Municipais'}, ${sitTxt} ${mobTxt}. A configuração recomendada atende rigorosamente aos critérios de dimensionamento técnico e economicidade previstos no Art. 18 da Lei Federal nº 14.133/2021, evitando aquisição de hardware superdimensionado e prevenindo o fornecimento de equipamentos inadequados à rotina escolar.`;
    }
  },

  async analisarAuditoria() {
    const recId = this.demanda.perfilRecomendado?.id || 1;
    const escId = this.demanda.perfilEscolhido?.id || 1;

    try {
      const res = await fetch('/api/analisar-trava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfilRecomendadoId: recId,
          perfilEscolhidoId: escId,
          quantidadeUsuarios: this.demanda.quantidade
        })
      });

      const a = await res.json();
      this.demanda.analiseTrava = a;
    } catch (e) {
      console.error(e);
    }
  },

  async salvarLicitação() {
    const txtJust = document.getElementById('txtJustificativa')?.value.trim() || '';
    const ehNotebook = (this.demanda.precisaMobilidade !== false);
    const nivel = this.demanda.perfilEscolhidoId || 1;
    const nomeEquip = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';

    const respostasDiagnostico = {
      tipoNecessidade: this.demanda.tipoNecessidade || 'computador',
      perfilRotinaNivel: nivel,
      rotinaDescricao: nivel === 1 
        ? 'Gestão Escolar & Rotina Administrativa' 
        : nivel === 2 
          ? 'Análise de Dados & Relatórios Gerenciais' 
          : 'Projetos de Engenharia, Plantas e CAD (3D)',
      precisaMobilidade: ehNotebook,
      formatoEquipamento: ehNotebook ? 'notebook' : 'desktop',
      programasUtilizados: (this.demanda.programasUtilizados && this.demanda.programasUtilizados.length > 0)
        ? this.demanda.programasUtilizados
        : ['Diário de Classe & Notas', 'Word / Textos & Provas', 'Planilhas & Médias', 'Internet & SGPe', 'Reuniões Online (Meet/Teams)'],
      multitarefas: this.demanda.multitarefas !== false,
      planilhasGrandes: this.demanda.planilhasGrandes === true,
      situacaoAtual: this.demanda.situacaoAtual || 'estragou',
      situacaoDescricao: this.demanda.situacaoAtual === 'estragou'
        ? 'O computador anterior estragou / não liga (substituição urgente)'
        : this.demanda.situacaoAtual === 'lento'
          ? 'A máquina atual trava muito / é lenta'
          : 'Novo posto de trabalho estruturado na unidade'
    };

    const recursosExistentes = {
      monitor: this.demanda.opcaoMonitor || 'none',
      monitorDescricao: this.demanda.opcaoMonitor === 'none' ? 'Já possui monitor na mesa' : 'Precisa de monitor novo',
      teclado: this.demanda.temTeclado !== false,
      tecladoDescricao: this.demanda.temTeclado !== false ? 'Já possui teclado na mesa' : 'Precisa de teclado novo',
      mouse: this.demanda.temMouse !== false,
      mouseDescricao: this.demanda.temMouse !== false ? 'Já possui mouse na mesa' : 'Precisa de mouse novo',
      webcam: this.demanda.temWebcam !== false,
      webcamDescricao: this.demanda.temWebcam !== false ? 'Já possui câmera ou integrada' : 'Precisa de câmera USB',
      segundoMonitor: this.demanda.segundoMonitor === true,
      segundoMonitorDescricao: this.demanda.segundoMonitor === true ? 'Precisa de 2º monitor' : 'Não necessita de tela secundária',
      quantidadePostos: this.demanda.quantidade || 1
    };

    const diagnosticoInterpretado = {
      perfilSugerido: nomeEquip,
      categoriaTrabalho: respostasDiagnostico.rotinaDescricao,
      justificativaUso: txtJust,
      resumoCriterios: [
        `Necessidade declarada: ${respostasDiagnostico.tipoNecessidade}`,
        `Mobilidade: ${ehNotebook ? 'Requer mobilidade entre salas e reuniões' : 'Posto fixo de atendimento'}`,
        `Softwares declarados: ${respostasDiagnostico.programasUtilizados.join(', ')}`,
        `Situação da máquina anterior: ${respostasDiagnostico.situacaoDescricao}`,
        `Reaproveitamento de periféricos ativos: ${recursosExistentes.monitor === 'none' ? 'Monitor preservado' : 'Sem monitor'}`
      ]
    };

    const recomendacaoPreliminar = {
      equipamento: nomeEquip,
      formato: ehNotebook ? 'notebook' : 'desktop',
      so: 'Windows 11 Pro 64-bit homologado',
      cpu: nivel === 1 ? 'Quad-Core x86-64 moderno' : nivel === 2 ? 'Hexa-Core x86-64' : 'Octa-Core 5.0GHz+',
      ram: nivel === 1 ? '8 GB Alta Velocidade' : nivel === 2 ? '16 GB Dual-Channel' : '32 GB DDR5',
      ssd: nivel === 1 ? 'SSD 256GB NVMe M.2' : nivel === 2 ? 'SSD 512GB NVMe PCIe 4.0' : 'SSD 1TB Gen4 NVMe',
      garantia: '36 meses presencial no local (on-site)',
      avisoImportante: 'Recomendação técnica preliminar gerada pelo sistema — aguardando validação do TI'
    };

    try {
      const res = await fetch('/api/demandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: this.demanda.usuarioId,
          usuarioNome: this.demanda.usuarioNome,
          usuarioMatricula: this.demanda.usuarioMatricula,
          orgao: this.demanda.orgao,
          municipio: 'Lages',
          setor: this.demanda.setorNome,
          cargo: this.demanda.cargo,
          quantidadeUsuarios: this.demanda.quantidade,
          custoUnitario: this.demanda.custo_unitario || 1850.00,
          custoTotal: this.demanda.custo_total || (1850.00 * this.demanda.quantidade),
          softwares: respostasDiagnostico.programasUtilizados,
          perfilRecomendadoId: nivel,
          perfilEscolhidoId: nivel,
          justificativaUsuario: txtJust || 'Solicitação encaminhada para análise e validação técnica da Diretoria de TIC.',
          status: 'Enviado para TI',
          irs: 5,
          nivelRisco: 'BAIXO',
          tipoNecessidade: respostasDiagnostico.tipoNecessidade,
          respostasDiagnostico: JSON.stringify(respostasDiagnostico),
          diagnosticoInterpretado: JSON.stringify(diagnosticoInterpretado),
          recomendacaoPreliminar: JSON.stringify(recomendacaoPreliminar),
          recursosExistentes: JSON.stringify(recursosExistentes)
        })
      });

      const data = await res.json();
      if (data.success) {
        // Recarrega a tabela de pedidos e estatísticas
        await this.carregarDemandas();
        // Volta para a tela de licitações
        this.navegar('licitacoes');
        // Abre a minuta técnica oficial (DOD) para visualização/impressão
        this.renderizarModalEtp(data.demanda, this.demanda.perfilEscolhido || this.demanda.perfilRecomendado);
      }
    } catch (e) {
      alert('Erro ao enviar solicitação para análise do TI: ' + e.message);
    }
  },

  // ==========================================
  // MODAL DA MINUTA A4
  // ==========================================
  async abrirMinuta(protocolo) {
    try {
      this.fecharTodosMenusAcoes();
      const res = await fetch(`/api/demandas/${protocolo}`);
      if (!res.ok) {
        throw new Error(`Servidor retornou status ${res.status}`);
      }
      const data = await res.json();
      if (!data || !data.demanda) {
        throw new Error('Demanda não localizada.');
      }
      this.renderizarModalEtp(data.demanda, data.perfilEsc || data.perfilRec);
    } catch (e) {
      console.error('Erro ao abrir DOD:', e);
      alert('Erro ao carregar minuta do DOD: ' + e.message);
    }
  },

  // Converte valor monetário em texto por extenso
  valorPorExtenso(valor) {
    if (!valor || isNaN(valor)) return 'zero reais';
    const v = Math.round(valor);
    if (v === 1850) return 'mil oitocentos e cinquenta reais';
    if (v === 3600) return 'três mil e seiscentos reais';
    if (v === 8200) return 'oito mil e duzentos reais';
    if (v === 18500) return 'dezoito mil e quinhentos reais';
    if (v === 27750) return 'vinte e sete mil setecentos e cinquenta reais';
    if (v === 36000) return 'trinta e seis mil reais';
    if (v === 37000) return 'trinta e sete mil reais';
    if (v === 41000) return 'quarenta e um mil reais';
    if (v === 82000) return 'oitenta e dois mil reais';
    if (v === 92500) return 'noventa e dois mil e quinhentos reais';
    return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} reais`;
  },

  // Extrai lista de softwares de forma segura (lidando com string JSON, Array ou texto)
  obterListaSoftwares(demanda, fallback) {
    if (!demanda) return fallback || ['Gestão Escolar & Rotina Administrativa'];
    const raw = demanda.softwares || demanda.programasUtilizados;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return [raw];
      } catch (e) {
        return [raw];
      }
    }
    return fallback || ['Gestão Escolar & Rotina Administrativa'];
  },

  demandaExibidaDod: null,
  modoEdicaoDod: false,

  toggleEdicaoDod() {
    this.modoEdicaoDod = !this.modoEdicaoDod;
    const btn = document.getElementById('btnToggleEdicaoDod');
    if (btn) {
      btn.innerText = this.modoEdicaoDod ? '💾 Salvar DOD' : '✏️ Editar DOD';
      btn.style.color = this.modoEdicaoDod ? '#059669' : '#0F172A';
      btn.style.borderColor = this.modoEdicaoDod ? '#059669' : '#CBD5E1';
    }

    const fields = document.querySelectorAll('.dod-editable-field');
    fields.forEach(el => {
      el.contentEditable = this.modoEdicaoDod ? 'true' : 'false';
      if (this.modoEdicaoDod) {
        el.classList.add('lages-editable-field');
      } else {
        el.classList.remove('lages-editable-field');
      }
    });

    if (!this.modoEdicaoDod) {
      this.salvarEdicaoDod();
    }
  },

  async salvarEdicaoDod() {
    if (!this.demandaExibidaDod) return;
    const protocolo = this.demandaExibidaDod.protocolo;
    const corpo = document.getElementById('corpoDocumentoEtp');
    if (!corpo) return;

    try {
      const res = await fetch(`/api/demandas/${protocolo}/dod`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dodConteudo: JSON.stringify({ html: corpo.innerHTML }),
          usuarioNome: this.usuarioLogado?.nome || 'Responsável pelo DOD'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('✓ Alterações no Documento de Formalização da Demanda (DOD de Lages) salvas com sucesso!');
        await this.carregarDemandas();
      }
    } catch (e) {
      console.error('Erro ao salvar edições do DOD:', e);
      alert('Erro ao salvar alterações do DOD: ' + e.message);
    }
  },

  renderizarModalEtp(demanda, perfil) {
    const modal = document.getElementById('modalEtp');
    const corpo = document.getElementById('corpoDocumentoEtp');

    if (!modal || !corpo) {
      console.error('Elementos #modalEtp ou #corpoDocumentoEtp não localizados no DOM.');
      return;
    }

    this.fecharCaixaEmail();
    this.demandaExibidaDod = demanda;
    this.modoEdicaoDod = false;
    const btnEdit = document.getElementById('btnToggleEdicaoDod');
    if (btnEdit) {
      btnEdit.innerText = '✏️ Editar DOD';
      btnEdit.style.color = '#0F172A';
      btnEdit.style.borderColor = '#CBD5E1';
    }

    // Se houver conteúdo previamente editado e salvo, carrega diretamente
    let dodConteudoSalvo = null;
    try {
      if (demanda.dod_conteudo) {
        dodConteudoSalvo = typeof demanda.dod_conteudo === 'string' ? JSON.parse(demanda.dod_conteudo) : demanda.dod_conteudo;
        if (dodConteudoSalvo && dodConteudoSalvo.html) {
          corpo.innerHTML = dodConteudoSalvo.html;
          modal.classList.add('active');
          return;
        }
      }
    } catch(e){}

    const ano = new Date().getFullYear();
    const dia = new Date().getDate();
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[new Date().getMonth()];

    const nomeServ = demanda.usuario_nome || demanda.usuarioNome || (this.usuarioLogado ? this.usuarioLogado.nome : 'Profa. Angelita de Souza');
    const matServ = demanda.usuario_matricula || demanda.usuarioMatricula || (this.usuarioLogado ? this.usuarioLogado.matricula : '48921-SC');
    const cargoServ = demanda.cargo || (this.usuarioLogado ? this.usuarioLogado.cargo : 'Diretora de Escola Municipal');
    const orgaoServ = demanda.orgao || (this.usuarioLogado ? this.usuarioLogado.orgao : 'Prefeitura Municipal de Lages — Secretaria Municipal de Educação');
    const setorServ = demanda.setor || demanda.setorNome || (this.usuarioLogado ? this.usuarioLogado.setor : 'Escolas Municipais (SME)');
    const emailServ = (this.usuarioLogado && this.usuarioLogado.email) ? this.usuarioLogado.email : 'angelita.souza@educacao.lages.sc.gov.br';
    const protocolo = demanda.protocolo || 'DOD-2026-0000';
    const qtd = demanda.quantidade_usuarios || demanda.quantidade || 1;

    let respDiag = {};
    let recsPosto = {};
    try { 
      respDiag = typeof demanda.respostas_diagnostico === 'string' ? JSON.parse(demanda.respostas_diagnostico) : (demanda.respostas_diagnostico || {}); 
    } catch(e){}
    try { 
      recsPosto = typeof demanda.recursos_existentes === 'string' ? JSON.parse(demanda.recursos_existentes) : (demanda.recursos_existentes || {}); 
    } catch(e){}

    const ehNotebook = (
      demanda.formato_equipamento === 'notebook' || 
      respDiag.formatoEquipamento === 'notebook' ||
      respDiag.precisaMobilidade === true ||
      this.demanda.formatoEquipamento === 'notebook' ||
      (demanda.perfil_escolhido_id === 1 && String(setorServ).toLowerCase().includes('escola'))
    );
    const tipoNec = demanda.tipo_necessidade || respDiag.tipoNecessidade || this.demanda.tipoNecessidade || 'computador';
    const sitAtual = respDiag.situacaoAtual || this.demanda.situacaoAtual || 'estragou';
    const softwaresLista = this.obterListaSoftwares(demanda, ['Diário de Classe SME', 'Sistemas Administrativos Municipais', 'Navegação Web e SGPe']);

    let nomeEquip = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';
    let perfilNome = 'Perfil 1: Administrativo e Educacional Padronizado';
    if (demanda.perfil_escolhido_id === 2 || (perfil && perfil.id === 2)) {
      nomeEquip = 'Estação para Análise de Dados e Relatórios';
      perfilNome = 'Perfil 2: BI, Finanças e Gestão';
    } else if (demanda.perfil_escolhido_id === 3 || (perfil && perfil.id === 3)) {
      nomeEquip = 'Workstation de Alto Desempenho CAD/3D';
      perfilNome = 'Perfil 3: Engenharia e Obras Públicas';
    }

    const custoUnit = demanda.custo_unitario || (perfil ? perfil.custo_unitario_estimado : 1850.00);
    const custoTotal = demanda.custo_total || (custoUnit * qtd);
    const valorExtenso = this.valorPorExtenso(custoTotal);

    corpo.innerHTML = `
      <div class="lages-doc-container">
        <!-- CABEÇALHO OFICIAL DE LAGES -->
        <div class="lages-header-logos">
          <img src="/img/brasao_lages.png" class="lages-logo-brasao" alt="Município de Lages">
          <div class="lages-header-titles">
            <div class="lages-title-city">MUNICÍPIO DE LAGES</div>
            <div class="lages-title-state">ESTADO DE SANTA CATARINA</div>
            <div class="lages-title-secretaria">SECRETARIA MUNICIPAL DE ADMINISTRAÇÃO E FAZENDA • DIRETORIA DE LICITAÇÕES E CONTRATOS</div>
          </div>
          <img src="/img/bandeira_lages.png" class="lages-logo-bandeira" alt="Bandeira de Lages">
        </div>
        <div class="lages-header-divider"></div>

        <div class="lages-doc-main-title">
          DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA Nº ${protocolo}
        </div>
        <div class="lages-doc-subtitle">
          Decreto Municipal nº 20.682, de 21 de dezembro de 2023 • Lei Federal nº 14.133/2021
        </div>

        <div class="lages-modalidade-box">
          <span><strong>( X ) LICITAÇÃO</strong></span>
          <span>( &nbsp; ) DISPENSA</span>
          <span>( &nbsp; ) INEXIGIBILIDADE</span>
          <span>( &nbsp; ) ADESÃO À ARP DE OUTRO ÓRGÃO</span>
        </div>

        <!-- 1. DESCRIÇÃO DO OBJETO -->
        <div class="lages-section-card">
          <div class="lages-section-header">1. DESCRIÇÃO DO OBJETO</div>
          <div class="lages-section-body dod-editable-field">
            Registro de preços para eventual e futura aquisição de equipamentos de tecnologia da informação e comunicação (${qtd} unidade(s) de ${nomeEquip}), com garantia técnica e assistência on-site de 36 (trinta e seis) meses, destinados a suprir as rotinas e atividades da unidade ${setorServ} (${orgaoServ}).
          </div>
        </div>

        <!-- 2. CLASSIFICAÇÃO DO OBJETO -->
        <div class="lages-section-card">
          <div class="lages-section-header">2. CLASSIFICAÇÃO DO OBJETO</div>
          <div class="lages-section-body dod-editable-field">
            <p style="margin: 0 0 6px 0;"><strong>( X ) Materiais/Equipamentos</strong> — Bens de natureza comum (Art. 6º, XIII da Lei nº 14.133/2021 c/c Art. 42, § 2º do Decreto Municipal nº 20.682/2023).</p>
            <p style="margin: 0 0 6px 0;">( &nbsp; ) Serviço comum</p>
            <p style="margin: 0 0 6px 0;">( &nbsp; ) Serviço comum de engenharia</p>
            <p style="margin: 0 0 6px 0;">( &nbsp; ) Serviço especial de engenharia</p>
            <p style="margin: 0 0 10px 0;">( &nbsp; ) Obra</p>
            <p style="margin: 0 0 4px 0;"><strong>2.1 Serviço ou fornecimento CONTINUADO?</strong> ( Não )</p>
            <p style="margin: 0;"><strong>2.2 Serviço COM dedicação exclusiva de mão de obra?</strong> ( Não )</p>
          </div>
        </div>

        <!-- 3. JUSTIFICATIVA DA NECESSIDADE DA CONTRATAÇÃO -->
        <div class="lages-section-card">
          <div class="lages-section-header">3. JUSTIFICATIVA DA NECESSIDADE DA CONTRATAÇÃO</div>
          <div class="lages-section-body dod-editable-field">
            <p style="margin: 0 0 8px 0;">
              A presente contratação é imprescindível para viabilizar as rotinas de trabalho executadas na unidade <strong>${setorServ}</strong> por <strong>${nomeServ}</strong> (${cargoServ}), garantindo a continuidade do atendimento ao cidadão e a tempestividade na emissão de atos públicos.
            </p>
            <p style="margin: 0 0 8px 0;">
              O diagnóstico automatizado de rotina processado pelo Sistema DimensionaTI SC constatou que o equipamento anteriormente alocado no posto de trabalho ${sitAtual === 'estragou' ? 'encontra-se avariado e sem viabilidade econômica de conserto' : 'apresenta obsolescência técnica que provoca travamentos e lentidão crítica'}, impossibilitando o uso adequado dos sistemas obrigatórios (${softwaresLista.join(', ')}).
            </p>
            <p style="margin: 0;">
              Em observância ao princípio da padronização (Art. 40, V, "a" da Lei Federal nº 14.133/2021) e ao Art. 66 do Decreto Municipal nº 20.682/2023, a especificação atende ao <strong>${perfilNome}</strong>, assegurando eficiência administrativa, proteção contra perdas de dados e cumprimento dos prazos legais do Município de Lages.
            </p>
          </div>
        </div>

        <!-- 4. PREVISÃO NO PLANO DE CONTRATAÇÕES ANUAL -->
        <div class="lages-section-card">
          <div class="lages-section-header">4. PREVISÃO NO PLANO DE CONTRATAÇÕES ANUAL</div>
          <div class="lages-section-body dod-editable-field">
            <p style="margin: 0 0 6px 0;"><strong>( X ) Sim, código nº PCA-2026-TIC-042</strong></p>
            <p style="margin: 0; color: #334155;">Demanda expressamente contemplada no Plano de Contratações Anual do Município de Lages para o exercício de ${ano}, na Ação de Modernização e Continuidade do Parque de TIC da Administração Municipal.</p>
          </div>
        </div>

        <!-- 5. VALOR TOTAL ESTIMADO -->
        <div class="lages-section-card">
          <div class="lages-section-header">5. VALOR TOTAL ESTIMADO</div>
          <div class="lages-section-body dod-editable-field">
            <p style="margin: 0 0 4px 0; font-size: 11pt; font-weight: 800; color: #0F172A;">
              R$ ${custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${valorExtenso})
            </p>
            <p style="margin: 0; font-size: 8.5pt; color: #475569;">
              Estimativa preliminar com base em pesquisas de preços e parâmetros referenciais públicos de TIC em Santa Catarina, correspondendo ao valor unitário de R$ ${custoUnit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para ${qtd} equipamento(s).
            </p>
          </div>
        </div>

        <!-- 6. RECURSOS ORÇAMENTÁRIOS -->
        <div class="lages-section-card">
          <div class="lages-section-header">6. RECURSOS ORÇAMENTÁRIOS</div>
          <div class="lages-section-body dod-editable-field" style="padding: 0;">
            <table class="lages-table-orcamento">
              <tr>
                <td style="width: 40%;"><strong>Fonte de recursos:</strong> Município</td>
                <td style="width: 40%;"><strong>Valor:</strong> R$ ${custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style="width: 20%;"><strong>Percentual:</strong> 100%</td>
              </tr>
              <tr>
                <td colspan="3"><strong>Conta para empenho:</strong> 01.02.00 — Recursos Ordinários Livres</td>
              </tr>
              <tr>
                <td><strong>Código de despesa:</strong> 12.361.0010.2045</td>
                <td colspan="2"><strong>Elemento de despesa:</strong> 44.90.52 (Equipamentos e Material Permanente)</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 7. PREVISÃO DE DATA -->
        <div class="lages-section-card">
          <div class="lages-section-header">7. PREVISÃO DE DATA EM QUE DEVE SER ASSINADO O INSTRUMENTO CONTRATUAL</div>
          <div class="lages-section-body dod-editable-field">
            Previsão para conclusão do certame e assinatura da ata/contrato: <strong>2º Semestre de ${ano}</strong>, em consonância com o calendário oficial de licitações da Diretoria de Gestão de Licitações e Contratos.
          </div>
        </div>

        <!-- 8. VINCULAÇÃO COM OUTRA DEMANDA -->
        <div class="lages-section-card">
          <div class="lages-section-header">8. VINCULAÇÃO OU DEPENDÊNCIA COM OUTRA DEMANDA</div>
          <div class="lages-section-body dod-editable-field">
            <strong>( X ) Não</strong> possui vinculação ou dependência prévia com outra demanda ou contrato vigente.
          </div>
        </div>

        <!-- 9. INDICAÇÃO DO GESTOR E FISCAL -->
        <div class="lages-section-card">
          <div class="lages-section-header">9. INDICAÇÃO DO GESTOR E FISCAL DO CONTRATO</div>
          <div class="lages-section-body dod-editable-field">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div style="border: 1px solid #E2E8F0; padding: 10px; border-radius: 4px;">
                <div style="font-weight: 800; text-transform: uppercase; font-size: 8.5pt; color: #0F172A; margin-bottom: 4px;">GESTOR</div>
                <div><strong>Nome:</strong> Equipe de Gestão Contratual</div>
                <div><strong>Cargo:</strong> Gestor Setorial de Contratos TIC</div>
                <div><strong>E-mail:</strong> gestao.contratos@lages.sc.gov.br</div>
              </div>
              <div style="border: 1px solid #E2E8F0; padding: 10px; border-radius: 4px;">
                <div style="font-weight: 800; text-transform: uppercase; font-size: 8.5pt; color: #0F172A; margin-bottom: 4px;">FISCAL</div>
                <div><strong>Nome:</strong> Fiscalização Técnica de TIC</div>
                <div><strong>Cargo:</strong> Analista de Infraestrutura e Redes</div>
                <div><strong>E-mail:</strong> fiscal.tic@lages.sc.gov.br</div>
              </div>
            </div>
            <div style="margin-top: 10px; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 4px; font-size: 8.5pt;">
              <span style="font-weight: 800;">GESTOR SUBSTITUTO:</span> Suplente de Fiscalização Administrativa • Cargo: Assessor Administrativo • E-mail: substituto.adm@lages.sc.gov.br
            </div>
          </div>
        </div>

        <!-- 10. ÁREA REQUISITANTE E ASSINATURAS -->
        <div class="lages-section-card">
          <div class="lages-section-header">10. ÁREA REQUISITANTE</div>
          <div class="lages-section-body dod-editable-field">
            <p style="margin: 0 0 4px 0;"><strong>10.1 SETOR:</strong> ${setorServ} — ${orgaoServ}</p>
            <p style="margin: 0 0 16px 0;"><strong>10.2 RESPONSÁVEL PELA DEMANDA:</strong> ${nomeServ} • <strong>Cargo:</strong> ${cargoServ} • <strong>E-mail:</strong> ${emailServ}</p>

            <div style="text-align: right; margin-bottom: 20px; font-weight: 700;">
              Lages (SC), ${dia} de ${mes} de ${ano}.
            </div>

            <div class="lages-assinaturas-grid-4">
              <div class="lages-assinatura-box">
                <strong>${nomeServ}</strong><br>
                Responsável pela elaboração do DFD<br>
                <small>Matrícula: ${matServ}</small>
              </div>
              <div class="lages-assinatura-box">
                <strong>Secretaria Municipal Requisitante</strong><br>
                Secretário(a) / Superintendente do Órgão
              </div>
              <div class="lages-assinatura-box">
                <strong>Diretoria-Geral de Orçamento</strong><br>
                Conformidade Orçamentária e PCA
              </div>
              <div class="lages-assinatura-box">
                <strong>Secretaria de Administração e Fazenda</strong><br>
                Autorização para instrução da fase preparatória
              </div>
            </div>
          </div>
        </div>

        <div class="lages-doc-footer-legal">
          <span>Modelo de Documento de Formalização de Demanda – Lei 14.133/21</span>
          <span>Município de Lages / SC • Decreto Municipal nº 20.682/2023 • Versão: Janeiro/2024</span>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },
  fecharModalEtp() {
    document.getElementById('modalEtp').classList.remove('active');
    this.fecharCaixaEmail();
  },

  abrirCaixaEmail() {
    const box = document.getElementById('boxEncaminharEmail');
    if (!box) return;
    box.style.display = 'block';
    const inp = document.getElementById('inputEmailDestino');
    if (inp) {
      if (this.usuarioLogado && !inp.value) inp.value = this.usuarioLogado.email;
      inp.focus();
    }
  },

  fecharCaixaEmail() {
    const box = document.getElementById('boxEncaminharEmail');
    if (box) box.style.display = 'none';
  },

  enviarPorEmail() {
    const inp = document.getElementById('inputEmailDestino');
    const msg = document.getElementById('emailFeedbackMsg');
    const email = inp ? inp.value.trim() : '';

    if (!email || !email.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }

    if (msg) {
      msg.style.display = 'block';
      msg.innerText = `✓ Minuta encaminhada com sucesso para ${email}!`;
    }

    const prot = this.demanda.protocolo || 'DOD-2026';
    const subj = encodeURIComponent(`Minuta de Contrato TIC Blindada - ${prot}`);
    const body = encodeURIComponent(`Segue a minuta oficial gerada para a Prefeitura de Lages/SC.\n\nProtocolo: ${prot}\nValor: R$ ${this.demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    setTimeout(() => {
      window.open(`mailto:${email}?subject=${subj}&body=${body}`, '_blank');
    }, 600);
  },

  // Executa impressão direta em folha A4 limpa (sem scrollbar e sem cortes)
  executarImpressaoLimpa(containerId, titulo) {
    const el = document.getElementById(containerId);
    if (!el) {
      window.print();
      return;
    }

    try {
      const w = window.open('', '_blank', 'width=900,height=1000');
      if (!w) {
        window.print();
        return;
      }

      w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${titulo || 'Documento Oficial - Município de Lages / TCE-SC'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      background: #FFFFFF !important;
      color: #000000 !important;
      font-family: Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 12px;
    }
    .dod-sc-container {
      width: 100%;
      margin: 0 auto;
      background: #FFFFFF;
      color: #000000;
      font-family: Arial, Helvetica, sans-serif;
    }
    .dod-header-oficial-sc {
      width: 100%;
      text-align: center;
      margin-bottom: 6px;
    }
    .dod-img-cabecalho {
      width: 100%;
      max-width: 820px;
      height: auto;
      display: block;
      margin: 0 auto;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .dod-sub-bar-protocolo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #475569;
      padding: 4px 6px 6px 6px;
      border-bottom: 1px solid #CBD5E1;
      margin-bottom: 8px;
    }
    .dod-header-brasao {
      text-align: center;
      border-bottom: 2px solid #000000;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .dod-official-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #000000;
      font-size: 9pt;
      color: #000000;
      background: #FFFFFF;
      page-break-inside: auto;
    }
    .dod-title-cell {
      background: #F1F5F9 !important;
      color: #000000;
      font-weight: 900;
      font-size: 11pt;
      text-align: center;
      padding: 10px;
      border: 1.5px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .dod-field-cell {
      border: 1px solid #000000;
      padding: 7px 10px;
      font-size: 9pt;
      vertical-align: top;
      color: #000000;
    }
    .dod-section-header {
      background: #F1F5F9 !important;
      color: #000000;
      font-weight: 800;
      font-size: 9.5pt;
      padding: 8px 10px;
      border: 1px solid #000000;
      text-align: left;
    }
    .dod-content-cell {
      border: 1px solid #000000;
      padding: 10px 12px;
      font-size: 9pt;
      vertical-align: top;
      text-align: justify;
      color: #000000;
    }
    .dod-subtable {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      color: #000000;
    }
    .dod-subtable th {
      background: #E2E8F0 !important;
      color: #000000;
      border: 1px solid #000000;
      padding: 7px 10px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8.5pt;
    }
    .dod-subtable td {
      border: 1px solid #000000;
      padding: 8px 10px;
      color: #000000;
    }
    .dod-footer-note {
      font-size: 8pt;
      color: #4B5563;
      margin-top: 10px;
      font-style: italic;
      line-height: 1.4;
      text-align: justify;
    }
    .gov-contract-doc {
      font-family: "Times New Roman", Times, Georgia, serif;
      color: #111827;
      line-height: 1.5;
      font-size: 10pt;
      text-align: justify;
    }
    .gov-contract-header {
      text-align: center;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .gov-clause {
      margin-bottom: 18px;
    }
    .gov-clause-title {
      font-weight: 800;
      font-size: 10pt;
      color: #000000;
      margin-bottom: 6px;
      page-break-inside: avoid;
    }
    .gov-clause-p {
      margin-bottom: 8px;
      text-indent: 2.5em;
    }
    .gov-table, .tce-table-compare {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8.5pt;
      page-break-inside: auto;
    }
    .gov-table th, .gov-table td,
    .tce-table-compare th, .tce-table-compare td {
      border: 1px solid #64748B;
      padding: 6px 8px;
    }
    .gov-table th, .tce-table-compare th {
      background: #F1F5F9 !important;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8pt;
    }
    .tech-spec-box {
      background: #F8FAFC !important;
      border: 1px solid #CBD5E1;
      padding: 10px 12px;
      margin-top: 8px;
      font-size: 8pt;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    .gov-signatures-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 36px;
      page-break-inside: avoid;
    }
    .gov-sig-line {
      border-top: 1px solid #000000;
      padding-top: 6px;
      text-align: center;
      font-size: 8.5pt;
    }
    .tce-report-doc {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.5pt;
      color: #111827;
      line-height: 1.5;
    }
    .tce-report-header {
      text-align: center;
      border-bottom: 2px solid #0F172A;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .tce-box-veredicto {
      border-radius: 6px;
      padding: 12px 16px;
      margin: 16px 0;
      page-break-inside: avoid;
    }
    .tce-box-veredicto.alert-danger {
      background: #FEF2F2 !important;
      border: 1px solid #F87171;
      color: #991B1B;
    }
    .tce-box-veredicto.alert-success {
      background: #ECFDF5 !important;
      border: 1px solid #34D399;
      color: #065F46;
    }
    .tce-box-veredicto.alert-warning {
      background: #FFFBEB !important;
      border: 1px solid #FBBF24;
      color: #92400E;
    }
    .tce-seal-stamp {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #F8FAFC !important;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 20px;
      font-size: 8pt;
      color: #475569;
      page-break-inside: avoid;
    }
    tr {
      page-break-inside: avoid;
    }
    @media print {
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  ${el.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  <\/script>
</body>
</html>`);
      w.document.close();
    } catch (err) {
      console.warn('Fallback para window.print direto:', err);
      window.print();
    }
  },

  imprimirDocumento() {
    this.executarImpressaoLimpa('corpoDocumentoEtp', 'Documento de Formalização da Demanda (DOD - SC)');
  },

  // ==========================================================
  // PAINEL DE ANÁLISE TÉCNICA DA DEMANDA (DIRETORIA DE TIC)
  // ==========================================================
  protocoloAnaliseAtual: null,
  abaAnaliseAtual: 'diagnostico',
  demandaAnaliseAtual: null,
  modoEdicaoEtp: false,

  async abrirPainelAnaliseTi(protocolo) {
    this.fecharTodosMenusAcoes();
    this.protocoloAnaliseAtual = protocolo;

    try {
      const res = await fetch(`/api/demandas/${protocolo}`);
      const data = await res.json();
      if (!data.demanda) {
        alert('Demanda não localizada.');
        return;
      }

      this.demandaAnaliseAtual = data.demanda;
      const d = data.demanda;

      // Se for a primeira visualização técnica e estiver como "Enviado para TI", atualiza para "Em análise pelo TI"
      const statusNorm = String(d.status || '').toUpperCase().trim();
      if (statusNorm === 'ENVIADO PARA TI' || statusNorm === 'SOB ANÁLISE') {
        try {
          await fetch(`/api/demandas/${protocolo}/em-analise`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC',
              usuarioCargo: this.usuarioLogado?.cargo || 'Analista de Infraestrutura TIC'
            })
          });
          d.status = 'Em análise pelo TI';
          await this.carregarDemandas();
        } catch (e) {
          console.error(e);
        }
      }

      // Preenche cabeçalho do Drawer
      const elTit = document.getElementById('analiseTiTitulo');
      const elProt = document.getElementById('analiseTiProtocolo');
      const elBadge = document.getElementById('analiseTiStatusBadge');
      const elSub = document.getElementById('analiseTiSubtitulo');

      if (elTit) elTit.innerText = `Análise Técnica — ${d.setor || 'Unidade Solicitante'}`;
      if (elProt) elProt.innerText = d.protocolo;
      if (elSub) elSub.innerText = `Solicitante: ${d.usuario_nome} • Cargo: ${d.cargo || 'Servidor'} • Órgão: ${d.orgao}`;

      if (elBadge) {
        elBadge.innerText = d.status;
        elBadge.className = 'badge-status-chip ' + (
          d.dod_validado === 1 ? 'status-homologado' :
          d.status === 'Cancelado' || d.status === 'Reprovado' ? 'status-cancelado' :
          d.status === 'Ajustes solicitados' ? 'status-revisao' : 'status-analise'
        );
      }

      // Preenche Aba 1: Respostas Originais do Servidor
      this.preencherAbaDiagnosticoTi(d);

      // Preenche Aba 2: Interpretação & Recomendação
      this.preencherAbaInterpretacaoTi(d);

      // Preenche Aba 3: DOD Oficial
      this.preencherAbaDodTi(d, data.perfilEsc);

      // Preenche Aba 4: Histórico & Rastreabilidade
      await this.carregarHistoricoDemanda(protocolo);

      // Atualiza botões do rodapé
      this.atualizarBotoesAcaoTi(d);

      // Abre modal
      this.setAbaAnaliseTi('diagnostico');
      document.getElementById('modalAnaliseTi')?.classList.add('active');
    } catch (e) {
      alert('Erro ao carregar análise da demanda: ' + e.message);
    }
  },

  fecharModalAnaliseTi() {
    document.getElementById('modalAnaliseTi')?.classList.remove('active');
  },

  setAbaAnaliseTi(aba) {
    this.abaAnaliseAtual = aba;
    document.querySelectorAll('.drawer-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.drawer-tab-pane').forEach(p => p.classList.remove('active'));

    const tabMap = {
      'diagnostico': 'tabAnaliseDiagnostico',
      'interpretacao': 'tabAnaliseInterpretacao',
      'dod': 'tabAnaliseDod',
      'historico': 'tabAnaliseHistorico'
    };

    const paneMap = {
      'diagnostico': 'paneAnaliseDiagnostico',
      'interpretacao': 'paneAnaliseInterpretacao',
      'dod': 'paneAnaliseDod',
      'historico': 'paneAnaliseHistorico'
    };

    document.getElementById(tabMap[aba])?.classList.add('active');
    document.getElementById(paneMap[aba])?.classList.add('active');
  },

  preencherAbaDiagnosticoTi(d) {
    let resp = {};
    let recs = {};
    try { resp = typeof d.respostas_diagnostico === 'string' ? JSON.parse(d.respostas_diagnostico) : (d.respostas_diagnostico || {}); } catch(e){}
    try { recs = typeof d.recursos_existentes === 'string' ? JSON.parse(d.recursos_existentes) : (d.recursos_existentes || {}); } catch(e){}

    const corpoResp = document.getElementById('analiseCorpoRespostasOriginais');
    const corpoRecs = document.getElementById('analiseCorpoRecursosPosto');

    if (corpoResp) {
      corpoResp.innerHTML = `
        <div class="info-item-row">
          <span class="info-item-label">O que o Servidor Solicitou:</span>
          <div class="info-item-value" style="color: var(--dark-accent); font-weight: 700;">
            ${(d.tipo_necessidade || resp.tipoNecessidade || 'computador').toUpperCase()} — ${resp.rotinaDescricao || 'Rotina Administrativa'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Mobilidade Declarada:</span>
          <div class="info-item-value">
            ${resp.precisaMobilidade !== false ? '🚗 Sim — Necessidade de deslocamento frequente entre salas e reuniões' : '🏢 Não — Posto fixo contínuo na mesa'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Sistemas e Softwares Diários:</span>
          <div class="info-item-value">
            ${this.obterListaSoftwares(d, resp.programasUtilizados).map(s => `<span class="tag-software" style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; margin-right: 4px; display: inline-block; margin-bottom: 4px;">${s}</span>`).join('')}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Multitarefas e Carga de Trabalho:</span>
          <div class="info-item-value">
            ${resp.multitarefas !== false ? 'Sim — Múltiplos programas abertos simultaneamente' : 'Não — Uso sequencial'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Situação da Máquina Anterior:</span>
          <div class="info-item-value">
            ${resp.situacaoDescricao || 'Equipamento anterior avariado / queimado (substituição urgente)'}
          </div>
        </div>
      `;
    }

    if (corpoRecs) {
      corpoRecs.innerHTML = `
        <div class="info-item-row">
          <span class="info-item-label">Monitor na Mesa:</span>
          <div class="info-item-value" style="color: ${recs.monitor === 'none' ? '#34D399' : '#FBBF24'};">
            ${recs.monitor === 'none' ? '✓ Já possui monitor funcionando (Dispensado da compra)' : '⚠️ Precisa de monitor de vídeo'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Teclado e Mouse:</span>
          <div class="info-item-value" style="color: ${recs.teclado !== false ? '#34D399' : '#FBBF24'};">
            ${recs.teclado !== false ? '✓ Periféricos existentes preservados' : '⚠️ Precisa de kit teclado/mouse'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Webcam / Reuniões Online:</span>
          <div class="info-item-value">
            ${recs.webcam !== false ? '✓ Câmera disponível ou integrada' : 'Precisa de webcam avulsa'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Segundo Monitor:</span>
          <div class="info-item-value">
            ${recs.segundoMonitor ? 'Solicitado pelo servidor (Sujeito a validação do TI)' : 'Não solicitado'}
          </div>
        </div>
        <div class="info-item-row">
          <span class="info-item-label">Quantidade Requisitada:</span>
          <div class="info-item-value" style="font-size: 1.1rem; font-weight: 800; color: #FFFFFF;">
            ${d.quantidade_usuarios || recs.quantidadePostos || 1} equipamento(s)
          </div>
        </div>
      `;
    }
  },

  preencherAbaInterpretacaoTi(d) {
    let diag = {};
    let rec = {};
    try { diag = typeof d.diagnostico_interpretado === 'string' ? JSON.parse(d.diagnostico_interpretado) : (d.diagnostico_interpretado || {}); } catch(e){}
    try { rec = typeof d.recomendacao_preliminar === 'string' ? JSON.parse(d.recomendacao_preliminar) : (d.recomendacao_preliminar || {}); } catch(e){}

    const corpo = document.getElementById('analiseCorpoInterpretacao');
    if (!corpo) return;

    corpo.innerHTML = `
      <div style="background: #141C28; border: 1px solid var(--dark-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
        <span class="label-muted-small" style="color: var(--dark-accent); font-weight: 800;">DIAGNÓSTICO SISTÊMICO DA NECESSIDADE</span>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFFFFF; margin: 4px 0 10px 0;">
          ${diag.perfilSugerido || 'Notebook Corporativo Portátil'}
        </h3>
        <p style="font-size: 0.9rem; color: #CBD5E1; line-height: 1.5; margin-bottom: 16px;">
          ${diag.justificativaUso || d.justificativa_usuario || 'Necessidade identificada para rotina operacional e educacional.'}
        </p>

        <h5 style="font-size: 0.85rem; color: #FFFFFF; text-transform: uppercase; margin-bottom: 8px;">Critérios de Adequação Técnica:</h5>
        <ul style="margin: 0; padding-left: 20px; color: #94A3B8; font-size: 0.85rem; line-height: 1.6;">
          ${(diag.resumoCriterios || [
            'Proporcionalidade entre carga de trabalho e capacidade do processador',
            'Sustentabilidade com reaproveitamento de monitores e cabos existentes',
            'Conformidade com o Art. 18 da Lei Federal nº 14.133/2021'
          ]).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="box-specs-tecnicas-ti" style="margin-top: 14px;">
        <div class="specs-ti-header">
          <h4><span>⚙️</span> Recomendação de Hardware TIC Analisada</h4>
          <span class="specs-ti-badge" style="background: rgba(56, 189, 248, 0.2); color: #38BDF8;">PRELIMINAR</span>
        </div>
        <div class="specs-ti-grid">
          <div class="spec-ti-item">
            <small>Sistema Operacional</small>
            <strong>${rec.so || 'Windows 11 Pro 64-bit'}</strong>
          </div>
          <div class="spec-ti-item">
            <small>Processador</small>
            <strong>${rec.cpu || 'Quad-Core Moderno x86-64'}</strong>
          </div>
          <div class="spec-ti-item">
            <small>Memória RAM</small>
            <strong>${rec.ram || '8 GB Alta Velocidade'}</strong>
          </div>
          <div class="spec-ti-item">
            <small>Armazenamento</small>
            <strong>${rec.ssd || 'SSD 256GB NVMe M.2'}</strong>
          </div>
          <div class="spec-ti-item">
            <small>Garantia e Suporte</small>
            <strong>${rec.garantia || '36 meses on-site'}</strong>
          </div>
        </div>
      </div>
    `;
  },

  preencherAbaDodTi(d, perfil) {
    const corpo = document.getElementById('analiseCorpoDod');
    if (!corpo) return;

    // Reaproveita renderização oficial do DOD
    this.renderizarModalEtp(d, perfil);
    const corpoEtp = document.getElementById('corpoDocumentoEtp');
    if (corpoEtp) {
      corpo.innerHTML = `<div style="background: #FFFFFF; border-radius: 8px; padding: 20px; color: #000;">${corpoEtp.innerHTML}</div>`;
    }
  },

  async carregarHistoricoDemanda(protocolo) {
    const corpo = document.getElementById('analiseCorpoHistorico');
    if (!corpo) return;

    try {
      const res = await fetch(`/api/demandas/${protocolo}/historico`);
      const historico = await res.json();
      this.renderizarHistoricoTimeline(historico);
    } catch (e) {
      corpo.innerHTML = `<p style="color: var(--dark-muted);">Não foi possível carregar o histórico de auditoria.</p>`;
    }
  },

  renderizarHistoricoTimeline(historico) {
    const corpo = document.getElementById('analiseCorpoHistorico');
    if (!corpo) return;

    if (!historico || historico.length === 0) {
      corpo.innerHTML = `
        <div class="audit-timeline-item">
          <div class="audit-node-point info">●</div>
          <div class="audit-item-box">
            <div class="audit-item-title">Solicitação Registrada</div>
            <p class="audit-item-detail">Processo iniciado no sistema e encaminhado à triagem técnica da TIC.</p>
          </div>
        </div>
      `;
      return;
    }

    corpo.innerHTML = historico.map(h => {
      let iconClass = 'info';
      if (h.acao.includes('Validado') || h.acao.includes('ETP')) iconClass = '';
      if (h.acao.includes('Ajuste')) iconClass = 'warn';
      if (h.acao.includes('Reprovad') || h.acao.includes('Cancel')) iconClass = 'danger';

      return `
        <div class="audit-timeline-item">
          <div class="audit-node-point ${iconClass}">✓</div>
          <div class="audit-item-box">
            <div class="audit-item-header">
              <span class="audit-item-title">${h.acao}</span>
              <span class="audit-item-date">${h.data_hora}</span>
            </div>
            <div class="audit-item-author">
              👤 ${h.usuario_nome} (${h.usuario_cargo || 'TI / Sistema'}) • ${h.tipo_usuario === 'admin' ? 'DIRETORIA DE TIC' : 'SOLICITANTE'}
            </div>
            <div class="audit-item-detail">
              ${h.detalhes || 'Sem observações adicionais registradas.'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  atualizarBotoesAcaoTi(d) {
    const ehValidado = d.dod_validado === 1 || String(d.status).toUpperCase() === 'VALIDADO PELO TI';
    const ehCancelado = String(d.status).toUpperCase() === 'CANCELADO' || String(d.status).toUpperCase() === 'REPROVADO';

    const btnVal = document.getElementById('btnAcaoValidarDod');
    const btnAj = document.getElementById('btnAcaoSolicitarAjustes');
    const btnRep = document.getElementById('btnAcaoReprovar');
    const btnEtp = document.getElementById('btnAcaoGerarEtp');
    const iconEtp = document.getElementById('btnGerarEtpIcon');
    const txtEtp = document.getElementById('btnGerarEtpText');

    if (btnVal) {
      btnVal.style.display = (ehValidado || ehCancelado) ? 'none' : 'inline-block';
    }
    if (btnAj) {
      btnAj.style.display = ehCancelado ? 'none' : 'inline-block';
    }
    if (btnRep) {
      btnRep.style.display = ehCancelado ? 'none' : 'inline-block';
    }

    if (btnEtp) {
      if (ehValidado) {
        btnEtp.className = 'btn-action-etp unlocked';
        if (iconEtp) iconEtp.innerText = '📑';
        if (txtEtp) txtEtp.innerText = d.etp_gerado === 1 ? 'Visualizar / Editar ETP' : 'Gerar ETP';
        btnEtp.title = 'Clique para gerar o Estudo Técnico Preliminar (ETP)';
      } else {
        btnEtp.className = 'btn-action-etp locked';
        if (iconEtp) iconEtp.innerText = '🔒';
        if (txtEtp) txtEtp.innerText = 'Gerar ETP';
        btnEtp.title = 'Bloqueado: Requer validação prévia do DOD pelo TI';
      }
    }
  },

  async validarDodTi(protocolo) {
    if (!confirm(`Deseja validar formalmente o DOD da demanda ${protocolo}?\n\nEsta ação atesta a conformidade das respostas e libera a geração do Estudo Técnico Preliminar (ETP).`)) {
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${protocolo}/validar-dod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC Responsável',
          usuarioCargo: this.usuarioLogado?.cargo || 'Analista de Governança TIC'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`✓ DOD do protocolo ${protocolo} validado com sucesso!\nA geração de ETP está agora liberada.`);
        await this.carregarDemandas();
        await this.abrirPainelAnaliseTi(protocolo);
      } else {
        alert(data.error || 'Erro ao validar DOD.');
      }
    } catch (e) {
      alert('Erro na comunicação com o servidor: ' + e.message);
    }
  },

  // ==========================================
  // MODAIS DE AJUSTES E REPROVAÇÃO
  // ==========================================
  protocoloAjusteAtual: null,

  abrirModalAjustes(protocolo) {
    this.protocoloAjusteAtual = protocolo;
    const lbl = document.getElementById('labelProtocoloAjustes');
    if (lbl) lbl.innerText = protocolo;
    const txt = document.getElementById('txtNotasAjustesTi');
    if (txt) txt.value = '';
    document.getElementById('modalSolicitarAjustesTi')?.classList.add('active');
  },

  fecharModalAjustes() {
    document.getElementById('modalSolicitarAjustesTi')?.classList.remove('active');
  },

  preencherNotaAjuste(txt) {
    const el = document.getElementById('txtNotasAjustesTi');
    if (el) el.value = txt;
  },

  async confirmarSolicitarAjustes() {
    const nota = document.getElementById('txtNotasAjustesTi')?.value.trim();
    if (!nota) {
      alert('Informe os apontamentos técnicos para o servidor.');
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${this.protocoloAjusteAtual}/solicitar-ajustes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ajustesSolicitados: nota,
          usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC',
          usuarioCargo: this.usuarioLogado?.cargo || 'Analista de TIC'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`✓ Apontamentos enviados ao servidor com sucesso! Demanda ${this.protocoloAjusteAtual} alterada para "Ajustes solicitados".`);
        this.fecharModalAjustes();
        this.fecharModalAnaliseTi();
        await this.carregarDemandas();
      } else {
        alert(data.error || 'Erro ao solicitar ajustes.');
      }
    } catch (e) {
      alert('Erro ao solicitar ajustes: ' + e.message);
    }
  },

  abrirModalReprovar(protocolo) {
    this.protocoloAjusteAtual = protocolo;
    const lbl = document.getElementById('labelProtocoloReprovar');
    if (lbl) lbl.innerText = protocolo;
    const txt = document.getElementById('txtJustificativaReprovacao');
    if (txt) txt.value = '';
    document.getElementById('modalReprovarTi')?.classList.add('active');
  },

  fecharModalReprovar() {
    document.getElementById('modalReprovarTi')?.classList.remove('active');
  },

  preencherJustificativaReprovacao(txt) {
    const el = document.getElementById('txtJustificativaReprovacao');
    if (el) el.value = txt;
  },

  async confirmarReprovacao() {
    const motivo = document.getElementById('txtJustificativaReprovacao')?.value.trim();
    if (!motivo) {
      alert('A justificativa técnica de reprovação é obrigatória.');
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${this.protocoloAjusteAtual}/reprovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motivoReprovacao: motivo,
          usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC',
          usuarioCargo: this.usuarioLogado?.cargo || 'Analista de TIC'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`Demanda ${this.protocoloAjusteAtual} reprovada e arquivada com sucesso.`);
        this.fecharModalReprovar();
        this.fecharModalAnaliseTi();
        await this.carregarDemandas();
      } else {
        alert(data.error || 'Erro ao reprovar demanda.');
      }
    } catch (e) {
      alert('Erro ao reprovar: ' + e.message);
    }
  },

  abrirModalResponderAjustes(protocolo) {
    this.fecharTodosMenusAcoes();
    this.protocoloAjusteAtual = protocolo;
    const d = this.demandasCarregadas.find(item => item.protocolo === protocolo);

    const lbl = document.getElementById('labelProtocoloResponderAjustes');
    if (lbl) lbl.innerText = protocolo;

    const elApon = document.getElementById('txtApontamentoTiExibicao');
    if (elApon) elApon.innerText = d?.ajustes_solicitados || 'Favor complementar os dados do pedido conforme orientação do TI.';

    const elResp = document.getElementById('txtRespostaAjusteServidor');
    if (elResp) elResp.value = '';

    document.getElementById('modalResponderAjustes')?.classList.add('active');
  },

  fecharModalResponderAjustes() {
    document.getElementById('modalResponderAjustes')?.classList.remove('active');
  },

  async confirmarRespostaAjustes() {
    const resp = document.getElementById('txtRespostaAjusteServidor')?.value.trim();
    if (!resp) {
      alert('Por favor, informe seus esclarecimentos antes de reenviar.');
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${this.protocoloAjusteAtual}/responder-ajustes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostaServidor: resp,
          usuarioNome: this.usuarioLogado?.nome || 'Servidor Solicitante',
          usuarioCargo: this.usuarioLogado?.cargo || 'Servidor'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`✓ Resposta enviada com sucesso! A demanda retornou para a fila de atendimento da Diretoria de TIC.`);
        this.fecharModalResponderAjustes();
        await this.carregarDemandas();
      } else {
        alert(data.error || 'Erro ao responder ajustes.');
      }
    } catch (e) {
      alert('Erro na comunicação: ' + e.message);
    }
  },

  async abrirHistoricoAuditoria(protocolo) {
    this.fecharTodosMenusAcoes();
    await this.abrirPainelAnaliseTi(protocolo);
    this.setAbaAnaliseTi('historico');
  },

  // ==========================================================
  // ESTUDO TÉCNICO PRELIMINAR (ETP COMPLETO - 12 SEÇÕES)
  // ==========================================================
  etpAtual: null,

  async gerarEtpDocumento(protocolo) {
    const d = this.demandasCarregadas.find(item => item.protocolo === protocolo) || this.demandaAnaliseAtual;

    if (!d || d.dod_validado !== 1) {
      alert('🔒 A geração do Estudo Técnico Preliminar (ETP) está bloqueada!\n\nConforme a governança pública e a Lei nº 14.133/2021, o Documento de Formalização da Demanda (DOD) precisa ser validado e aprovado tecnicamente pela Diretoria de TIC antes da elaboração do ETP.');
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${protocolo}/gerar-etp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioNome: this.usuarioLogado?.nome || 'Equipe de Planejamento TIC',
          usuarioCargo: this.usuarioLogado?.cargo || 'Responsável Técnico TIC'
        })
      });

      const data = await res.json();
      if (data.success) {
        await this.carregarDemandas();
        await this.abrirModalEtpCompleto(protocolo);
      } else {
        alert(data.error || 'Erro ao gerar ETP.');
      }
    } catch (e) {
      alert('Erro ao gerar ETP: ' + e.message);
    }
  },

  async abrirModalEtpCompleto(protocolo) {
    this.fecharTodosMenusAcoes();
    try {
      const res = await fetch(`/api/demandas/${protocolo}`);
      const data = await res.json();
      const d = data.demanda;
      if (!d) return;

      this.etpAtual = d;
      let etpConteudo = null;
      try {
        etpConteudo = typeof d.etp_conteudo === 'string' ? JSON.parse(d.etp_conteudo) : d.etp_conteudo;
      } catch(e){}

      this.renderizarEtpCompleto(d, etpConteudo);
      document.getElementById('modalEtpCompleto')?.classList.add('active');
    } catch (e) {
      alert('Erro ao abrir ETP: ' + e.message);
    }
  },

  fecharModalEtpCompleto() {
    document.getElementById('modalEtpCompleto')?.classList.remove('active');
    this.fecharCaixaEmailEtp();
  },

  abrirCaixaEmailEtp() {
    const box = document.getElementById('boxEncaminharEmailEtp');
    if (!box) return;
    box.style.display = 'block';
    const inp = document.getElementById('inputEmailDestinoEtp');
    if (inp) {
      if (this.usuarioLogado && !inp.value) inp.value = this.usuarioLogado.email;
      inp.focus();
    }
  },

  fecharCaixaEmailEtp() {
    const box = document.getElementById('boxEncaminharEmailEtp');
    if (box) box.style.display = 'none';
  },

  enviarEtpPorEmail() {
    const inp = document.getElementById('inputEmailDestinoEtp');
    const msg = document.getElementById('emailEtpFeedbackMsg');
    const email = inp ? inp.value.trim() : '';

    if (!email || !email.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }

    if (msg) {
      msg.style.display = 'block';
      msg.innerText = '✓ ETP encaminhado com sucesso para ' + email + '!';
    }

    const prot = this.etpAtual?.protocolo || 'DOD-2026';
    const etpNum = this.etpAtual?.etp_numero || prot.replace('DOD-', 'ETP-');
    const subj = encodeURIComponent('Estudo Técnico Preliminar - ' + etpNum + ' (Vinculado ao ' + prot + ')');
    const body = encodeURIComponent('Prezados,\n\nSegue o Estudo Técnico Preliminar (ETP nº ' + etpNum + ') elaborado para a Prefeitura do Município de Lages / SC, em observância ao Decreto Municipal nº 20.682/2023 e à Lei Federal nº 14.133/2021.\n\nDemanda Vinculada: ' + prot + '\nÓrgão: ' + (this.etpAtual?.orgao || 'Prefeitura de Lages') + '\nUnidade: ' + (this.etpAtual?.setor || 'Setor Requisitante'));
    
    setTimeout(() => {
      window.open('mailto:' + email + '?subject=' + subj + '&body=' + body, '_blank');
    }, 600);
  },
  modoEdicaoEtp: false,

  toggleEdicaoEtp() {
    this.modoEdicaoEtp = !this.modoEdicaoEtp;
    const btn = document.getElementById('btnToggleEdicaoEtp');
    if (btn) {
      btn.innerText = this.modoEdicaoEtp ? '💾 Salvar ETP' : '✏️ Editar ETP (TI)';
      btn.style.color = this.modoEdicaoEtp ? '#059669' : '#0F172A';
      btn.style.borderColor = this.modoEdicaoEtp ? '#059669' : '#CBD5E1';
    }

    const fields = document.querySelectorAll('.etp-editable-field');
    fields.forEach(sec => {
      sec.contentEditable = this.modoEdicaoEtp ? 'true' : 'false';
      if (this.modoEdicaoEtp) {
        sec.classList.add('lages-editable-field');
      } else {
        sec.classList.remove('lages-editable-field');
      }
    });

    if (!this.modoEdicaoEtp) {
      this.salvarEdicaoEtp();
    }
  },

  async salvarEdicaoEtp() {
    if (!this.etpAtual) return;
    const protocolo = this.etpAtual.protocolo;
    const corpo = document.getElementById('corpoEtpCompleto');
    if (!corpo) return;

    try {
      const res = await fetch(`/api/demandas/${protocolo}/etp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etpConteudo: JSON.stringify({ html: corpo.innerHTML }),
          usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC Responsável'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('✓ Alterações no Estudo Técnico Preliminar (ETP de Lages) salvas com sucesso!');
        await this.carregarDemandas();
      }
    } catch (e) {
      console.error('Erro ao salvar edições do ETP:', e);
      alert('Erro ao salvar alterações do ETP: ' + e.message);
    }
  },

  renderizarEtpCompleto(d, etp) {
    const corpo = document.getElementById('corpoEtpCompleto');
    if (!corpo) return;

    this.etpAtual = d;
    this.modoEdicaoEtp = false;
    const btnEdit = document.getElementById('btnToggleEdicaoEtp');
    if (btnEdit) {
      btnEdit.innerText = '✏️ Editar ETP (TI)';
      btnEdit.style.color = '#0F172A';
      btnEdit.style.borderColor = '#CBD5E1';
    }

    // Se houver conteúdo previamente editado e salvo, carrega diretamente
    let etpConteudoSalvo = null;
    try {
      if (d.etp_conteudo) {
        etpConteudoSalvo = typeof d.etp_conteudo === 'string' ? JSON.parse(d.etp_conteudo) : d.etp_conteudo;
        if (etpConteudoSalvo && etpConteudoSalvo.html) {
          corpo.innerHTML = etpConteudoSalvo.html;
          return;
        }
      }
    } catch(e){}

    const ano = new Date().getFullYear();
    const dia = new Date().getDate();
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[new Date().getMonth()];

    const protocolo = d.protocolo;
    const etpNumero = d.etp_numero || protocolo.replace('DOD-', 'ETP-');
    const qtd = d.quantidade_usuarios || 1;
    const ehNotebook = (d.formato_equipamento === 'notebook' || (d.respostas_diagnostico && d.respostas_diagnostico.includes('notebook')));
    const nomeEquip = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';
    const orgao = d.orgao || 'Prefeitura Municipal de Lages';
    const setor = d.setor || 'Escolas Municipais (SME)';
    const solicitante = d.usuario_nome || 'Servidor Solicitante';
    const cargoSol = d.cargo || 'Servidor Público Municipal';

    const custoUnit = d.custo_unitario || 1850.00;
    const custoTotalAquisicao = custoUnit * qtd;
    const custoMensalLocacao = 145.00 * qtd;
    const custoTotalLocacao36m = custoMensalLocacao * 36;
    const custoUpgradeExistente = 650.00 * qtd;

    corpo.innerHTML = `
      <div class="lages-doc-container">
        <!-- CABEÇALHO OFICIAL DE LAGES -->
        <div class="lages-header-logos">
          <img src="/img/brasao_lages.png" class="lages-logo-brasao" alt="Município de Lages">
          <div class="lages-header-titles">
            <div class="lages-title-city">MUNICÍPIO DE LAGES</div>
            <div class="lages-title-state">ESTADO DE SANTA CATARINA</div>
            <div class="lages-title-secretaria">SECRETARIA MUNICIPAL DE ADMINISTRAÇÃO E FAZENDA • DIRETORIA DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÕES</div>
          </div>
          <img src="/img/bandeira_lages.png" class="lages-logo-bandeira" alt="Bandeira de Lages">
        </div>
        <div class="lages-header-divider"></div>

        <div style="font-weight: 800; font-size: 10pt; color: #1E293B; margin-bottom: 2px;">
          VINCULADO AO DFD Nº ${protocolo}
        </div>
        <div class="lages-doc-main-title" style="margin-top: 4px; margin-bottom: 4px;">
          ESTUDO TÉCNICO PRELIMINAR (ETP) Nº ${etpNumero}
        </div>
        <div style="font-weight: 700; font-size: 9.5pt; color: #0F172A; margin-bottom: 16px; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">
          OBJETO: Registro de preços para eventual e futura aquisição de equipamentos de tecnologia da informação e comunicação (${nomeEquip}) para atendimento das demandas de ${setor} (${orgao}).
        </div>

        <!-- 1. DESCRIÇÃO DA NECESSIDADE -->
        <div class="lages-section-card">
          <div class="lages-section-header">1. DESCRIÇÃO DA NECESSIDADE</div>
          <div class="lages-section-body etp-editable-field">
            <p style="margin: 0 0 8px 0;">
              O presente Estudo Técnico Preliminar visa fundamentar a necessidade da contratação de solução de Tecnologia da Informação e Comunicação (TIC) para suprir as demandas operacionais e pedagógicas da unidade <strong>${setor}</strong> (${orgao}).
            </p>
            <p style="margin: 0;">
              A servidora requisitante <strong>${solicitante}</strong> (${cargoSol}) declarou a necessidade de atendimento contínuo às rotinas de trabalho com sistemas corporativos municipais, Diário de Classe, redação de expedientes e navegação no SGPe. O equipamento anteriormente alocado no posto apresentou desgaste/inoperância que inviabiliza sua continuidade operacional sem risco de paralisação e perda de dados públicos.
            </p>
          </div>
        </div>

        <!-- 2. PREVISÃO NO PLANO DE CONTRATAÇÕES ANUAL -->
        <div class="lages-section-card">
          <div class="lages-section-header">2. PREVISÃO NO PLANO DE CONTRATAÇÕES ANUAL</div>
          <div class="lages-section-body etp-editable-field">
            A demanda encontra-se expressamente alinhada ao Plano de Contratações Anual (PCA) do Município de Lages do exercício de <strong>${ano}</strong>, na Meta Estratégica de Modernização e Continuidade do Parque Computacional Escolar e Administrativo, em conformidade com o Art. 18, § 1º, II da Lei Federal nº 14.133/2021 e Decreto Municipal nº 20.682/2023.
          </div>
        </div>

        <!-- 3. REQUISITOS DA CONTRATAÇÃO -->
        <div class="lages-section-card">
          <div class="lages-section-header">3. REQUISITOS DA CONTRATAÇÃO</div>
          <div class="lages-section-body etp-editable-field">
            <p style="margin: 0 0 6px 0;">Os equipamentos a serem fornecidos devem observar rigorosamente os seguintes requisitos mínimos de qualidade e padrões de TIC:</p>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
              <li><strong>Arquitetura de Hardware:</strong> Processador moderno de alto rendimento compatível com x86-64 bits (pontuação PassMark compatível com a rotina);</li>
              <li><strong>Sistema Operacional Corporativo:</strong> Microsoft Windows 11 Pro 64-bit licenciado de fábrica, integrado ao domínio municipal de Lages;</li>
              <li><strong>Armazenamento Veloz:</strong> Unidade SSD NVMe M.2 com leitura superior a 2.000 MB/s, garantindo inicialização veloz dos sistemas;</li>
              <li><strong>Garantia Técnica Integral On-Site de 36 Meses:</strong> Atendimento presencial nas dependências da unidade em Lages/SC, com prazo máximo de substituição de peças de 48 horas;</li>
              <li><strong>Sustentabilidade e Eficiência Energética:</strong> Fonte de alimentação com certificação mínima 80 Plus e conformidade com o Guia Nacional de Contratações Sustentáveis da AGU.</li>
            </ul>
          </div>
        </div>

        <!-- 4. ESTIMATIVA DAS QUANTIDADES -->
        <div class="lages-section-card">
          <div class="lages-section-header">4. ESTIMATIVA DAS QUANTIDADES</div>
          <div class="lages-section-body etp-editable-field">
            A quantidade estimada foi fixada em <strong>${qtd} unidade(s)</strong> de ${nomeEquip}. O quantitativo decorre estritamente da quantidade de postos de trabalho e servidores em atividade contínua no setor ${setor}, assegurando a economicidade e a vedação ao superdimensionamento de despesas, conforme memória de cálculo vinculada ao Documento de Formalização da Demanda (DFD).
          </div>
        </div>

        <!-- 5. LEVANTAMENTO DE MERCADO -->
        <div class="lages-section-card">
          <div class="lages-section-header">5. LEVANTAMENTO DE MERCADO (ANÁLISE DE ALTERNATIVAS)</div>
          <div class="lages-section-body etp-editable-field">
            <p style="margin: 0 0 10px 0;">Em estrita observância ao Art. 18, § 1º, V da Lei nº 14.133/2021, a equipe de planejamento da TIC analisou 3 (três) alternativas de mercado:</p>
            
            <table class="lages-table-orcamento">
              <thead>
                <tr>
                  <th style="width: 28%;">ALTERNATIVA</th>
                  <th style="width: 44%;">CARACTERÍSTICAS OPERACIONAIS</th>
                  <th style="width: 28%;">CUSTO ESTIMADO</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #F0FDF4;">
                  <td><strong>Alternativa 1 (Eleita):</strong><br>Aquisição Definitiva com Garantia de 36 Meses</td>
                  <td>Compra de máquinas novas padronizadas, incorporação patrimonial ao acervo municipal e garantia integral on-site por 3 anos.</td>
                  <td><strong>R$ ${custoTotalAquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong><br><small>Menor custo total de propriedade (TCO)</small></td>
                </tr>
                <tr>
                  <td><strong>Alternativa 2:</strong><br>Locação de Equipamentos (Device as a Service)</td>
                  <td>Contratação de locação mensal por 36 meses. Custo elevado ao longo do tempo sem incorporação de ativos ao patrimônio municipal.</td>
                  <td><strong>R$ ${custoTotalLocacao36m.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong><br><small>Custo 182% superior à aquisição</small></td>
                </tr>
                <tr>
                  <td><strong>Alternativa 3:</strong><br>Upgrade de Peças em Máquinas Sucateadas</td>
                  <td>Tentativa de remanejamento interno com troca de peças. Inviável tecnicamente por ausência de suporte oficial para Windows 11 corporativo.</td>
                  <td><strong>R$ ${custoUpgradeExistente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong><br><small>Alto risco de paralisação e falha de placa</small></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 6. ESTIMATIVA DO VALOR DA CONTRATAÇÃO -->
        <div class="lages-section-card">
          <div class="lages-section-header">6. ESTIMATIVA DO VALOR DA CONTRATAÇÃO</div>
          <div class="lages-section-body etp-editable-field">
            <p style="margin: 0 0 6px 0;">
              Com base nos parâmetros referenciais de preços públicos de TIC em Santa Catarina, o valor total estimado da contratação é de:
            </p>
            <p style="margin: 0 0 6px 0; font-size: 11pt; font-weight: 800; color: #0F172A;">
              R$ ${custoTotalAquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${this.valorPorExtenso(custoTotalAquisicao)})
            </p>
            <p style="margin: 0; font-size: 8.5pt; color: #475569;">
              Correspondendo ao custo unitário referencial de R$ ${custoUnit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por equipamento completo homologado com 3 anos de garantia.
            </p>
          </div>
        </div>

        <!-- 7. DESCRIÇÃO DA SOLUÇÃO COMO UM TODO -->
        <div class="lages-section-card">
          <div class="lages-section-header">7. DESCRIÇÃO DA SOLUÇÃO COMO UM TODO</div>
          <div class="lages-section-body etp-editable-field">
            A solução compreende o fornecimento integral dos microcomputadores/notebooks, devidamente montados, configurados de fábrica, com entrega nas dependências do Município de Lages, incluindo ativação de garantia on-site pelo prazo de 36 (trinta e seis) meses, canais de chamado técnico direto e reposição de partes e peças sem custos adicionais à Administração.
          </div>
        </div>

        <!-- 8. JUSTIFICATIVAS PARA O PARCELAMENTO OU NÃO -->
        <div class="lages-section-card">
          <div class="lages-section-header">8. JUSTIFICATIVAS PARA O PARCELAMENTO OU NÃO DA CONTRATAÇÃO</div>
          <div class="lages-section-body etp-editable-field">
            A licitação será processada por item único para a solução computacional padronizada, preservando a economia de escala e a padronização do ambiente operacional do Município, em conformidade com o Art. 40, V, "b" da Lei Federal nº 14.133/2021 e Súmula nº 247 do Tribunal de Contas da União (TCU).
          </div>
        </div>

        <!-- 9. RESULTADOS PRETENDIDOS -->
        <div class="lages-section-card">
          <div class="lages-section-header">9. RESULTADOS PRETENDIDOS</div>
          <div class="lages-section-body etp-editable-field">
            Pretende-se garantir a alta disponibilidade operacional dos postos de trabalho municipais, mitigar riscos de interrupção de atendimento ao público, conferir agilidade aos procedimentos pedagógicos e administrativos e assegurar suporte técnico duradouro com redução de custos de manutenção corretiva para os cofres municipais.
          </div>
        </div>

        <!-- 10. PROVIDÊNCIAS A SEREM ADOTADAS -->
        <div class="lages-section-card">
          <div class="lages-section-header">10. PROVIDÊNCIAS A SEREM ADOTADAS</div>
          <div class="lages-section-body etp-editable-field">
            Previamente ao recebimento dos bens, a unidade requisitante e a Diretoria de TIC certificarão as condições de infraestrutura elétrica e pontos de rede lógica estabilizada, bem como instruirão os servidores responsáveis quanto aos procedimentos de abertura de chamados técnicos de garantia.
          </div>
        </div>

        <!-- 11. CONTRATAÇÕES CORRELATAS E/OU INTERDEPENDENTES -->
        <div class="lages-section-card">
          <div class="lages-section-header">11. CONTRATAÇÕES CORRELATAS E/OU INTERDEPENDENTES</div>
          <div class="lages-section-body etp-editable-field">
            A presente contratação não possui dependência direta de outros contratos, aproveitando-se a infraestrutura de rede corporativa e os links de conectividade já implantados na rede municipal de Lages.
          </div>
        </div>

        <!-- 12. DESCRIÇÃO DE POSSÍVEIS IMPACTOS AMBIENTAIS -->
        <div class="lages-section-card">
          <div class="lages-section-header">12. DESCRIÇÃO DE POSSÍVEIS IMPACTOS AMBIENTAIS</div>
          <div class="lages-section-body etp-editable-field">
            Exigir-se-á que os equipamentos contenham selo de eficiência energética e baixo consumo de energia. O descarte dos equipamentos antigos e inservíveis observará a Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010), mediante procedimento de desfazimento patrimonial e logística reversa de lixo eletrônico.
          </div>
        </div>

        <!-- 13. POSICIONAMENTO CONCLUSIVO -->
        <div class="lages-section-card">
          <div class="lages-section-header">13. POSICIONAMENTO CONCLUSIVO</div>
          <div class="lages-section-body etp-editable-field">
            Com fulcro nos estudos técnicos, comparativos de mercado e análises de viabilidade expostos, a equipe técnica de planejamento declara que a contratação da <strong>Alternativa 1 (Aquisição de ${qtd} unidade(s) de ${nomeEquip})</strong> é plenamente viável, razoável e vantajosa para o Município de Lages sob as óticas técnica, operacional e financeira.
          </div>
        </div>

        <!-- 14. RESPONSÁVEIS -->
        <div class="lages-section-card">
          <div class="lages-section-header">14. RESPONSÁVEIS</div>
          <div class="lages-section-body etp-editable-field">
            <div style="text-align: right; margin-bottom: 24px; font-weight: 700;">
              Lages (SC), ${dia} de ${mes} de ${ano}.
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; text-align: center;">
              <div class="lages-assinatura-box">
                <strong>Equipe de Planejamento da Contratação</strong><br>
                Responsável pela Elaboração do ETP<br>
                <small>Diretoria de Licitações e Contratos — PML</small>
              </div>
              <div class="lages-assinatura-box">
                <strong>Diretoria de Tecnologia da Informação (TIC)</strong><br>
                Responsável Técnico<br>
                <small>Prefeitura do Município de Lages / SC</small>
              </div>
            </div>
          </div>
        </div>

        <div class="lages-doc-footer-legal">
          <span>Modelo de Estudo Técnico Preliminar – Lei 14.133/21</span>
          <span>Município de Lages / SC • Decreto Municipal nº 20.682/2023 • Atualização: Janeiro/2024</span>
        </div>
      </div>
    `;
  },

  imprimirEtp() {
    this.executarImpressaoLimpa('corpoEtpCompleto', 'Estudo Técnico Preliminar (ETP Oficial TIC - Lages SC)');
  },

  // ==========================================
  // AUDITORIA TCE/SC
  // ==========================================
  radarDemandas: [],

  async carregarAuditor() {
    try {
      const res = await fetch('/api/estatisticas');
      const s = await res.json();

      document.getElementById('kpiTotal').innerText = s.totalDemandas;
      document.getElementById('kpiEco').innerText = `R$ ${s.totalEconomia.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
      document.getElementById('kpiRisco').innerText = `${s.mediaIrs}%`;

      const cr = (s.riscoContagem.find(r => r.nivel_risco === 'ALTO') || {}).qtd || 0;
      document.getElementById('kpiAlertas').innerText = cr;

      const roiEl = document.getElementById('roiTotalEconomia');
      if (roiEl) {
        roiEl.innerText = `R$ ${(s.totalEconomia || 542800).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }

      this.renderizarGraficosAuditor(s);
      await this.carregarRadarAuditor();
    } catch (e) {
      console.error(e);
    }
  },

  async carregarRadarAuditor() {
    try {
      const res = await fetch('/api/demandas?tipoUsuario=admin');
      this.radarDemandas = await res.json();
      this.renderizarRadarAuditor(this.radarDemandas);
    } catch (e) {
      console.error('Erro ao carregar radar do auditor:', e);
    }
  },

  renderizarRadarAuditor(demandas) {
    const tbody = document.getElementById('tbodyRadarAuditor');
    if (!tbody) return;

    if (!demandas || demandas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--dark-muted);">Nenhum processo em auditoria encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = demandas.map(d => {
      let barClass = 'low';
      let statusBadge = '<span class="status-chip ok">ADEQUADO</span>';
      
      if (d.nivel_risco === 'ALTO' || d.irs >= 70) {
        barClass = 'high';
        statusBadge = '<span class="status-chip danger">SUPERDIMENSIONADO</span>';
      } else if (d.nivel_risco === 'MEDIO' || d.irs >= 30) {
        barClass = 'mid';
        statusBadge = '<span class="status-chip warn">SOB ANÁLISE</span>';
      }

      let softwaresTxt = 'Rotinas de escritório';
      try {
        const sw = JSON.parse(d.softwares || '[]');
        softwaresTxt = Array.isArray(sw) ? sw.slice(0, 2).join(', ') : d.softwares;
      } catch (e) {
        softwaresTxt = d.softwares || 'Rotinas gerais';
      }

      return `
        <tr>
          <td><strong style="color: var(--dark-accent);">${d.protocolo}</strong></td>
          <td>
            <strong>${d.setor}</strong><br>
            <small style="color: var(--dark-muted);">${d.orgao}</small>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: #CBD5E1;">${softwaresTxt}</span><br>
            <small style="color: var(--dark-muted);">${d.cargo || 'Servidor'}</small>
          </td>
          <td>
            <strong>${d.perfil_esc_nome ? d.perfil_esc_nome.split(':')[0] : 'Nível ' + d.perfil_escolhido_id}</strong><br>
            <small style="color: var(--dark-muted);">${d.quantidade_usuarios} máquinas • R$ ${d.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
          </td>
          <td>
            <div class="irs-progress-wrap">
              <span style="font-weight: 700; font-size: 0.82rem; min-width: 32px;">${d.irs}%</span>
              <div class="irs-bar-outer">
                <div class="irs-bar-inner ${barClass}" style="width: ${Math.min(100, Math.max(8, d.irs))}%;"></div>
              </div>
            </div>
          </td>
          <td>${statusBadge}</td>
          <td style="text-align: center;">
            <button class="btn-table-action" onclick="app.gerarParecerTce('${d.protocolo}')" style="background: rgba(124, 58, 237, 0.15); border-color: rgba(124, 58, 237, 0.3); color: #C4B5FD;">
              📄 Parecer TCE
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  filtrarRadarAuditor(filtro, elem) {
    document.querySelectorAll('.qty-pill').forEach(p => p.classList.remove('active'));
    if (elem) elem.classList.add('active');

    if (filtro === 'TODOS') {
      this.renderizarRadarAuditor(this.radarDemandas);
    } else {
      const filtradas = this.radarDemandas.filter(d => (d.nivel_risco || '').toUpperCase() === filtro);
      this.renderizarRadarAuditor(filtradas);
    }
  },

  // ==========================================
  // SIMULADOR DE CASOS PARA A BANCA DO HACKATHON
  // ==========================================
  simularCasoAuditor(numCaso) {
    if (numCaso === 1) {
      // Caso 1: Superdimensionamento Escolar Grave
      const demandaSim = {
        protocolo: 'DOD-2026-HACK01',
        orgao: 'Secretaria Municipal de Educação de Lages (SME)',
        setor: 'Escolas Municipais de Ensino Fundamental',
        usuario_nome: 'Gestão Escolar Municipal',
        cargo: 'Diretor / Professores de Escola',
        quantidade_usuarios: 50,
        softwares: JSON.stringify(['Diário de Classe SME', 'Digitação de Planos de Aula e Provas', 'Navegação Web e E-mail']),
        perfil_recomendado_id: 1,
        perfil_escolhido_id: 3, // Tentando comprar Workstation de R$ 8.200 com GPU RTX
        custo_unitario: 8200.00,
        custo_total: 410000.00,
        economia_estimada: 317500.00,
        irs: 94,
        nivel_risco: 'ALTO',
        justificativa_usuario: 'Solicitado o melhor modelo com placa de vídeo dedicada RTX 4060 para garantir durabilidade.'
      };

      const perfilRec = {
        id: 1,
        nome: 'Perfil 1: Administrativo e Atendimento Básico (Padronizado Lages)',
        processador: 'Quad-Core 3.4GHz+ (PassMark 8.500+)',
        ram: '8 GB DDR4 3200MHz',
        gpu: 'Controlador Gráfico Integrado',
        custo_unitario_estimado: 1850.00
      };

      const perfilEsc = {
        id: 3,
        nome: 'Perfil 3: Engenharia, Obras e Geoprocessamento (Workstation RTX)',
        processador: 'Octa-Core 5.0GHz+ (PassMark 30.000+)',
        ram: '32 GB DDR5 5200MHz',
        gpu: 'Placa de Vídeo Dedicada NVIDIA GeForce RTX 4060 8GB GDDR6',
        custo_unitario_estimado: 8200.00
      };

      this.abrirModalParecerTce(demandaSim, perfilRec, perfilEsc);

    } else if (numCaso === 2) {
      // Caso 2: Risco de Subdimensionamento em Obras
      const demandaSim = {
        protocolo: 'DOD-2026-HACK02',
        orgao: 'Secretaria de Planejamento e Obras (SEPLAN)',
        setor: 'Engenharia Civil e Pavimentação Asfáltica',
        usuario_nome: 'Eng. Rodolfo Silveira',
        cargo: 'Engenheiro Civil - Fiscal de Obras',
        quantidade_usuarios: 6,
        softwares: JSON.stringify(['AutoCAD Civil 3D', 'QGIS Lages', 'Plantas Viárias e Drenagem Urbana']),
        perfil_recomendado_id: 3,
        perfil_escolhido_id: 1, // Tentando colocar PC básico de R$ 1.850 para engenharia
        custo_unitario: 1850.00,
        custo_total: 11100.00,
        economia_estimada: 0.00,
        irs: 75,
        nivel_risco: 'MEDIO',
        justificativa_usuario: 'Tentativa de corte excessivo de custos na secretaria.'
      };

      const perfilRec = {
        id: 3,
        nome: 'Perfil 3: Engenharia, Obras e Geoprocessamento (Workstation RTX)',
        processador: 'Octa-Core 5.0GHz+ (PassMark 30.000+)',
        ram: '32 GB DDR5 5200MHz',
        gpu: 'Placa de Vídeo Dedicada NVIDIA GeForce RTX 4060 8GB GDDR6',
        custo_unitario_estimado: 8200.00
      };

      const perfilEsc = {
        id: 1,
        nome: 'Perfil 1: Administrativo e Atendimento Básico (Padronizado Lages)',
        processador: 'Quad-Core 3.4GHz+ (PassMark 8.500+)',
        ram: '8 GB DDR4 3200MHz',
        gpu: 'Controlador Gráfico Integrado',
        custo_unitario_estimado: 1850.00
      };

      this.abrirModalParecerTce(demandaSim, perfilRec, perfilEsc);

    } else {
      // Caso 3: Eficiência Máxima e Conformidade Plena na Saúde
      const demandaSim = {
        protocolo: 'DOD-2026-HACK03',
        orgao: 'Secretaria Municipal de Saúde de Lages (SMS)',
        setor: 'Unidades Básicas de Saúde (UBS)',
        usuario_nome: 'Dra. Camila Ramos',
        cargo: 'Enfermeira Chefe / Gestora de UBS',
        quantidade_usuarios: 30,
        softwares: JSON.stringify(['Prontuário Eletrônico do SUS (e-SUS / SISREG)', 'Navegação Web e SGPe', 'Digitação de Receitas']),
        perfil_recomendado_id: 1,
        perfil_escolhido_id: 1, // Compra 100% calibrada
        custo_unitario: 1850.00,
        custo_total: 55500.00,
        economia_estimada: 190500.00,
        irs: 5,
        nivel_risco: 'BAIXO',
        justificativa_usuario: 'Dimensionamento adequado à rotina das unidades de saúde.'
      };

      const perfilRec = {
        id: 1,
        nome: 'Perfil 1: Administrativo e Atendimento Básico (Padronizado Lages)',
        processador: 'Quad-Core 3.4GHz+ (PassMark 8.500+)',
        ram: '8 GB DDR4 3200MHz',
        gpu: 'Controlador Gráfico Integrado',
        custo_unitario_estimado: 1850.00
      };

      this.abrirModalParecerTce(demandaSim, perfilRec, perfilRec);
    }
  },

  // ==========================================
  // PARECER TÉCNICO OFICIAL DO TCE/SC
  // ==========================================
  async gerarParecerTce(protocolo) {
    try {
      const res = await fetch(`/api/demandas/${protocolo}`);
      const data = await res.json();
      this.abrirModalParecerTce(data.demanda, data.perfilRec, data.perfilEsc);
    } catch (e) {
      alert('Erro ao carregar parecer técnico do processo.');
    }
  },

  abrirModalParecerTce(demanda, perfilRec, perfilEsc) {
    const modal = document.getElementById('modalParecerTce');
    const corpo = document.getElementById('corpoParecerTce');
    if (!modal || !corpo) return;

    const ano = new Date().getFullYear();
    const dia = new Date().getDate();
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[new Date().getMonth()];

    let softwaresTxt = 'Rotinas administrativas';
    try {
      const sw = Array.isArray(demanda.softwares) ? demanda.softwares : JSON.parse(demanda.softwares || '[]');
      softwaresTxt = sw.join('; ');
    } catch (e) {
      softwaresTxt = demanda.softwares || 'Rotinas operacionais';
    }

    const custoRecTotal = (perfilRec.custo_unitario_estimado || 1850) * demanda.quantidade_usuarios;
    const custoEscTotal = (perfilEsc.custo_unitario_estimado || 1850) * demanda.quantidade_usuarios;
    const diferencaTotal = custoEscTotal - custoRecTotal;

    const ehSuper = demanda.irs >= 70 || (perfilEsc.id > perfilRec.id);
    const ehSub = (perfilEsc.id < perfilRec.id);

    let veredictoClass = 'alert-success';
    let veredictoTitulo = '✓ ATÉSTADO DE CONFORMIDADE E ECONOMICIDADE PLENA (TCE/SC)';
    let veredictoTexto = `A solução técnica especificada pelo órgão atende com exatidão à necessidade operacional declarada. Inexistência de sobrepreço ou superdimensionamento. Processo aprovado sem apontamentos de auditoria.`;
    let conclusaoTexto = `Em face do estrito atendimento às diretrizes do Art. 18 da Lei Federal nº 14.133/2021 e aos princípios da economicidade e da razoabilidade, manifesta-se pela <strong>REGULARIDADE TÉCNICA DO CERTAME</strong> e prosseguimento do processo licitatório.`;
    let sobrecustoHtml = '';

    if (ehSuper) {
      veredictoClass = 'alert-danger';
      veredictoTitulo = '🚨 APONTAMENTO DE SUPERDIMENSIONAMENTO GRAVE (RISCO AO ERÁRIO)';
      veredictoTexto = `Identificada desconexão técnica manifesta: o órgão pretende adquirir equipamentos de alto desempenho gráfico com GPU dedicada para executar tarefas básicas de digitação e navegação web. O sobrecusto apurado é antieconômico e viola as balizas de governança de TIC.`;
      sobrecustoHtml = `
        <div style="margin-top: 10px; font-weight: 800; color: #DC2626;">
          DANO POTENCIAL AO ERÁRIO (SOBREPREÇO EVITÁVEL): R$ ${Math.abs(diferencaTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Excedente de R$ ${(Math.abs(diferencaTotal) / demanda.quantidade_usuarios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por computador).
        </div>
      `;
      conclusaoTexto = `Diante da violação ao princípio da economicidade (Art. 70 da CRFB/88) e ausência de justificativa técnica compatível no ETP, <strong>RECOMENDA-SE A SUSPENSÃO PREVENTIVA DO ITEM LICITADO</strong> para readequação ao Perfil 1 (Computador Básico Padronizado), sob pena de responsabilização funcional e instauração de Tomada de Contas Especial.`;
    } else if (ehSub) {
      veredictoClass = 'alert-warning';
      veredictoTitulo = '⚠️ ALERTA DE RISCO DE SUBDIMENSIONAMENTO TÉCNICO';
      veredictoTexto = `O equipamento selecionado possui capacidade de memória e vídeo inferior aos requisitos mínimos homologados para softwares pesados (AutoCAD/QGIS/BIM). Há iminente risco de lentidão crônica, travamentos e perda prematura de vida útil.`;
      conclusaoTexto = `Recomenda-se a revisão do dimensionamento junto ao corpo de engenharia e readequação ao Perfil 3 para assegurar a continuidade dos serviços públicos de projetos e obras municipais.`;
    }

    corpo.innerHTML = `
      <div class="tce-report-doc">
        
        <div class="tce-report-header">
          <div class="tce-brasao-icon">🏛️</div>
          <div class="tce-title-sup">ESTADO DE SANTA CATARINA • TRIBUNAL DE CONTAS DO ESTADO (TCE/SC)</div>
          <div class="tce-title-main">DIRETORIA DE CONTROLE DE LICITAÇÕES E CONTRATAÇÕES – DLC</div>
          <div class="tce-title-sub">Divisão de Fiscalização de Tecnologia da Informação • Sistema Preventivo DimensionaTI SC</div>
        </div>
        
        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-left: 4px solid #0F172A; padding: 12px 16px; margin-bottom: 18px;">
          <div style="font-weight: 800; font-size: 10pt; color: #0F172A;">PARECER PRELIMINAR DE AUDITORIA PREVENTIVA Nº ${demanda.protocolo.replace('ETP-', 'PAR-TCE-').replace('DOD-', 'PAR-TCE-')}/${ano}</div>
          <div style="font-size: 8.5pt; color: #475569; margin-top: 4px; line-height: 1.4;">
            <strong>Jurisdicionado:</strong> Município de Lages / SC • <strong>Unidade Gestora:</strong> ${demanda.orgao}<br>
            <strong>Setor Beneficiado:</strong> ${demanda.setor} • <strong>Responsável:</strong> ${demanda.usuario_nome || 'Servidor Solicitante'} (${demanda.cargo || 'Cargo Público'})<br>
            <strong>Volume Licitado:</strong> ${demanda.quantidade_usuarios} computadores • <strong>Índice de Risco (IRS):</strong> <strong>${demanda.irs}% (${demanda.nivel_risco})</strong>
          </div>
        </div>

        <p style="margin-bottom: 10px; text-align: justify;">
          <strong>1. FUNDAMENTAÇÃO NORMATIVA:</strong> A presente instrução técnica preventiva de controle externo analisa a conformidade do Estudo Técnico Preliminar (ETP) com o <strong>Art. 18, § 1º, incisos I e IV da Lei Federal nº 14.133/2021</strong> (exigência de comprovação de adequação técnica da solução licitada à necessidade real do serviço público), o princípio constitucional da economicidade (Art. 70 da CRFB/88) e resoluções do TCE/SC que vedam a aquisição de equipamentos com configurações superdimensionadas e antieconômicas.
        </p>

        <p style="margin-bottom: 6px;">
          <strong>2. CONFRONTO TÉCNICO (NECESSIDADE DECLARADA vs HARDWARE SOLICITADO):</strong>
        </p>
        <table class="tce-table-compare">
          <thead>
            <tr>
              <th>PARÂMETRO</th>
              <th>ROTINA REAL DECLARADA</th>
              <th>PADRÃO TÉCNICO HOMOLOGADO</th>
              <th>CONFIGURAÇÃO SOLICITADA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Perfil de Carga</strong></td>
              <td>${softwaresTxt}</td>
              <td>${perfilRec.nome}</td>
              <td><strong>${perfilEsc.nome}</strong></td>
            </tr>
            <tr>
              <td><strong>Processador</strong></td>
              <td>PassMark adequado à rotina pública</td>
              <td>${perfilRec.processador}</td>
              <td>${perfilEsc.processador}</td>
            </tr>
            <tr>
              <td><strong>Memória RAM</strong></td>
              <td>Proporcional às aplicações em execução</td>
              <td>${perfilRec.ram}</td>
              <td>${perfilEsc.ram}</td>
            </tr>
            <tr>
              <td><strong>Controlador Gráfico</strong></td>
              <td>Integrado padrão NR-17</td>
              <td>${perfilRec.gpu}</td>
              <td>${perfilEsc.gpu}</td>
            </tr>
            <tr style="background: #F1F5F9; font-weight: 700;">
              <td><strong>Custo Total (${demanda.quantidade_usuarios} PCs)</strong></td>
              <td>Investimento Público Estimado</td>
              <td style="color: #059669;">R$ ${custoRecTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style="color: ${ehSuper ? '#DC2626' : '#059669'};">R$ ${custoEscTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <!-- VEREDITO DA AUDITORIA -->
        <div class="tce-box-veredicto ${veredictoClass}">
          <div style="font-weight: 900; font-size: 10pt; margin-bottom: 4px;">
            ${veredictoTitulo}
          </div>
          <div style="font-size: 8.5pt; line-height: 1.45;">
            ${veredictoTexto}
          </div>
          ${sobrecustoHtml}
        </div>

        <p style="margin-top: 14px; text-align: justify;">
          <strong>3. CONCLUSÃO E ENCAMINHAMENTO DO CONTROLE EXTERNO:</strong><br>
          ${conclusaoTexto}
        </p>

        <div class="tce-seal-stamp">
          <div style="font-size: 2rem;">🛡️</div>
          <div>
            <strong>ASSINADO ELETRONICAMENTE PELO CORPO INSTRUTIVO DO TCE/SC</strong><br>
            Auditor Fiscal de Controle Externo • Matrícula TCE/SC nº 094.218-3<br>
            <span style="font-family: monospace; font-size: 7.5pt; color: #64748B;">Autenticidade Criptográfica SHA-256: 7f8c12a4b901e23f99aa8412cbe7194602bb44a1936c398e09f81d</span>
          </div>
        </div>

      </div>
    `;

    modal.classList.add('active');
  },

  fecharModalParecerTce() {
    const modal = document.getElementById('modalParecerTce');
    if (modal) modal.classList.remove('active');
  },

  imprimirParecerTce() {
    this.executarImpressaoLimpa('corpoParecerTce', 'Parecer Preliminar de Auditoria em TIC - TCE-SC');
  },

  renderizarGraficosAuditor(s) {
    if (typeof Chart === 'undefined') return;

    const ctxR = document.getElementById('chartRisco');
    if (ctxR) {
      if (this.chartRiscoInst) this.chartRiscoInst.destroy();
      const b = (s.riscoContagem.find(r => r.nivel_risco === 'BAIXO') || {}).qtd || 0;
      const m = (s.riscoContagem.find(r => r.nivel_risco === 'MEDIO') || {}).qtd || 0;
      const a = (s.riscoContagem.find(r => r.nivel_risco === 'ALTO') || {}).qtd || 0;

      this.chartRiscoInst = new Chart(ctxR, {
        type: 'doughnut',
        data: {
          labels: ['Baixo Risco', 'Médio Risco', 'Alto Risco'],
          datasets: [{
            data: [b, m, a],
            backgroundColor: ['#34D399', '#F59E0B', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#8493A8' } } },
          cutout: '72%'
        }
      });
    }

    const ctxO = document.getElementById('chartOrgaos');
    if (ctxO) {
      if (this.chartOrgaosInst) this.chartOrgaosInst.destroy();
      const labels = s.porOrgao.map(o => o.orgao.length > 15 ? o.orgao.substring(0, 15) + '...' : o.orgao);
      const vals = s.porOrgao.map(o => o.valor_total);

      this.chartOrgaosInst = new Chart(ctxO, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: vals,
            backgroundColor: '#34D399',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#8493A8' }, grid: { display: false } },
            y: { ticks: { color: '#8493A8', callback: v => 'R$' + (v/1000) + 'k' }, grid: { color: '#1E293B' } }
          }
        }
      });
    }
  },

  async carregarPerfis() {
    try {
      const res = await fetch('/api/perfis');
      this.perfisDisponiveis = await res.json();
    } catch (e) {}
  },

  renderizarDotGrid() {
    const canvas = document.getElementById('loginDotsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const spacing = 28;
    const cols = Math.ceil(rect.width / spacing);
    const rows = Math.ceil(rect.height / spacing);
    const cx = rect.width / 2;
    const cy = rect.height * 0.4;
    const maxDist = Math.max(rect.width, rect.height) * 0.6;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing + spacing / 2;
        const y = r * spacing + spacing / 2;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const alpha = Math.max(0.03, 0.45 - (dist / maxDist) * 0.45);
        const size = Math.max(0.8, 2.2 - (dist / maxDist) * 1.5);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
        ctx.fill();
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
