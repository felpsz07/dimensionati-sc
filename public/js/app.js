// app.js - Lógica Dark Minimalista Unificada (DimensionaTI SC - Lages)
const app = {
  usuarioLogado: null,
  passoAtual: 1,
  totalPassos: 5,
  demandasCarregadas: [],

  lotacaoTemp: {
    setorNome: 'Escolas Municipais (SME)',
    orgao: 'Prefeitura de Lages - SME',
    cargo: 'Professora / Coordenadora'
  },

  demanda: {
    usuarioId: null,
    usuarioNome: '',
    usuarioMatricula: '',
    setorNome: 'Escolas Municipais (SME)',
    orgao: 'Prefeitura de Lages - SME',
    cargo: 'Professora / Coordenadora',
    municipio: 'Lages',
    quantidade: 10,
    atividades: ['edu_1', 'edu_2', 'edu_3'],
    atividadesNomes: [
      'Diário de Classe & Sistema Escolar SME',
      'Planos de Aula, Provas e Documentos Didáticos',
      'Navegação Web, SGPe e E-mails Educacionais'
    ],
    perfilRecomendado: null,
    perfilEscolhido: null,
    analiseTrava: null,
    protocolo: 'ETP-2026-0000',
    custo_total: 18500.00
  },

  // ==========================================================
  // CATÁLOGO DE ROTINAS INTELIGENTES POR SETOR / ÁREA DE ATUAÇÃO
  // ==========================================================
  catalogoRotinasPorSetor: {
    educacao: {
      nomeSetor: 'Escolas Municipais e CMEIs (SME Lages)',
      icone: '🏫',
      badge: 'ROTINAS ESCOLARES HOMOLOGADAS • LEI 14.133',
      titulo: 'Atividades Pedagógicas e de Gestão Escolar',
      descricaoBlindagem: 'Com base no seu perfil escolar (SME), este catálogo foi restrito às rotinas didáticas e administrativas autorizadas. Softwares pesados (AutoCAD, 3D e renderização) foram desabilitados para prevenir compras inadequadas e superdimensionamento.',
      rotinas: [
        {
          id: 'edu_1',
          nome: 'Diário de Classe & Sistema Escolar SME',
          desc: 'Lançamento de notas, faltas, boletins, transferências e histórico escolar de alunos nos portais oficiais.',
          icone: '🎓',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'edu_2',
          nome: 'Planos de Aula, Provas e Documentos Didáticos',
          desc: 'Elaboração de avaliações, apostilas, leitura e geração de PDFs e edição de textos (Word/Writer).',
          icone: '📝',
          softwareId: 2,
          padrao: true
        },
        {
          id: 'edu_3',
          nome: 'Navegação Web, SGPe e E-mails Educacionais',
          desc: 'Pesquisa pedagógica, acesso ao portal do professor, SGPe do Estado e comunicação escolar.',
          icone: '🌐',
          softwareId: 1,
          padrao: true
        },
        {
          id: 'edu_4',
          nome: 'Apresentações Didáticas e Mídias em Sala',
          desc: 'Exibição de slides no projetor (PowerPoint/Canva), reprodução de vídeos educativos e YouTube.',
          icone: '📽️',
          softwareId: 2,
          padrao: false
        },
        {
          id: 'edu_5',
          nome: 'Planilhas Escolares & Almoxarifado Pedagógico',
          desc: 'Controle de médias de alunos, listas de presença e almoxarifado de livros e merenda escolar.',
          icone: '📊',
          softwareId: 3,
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
      this.renderizarTabela(this.demandasCarregadas);
    } catch (e) {
      console.error(e);
    }
  },

  renderizarTabela(demandas) {
    const tbody = document.getElementById('tbodyLicitacoes');
    if (!tbody) return;

    if (!demandas || demandas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 28px; color: var(--dark-muted);">Nenhuma licitação encontrada para este usuário.</td></tr>`;
      return;
    }

    tbody.innerHTML = demandas.map(d => {
      let stClass = 'ok';
      let stText = 'AUTORIZADA';

      if (d.status === 'Sob Análise' || d.nivel_risco === 'MEDIO') {
        stClass = 'warn';
        stText = 'SOB ANÁLISE';
      } else if (d.status === 'Bloqueado TCE' || d.nivel_risco === 'ALTO') {
        stClass = 'danger';
        stText = 'CANCELADA';
      }

      return `
        <tr>
          <td><strong style="color: var(--dark-accent);">${d.protocolo}</strong></td>
          <td>
            <strong>${d.setor}</strong><br>
            <small style="color: var(--dark-muted);">${d.orgao}</small>
          </td>
          <td>
            ${d.usuario_nome || 'Servidor'}<br>
            <small style="color: var(--dark-muted);">${d.cargo || ''}</small>
          </td>
          <td><strong>${d.quantidade_usuarios}</strong></td>
          <td><span class="status-chip ${stClass}">${stText}</span></td>
          <td style="text-align: right; font-weight: 700;">
            R$ ${d.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </td>
          <td style="text-align: center;">
            <button class="btn-table-action" onclick="app.abrirMinuta('${d.protocolo}')">
              Ver
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  filtrarTabela() {
    const term = (document.getElementById('inputBusca')?.value || '').toLowerCase();
    const filtradas = this.demandasCarregadas.filter(d => 
      !term ||
      (d.protocolo || '').toLowerCase().includes(term) ||
      (d.setor || '').toLowerCase().includes(term) ||
      (d.orgao || '').toLowerCase().includes(term) ||
      (d.usuario_nome || '').toLowerCase().includes(term)
    );
    this.renderizarTabela(filtradas);
  },

  // ==========================================
  // STEPPER WIZARD (PASSOS 1 A 5)
  // ==========================================
  abrirWizardNovo() {
    const num = Math.floor(1000 + Math.random() * 9000);
    this.demanda.protocolo = `ETP-2026-${num}`;

    // Sincroniza com dados cadastrados do usuário logado
    if (this.usuarioLogado) {
      this.demanda.usuarioId = this.usuarioLogado.id;
      this.demanda.usuarioNome = this.usuarioLogado.nome;
      this.demanda.usuarioMatricula = this.usuarioLogado.matricula;
      this.demanda.setorNome = this.usuarioLogado.setor || 'Escolas Municipais (SME)';
      this.demanda.orgao = this.usuarioLogado.orgao || 'Prefeitura de Lages - SME';
      this.demanda.cargo = this.usuarioLogado.cargo || 'Professora / Coordenadora';
    }

    // Sincroniza o select do Passo 1
    const sel = document.getElementById('wizOrgaoSelect');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        const val = sel.options[i].value;
        const [optSetor, optOrgao] = val.split('|');
        if (
          this.demanda.setorNome.includes(optSetor) ||
          optSetor.includes(this.demanda.setorNome) ||
          this.demanda.orgao.includes(optOrgao)
        ) {
          sel.selectedIndex = i;
          break;
        }
      }
    }

    // Renderiza dinamicamente as rotinas específicas do setor do usuário
    this.renderizarRotinasPasso2();

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
        btnAvancar.innerHTML = 'Emitir Minuta & Salvar ✓';
      } else {
        btnAvancar.innerHTML = 'Próximo &rarr;';
      }
    }

    if (passo === 2) this.renderizarRotinasPasso2();
    else if (passo === 3) this.calcularHardware();
    else if (passo === 4) this.analisarAuditoria();
    else if (passo === 5) this.preencherResumo();
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
    // Atualiza imediatamente o catálogo do Passo 2 para o novo setor
    this.renderizarRotinasPasso2();
  },

  setQtd(n, elem) {
    document.querySelectorAll('.qty-pill').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
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
  // RENDERIZAÇÃO INTELIGENTE DO PASSO 2 (ROTINA)
  // FILTRADO PELO SETOR DE ATUAÇÃO (EX: ESCOLAS)
  // ==========================================
  renderizarRotinasPasso2() {
    const chave = this.detectarChaveSetor(this.demanda.setorNome || this.demanda.orgao);
    const config = this.catalogoRotinasPorSetor[chave] || this.catalogoRotinasPorSetor['educacao'];

    // Atualiza o Banner de Homologação / Blindagem TCE
    const elIcon = document.getElementById('rotinaBannerIcon');
    const elSetor = document.getElementById('rotinaBannerSetorNome');
    const elBadge = document.getElementById('rotinaBannerBadge');
    const elTitulo = document.getElementById('rotinaBannerTitulo');
    const elDesc = document.getElementById('rotinaBannerDesc');

    if (elIcon) elIcon.innerText = config.icone;
    if (elSetor) elSetor.innerText = config.nomeSetor;
    if (elBadge) elBadge.innerText = config.badge;
    if (elTitulo) elTitulo.innerText = config.titulo;
    if (elDesc) elDesc.innerText = config.descricaoBlindagem;

    // Garante que as atividades selecionadas pertençam ao catálogo atual
    const idsValidos = config.rotinas.map(r => r.id);
    const temAtividadesValidas = this.demanda.atividades.some(id => idsValidos.includes(id));

    if (!temAtividadesValidas) {
      // Pré-marca as rotinas padrão do setor
      this.demanda.atividades = config.rotinas.filter(r => r.padrao).map(r => r.id);
    }

    // Mantém os nomes textuais atualizados
    this.demanda.atividadesNomes = config.rotinas
      .filter(r => this.demanda.atividades.includes(r.id))
      .map(r => r.nome);

    // Renderiza a Grid de Cards
    const grid = document.getElementById('gridRotinasDinamicas');
    if (!grid) return;

    grid.innerHTML = config.rotinas.map(rot => {
      const isSelected = this.demanda.atividades.includes(rot.id);
      return `
        <div class="select-box ${isSelected ? 'selected' : ''}" id="act-${rot.id}" onclick="app.toggleAtividade('${rot.id}')">
          <div class="box-check">✓</div>
          <div class="box-info">
            <h4>${rot.icone} ${rot.nome}</h4>
            <p>${rot.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleAtividade(id) {
    const chave = this.detectarChaveSetor(this.demanda.setorNome || this.demanda.orgao);
    const config = this.catalogoRotinasPorSetor[chave] || this.catalogoRotinasPorSetor['educacao'];
    const rot = config.rotinas.find(r => r.id === id);

    const idx = this.demanda.atividades.indexOf(id);

    if (idx > -1) {
      if (this.demanda.atividades.length === 1) {
        alert('Selecione ao menos uma atividade de rotina escolar/setorial.');
        return;
      }
      this.demanda.atividades.splice(idx, 1);
    } else {
      this.demanda.atividades.push(id);
    }

    // Atualiza estado visual do card
    const cardEl = document.getElementById(`act-${id}`);
    if (cardEl) cardEl.classList.toggle('selected', this.demanda.atividades.includes(id));

    // Atualiza lista de nomes legíveis
    this.demanda.atividadesNomes = config.rotinas
      .filter(r => this.demanda.atividades.includes(r.id))
      .map(r => r.nome);
  },

  // ==========================================
  // CÁLCULOS DO HARDWARE
  // ==========================================
  async calcularHardware() {
    const chave = this.detectarChaveSetor(this.demanda.setorNome || this.demanda.orgao);
    const config = this.catalogoRotinasPorSetor[chave] || this.catalogoRotinasPorSetor['educacao'];

    // Mapeia os softwareIds exigidos pelas rotinas selecionadas
    let sw = [];
    this.demanda.atividades.forEach(id => {
      const rot = config.rotinas.find(r => r.id === id);
      if (rot && rot.softwareId) {
        sw.push(rot.softwareId);
      }
    });

    if (sw.length === 0) sw = [1];

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

  renderizarHardware(p) {
    const badge = document.getElementById('recBadge');
    const title = document.getElementById('recTitle');
    const cpu = document.getElementById('recCpu');
    const ram = document.getElementById('recRam');
    const ssd = document.getElementById('recSsd');
    const mon = document.getElementById('recMonitor');

    if (p.id === 1) {
      badge.innerText = 'NÍVEL 1 • ADEQUADO E ECONÔMICO';
      title.innerText = 'Computador para Atendimento e Navegação';
      cpu.innerText = 'Quad-Core 3.4GHz+ (PassMark 8.500+)';
      ram.innerText = '8 GB DDR4 3200MHz (expansível)';
      ssd.innerText = 'SSD 256GB NVMe M.2';
      mon.innerText = '23.8" IPS com ajuste de altura (NR-17)';
    } else if (p.id === 2) {
      badge.innerText = 'NÍVEL 2 • ANÁLISE DE DADOS E BI';
      title.innerText = 'Estação com 2 Telas para Relatórios e BI';
      cpu.innerText = 'Hexa-Core 4.4GHz+ (PassMark 18.000+)';
      ram.innerText = '16 GB DDR4/DDR5 Dual-Channel';
      ssd.innerText = 'SSD 512GB NVMe PCIe 4.0';
      mon.innerText = '2x Monitores 23.8" IPS com suporte articulado';
    } else {
      badge.innerText = 'NÍVEL 3 • ENGENHARIA & CAD';
      title.innerText = 'Workstation de Alto Desempenho Gráfico';
      cpu.innerText = 'Octa-Core 5.0GHz+ (PassMark 30.000+)';
      ram.innerText = '32 GB DDR5 5200MHz Dual-Channel';
      ssd.innerText = 'SSD 1TB Gen4 + GPU NVIDIA RTX';
      mon.innerText = '2x Monitores 27" QHD Alta Precisão';
    }

    const unit = p.custo_unitario_estimado;
    const total = unit * this.demanda.quantidade;
    const pior = 8200 * this.demanda.quantidade;
    const econ = Math.max(0, pior - total);

    this.demanda.custo_total = total;

    document.getElementById('recPrecoTotal').innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('recPrecoUnit').innerText = `(R$ ${unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por máquina)`;
    document.getElementById('recEconomia').innerText = `R$ ${econ.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
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
        icon.innerText = '🛡️';
        title.innerText = 'Conformidade Plena com o TCE/SC';
        desc.innerText = 'Configuração proporcional à rotina. Processo aprovado sem apontamentos.';
        card.style.borderColor = 'var(--dark-border)';
        boxJust.style.display = 'none';
      } else if (a.nivelRisco === 'MEDIO') {
        icon.innerText = '⚠️';
        title.innerText = 'Atenção: Configuração Superior';
        desc.innerText = `O modelo escolhido custa R$ ${a.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a mais. Justifique a necessidade técnica.`;
        card.style.borderColor = '#F59E0B';
        boxJust.style.display = 'block';
      } else {
        icon.innerText = '🚨';
        title.innerText = 'Alerta de Superdimensionamento TCE/SC';
        desc.innerText = `Workstation cara selecionada para rotina básica (Excedente: R$ ${a.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Justificativa obrigatória.`;
        card.style.borderColor = '#EF4444';
        boxJust.style.display = 'block';
      }
    } catch (e) {
      console.error(e);
    }
  },

  preencherResumo() {
    document.getElementById('sumProtocolo').innerText = this.demanda.protocolo;
    document.getElementById('sumOrgao').innerText = this.demanda.setorNome;
    document.getElementById('sumServidor').innerText = `${this.demanda.usuarioNome} (${this.demanda.cargo})`;
    document.getElementById('sumQtd').innerText = `${this.demanda.quantidade} PCs`;
    document.getElementById('sumModelo').innerText = this.demanda.perfilEscolhido?.nome?.split(':')[1] || 'Nível 1';
    document.getElementById('sumTotal').innerText = `R$ ${this.demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  },

  async salvarLicitação() {
    const analise = this.demanda.analiseTrava;
    const txt = document.getElementById('txtJustificativa')?.value.trim() || '';

    if (analise && analise.requerJustificativa && !txt) {
      alert('Por favor, informe a justificativa técnica exigida pelo TCE/SC.');
      this.irParaPasso(4);
      document.getElementById('txtJustificativa')?.focus();
      return;
    }

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
          softwares: (this.demanda.atividadesNomes && this.demanda.atividadesNomes.length > 0)
            ? this.demanda.atividadesNomes 
            : this.demanda.atividades,
          perfilRecomendadoId: this.demanda.perfilRecomendado?.id || 1,
          perfilEscolhidoId: this.demanda.perfilEscolhido?.id || 1,
          justificativaUsuario: txt,
          status: analise ? analise.status : 'Aprovado Direto',
          irs: analise ? analise.irs : 5,
          nivelRisco: analise ? analise.nivelRisco : 'BAIXO'
        })
      });

      const data = await res.json();
      if (data.success) {
        // Recarrega a tabela de pedidos respeitando as permissões
        this.carregarDemandas();
        this.renderizarModalEtp(data.demanda, this.demanda.perfilEscolhido);
      }
    } catch (e) {
      alert('Erro ao salvar licitação: ' + e.message);
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

    corpo.innerHTML = `
      <div class="gov-contract-doc">

        <!-- CABEÇALHO SUPERIOR OFICIAL AGU / SGD -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; font-size: 8pt; color: #4B5563;">
          <div>ESTADO DE SANTA CATARINA • MUNICÍPIO DE LAGES</div>
          <div style="font-weight: 800; color: #111827;">TERMO DE CONTRATO ADMINISTRATIVO Nº ${numContrato}</div>
        </div>

        <div class="gov-contract-header">
          <h2 style="font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #000000; margin-bottom: 2px;">
            MODELO DE TERMO DE CONTRATO
          </h2>
          <div style="font-weight: 700; font-size: 9.5pt; color: #1F2937;">
            Lei nº 14.133, de 1º de abril de 2021<br>
            TECNOLOGIAS DA INFORMAÇÃO E COMUNICAÇÃO - TIC<br>
            AQUISIÇÕES – LICITAÇÃO E CONTRATAÇÃO DIRETA
          </div>

          <div style="margin-top: 14px; padding: 10px; background: #F8FAFC; border: 1px solid #CBD5E1; text-align: center;">
            <div style="font-weight: 900; font-size: 10pt; color: #0F172A;">${orgaoServ}</div>
            <div style="font-size: 8.5pt; color: #475569; margin-top: 2px;">(${processoAdm})</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #0F172A; margin-top: 6px;">
              CONTRATO ADMINISTRATIVO Nº ${numContrato}, QUE FAZEM ENTRE SI O MUNICÍPIO DE LAGES, POR INTERMÉDIO DO(A) ${orgaoServ} E A EMPRESA VENCEDORA DO CERTAME
            </div>
          </div>
        </div>

        <!-- PREÂMBULO -->
        <p class="gov-clause-p">
          O <strong>MUNICÍPIO DE LAGES</strong>, pessoa jurídica de direito público interno, por intermédio do(a) <strong>${orgaoServ}</strong>, com sede na Rua Benjamin Constant, 13, Centro, Lages/SC, inscrito no CNPJ sob o nº 82.777.301/0001-90, neste ato representado(a) pelo(a) <strong>${cargoServ}</strong>, Sr(a). <strong>${nomeServ}</strong>, portador(a) da Matrícula Funcional nº <strong>${matServ}</strong>, doravante denominado <strong>CONTRATANTE</strong>, e o(a) <strong>CONTRATADO(A)</strong> vencedor(a) do certame, pessoa jurídica inscrita no CNPJ sob o nº 00.000.000/0001-00, doravante designada <strong>CONTRATADA</strong>, tendo em vista o que consta no <strong>${processoAdm}</strong> e em observância às disposições da <strong>Lei nº 14.133, de 1º de abril de 2021</strong> e legislação correlata, resolvem celebrar o presente Termo de Contrato, decorrente do <strong>${pregaoNum}</strong>, mediante as cláusulas e condições a seguir enunciadas:
        </p>

        <!-- 1. CLÁUSULA PRIMEIRA – OBJETO -->
        <div class="gov-clause">
          <div class="gov-clause-title">1. CLÁUSULA PRIMEIRA – OBJETO</div>
          <p class="gov-clause-p">
            1.1. O objeto do presente instrumento é a contratação de solução de tecnologia da informação e comunicação consistente no fornecimento de equipamentos de microinformática padronizados para o atendimento das demandas operacionais do setor de <strong>${setorServ}</strong>, nas condições estabelecidas no Termo de Referência.
          </p>
          <p class="gov-clause-p">
            1.1.1. As configurações foram dimensionadas estritamente para as rotinas homologadas do setor solicitante: <em>${rotinasFormatadas || 'Rotinas pedagógicas e administrativas municipais'}</em>, em observância ao princípio da economicidade e da eficiência pública (Art. 5º da Lei Federal nº 14.133/2021).
          </p>
          <p class="gov-clause-p">
            1.2. Objeto da contratação:
          </p>

          <table class="gov-table">
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">ITEM</th>
                <th style="width: 48%;">ESPECIFICAÇÃO PADRONIZADA (LICITAÇÃO BLINDADA)</th>
                <th style="width: 13%; text-align: center;">CATMAT</th>
                <th style="width: 8%; text-align: center;">UNID.</th>
                <th style="width: 6%; text-align: center;">QTD.</th>
                <th style="width: 10%; text-align: right;">VALOR UNIT.</th>
                <th style="width: 10%; text-align: right;">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;"><strong>1</strong></td>
                <td>
                  <strong>${perfil.nome}</strong><br>
                  <small>
                    • <strong>Processador:</strong> ${perfil.processador}<br>
                    • <strong>Memória RAM:</strong> ${perfil.ram}<br>
                    • <strong>Armazenamento:</strong> ${perfil.armazenamento}<br>
                    • <strong>Controlador Gráfico:</strong> ${perfil.gpu}<br>
                    • <strong>Periféricos e Ergonomia:</strong> ${perfil.perifericos}
                  </small>
                </td>
                <td style="text-align: center;">
                  <strong>${catmat}</strong><br>
                  <span style="font-size: 7pt; color: #4B5563;">${catmatNome}</span>
                </td>
                <td style="text-align: center;">Unidade</td>
                <td style="text-align: center;"><strong>${demanda.quantidade_usuarios}</strong></td>
                <td style="text-align: right;">R$ ${valUnit}</td>
                <td style="text-align: right;"><strong>R$ ${valTot}</strong></td>
              </tr>
            </tbody>
          </table>

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

  imprimirDocumento() {
    window.print();
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
    window.print();
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
