// app.js - Lógica Dark Minimalista Unificada (DimensionaTI SC - Lages)
const app = {
  usuarioLogado: null,
  passoAtual: 1,
  totalPassos: 3,
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
    protocolo: 'REQ-2026-0000',
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
  // LISTAGEM DE LICITAÇÕES (FILTRADA POR USUÁRIO)
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
      this.filtrarTabela();
    } catch (e) {
      console.error(e);
    }
  },

  protocoloParaCancelar: null,

  setAbaStatus(aba) {
    this.abaStatusAtual = aba;
    document.querySelectorAll('.status-tab-btn').forEach(btn => btn.classList.remove('active'));

    if (aba === 'transmitidas') {
      document.getElementById('tabStatusTransmitidas')?.classList.add('active');
    } else if (aba === 'canceladas') {
      document.getElementById('tabStatusCanceladas')?.classList.add('active');
    } else {
      document.getElementById('tabStatusTodas')?.classList.add('active');
    }

    this.filtrarTabela();
  },

  filtrarTabela() {
    const term = (document.getElementById('inputBusca')?.value || '').toLowerCase().trim();
    const todas = this.demandasCarregadas || [];

    const isCancelado = (status) => {
      const s = String(status || '').toUpperCase().trim();
      return s === 'CANCELADO' || s === 'CANCELADA';
    };

    // Atualiza contadores das abas
    const qtdTransmitidas = todas.filter(d => !isCancelado(d.status)).length;
    const qtdCanceladas = todas.filter(d => isCancelado(d.status)).length;
    const qtdTodas = todas.length;

    const bTrans = document.getElementById('badgeQtdTransmitidas');
    const bCanc = document.getElementById('badgeQtdCanceladas');
    const bTodas = document.getElementById('badgeQtdTodas');

    if (bTrans) bTrans.innerText = qtdTransmitidas;
    if (bCanc) bCanc.innerText = qtdCanceladas;
    if (bTodas) bTodas.innerText = qtdTodas;

    // Filtra pelo termo de busca
    let filtradas = todas.filter(d => 
      !term ||
      (d.protocolo || '').toLowerCase().includes(term) ||
      (d.setor || '').toLowerCase().includes(term) ||
      (d.orgao || '').toLowerCase().includes(term) ||
      (d.usuario_nome || '').toLowerCase().includes(term)
    );

    // Filtra pela aba de status
    if (this.abaStatusAtual === 'transmitidas') {
      filtradas = filtradas.filter(d => !isCancelado(d.status));
    } else if (this.abaStatusAtual === 'canceladas') {
      filtradas = filtradas.filter(d => isCancelado(d.status));
    }

    this.renderizarTabela(filtradas);
  },

  renderizarTabela(demandas) {
    const tbody = document.getElementById('tbodyLicitacoes');
    if (!tbody) return;

    const footer = document.getElementById('tableCardFooter');
    const footerText = document.getElementById('footerCountText');

    if (!demandas || demandas.length === 0) {
      if (footer) footer.style.display = 'none';

      let icon = '📋';
      let title = 'Nenhuma requisição encontrada';
      let msg = 'Não há registros com os filtros atuais. Clique em <strong>+ Nova Requisição</strong> para emitir um pedido.';

      if (this.abaStatusAtual === 'transmitidas') {
        icon = '🚀';
        title = 'Nenhuma requisição transmitida ativa';
        msg = 'Todas as solicitações ativas foram concluídas ou canceladas. Clique em <strong>+ Nova Requisição</strong> para iniciar um processo.';
      } else if (this.abaStatusAtual === 'canceladas') {
        icon = '🚫';
        title = 'Nenhuma requisição cancelada';
        msg = 'Todas as suas solicitações continuam ativas e em atendimento regular pela Diretoria de TIC.';
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
      const statusUpper = String(d.status || '').toUpperCase().trim();
      const ehCancelado = statusUpper === 'CANCELADO' || statusUpper === 'CANCELADA';

      let stClass = 'status-homologado';
      let stText = 'Homologado TI';

      if (ehCancelado) {
        stClass = 'status-cancelado';
        stText = 'Cancelado';
      } else if (statusUpper.includes('ANÁLISE') || statusUpper.includes('ANALISE') || d.nivel_risco === 'MEDIO') {
        stClass = 'status-analise';
        stText = 'Em Análise TI';
      } else if (statusUpper.includes('BLOQUEADO') || statusUpper.includes('REVIS') || d.nivel_risco === 'ALTO') {
        stClass = 'status-revisao';
        stText = 'Revisão Exigida';
      } else {
        stClass = 'status-homologado';
        stText = 'Homologado TI';
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

      // Abre para cima apenas quando houver 3 ou mais registros e for a última linha
      const isDropUp = totalRows >= 3 && index === totalRows - 1;

      return `
        <tr class="table-row-item ${ehCancelado ? 'row-canceled' : ''}">
          <td class="col-protocolo">
            <span class="badge-protocolo">${d.protocolo}</span>
          </td>
          <td class="col-orgao">
            <div class="text-primary-strong">${d.setor || 'Escolas Municipais (SME)'}</div>
            <div class="text-secondary-muted">${d.orgao || 'Prefeitura de Lages - SME'}</div>
          </td>
          <td class="col-solicitante">
            <div class="text-primary-strong">${d.usuario_nome || 'Servidor Solicitante'}</div>
            <div class="text-secondary-muted">${d.cargo || 'Diretora de Escola'}</div>
          </td>
          <td class="col-qtd" style="text-align: center;">
            <span class="qty-pill-badge">${d.quantidade_usuarios}</span>
          </td>
          <td class="col-equipamento">
            <div class="text-primary-strong">${nomeEquip}</div>
            <div class="text-secondary-muted">${descEquip}</div>
          </td>
          <td class="col-status" style="text-align: center;">
            <span class="badge-status-chip ${stClass}">
              <span class="status-dot"></span>
              <span class="status-label">${stText}</span>
            </span>
            ${ehCancelado && d.motivo_cancelamento ? `
              <div class="canceled-reason-preview" title="${d.motivo_cancelamento}">
                ${d.motivo_cancelamento}
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
                <button type="button" class="acoes-menu-item" onclick="app.abrirMinuta('${d.protocolo}')">
                  <span class="item-icon">📄</span>
                  <div class="item-label">
                    <strong>Visualizar Ficha Técnica</strong>
                    <small>DOD oficial para impressão A4</small>
                  </div>
                </button>
                <div class="menu-divider"></div>
                ${!ehCancelado ? `
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
                      <strong>Motivo do Cancelamento</strong>
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
    this.demanda.protocolo = `REQ-2026-${num}`;

    // Sincroniza com dados cadastrados do usuário logado
    if (this.usuarioLogado) {
      this.demanda.usuarioId = this.usuarioLogado.id;
      this.demanda.usuarioNome = this.usuarioLogado.nome;
      this.demanda.usuarioMatricula = this.usuarioLogado.matricula;
      this.demanda.setorNome = this.usuarioLogado.setor || 'Escolas Municipais (SME)';
      this.demanda.orgao = this.usuarioLogado.orgao || 'Prefeitura de Lages - SME';
      this.demanda.cargo = this.usuarioLogado.cargo || 'Diretora de Escola Municipal';
    }

    this.demanda.formatoEquipamento = 'notebook';
    this.demanda.quantidade = 1;
    this.demanda.opcaoMonitor = '1x';
    this.demanda.incluiPerifericos = true;

    // Atualiza identificação visual da solicitante
    const lblLocal = document.getElementById('labelLocalSolicitante');
    if (lblLocal) {
      lblLocal.innerText = `${this.demanda.usuarioNome} — ${this.demanda.setorNome}`;
    }

    this.setFormatoEquipamento('notebook');
    this.setQtd(1);
    this.setPerfilNivel(1);

    this.navegar('wizard');
    this.irParaPasso(1);
  },

  irParaPasso(passo) {
    this.passoAtual = passo;

    for (let i = 1; i <= this.totalPassos; i++) {
      const node = document.getElementById(`step-node-${i}`);
      const pane = document.getElementById(`pane-passo-${i}`);

      node?.classList.toggle('active', i === passo);
      pane?.classList.toggle('active', i === passo);
    }

    const btnVoltar = document.getElementById('btnWizVoltar');
    if (btnVoltar) btnVoltar.style.visibility = passo > 1 ? 'visible' : 'hidden';

    const btnAvancar = document.getElementById('btnWizAvancar');
    if (btnAvancar) {
      if (passo === this.totalPassos) {
        btnAvancar.innerHTML = '🚀 Enviar Solicitação para o TI ✓';
      } else {
        btnAvancar.innerHTML = 'Avançar &rarr;';
      }
    }

    if (passo === 2) {
      this.setPerfilNivel(this.demanda.perfilEscolhidoId || 1);
    } else if (passo === 3) {
      this.calcularHardware().then(() => {
        this.analisarAuditoria().then(() => {
          this.preencherResumo();
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

  atualizarOrgaoWizard(val) {
    const [setor, orgao] = val.split('|');
    this.demanda.setorNome = setor;
    this.demanda.orgao = orgao;
    this.renderizarRotinasPasso2();
  },

  setFormatoEquipamento(formato, elem) {
    this.demanda.formatoEquipamento = formato;

    const cardNb = document.getElementById('cardEscolhaNotebook');
    const cardDt = document.getElementById('cardEscolhaDesktop');
    if (cardNb && cardDt) {
      cardNb.classList.toggle('active', formato === 'notebook');
      cardDt.classList.toggle('active', formato === 'desktop');
    }

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
  },

  setQtdCustom(v) {
    const n = Math.max(1, Math.min(500, parseInt(v) || 1));
    this.demanda.quantidade = n;
    document.querySelectorAll('.qty-pill').forEach(b => b.classList.remove('active'));
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

    // Se for da escola e tentar marcar nível 3 (CAD/Engenharia), exibe o alerta do TCE/SC
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

      this.renderizarHardware(data.perfil);

      const sel = document.getElementById('selectSimular');
      if (sel) sel.value = data.perfil.id.toString();
    } catch (e) {
      console.error(e);
    }
  },

  setOpcaoMonitor(opcao, elem) {
    document.querySelectorAll('#btnMon1x, #btnMonNone, #btnMon2x').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.demanda.opcaoMonitor = opcao;
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoPerifericos(incluir, elem) {
    document.querySelectorAll('#btnPeriSim, #btnPeriNao').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.demanda.incluiPerifericos = incluir;
    this.recalcularPrecoEPerifericos();
  },

  setOpcaoNobreak(incluir, elem) {
    document.querySelectorAll('#btnNobSim, #btnNobNao').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.demanda.incluiNobreak = incluir;
    this.recalcularPrecoEPerifericos();
  },

  recalcularPrecoEPerifericos() {
    const p = this.demanda.perfilEscolhido || this.demanda.perfilRecomendado || { id: 1 };
    
    // Custos base de gabinete/CPU desmembrada:
    // Perfil 1: R$ 1.110 CPU + R$ 650 Mon + R$ 90 Kit Peri = R$ 1.850
    // Perfil 2: R$ 2.210 CPU + R$ 1.300 Mon (2x) + R$ 90 Kit Peri = R$ 3.600
    // Perfil 3: R$ 5.960 CPU + R$ 2.150 Mon (2x 27") + R$ 90 Kit Peri = R$ 8.200
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
    const monCard = document.getElementById('recMonitor');
    const labelEcoMon = document.getElementById('labelEcoMonitor');

    if (this.demanda.opcaoMonitor === 'none') {
      adicionalMonitor = 0;
      if (monCard) monCard.innerHTML = '<span style="color: var(--dark-accent); font-weight: 700;">NÃO INCLUSO</span> (Aproveitamento do setor)';
      if (labelEcoMon) labelEcoMon.innerText = `✂️ Economia de R$ ${(custoMonPadrao * this.demanda.quantidade).toLocaleString('pt-BR')} no lote!`;
    } else if (this.demanda.opcaoMonitor === '2x') {
      adicionalMonitor = custoMonPadrao * 2;
      if (monCard) monCard.innerText = p.id === 3 ? '2x Monitores 27" QHD Alta Precisão' : '2x Monitores 23.8" IPS Dual-Head';
      if (labelEcoMon) labelEcoMon.innerText = '';
    } else {
      adicionalMonitor = custoMonPadrao;
      if (monCard) monCard.innerText = p.id === 3 ? '1x Monitor 27" QHD Alta Precisão' : '23.8" IPS com ajuste de altura NR-17';
      if (labelEcoMon) labelEcoMon.innerText = '';
    }

    const adicionalPerifericos = this.demanda.incluiPerifericos ? 90.00 : 0.00;
    const labelEcoPeri = document.getElementById('labelEcoPerifericos');
    if (labelEcoPeri) {
      labelEcoPeri.innerText = !this.demanda.incluiPerifericos ? `✂️ Economia de R$ ${(90 * this.demanda.quantidade).toLocaleString('pt-BR')} no lote!` : '';
    }

    const adicionalNobreak = this.demanda.incluiNobreak ? 450.00 : 0.00;

    const unit = precoCpu + adicionalMonitor + adicionalPerifericos + adicionalNobreak;
    const total = unit * this.demanda.quantidade;
    const pior = 8200 * this.demanda.quantidade;
    const econ = Math.max(0, pior - total);

    this.demanda.custo_unitario = unit;
    this.demanda.custo_total = total;

    // Alerta de economia de periféricos
    const boxEco = document.getElementById('alertaEcoPerifericos');
    if (boxEco) {
      const poupou = (this.demanda.opcaoMonitor === 'none') || (!this.demanda.incluiPerifericos);
      boxEco.style.display = poupou ? 'block' : 'none';
    }

    // Atualiza na tela
    const elTot = document.getElementById('recPrecoTotal');
    const elUni = document.getElementById('recPrecoUnit');
    const elEco = document.getElementById('recEconomia');
    if (elTot) elTot.innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (elUni) elUni.innerText = `(R$ ${unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por máquina)`;
    if (elEco) elEco.innerText = `R$ ${econ.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  },

  renderizarHardware(p) {
    const badge = document.getElementById('recBadge');
    const title = document.getElementById('recTitle');
    const cpu = document.getElementById('recCpu');
    const ram = document.getElementById('recRam');
    const ssd = document.getElementById('recSsd');
    const mon = document.getElementById('recMonitor');

    const ehNotebook = this.demanda.formatoEquipamento === 'notebook';

    if (p.id === 1) {
      if (badge) badge.innerText = 'NÍVEL 1 • ADEQUADO E HOMOLOGADO';
      if (title) title.innerText = ehNotebook 
        ? 'Notebook Corporativo Portátil (Gestão Escolar)' 
        : 'Computador Desktop de Mesa (Atendimento e Gestão)';
      if (cpu) cpu.innerText = 'Quad-Core x86-64 3.4GHz+ (PassMark 8.500+)';
      if (ram) ram.innerText = '8 GB DDR4/DDR5 (Expansível até 32GB)';
      if (ssd) ssd.innerText = 'SSD 256GB NVMe M.2 de Alta Velocidade';
    } else if (p.id === 2) {
      if (badge) badge.innerText = 'NÍVEL 2 • ANÁLISE DE DADOS E GESTÃO';
      if (title) title.innerText = ehNotebook 
        ? 'Notebook Corporativo Intermediário (Dados & BI)' 
        : 'Estação Desktop para Relatórios e BI';
      if (cpu) cpu.innerText = 'Hexa-Core 4.4GHz+ (PassMark 18.000+)';
      if (ram) ram.innerText = '16 GB DDR4/DDR5 Dual-Channel';
      if (ssd) ssd.innerText = 'SSD 512GB NVMe PCIe 4.0';
    } else {
      if (badge) badge.innerText = 'NÍVEL 3 • ENGENHARIA & CAD';
      if (title) title.innerText = ehNotebook 
        ? 'Mobile Workstation com GPU Dedicada' 
        : 'Workstation Desktop de Alto Desempenho';
      if (cpu) cpu.innerText = 'Octa-Core 5.0GHz+ (PassMark 30.000+)';
      if (ram) ram.innerText = '32 GB DDR5 5200MHz Dual-Channel';
      if (ssd) ssd.innerText = 'SSD 1TB Gen4 + GPU NVIDIA RTX';
    }

    if (ehNotebook) {
      if (mon) mon.innerText = 'Tela 15.6" Full HD Anti-reflexo + Webcam HD';
    }

    this.recalcularPrecoEPerifericos();
  },

  async mudarModeloManual(val) {
    const id = parseInt(val);
    try {
      const res = await fetch('/api/analisar-trava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfilRecomendadoId: this.demanda.perfilRecomendado?.id || 1,
          perfilEscolhidoId: id,
          quantidadeUsuarios: this.demanda.quantidade
        })
      });

      const data = await res.json();
      this.demanda.analiseTrava = data;
      this.demanda.perfilEscolhido = data.perfilEsc;
      this.renderizarHardware(data.perfilEsc);
    } catch (e) {
      console.error(e);
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

      const card = document.getElementById('auditCard');
      const icon = document.getElementById('auditIcon');
      const title = document.getElementById('auditTitle');
      const desc = document.getElementById('auditDesc');
      const boxJust = document.getElementById('boxJustificativa');

      if (a.nivelRisco === 'BAIXO') {
        if (icon) icon.innerText = '🛡️';
        if (title) title.innerText = 'Conformidade Plena com o TCE/SC';
        if (desc) desc.innerText = 'Configuração proporcional à rotina. Processo aprovado sem apontamentos.';
        if (card) card.style.borderColor = 'var(--dark-border)';
        if (boxJust) boxJust.style.display = 'none';
      } else if (a.nivelRisco === 'MEDIO') {
        if (icon) icon.innerText = '⚠️';
        if (title) title.innerText = 'Atenção: Configuração Superior';
        if (desc) desc.innerText = `O modelo escolhido custa R$ ${a.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a mais. Justifique a necessidade técnica.`;
        if (card) card.style.borderColor = '#F59E0B';
        if (boxJust) boxJust.style.display = 'block';
      } else {
        if (icon) icon.innerText = '🚨';
        if (title) title.innerText = 'Alerta de Superdimensionamento TCE/SC';
        if (desc) desc.innerText = `Workstation cara selecionada para rotina básica (Excedente: R$ ${a.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Justificativa obrigatória.`;
        if (card) card.style.borderColor = '#EF4444';
        if (boxJust) boxJust.style.display = 'block';
      }
    } catch (e) {
      console.error(e);
    }
  },

  preencherResumo() {
    const ehNotebook = this.demanda.formatoEquipamento === 'notebook';
    const icone = ehNotebook ? '💻' : '🖥️';
    const titulo = ehNotebook ? 'Notebook Corporativo Portátil' : 'Computador de Mesa (Desktop)';

    const elIcon = document.getElementById('resumoObjIcon');
    const elTitulo = document.getElementById('resumoObjTitulo');
    const elSub = document.getElementById('resumoObjSub');

    if (elIcon) elIcon.innerText = icone;
    if (elTitulo) elTitulo.innerText = `${titulo} (${this.demanda.quantidade} unidade${this.demanda.quantidade > 1 ? 's' : ''})`;
    if (elSub) elSub.innerText = `Destinado a: ${this.demanda.setorNome || 'Escolas Municipais'} — Protocolo ${this.demanda.protocolo}`;

    const elServ = document.getElementById('sumServidor');
    const elOrg = document.getElementById('sumOrgao');
    const elAcess = document.getElementById('sumAcessorios');
    const elProt = document.getElementById('sumProtocolo');
    const elQtd = document.getElementById('sumQtd');
    const elMod = document.getElementById('sumModelo');

    if (elServ) elServ.innerText = `${this.demanda.usuarioNome || 'Profa. Angelita de Souza'} (${this.demanda.cargo || 'Diretora'})`;
    if (elOrg) elOrg.innerText = this.demanda.setorNome || 'Escolas Municipais (SME Lages)';
    if (elProt) elProt.innerText = this.demanda.protocolo;
    if (elQtd) elQtd.innerText = `${this.demanda.quantidade} Equipamento${this.demanda.quantidade > 1 ? 's' : ''}`;

    let acessTxt = [];
    if (this.demanda.opcaoMonitor === 'none') {
      acessTxt.push('Monitor (Já tem na mesa)');
    } else {
      acessTxt.push('Novo Monitor Incluso');
    }

    if (!this.demanda.incluiPerifericos) {
      acessTxt.push('Teclado/Mouse (Já tem na mesa)');
    } else {
      acessTxt.push('Teclado/Mouse Novos');
    }

    if (elAcess) elAcess.innerText = acessTxt.join(' • ');

    const nomePerfil = this.demanda.perfilEscolhido?.nome?.split(':')[0] || 'Nível 1';
    if (elMod) elMod.innerText = `${titulo} - ${nomePerfil}`;
  },

  async salvarLicitação() {
    const analise = this.demanda.analiseTrava;
    const txt = document.getElementById('txtJustificativa')?.value.trim() || '';

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
          custoUnitario: this.demanda.custo_unitario,
          custoTotal: this.demanda.custo_total,
          softwares: (this.demanda.atividadesNomes && this.demanda.atividadesNomes.length > 0)
            ? this.demanda.atividadesNomes 
            : this.demanda.atividades,
          perfilRecomendadoId: this.demanda.perfilRecomendado?.id || 1,
          perfilEscolhidoId: this.demanda.perfilEscolhido?.id || 1,
          justificativaUsuario: txt || 'Demanda escolar homologada para rotinas administrativas e pedagógicas.',
          status: analise ? analise.status : 'Aprovado Direto',
          irs: analise ? analise.irs : 5,
          nivelRisco: analise ? analise.nivelRisco : 'BAIXO'
        })
      });

      const data = await res.json();
      if (data.success) {
        // Recarrega a tabela de pedidos respeitando as permissões
        this.carregarDemandas();
        this.renderizarModalEtp(data.demanda, this.demanda.perfilEscolhido || this.demanda.perfilRecomendado);
      }
    } catch (e) {
      alert('Erro ao salvar requisição: ' + e.message);
    }
  },

  // ==========================================
  // MODAL DA MINUTA A4
  // ==========================================
  async abrirMinuta(protocolo) {
    try {
      const res = await fetch(`/api/demandas/${protocolo}`);
      const data = await res.json();
      this.renderizarModalEtp(data.demanda, data.perfilEsc);
    } catch (e) {
      alert('Erro ao carregar minuta.');
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

  renderizarModalEtp(demanda, perfil) {
    const modal = document.getElementById('modalEtp');
    const corpo = document.getElementById('corpoDocumentoEtp');

    this.fecharCaixaEmail();

    const ano = new Date().getFullYear();
    const dia = new Date().getDate();
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[new Date().getMonth()];

    const numContrato = demanda.protocolo.replace('ETP-', 'CT-') + '/' + ano;
    const processoAdm = `Processo Administrativo nº ${demanda.protocolo.replace('ETP-', '00')}/${ano}-PML`;
    const pregaoNum = `Pregão Eletrônico SRP nº 042/${ano}`;

    let catmat = perfil.id === 3 ? '482914' : perfil.id === 2 ? '471209' : '463821';
    let catmatNome = perfil.id === 3 
      ? 'Estação de Trabalho Workstation (Engenharia / Alto Desempenho)' 
      : perfil.id === 2 
      ? 'Microcomputador Desktop Tipo II (Análise de Dados / Dual Head)' 
      : 'Microcomputador Desktop Padrão (Administrativo / Atendimento)';

    const valUnit = demanda.custo_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const valTot = demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const valTotExtenso = this.valorPorExtenso(demanda.custo_total);

    const nomeServ = (demanda.usuario_nome || 'Maria Eduarda Alencar').toUpperCase();
    const matServ = demanda.usuario_matricula || 'MAT-48921/PML';
    const cargoServ = demanda.cargo || 'Servidor Público Responsável';
    const orgaoServ = (demanda.orgao || 'Prefeitura do Município de Lages - Secretaria Municipal de Educação').toUpperCase();
    const setorServ = demanda.setor || 'Escolas Municipais (SME)';

    let rotinasFormatadas = '';
    try {
      const parsed = Array.isArray(demanda.softwares) ? demanda.softwares : JSON.parse(demanda.softwares || '[]');
      rotinasFormatadas = parsed.join('; ');
    } catch (e) {
      rotinasFormatadas = demanda.softwares || '';
    }

    const ehNotebook = (this.demanda.formatoEquipamento === 'notebook');
    const nomeEquipamentoFormatado = ehNotebook 
      ? 'Notebook Corporativo Portátil com Tela 15.6" Full HD' 
      : 'Microcomputador Desktop Corporativo (Gabinete de Mesa)';

    let monitorTxt = ehNotebook 
      ? 'Tela 15.6" Full HD (1920x1080) WVA anti-reflexo com webcam HD e microfone digital integrados'
      : '1x Monitor 23.8" IPS Full HD ergonômico NR-17 com ajuste de altura';

    if (!ehNotebook && this.demanda.opcaoMonitor === 'none') {
      monitorTxt = '<strong style="color: #047857;">DISPENSADO DO FORNECIMENTO:</strong> Reaproveitamento integral de monitores em perfeito estado já existentes no setor de ' + setorServ + ' (Art. 11 da Lei 14.133/2021).';
    } else if (!ehNotebook && this.demanda.opcaoMonitor === '2x') {
      monitorTxt = '2x Monitores IPS Full HD com suporte articulado a pistão (Dual-Head)';
    }

    let periTxt = ehNotebook
      ? 'Teclado ABNT2 com teclado numérico integrado, touchpad multitoque, fonte/carregador bivolt original e trava Kensington'
      : 'Kit Teclado e Mouse USB ABNT2 padrão corporativo com fio';

    if (!ehNotebook && this.demanda.incluiPerifericos === false) {
      periTxt = '<strong style="color: #047857;">DISPENSADO DO FORNECIMENTO:</strong> Reaproveitamento de kits de teclado e mouse já existentes na escola/órgão.';
    }

    if (this.demanda.incluiNobreak) {
      periTxt += ' • Nobreak Senoidal com regulação automática de voltagem';
    }

    corpo.innerHTML = `
      <div class="gov-contract-doc">

        <!-- CABEÇALHO SUPERIOR OFICIAL PML / TIC -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; font-size: 8pt; color: #4B5563;">
          <div>MUNICÍPIO DE LAGES • ESTADO DE SANTA CATARINA</div>
          <div style="font-weight: 800; color: #111827;">REQUISIÇÃO TÉCNICA DE TIC Nº ${demanda.protocolo.replace('ETP-', 'REQ-TIC-')}/${ano}</div>
        </div>

        <div class="gov-contract-header">
          <h2 style="font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #000000; margin-bottom: 2px;">
            DOCUMENTO DE OFICIALIZAÇÃO DA DEMANDA (DOD)
          </h2>
          <div style="font-weight: 700; font-size: 9.5pt; color: #1F2937;">
            REQUISIÇÃO E ESPECIFICAÇÃO TÉCNICA PADRONIZADA DE INFORMÁTICA<br>
            Lei Federal nº 14.133, de 1º de abril de 2021 (Art. 18, § 1º)<br>
            Diretoria Geral de Tecnologia da Informação e Comunicações (TIC)
          </div>

          <div style="margin-top: 14px; padding: 10px; background: #F8FAFC; border: 1px solid #CBD5E1; text-align: center;">
            <div style="font-weight: 900; font-size: 10pt; color: #0F172A;">${orgaoServ}</div>
            <div style="font-size: 8.5pt; color: #475569; margin-top: 2px;">Setor Solicitante: <strong>${setorServ}</strong> • (${processoAdm})</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #0F172A; margin-top: 6px;">
              SOLICITAÇÃO DE FORNECIMENTO DE EQUIPAMENTO DE INFORMÁTICA HOMOLOGADO PARA GESTÃO OPERACIONAL
            </div>
          </div>
        </div>

        <!-- IDENTIFICAÇÃO DO SOLICITANTE -->
        <p class="gov-clause-p">
          Por meio deste instrumento, a servidora responsável <strong>${nomeServ}</strong>, ocupante do cargo de <strong>${cargoServ}</strong>, matrícula funcional nº <strong>${matServ}</strong>, lotada no(a) <strong>${setorServ}</strong>, formaliza perante a Diretoria de Tecnologia da Informação da Prefeitura de Lages a requisição de equipamento de informática em substituição/atendimento de posto de trabalho, de acordo com as especificações técnicas delimitadas a seguir:
        </p>

        <!-- 1. OBJETO E ESPECIFICAÇÃO TÉCNICA -->
        <div class="gov-clause">
          <div class="gov-clause-title">1. OBJETO E ESPECIFICAÇÃO TÉCNICA (FICHA PARA O SETOR DE TI)</div>
          <p class="gov-clause-p">
            1.1. Fornecimento de equipamento computacional padronizado, dimensionado com base no levantamento das rotinas reais de trabalho: <em>${rotinasFormatadas || 'Gestão escolar, diário de classe, Google Sala de Aula, SGPe e documentos pedagógicos'}</em>.
          </p>
          <p class="gov-clause-p">
            1.2. <strong>Cláusula Anti-Subdimensionamento (Proteção ao Usuário):</strong> O equipamento deve possuir estritamente arquitetura computacional x86-64 bits com sistema operacional corporativo Windows 11 Pro 64-bit homologado pela rede municipal. É expressamente vedado o fornecimento de netbooks de baixa potência, aparelhos móveis do tipo tablet ou dispositivos com sistema operacional Android/ChromeOS, por serem comprovadamente incompatíveis com as aplicações de gestão da Prefeitura e da Secretaria Municipal de Educação.
          </p>

          <table class="gov-table">
            <thead>
              <tr>
                <th style="width: 6%; text-align: center;">ITEM</th>
                <th style="width: 50%;">ESPECIFICAÇÃO PADRONIZADA PARA ATENDIMENTO (TIC)</th>
                <th style="width: 14%; text-align: center;">CATMAT</th>
                <th style="width: 10%; text-align: center;">FORMATO</th>
                <th style="width: 8%; text-align: center;">QTD.</th>
                <th style="width: 12%; text-align: center;">SISTEMA OPERACIONAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;"><strong>1</strong></td>
                <td>
                  <strong>${nomeEquipamentoFormatado} - ${perfil.nome.split(':')[0]}</strong><br>
                  <small>
                    • <strong>Processador:</strong> ${perfil.processador}<br>
                    • <strong>Memória RAM:</strong> ${perfil.ram}<br>
                    • <strong>Armazenamento:</strong> ${perfil.armazenamento}<br>
                    • <strong>Controlador Gráfico:</strong> ${perfil.gpu}<br>
                    • <strong>Tela / Monitor:</strong> ${monitorTxt}<br>
                    • <strong>Periféricos e Conectividade:</strong> ${periTxt}
                  </small>
                </td>
                <td style="text-align: center;">
                  <strong>${catmat}</strong><br>
                  <span style="font-size: 7pt; color: #4B5563;">${catmatNome}</span>
                </td>
                <td style="text-align: center;"><strong>${ehNotebook ? 'Notebook' : 'Desktop'}</strong></td>
                <td style="text-align: center;"><strong>${demanda.quantidade_usuarios}</strong></td>
                <td style="text-align: center; font-weight: 700; color: #047857;">Windows 11 Pro (x86-64)</td>
              </tr>
            </tbody>
          </table>

          <!-- REQUISITOS OBRIGATÓRIOS DO FORNECIMENTO -->
          <div class="tech-spec-box">
            <strong>REQUISITOS MÍNIMOS OBRIGATÓRIOS PARA HOMOLOGAÇÃO PELO TI:</strong><br>
            • <strong>Desempenho Homologado:</strong> Processador compatível com índice PassMark mínimo de 8.500 pontos, garantindo agilidade na abertura simultânea de abas do SGPe e relatórios em PDF sem travamentos.<br>
            • <strong>Segurança em Hardware:</strong> Chip TPM 2.0 ativo de fábrica com suporte a inicialização segura (UEFI Secure Boot).<br>
            • <strong>Garantia Técnica no Local:</strong> Garantia integral de <strong>36 (trinta e seis) meses on-site</strong> com atendimento e suporte técnico presencial na unidade de ensino em Lages/SC.
          </div>
        </div>

        <!-- 2. DESPACHO DA DIRETORIA DE TECNOLOGIA DA INFORMAÇÃO -->
        <div class="gov-clause">
          <div class="gov-clause-title">2. PARECER E ENCAMINHAMENTO DA DIRETORIA DE TI</div>
          <p class="gov-clause-p">
            2.1. A presente demanda foi verificada e compatibilizada com o Catálogo Municipal de TIC de Lages/SC. Constatou-se conformidade técnica plena entre a rotina de trabalho informada pela servidora e o equipamento dimensionado, restando afastados tanto o superdimensionamento (gastos excessivos) quanto o subdimensionamento (entrega de máquinas inadequadas).
          </p>
          <p class="gov-clause-p">
            2.2. Encaminhe-se ao Almoxarifado Central / Setor de Compras para providências de entrega e instalação do equipamento no local de trabalho da solicitante.
          </p>
        </div>

          <!-- REQUISITOS TÉCNICOS DETALHADOS ANTI-ENTREGA DE PRODUTO INFERIOR -->
          <div class="tech-spec-box">
            <strong>REQUISITOS MÍNIMOS OBRIGATÓRIOS DO FORNECEDOR (CLÁUSULA ANTI-ENTREGA DE PRODUTO INFERIOR):</strong><br>
            • <strong>Placa-mãe OEM Corporativa:</strong> Desenvolvida pelo fabricante do equipamento ou com BIOS customizada contendo logo institucional da marca, chip TPM 2.0 de segurança em hardware ativo e UEFI 2.8+ com Secure Boot habilitado de fábrica.<br>
            • <strong>Fonte de Alimentação:</strong> Fonte bivolt automática de alta eficiência com certificação mínima <strong>80 Plus Bronze</strong> (eficiência superior a 85%) e PFC Ativo.<br>
            • <strong>Monitor Ergonômico (NR-17):</strong> Painel IPS com base articulada e ajuste vertical de altura (mínimo 100mm), inclinação e rotação, atendendo à Norma Regulamentadora NR-17 do Ministério do Trabalho.<br>
            • <strong>Garantia e Assistência On-Site em Lages/SC:</strong> Garantia técnica integral de <strong>36 (trinta e seis) meses on-site</strong>, com prazo de atendimento no município de Lages de no máximo 48 horas úteis e substituição de peças defeituosas por novas originais.
          </div>

          <p class="gov-clause-p" style="margin-top: 8px;">
            1.3. Vinculam esta contratação, independentemente de transcrição: o Termo de Referência; o Edital da Licitação; a Proposta do contratado; e eventuais anexos dos documentos supracitados.
          </p>
        </div>

        <!-- 2. CLÁUSULA SEGUNDA – VIGÊNCIA E PRORROGAÇÃO -->
        <div class="gov-clause">
          <div class="gov-clause-title">2. CLÁUSULA SEGUNDA – VIGÊNCIA E PRORROGAÇÃO</div>
          <p class="gov-clause-p">
            2.1. O prazo de vigência da contratação é de <strong>12 (doze) meses</strong> contados da data de assinatura deste instrumento, na forma do art. 105 da Lei nº 14.133, de 2021, prorrogável exclusivamente para fins de vigência da garantia técnica de 36 (trinta e seis) meses dos equipamentos.
          </p>
        </div>

        <!-- 3. CLÁUSULA TERCEIRA – MODELOS DE EXECUÇÃO E GESTÃO CONTRATUAIS -->
        <div class="gov-clause">
          <div class="gov-clause-title">3. CLÁUSULA TERCEIRA – MODELOS DE EXECUÇÃO E GESTÃO CONTRATUAIS</div>
          <p class="gov-clause-p">
            3.1. O regime de execução contratual, os modelos de gestão e de fiscalização, assim como os prazos de entrega fixados em até <strong>30 (trinta) dias corridos</strong> no município de Lages/SC, observação e recebimento do objeto constam detalhados no Termo de Referência.
          </p>
        </div>

        <!-- 4. CLÁUSULA QUARTA – SUBCONTRATAÇÃO -->
        <div class="gov-clause">
          <div class="gov-clause-title">4. CLÁUSULA QUARTA – SUBCONTRATAÇÃO</div>
          <p class="gov-clause-p">
            4.1. Não será admitida a subcontratação do fornecimento principal dos equipamentos de tecnologia da informação.
          </p>
        </div>

        <!-- 5. CLÁUSULA QUINTA – PREÇO -->
        <div class="gov-clause">
          <div class="gov-clause-title">5. CLÁUSULA QUINTA – PREÇO</div>
          <p class="gov-clause-p">
            5.2. O valor total da contratação é de <strong>R$ ${valTot} (${valTotExtenso})</strong>.
          </p>
          <p class="gov-clause-p">
            5.3. No valor acima estão incluídas todas as despesas ordinárias diretas e indiretas decorrentes da execução do objeto, inclusive tributos, encargos sociais, trabalhistas, previdenciários, fiscais, frete até o município de Lages/SC, seguro e garantia integral de 3 anos.
          </p>
        </div>

        <!-- 6. CLÁUSULA SEXTA – PAGAMENTO -->
        <div class="gov-clause">
          <div class="gov-clause-title">6. CLÁUSULA SEXTA – PAGAMENTO</div>
          <p class="gov-clause-p">
            6.1. O pagamento será realizado em até <strong>30 (trinta) dias corridos</strong> após a emissão do Termo de Recebimento Definitivo e conferência física pela Diretoria de TIC da Prefeitura de Lages.
          </p>
        </div>

        <!-- 7. CLÁUSULA SÉTIMA – REAJUSTE -->
        <div class="gov-clause">
          <div class="gov-clause-title">7. CLÁUSULA SÉTIMA – REAJUSTE</div>
          <p class="gov-clause-p">
            7.1. Os preços são fixos e irreajustáveis no período de 12 (doze) meses da proposta, aplicando-se o índice IPCA/IBGE caso haja prorrogação legal autorizada.
          </p>
        </div>

        <!-- 8. CLÁUSULA OITAVA – OBRIGAÇÕES DO CONTRATANTE -->
        <div class="gov-clause">
          <div class="gov-clause-title">8. CLÁUSULA OITAVA – OBRIGAÇÕES DO CONTRATANTE</div>
          <p class="gov-clause-p">
            8.1. São obrigações do Contratante: receber o objeto no prazo e condições fixadas; fiscalizar a conformidade dos equipamentos com as especificações blindadas do edital; efetuar o pagamento tempestivo; e notificar formalmente a Contratada sobre quaisquer inconformidades.
          </p>
        </div>

        <!-- 9. CLÁUSULA NONA – OBRIGAÇÕES DO CONTRATADO -->
        <div class="gov-clause">
          <div class="gov-clause-title">9. CLÁUSULA NONA – OBRIGAÇÕES DO CONTRATADO</div>
          <p class="gov-clause-p">
            9.1. O Contratado obriga-se a entregar equipamentos novos, de primeiro uso, lacrados de fábrica; prestar assistência técnica presencial no município de Lages/SC; disponibilizar manuais em português; cumprir as normas de proteção ao trabalho e NR-17; e observar estritamente a <strong>Lei nº 13.709/2018 (LGPD)</strong>.
          </p>
        </div>

        <!-- 10. CLÁUSULA DÉCIMA – GARANTIA DE EXECUÇÃO -->
        <div class="gov-clause">
          <div class="gov-clause-title">10. CLÁUSULA DÉCIMA – GARANTIA DE EXECUÇÃO</div>
          <p class="gov-clause-p">
            10.1. Não haverá exigência de garantia contratual da execução com base nos estudos preliminares, prevalecendo a garantia técnica de fábrica de 36 meses.
          </p>
        </div>

        <!-- 11. CLÁUSULA DÉCIMA PRIMEIRA – INFRAÇÕES E SANÇÕES ADMINISTRATIVAS -->
        <div class="gov-clause">
          <div class="gov-clause-title">11. CLÁUSULA DÉCIMA PRIMEIRA – INFRAÇÕES E SANÇÕES ADMINISTRATIVAS</div>
          <p class="gov-clause-p">
            11.1. O cometimento de infrações administrativas sujeitará a Contratada às sanções previstas no art. 156 da Lei nº 14.133, de 2021, garantida a prévia defesa e o contraditório.
          </p>
        </div>

        <!-- 12. CLÁUSULA DÉCIMA SEGUNDA – DA EXTINÇÃO CONTRATUAL -->
        <div class="gov-clause">
          <div class="gov-clause-title">12. CLÁUSULA DÉCIMA SEGUNDA – DA EXTINÇÃO CONTRATUAL</div>
          <p class="gov-clause-p">
            12.1. O contrato será extinto quando cumpridas integralmente as obrigações de ambas as partes, ou nos termos do art. 137 da Lei nº 14.133/2021.
          </p>
        </div>

        <!-- 13. CLÁUSULA DÉCIMA TERCEIRA – ALTERAÇÕES -->
        <div class="gov-clause">
          <div class="gov-clause-title">13. CLÁUSULA DÉCIMA TERCEIRA – ALTERAÇÕES</div>
          <p class="gov-clause-p">
            13.1. Eventuais alterações contratuais reger-se-ão pela disciplina dos arts. 124 e seguintes da Lei nº 14.133, de 2021, com o limite legal de até 25% de acréscimo ou supressão.
          </p>
        </div>

        <!-- 14. CLÁUSULA DÉCIMA QUARTA – DOTAÇÃO ORÇAMENTÁRIA -->
        <div class="gov-clause">
          <div class="gov-clause-title">14. CLÁUSULA DÉCIMA QUARTA – DOTAÇÃO ORÇAMENTÁRIA</div>
          <p class="gov-clause-p">
            14.1. As despesas correrão à conta de recursos específicos do Orçamento do Município de Lages, Elemento de Despesa 44.90.52 (Equipamentos e Material Permanente de TIC).
          </p>
        </div>

        <!-- 15. CLÁUSULA DÉCIMA QUINTA – DOS CASOS OMISSOS -->
        <div class="gov-clause">
          <div class="gov-clause-title">15. CLÁUSULA DÉCIMA QUINTA – DOS CASOS OMISSOS</div>
          <p class="gov-clause-p">
            15.1. Os casos omissos serão decididos segundo as disposições da Lei nº 14.133, de 2021 e princípios gerais de direito público.
          </p>
        </div>

        <!-- 16. CLÁUSULA DÉCIMA SEXTA – PUBLICAÇÃO -->
        <div class="gov-clause">
          <div class="gov-clause-title">16. CLÁUSULA DÉCIMA SEXTA – PUBLICAÇÃO</div>
          <p class="gov-clause-p">
            16.1. Incumbirá ao contratante divulgar o presente instrumento no <strong>Portal Nacional de Contratações Públicas (PNCP)</strong>, na forma do art. 94 da Lei 14.133/2021.
          </p>
        </div>

        <!-- 17. CLÁUSULA DÉCIMA SÉTIMA – FORO -->
        <div class="gov-clause">
          <div class="gov-clause-title">17. CLÁUSULA DÉCIMA SÉTIMA – FORO</div>
          <p class="gov-clause-p">
            17.1. Fica eleito o Foro da <strong>Comarca de Lages / SC</strong> para dirimir controvérsias decorrentes deste contrato administrativo.
          </p>
        </div>

        <!-- CERTIFICAÇÃO PREVENTIVA TCE/SC -->
        <div style="background: #F9FAFB; border: 1px solid #D1D5DB; padding: 10px 14px; margin-top: 14px; font-size: 8pt; break-inside: avoid;">
          <strong>CERTIFICAÇÃO DE AUDITORIA PREVENTIVA TCE/SC (DIMENSIONATI):</strong><br>
          Índice de Risco de Superdimensionamento (IRS): <strong>${demanda.irs}% (${demanda.nivel_risco})</strong> • Dimensionamento aprovado para <strong>${cargoServ}</strong> em <strong>Lages/SC</strong> com <strong>${perfil.ram}</strong> sem sobrecusto ao erário.
        </div>

        <!-- DATA E ASSINATURAS -->
        <div style="margin-top: 24px; text-align: right; font-weight: 700; font-size: 9.5pt; break-inside: avoid;">
          Lages/SC, ${dia} de ${mes} de ${ano}.
        </div>

        <div class="gov-signatures-block" style="break-inside: avoid;">
          <div>
            <div class="gov-sig-line">
              <strong>${nomeServ}</strong><br>
              ${cargoServ}<br>
              <small>Matrícula nº ${matServ} • ${orgaoServ}</small><br>
              <strong>Representante legal do CONTRATANTE</strong>
            </div>
          </div>
          <div>
            <div class="gov-sig-line">
              <strong>EMPRESA VENCEDORA DO CERTAME</strong><br>
              Representante Legal da CONTRATADA<br>
              <small>Assinatura Digital ICP-Brasil (Conforme Lei nº 14.063/2020)</small><br>
              <strong>Representante legal do CONTRATADO</strong>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 8pt; color: #4B5563; break-inside: avoid;">
          <p><strong>TESTEMUNHAS:</strong></p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 6px;">
            <div>1- ____________________________________ CPF: _______________________</div>
            <div>2- ____________________________________ CPF: _______________________</div>
          </div>
        </div>

        <!-- RODAPÉ INSTITUCIONAL PADRÃO AGU / SGD / SEGES -->
        <div style="margin-top: 28px; padding-top: 10px; border-top: 1px solid #9CA3AF; font-size: 7pt; color: #6B7280; text-align: center; line-height: 1.35; break-inside: avoid;">
          Câmara Nacional de Modelos de Licitações e Contratos da Consultoria-Geral da União<br>
          Termo de contrato modelo para Pregão Eletrônico para contratação de compras/Solução de Tecnologia da Informação e Comunicação<br>
          Aprovado pela Secretaria de Governo Digital • Identidade visual pela Secretaria de Gestão • Atualização: AGO/2025
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

    const prot = this.demanda.protocolo || 'ETP-2026';
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif;
      margin: 0;
      padding: 12px;
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
    this.executarImpressaoLimpa('corpoDocumentoEtp', 'Termo de Contrato Administrativo TIC - Lei 14.133');
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
        protocolo: 'ETP-2026-HACK01',
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
        protocolo: 'ETP-2026-HACK02',
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
        protocolo: 'ETP-2026-HACK03',
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
          <div style="font-weight: 800; font-size: 10pt; color: #0F172A;">PARECER PRELIMINAR DE AUDITORIA PREVENTIVA Nº ${demanda.protocolo.replace('ETP-', 'PAR-TCE-')}/${ano}</div>
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
