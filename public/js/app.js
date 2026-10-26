// app.js - Trez.cloud ERP + Stepper Wizard em Passos + Login Dark (DimensionaTI SC - Lages)
const app = {
  usuarioLogado: null,
  abaAtiva: 'licitacoes',
  passoAtual: 1,
  totalPassos: 5,
  demandasCarregadas: [],

  lotacaoTemp: {
    setorNome: 'Escolas Municipais (SME Lages)',
    orgao: 'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
    cargo: 'Professora e Coordenadora'
  },

  demanda: {
    usuarioId: null,
    usuarioNome: '',
    usuarioMatricula: '',
    setorNome: 'Escolas Municipais (SME Lages)',
    orgao: 'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
    cargo: 'Professora e Coordenadora',
    municipio: 'Lages',
    quantidade: 10,
    atividades: [1, 2],
    perfilRecomendado: null,
    perfilEscolhido: null,
    analiseTrava: null,
    protocolo: 'ETP-2026-0000',
    custo_total: 22000.00
  },

  perfisDisponiveis: [],
  chartRiscoInst: null,
  chartOrgaosInst: null,

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================
  async init() {
    await this.carregarPerfisBackend();
    this.renderizarDotGrid();
    this.verificarSessaoSalva();
  },

  // ==========================================
  // CONTROLE DE TELAS (LOGIN -> LOTAÇÃO -> APP)
  // ==========================================
  mostrarTela(telaId) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    const tela = document.getElementById(telaId);
    if (tela) tela.classList.add('active');
  },

  verificarSessaoSalva() {
    try {
      const salva = localStorage.getItem('dimensionati_sessao');
      if (salva) {
        const sessao = JSON.parse(salva);
        if (sessao && sessao.id && sessao.nome) {
          this.usuarioLogado = sessao;
          this.aplicarDadosNoApp(sessao);
          this.mostrarTela('screen-app');
          this.abrirAba('licitacoes');
          return;
        }
      }
    } catch (e) {}
    this.mostrarTela('screen-login');
  },

  // ==========================================
  // LOGIN DARK FULLSCREEN
  // ==========================================
  async fazerLogin(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    const errorMsg = document.getElementById('loginErrorMsg');
    const btnLogin = document.getElementById('btnLogin');

    errorMsg.textContent = '';

    if (!email || !email.includes('@')) {
      errorMsg.textContent = 'Por favor, informe um e-mail válido.';
      return;
    }
    if (!senha) {
      errorMsg.textContent = 'Por favor, informe sua senha.';
      return;
    }

    btnLogin.textContent = 'Entrando...';
    btnLogin.disabled = true;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (!res.ok) {
        errorMsg.textContent = data.error || 'Erro ao fazer login.';
        return;
      }

      this.usuarioLogado = data.usuario;

      // Preenche campos da lotação
      const wpNome = document.getElementById('wpNome');
      const wpMatricula = document.getElementById('wpMatricula');
      const wpCargo = document.getElementById('wpCargo');

      if (wpNome) wpNome.value = data.usuario.nome || '';
      if (wpMatricula) wpMatricula.value = data.usuario.matricula || '';
      if (wpCargo) wpCargo.value = data.usuario.cargo || 'Servidor Público';

      if (data.usuario.setor) {
        this.preselecionarLotacao(data.usuario.setor);
      }

      this.mostrarTela('screen-workplace');
    } catch (e) {
      errorMsg.textContent = 'Erro de conexão com o servidor local.';
    } finally {
      btnLogin.innerHTML = 'Entrar no painel <span class="login-arrow">↗</span>';
      btnLogin.disabled = false;
    }
  },

  toggleSenha() {
    const input = document.getElementById('loginSenha');
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  // ==========================================
  // CONFIRMAÇÃO DE LOTAÇÃO
  // ==========================================
  selecionarLotacao(setorNome, orgao, cargo, elemento) {
    document.querySelectorAll('#wpGridSetores .wp-pill').forEach(p => p.classList.remove('active'));
    if (elemento) elemento.classList.add('active');

    this.lotacaoTemp.setorNome = setorNome;
    this.lotacaoTemp.orgao = orgao;
    this.lotacaoTemp.cargo = cargo;

    const wpCargo = document.getElementById('wpCargo');
    if (wpCargo) wpCargo.value = cargo;
  },

  preselecionarLotacao(setor) {
    const pills = document.querySelectorAll('#wpGridSetores .wp-pill');
    pills.forEach(p => p.classList.remove('active'));

    if (setor.includes('Educação') || setor.includes('SME')) {
      pills[0]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Escolas Municipais (SME Lages)', orgao: 'Prefeitura do Município de Lages - Secretaria Municipal de Educação', cargo: 'Professora e Coordenadora' };
    } else if (setor.includes('Saúde') || setor.includes('UBS')) {
      pills[1]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Saúde & Unidades Básicas (UBS Lages)', orgao: 'Prefeitura do Município de Lages - Secretaria Municipal de Saúde', cargo: 'Enfermeira Chefe / Gestora UBS' };
    } else if (setor.includes('Administração')) {
      pills[2]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Administrativo & Atendimento (Prefeitura)', orgao: 'Prefeitura do Município de Lages - Secretaria de Administração', cargo: 'Auxiliar Administrativo' };
    } else if (setor.includes('Fazenda') || setor.includes('Finanças')) {
      pills[3]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Fazenda & Finanças de Lages', orgao: 'Prefeitura do Município de Lages - Secretaria da Fazenda', cargo: 'Auditor Fiscal da Receita' };
    } else if (setor.includes('Obras') || setor.includes('SEPLAN')) {
      pills[4]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Planejamento & Obras (SEPLAN Lages)', orgao: 'Prefeitura do Município de Lages - Secretaria de Planejamento e Obras', cargo: 'Engenheiro Civil - Fiscal' };
    } else if (setor.includes('Câmara')) {
      pills[5]?.classList.add('active');
      this.lotacaoTemp = { setorNome: 'Câmara de Vereadores de Lages', orgao: 'Câmara Municipal de Vereadores de Lages', cargo: 'Assessor Legislativo' };
    } else {
      pills[0]?.classList.add('active');
    }
  },

  async confirmarLotacao() {
    const nome = document.getElementById('wpNome').value.trim();
    const cargo = document.getElementById('wpCargo').value.trim();
    const matricula = document.getElementById('wpMatricula').value.trim();

    if (!nome) {
      alert('Por favor, informe seu nome completo.');
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
          cargo: cargo || this.lotacaoTemp.cargo,
          orgao: this.lotacaoTemp.orgao,
          setor: this.lotacaoTemp.setorNome,
          matricula: matricula || this.usuarioLogado.matricula
        })
      });
    } catch (e) {
      console.warn('Erro ao salvar no banco:', e);
    }

    const sessao = {
      ...this.usuarioLogado,
      nome,
      cargo: cargo || this.lotacaoTemp.cargo,
      orgao: this.lotacaoTemp.orgao,
      setor: this.lotacaoTemp.setorNome,
      matricula: matricula || this.usuarioLogado.matricula,
      municipio: 'Lages'
    };

    this.usuarioLogado = sessao;
    localStorage.setItem('dimensionati_sessao', JSON.stringify(sessao));

    this.aplicarDadosNoApp(sessao);
    this.mostrarTela('screen-app');
    this.abrirAba('licitacoes');
  },

  // ==========================================
  // DADOS NO PAINEL TREZ.CLOUD
  // ==========================================
  aplicarDadosNoApp(usuario) {
    // Iniciais do avatar
    const partes = usuario.nome.trim().split(' ');
    let ini = 'AD';
    if (partes.length >= 2) {
      ini = (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    } else if (partes.length === 1) {
      ini = partes[0].substring(0, 2).toUpperCase();
    }
    document.getElementById('userInitials').innerText = ini;
    document.getElementById('userDdNome').innerText = usuario.nome;
    document.getElementById('userDdCargo').innerText = `${usuario.cargo} • ${usuario.setor || 'Lages'}`;

    // Atualiza demanda local
    this.demanda.usuarioId = usuario.id;
    this.demanda.usuarioNome = usuario.nome;
    this.demanda.usuarioMatricula = usuario.matricula;
    this.demanda.orgao = usuario.orgao;
    this.demanda.setorNome = usuario.setor;
    this.demanda.cargo = usuario.cargo;

    // Atualiza dados no Wizard (Passo 1)
    const wizNome = document.getElementById('wizNomeServidor');
    const wizCargo = document.getElementById('wizCargoServidor');
    const wizMat = document.getElementById('wizMatriculaServidor');
    if (wizNome) wizNome.value = usuario.nome;
    if (wizCargo) wizCargo.value = usuario.cargo;
    if (wizMat) wizMat.value = usuario.matricula;

    // Seleciona o órgão no select do Wizard
    const sel = document.getElementById('wizSelectOrgao');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value.includes(usuario.setor)) {
          sel.selectedIndex = i;
          break;
        }
      }
    }
  },

  toggleUserMenu() {
    const dd = document.getElementById('userDropdown');
    dd.classList.toggle('show');
  },

  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem('dimensionati_sessao');
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('show');
    this.mostrarTela('screen-login');
  },

  // ==========================================
  // CONTROLE DE ABAS (TREZ.CLOUD SUB-TABS)
  // ==========================================
  abrirAba(abaId) {
    this.abaAtiva = abaId;

    // Fechar dropdown de usuário
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('show');

    // Panes
    document.querySelectorAll('.trez-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`pane-${abaId}`)?.classList.add('active');

    // Sub-tabs
    document.querySelectorAll('.trez-sub-tab').forEach(t => t.classList.remove('active'));

    // Top menu items
    document.querySelectorAll('.trez-menu-item').forEach(m => m.classList.remove('active'));

    if (abaId === 'home') {
      document.getElementById('tabHome')?.classList.add('active');
    } else if (abaId === 'licitacoes') {
      document.getElementById('tabLicitacoes')?.classList.add('active');
      document.getElementById('menuLicitacoes')?.classList.add('active');
      this.carregarDemandasBackend();
    } else if (abaId === 'wizard') {
      const tabNovo = document.getElementById('tabNovo');
      if (tabNovo) {
        tabNovo.style.display = 'flex';
        tabNovo.classList.add('active');
      }
    } else if (abaId === 'auditor') {
      const tabAuditor = document.getElementById('tabAuditor');
      if (tabAuditor) {
        tabAuditor.style.display = 'flex';
        tabAuditor.classList.add('active');
      }
      document.getElementById('menuAuditor')?.classList.add('active');
      this.carregarDadosAuditor();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  iniciarNovoProcesso() {
    // Gera protocolo sequencial preview
    const num = Math.floor(1000 + Math.random() * 9000);
    this.demanda.protocolo = `ETP-2026-${num}`;
    const idElem = document.getElementById('wizIdentificador');
    if (idElem) idElem.value = this.demanda.protocolo;

    this.abrirAba('wizard');
    this.irParaPasso(1);
  },

  // ==========================================
  // STEPPER WIZARD EM PASSOS (IMAGEM 3)
  // ==========================================
  irParaPasso(passo) {
    this.passoAtual = passo;

    // Atualiza indicadores visuais do Stepper
    for (let i = 1; i <= this.totalPassos; i++) {
      const ind = document.getElementById(`stepIndicator-${i}`);
      const pane = document.getElementById(`wizardPane-${i}`);

      if (ind) {
        if (i === passo) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      }

      if (pane) {
        if (i === passo) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      }
    }

    // Botão Voltar
    const btnVoltar = document.getElementById('btnWizardVoltar');
    if (btnVoltar) {
      btnVoltar.style.visibility = passo > 1 ? 'visible' : 'hidden';
    }

    // Botão Próximo / Finalizar
    const btnProx = document.getElementById('btnWizardProximo');
    if (btnProx) {
      if (passo === this.totalPassos) {
        btnProx.innerHTML = 'EMITIR MINUTA & SALVAR ✓';
        btnProx.style.background = '#10B981';
      } else {
        btnProx.innerHTML = 'PRÓXIMO &gt;';
        btnProx.style.background = 'var(--trez-purple)';
      }
    }

    // Atualiza cálculos contextuais conforme o passo
    if (passo === 3) {
      this.calcularConfiguracaoInterna();
    } else if (passo === 4) {
      this.aoMudarNivelManual();
    } else if (passo === 5) {
      this.preencherResumoFinal();
    }
  },

  passoAnterior() {
    if (this.passoAtual > 1) {
      this.irParaPasso(this.passoAtual - 1);
    }
  },

  async proximoPasso() {
    if (this.passoAtual === this.totalPassos) {
      // Salva a licitação e abre a minuta
      await this.salvarEFinalizarLicitação();
    } else {
      this.irParaPasso(this.passoAtual + 1);
    }
  },

  aoMudarOrgaoWizard(val) {
    const [setor, orgao, cargo] = val.split('|');
    this.demanda.setorNome = setor;
    this.demanda.orgao = orgao;
    this.demanda.cargo = cargo;

    const wizCargo = document.getElementById('wizCargoServidor');
    if (wizCargo) wizCargo.value = cargo;
  },

  definirQuantidade(qtd, elemento) {
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
    if (elemento) elemento.classList.add('active');

    this.demanda.quantidade = qtd;
    const inputCustom = document.getElementById('inputQtdCustom');
    if (inputCustom) inputCustom.value = qtd;
  },

  definirQuantidadeCustom(qtd) {
    const val = parseInt(qtd) || 1;
    this.demanda.quantidade = Math.max(1, Math.min(500, val));
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
  },

  toggleAtividade(id) {
    const card = document.getElementById(`act-${id}`);
    const index = this.demanda.atividades.indexOf(id);

    if (index > -1) {
      if (this.demanda.atividades.length === 1) {
        alert('Selecione pelo menos uma atividade realizada no computador.');
        return;
      }
      this.demanda.atividades.splice(index, 1);
      if (card) card.classList.remove('selected');
    } else {
      this.demanda.atividades.push(id);
      if (card) card.classList.add('selected');
    }
  },

  // ==========================================
  // MOTOR DE CÁLCULO E AUDITORIA
  // ==========================================
  async calcularConfiguracaoInterna() {
    const mapaSoftwares = {
      1: [1],
      2: [2, 3],
      3: [2, 4],
      4: [5, 6],
      5: [7, 8],
      6: [7, 8]
    };

    let softwareIds = [];
    this.demanda.atividades.forEach(actId => {
      if (mapaSoftwares[actId]) {
        softwareIds = softwareIds.concat(mapaSoftwares[actId]);
      }
    });

    try {
      const res = await fetch('/api/calcular-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          softwareIds,
          quantidadeUsuarios: this.demanda.quantidade
        })
      });

      const calc = await res.json();
      this.demanda.perfilRecomendado = calc.perfil;
      this.demanda.perfilEscolhido = calc.perfil;

      this.renderizarResultado(calc.perfil);

      const selManual = document.getElementById('selectNivelManual');
      if (selManual) selManual.value = calc.perfil.id.toString();
    } catch (e) {
      console.error(e);
    }
  },

  renderizarResultado(perfil) {
    const titulo = document.getElementById('tituloPerfilAmigavel');
    const desc = document.getElementById('descPerfilAmigavel');
    const badge = document.getElementById('badgeNivelRecomendado');

    const perkCpu = document.getElementById('perkCpu');
    const perkRam = document.getElementById('perkRam');
    const perkMonitor = document.getElementById('perkMonitor');
    const perkKit = document.getElementById('perkKit');

    if (perfil.id === 1) {
      badge.innerText = '✅ NÍVEL 1 - ECONÔMICO E ADEQUADO';
      titulo.innerText = 'Computador para Atendimento e Rotinas de Escritório';
      desc.innerText = 'Configuração econômica dimensionada para a realidade da administração de Lages. Rápida para o dia a dia, sem desperdício de dinheiro público e com especificações blindadas para o edital.';
      perkCpu.innerText = 'Processador Quad-Core eficiente (9.500+ PassMark) com inicialização em segundos.';
      perkRam.innerText = '8 GB ou 16 GB DDR4 Dual-Channel para abrir várias abas sem travar.';
      perkMonitor.innerText = 'Tela 23.8" Full HD IPS com ajuste vertical de altura (Norma NR-17).';
      perkKit.innerText = 'Fonte 80 Plus certificada e garantia presencial de 36 meses em Lages.';
    } else if (perfil.id === 2) {
      badge.innerText = '📈 NÍVEL 2 - ANÁLISE DE DADOS E GESTÃO';
      titulo.innerText = 'Computador com Duas Telas para Relatórios e Dados';
      desc.innerText = 'Projetado para auditores e equipes que trabalham com relatórios contábeis pesados e Power BI em Lages. Já inclui suporte a dois monitores para agilizar o trabalho.';
      perkCpu.innerText = 'Processador Hexa/Octa-Core de alto desempenho para cálculos rápidos.';
      perkRam.innerText = '16 GB a 32 GB de memória para suportar grandes bases de dados.';
      perkMonitor.innerText = '2x Monitores 23.8" Full HD IPS com suporte ergonômico articulado.';
      perkKit.innerText = 'Mouse de alta precisão e nobreak senoidal puro para proteger os dados.';
    } else {
      badge.innerText = '📐 NÍVEL 3 - ENGENHARIA E OBRAS (SEPLAN)';
      titulo.innerText = 'Workstation de Alto Desempenho para Projetos e Obras';
      desc.innerText = 'Estação de trabalho potente com placa de vídeo dedicada RTX, recomendada exclusivamente para engenheiros de obras públicas (AutoCAD Civil 3D, QGIS e mapas de Lages).';
      perkCpu.innerText = 'Processador Octa-Core de última geração (32.000+ PassMark).';
      perkRam.innerText = '32 GB a 64 GB de memória DDR5 para plantas pesadas.';
      perkMonitor.innerText = '2x Monitores 27" de alta definição com fidelidade de cores sRGB.';
      perkKit.innerText = 'Placa de vídeo profissional NVIDIA RTX para projetos e maquetes 3D.';
    }

    const custoUnit = perfil.custo_unitario_estimado;
    const custoTotal = custoUnit * this.demanda.quantidade;
    const custoPiorCenario = 9800.00 * this.demanda.quantidade;
    const economia = Math.max(0, custoPiorCenario - custoTotal);

    this.demanda.custo_total = custoTotal;

    document.getElementById('resumoCustoTotal').innerText = `R$ ${custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('resumoCustoUnit').innerText = `(R$ ${custoUnit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por computador completo)`;
    document.getElementById('resumoEconomiaTexto').innerHTML = `
      Economia de <strong>R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> aos cofres públicos de Lages em relação a máquinas de alto desempenho desnecessárias.
    `;
  },

  async aoMudarNivelManual() {
    const sel = document.getElementById('selectNivelManual');
    const perfilEscolhidoId = parseInt(sel.value);

    try {
      const res = await fetch('/api/analisar-trava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfilRecomendadoId: this.demanda.perfilRecomendado?.id || 1,
          perfilEscolhidoId: perfilEscolhidoId,
          quantidadeUsuarios: this.demanda.quantidade
        })
      });

      const analise = await res.json();
      this.demanda.analiseTrava = analise;
      this.demanda.perfilEscolhido = analise.perfilEsc;

      const alertBox = document.getElementById('friendlyLockAlert');
      const alertTitle = document.getElementById('lockAlertTitle');
      const alertBody = document.getElementById('lockAlertBody');
      const boxJust = document.getElementById('boxJustificativaSimples');

      if (analise.nivelRisco === 'BAIXO') {
        alertBox.style.background = '#ECFDF5';
        alertBox.style.borderColor = '#A7F3D0';
        alertTitle.style.color = '#065F46';
        alertTitle.innerText = '🛡️ Conformidade Plena com as Diretrizes do TCE/SC';
        alertBody.style.color = '#047857';
        alertBody.innerText = 'A configuração escolhida está alinhada às atividades diárias. Não há indício de superdimensionamento ou sobrepreço para o erário de Lages.';
        boxJust.style.display = 'none';
      } else if (analise.nivelRisco === 'MEDIO') {
        alertBox.style.background = '#FFFBEB';
        alertBox.style.borderColor = '#FDE68A';
        alertTitle.style.color = '#B45309';
        alertTitle.innerText = '⚠️ Atenção: Configuração Acima do Necessário';
        alertBody.style.color = '#78350F';
        alertBody.innerHTML = `
          Você escolheu uma máquina de Nível 2. Para a rotina cadastrada, o Nível 1 já atende plenamente e economiza <strong>R$ ${analise.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> dos cofres municipais.
        `;
        boxJust.style.display = 'block';
      } else {
        alertBox.style.background = '#FEF2F2';
        alertBox.style.borderColor = '#FECACA';
        alertTitle.style.color = '#991B1B';
        alertTitle.innerText = '🚨 ALERTA DO TRIBUNAL DE CONTAS (TCE/SC): Superdimensionamento em Lages!';
        alertBody.style.color = '#7F1D1D';
        alertBody.innerHTML = `
          Você selecionou uma Workstation de Engenharia (Nível 3). Ela custa <strong>R$ ${analise.diferencaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a mais</strong> para rotinas administrativas sem ganho prático de produtividade.
        `;
        boxJust.style.display = 'block';
      }

    } catch (e) {
      console.error(e);
    }
  },

  preencherResumoFinal() {
    document.getElementById('resumoWizOrgao').innerText = this.demanda.orgao;
    document.getElementById('resumoWizServidor').innerText = `${this.demanda.usuarioNome} (${this.demanda.cargo})`;
    document.getElementById('resumoWizQtd').innerText = this.demanda.quantidade;
    document.getElementById('resumoWizModelo').innerText = this.demanda.perfilEscolhido?.nome || 'Nível 1';
    
    const unit = this.demanda.perfilEscolhido?.custo_unitario_estimado || 2200;
    const tot = unit * this.demanda.quantidade;
    this.demanda.custo_total = tot;

    document.getElementById('resumoWizValorUnit').innerText = `R$ ${unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('resumoWizValorTotal').innerText = `R$ ${tot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  },

  async salvarEFinalizarLicitação() {
    const analise = this.demanda.analiseTrava;
    const txtJust = document.getElementById('inputJustificativaTexto') ? document.getElementById('inputJustificativaTexto').value.trim() : '';

    if (analise && analise.requerJustificativa && !txtJust) {
      alert('⚠️ Por favor, informe a justificativa formal exigida pelo Tribunal de Contas para esta configuração.');
      this.irParaPasso(4);
      document.getElementById('inputJustificativaTexto').focus();
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
          softwares: this.demanda.atividades.map(id => `Atividade #${id}`),
          perfilRecomendadoId: this.demanda.perfilRecomendado?.id || 1,
          perfilEscolhidoId: this.demanda.perfilEscolhido?.id || 1,
          justificativaUsuario: txtJust,
          status: analise ? analise.status : 'Aprovado Direto',
          irs: analise ? analise.irs : 5,
          nivelRisco: analise ? analise.nivelRisco : 'BAIXO'
        })
      });

      const data = await res.json();
      if (data.success) {
        this.demanda.protocolo = data.demanda.protocolo;
        this.demanda.custo_total = data.demanda.custo_total;

        // Recarrega lista e abre minuta
        await this.carregarDemandasBackend();
        this.renderizarModalEtp(data.demanda, this.demanda.perfilEscolhido);
      }
    } catch (e) {
      alert('Erro ao formalizar licitação: ' + e.message);
    }
  },

  // ==========================================
  // TABELA DE LICITAÇÕES (TREZ.CLOUD ERP)
  // ==========================================
  async carregarDemandasBackend() {
    try {
      const res = await fetch('/api/demandas');
      this.demandasCarregadas = await res.json();
      this.renderizarTabelaLicitacoes(this.demandasCarregadas);
    } catch (e) {
      console.error('Erro ao buscar demandas:', e);
    }
  },

  renderizarTabelaLicitacoes(demandas) {
    const tbody = document.getElementById('tbodyLicitacoesTrez');
    if (!tbody) return;

    if (!demandas || demandas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 28px; color: #64748B;">Nenhum processo licitatório encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = demandas.map(d => {
      let statusClass = 'autorizada';
      let statusLabel = 'AUTORIZADA';

      if (d.status === 'Sob Análise' || d.nivel_risco === 'MEDIO') {
        statusClass = 'sob-analise';
        statusLabel = 'SOB ANÁLISE';
      } else if (d.status === 'Bloqueado TCE' || d.nivel_risco === 'ALTO') {
        statusClass = 'cancelada';
        statusLabel = 'CANCELADA';
      }

      let catmat = '463821';
      if (d.perfil_escolhido_id === 2) catmat = '471209';
      if (d.perfil_escolhido_id === 3) catmat = '482914';

      const dataFormatada = (d.created_at || '').substring(0, 10).split('-').reverse().join('/') || '26/10/2026';

      return `
        <tr>
          <td><strong>${d.id}</strong></td>
          <td><strong style="color: var(--trez-blue);">${d.protocolo}</strong></td>
          <td>${dataFormatada}</td>
          <td>
            <strong>${d.setor}</strong><br>
            <small style="color: #64748B;">${d.orgao}</small>
          </td>
          <td>
            ${d.usuario_nome || 'Servidor'}<br>
            <small style="color: #64748B;">${d.cargo || ''}</small>
          </td>
          <td style="text-align: center;"><code>${catmat}</code></td>
          <td style="text-align: center;">
            <span class="trez-status-pill ${statusClass}">${statusLabel}</span>
          </td>
          <td style="text-align: right; font-weight: 700; color: #0F172A;">
            R$ ${d.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </td>
          <td style="text-align: center;">
            <button class="trez-action-btn-circle" title="Visualizar Minuta Oficial" onclick="app.abrirDossie('${d.protocolo}')">
              •••
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  filtrarTabelaLocal() {
    const busca = (document.getElementById('inputBuscaLicitacao')?.value || '').toLowerCase();
    const orgao = document.getElementById('filtroOrgaoTrez')?.value || '';
    const status = document.getElementById('filtroStatusTrez')?.value || '';

    const filtradas = this.demandasCarregadas.filter(d => {
      const matchBusca = !busca || 
        (d.protocolo || '').toLowerCase().includes(busca) ||
        (d.setor || '').toLowerCase().includes(busca) ||
        (d.orgao || '').toLowerCase().includes(busca) ||
        (d.usuario_nome || '').toLowerCase().includes(busca) ||
        (d.id || '').toString().includes(busca);

      const matchOrgao = !orgao || (d.setor || '').includes(orgao) || (d.orgao || '').includes(orgao);

      let statusReal = 'AUTORIZADA';
      if (d.status === 'Sob Análise' || d.nivel_risco === 'MEDIO') statusReal = 'SOB ANÁLISE';
      if (d.status === 'Bloqueado TCE' || d.nivel_risco === 'ALTO') statusReal = 'CANCELADA';

      const matchStatus = !status || statusReal === status;

      return matchBusca && matchOrgao && matchStatus;
    });

    this.renderizarTabelaLicitacoes(filtradas);
  },

  // ==========================================
  // MODAL DA MINUTA OFICIAL DE CONTRATO (A4)
  // ==========================================
  async abrirDossie(protocolo) {
    try {
      const res = await fetch(`/api/demandas/${protocolo}`);
      const data = await res.json();
      this.renderizarModalEtp(data.demanda, data.perfilEsc);
    } catch (e) {
      alert('Erro ao abrir documento: ' + e.message);
    }
  },

  renderizarModalEtp(demanda, perfil) {
    const modal = document.getElementById('modalEtp');
    const corpo = document.getElementById('corpoDocumentoEtp');

    this.fecharCaixaEmail();

    const ano = new Date().getFullYear();
    const dia = new Date().getDate();
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[new Date().getMonth()];

    const numContrato = demanda.protocolo.replace('ETP-', 'CT-');
    const processoAdm = `Processo Licitatório nº ${demanda.protocolo.replace('ETP-', '')}/${ano} - PML`;

    let catmat = '463821';
    let catmatNome = 'Microcomputador Desktop Tipo I (Administrativo / Atendimento)';
    if (perfil.id === 2) {
      catmat = '471209';
      catmatNome = 'Microcomputador Desktop Tipo II (Análise de Dados / Dual Head)';
    } else if (perfil.id === 3) {
      catmat = '482914';
      catmatNome = 'Estação de Trabalho Workstation Tipo III (Engenharia / Alto Desempenho Gráfico)';
    }

    const valorUnitFmt = demanda.custo_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const valorTotFmt = demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    const nomeServidor = demanda.usuario_nome || (this.usuarioLogado ? this.usuarioLogado.nome : 'Servidor Responsável');
    const matriculaServidor = demanda.usuario_matricula || (this.usuarioLogado ? this.usuarioLogado.matricula : 'MAT-00000/PML');

    corpo.innerHTML = `
      <div class="gov-contract-doc">

        <!-- TIMBRE OFICIAL DA PREFEITURA DE LAGES / SC -->
        <div class="gov-contract-header">
          <div style="font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; color: #374151;">ESTADO DE SANTA CATARINA</div>
          <h2>PREFEITURA DO MUNICÍPIO DE LAGES</h2>
          <p style="font-weight: 700; color: #111827; margin-top: 2px;">${demanda.orgao.toUpperCase()}</p>
          <p style="font-size: 0.78rem; color: #4B5563;">DIRETORIA DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO</p>
          
          <div style="margin-top: 10px; padding: 6px; background: #F3F4F6; border: 1px solid #D1D5DB; font-size: 8.5pt;">
            <strong>MINUTA OFICIAL DE CONTRATO DE TIC • LEI Nº 14.133/2021 (NOVA LEI DE LICITAÇÕES)</strong><br>
            ${processoAdm} • Contrato Administrativo nº ${numContrato}
          </div>
        </div>

        <!-- PREÂMBULO -->
        <p class="gov-clause-p">
          O <strong>MUNICÍPIO DE LAGES</strong>, pessoa jurídica de direito público interno, por intermédio do(a) <strong>${demanda.orgao}</strong>, neste ato representado pelo servidor responsável <strong>${nomeServidor}</strong>, portador da matrícula funcional nº <strong>${matriculaServidor}</strong>, e a empresa vencedora do certame licitatório, inscrita no CNPJ sob o nº 00.000.000/0001-00, doravante designada <strong>CONTRATADA</strong>, em estrita observância à <strong>Lei nº 14.133/2021</strong> e diretrizes preventivas do <strong>Tribunal de Contas de Santa Catarina (TCE/SC)</strong>, celebram o presente contrato sob as cláusulas a seguir:
        </p>

        <!-- CLÁUSULA PRIMEIRA: OBJETO COM ESPECIFICAÇÃO BLINDADA -->
        <div class="gov-clause">
          <div class="gov-clause-title">CLÁUSULA PRIMEIRA – OBJETO E ESPECIFICAÇÃO TÉCNICA PADRONIZADA</div>
          <p class="gov-clause-p">
            Aquisição de equipamentos de informática padronizados para atendimento das necessidades operacionais do setor de <strong>${demanda.setor}</strong>, conforme especificações técnicas e diretrizes de dimensionamento do sistema DimensionaTI SC.
          </p>

          <table class="gov-table">
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">ITEM</th>
                <th style="width: 45%;">ESPECIFICAÇÃO TÉCNICA PADRONIZADA (LICITAÇÃO BLINDADA)</th>
                <th style="width: 14%; text-align: center;">CATMAT</th>
                <th style="width: 8%; text-align: center;">UNID.</th>
                <th style="width: 8%; text-align: center;">QTD.</th>
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
                    • <strong>CPU:</strong> ${perfil.processador}<br>
                    • <strong>RAM:</strong> ${perfil.ram}<br>
                    • <strong>SSD:</strong> ${perfil.armazenamento}<br>
                    • <strong>Vídeo:</strong> ${perfil.gpu}<br>
                    • <strong>Monitor e Ergonomia:</strong> ${perfil.perifericos}
                  </small>
                </td>
                <td style="text-align: center;">
                  <strong>${catmat}</strong><br>
                  <span style="font-size: 7pt; color: #4B5563;">${catmatNome}</span>
                </td>
                <td style="text-align: center;">Unidade</td>
                <td style="text-align: center;"><strong>${demanda.quantidade_usuarios}</strong></td>
                <td style="text-align: right;">R$ ${valorUnitFmt}</td>
                <td style="text-align: right;"><strong>R$ ${valorTotFmt}</strong></td>
              </tr>
            </tbody>
          </table>

          <!-- REQUISITOS TÉCNICOS DETALHADOS -->
          <div class="tech-spec-box">
            <strong>REQUISITOS MÍNIMOS OBRIGATÓRIOS DO FORNECEDOR (CLÁUSULA ANTI-ENTREGA DE PRODUTO INFERIOR):</strong><br>
            • <strong>Placa-mãe e BIOS:</strong> Padrão corporativo OEM desenvolvida pelo mesmo fabricante do equipamento ou com BIOS customizada contendo logo institucional da marca, chip TPM 2.0 de segurança em hardware ativo e UEFI 2.8+ com Secure Boot.<br>
            • <strong>Fonte de Alimentação:</strong> Fonte bivolt automática de alta eficiência energética com certificação mínima <strong>80 Plus Bronze</strong> (eficiência >= 85%) e PFC Ativo (vedada fonte genérica sem certificação).<br>
            • <strong>Monitor e Ergonomia (NR-17):</strong> Painel IPS com ajuste vertical de altura (mínimo 100mm), rotação e inclinação conforme a Norma NR-17 de Ergonomia do Ministério do Trabalho.<br>
            • <strong>Laudos e Certificações na Entrega:</strong> Certificação de Segurança Elétrica (Portaria INMETRO / IEC 62368-1), Compatibilidade Eletromagnética (CISPR 32 / FCC) e Laudo de Ruído Acústico (ISO 7779 / 9296 inferior a 30 dB).<br>
            • <strong>Garantia e Assistência Presencial em Lages/SC:</strong> Garantia técnica integral de <strong>36 (trinta e seis) meses on-site</strong>, com prazo de atendimento no município de Lages de no máximo 48 horas úteis e substituição de peças defeituosas por novas originais.
          </div>
        </div>

        <!-- CLÁUSULA SEGUNDA -->
        <div class="gov-clause">
          <div class="gov-clause-title">CLÁUSULA SEGUNDA – VIGÊNCIA E PRAZOS DE ENTREGA</div>
          <p class="gov-clause-p">
            O prazo de vigência contratual é de <strong>12 (doze) meses</strong>, prorrogável nos termos da Lei nº 14.133/2021. O prazo de entrega dos computadores em Lages/SC é de até <strong>30 (trinta) dias corridos</strong> após a emissão da Ordem de Fornecimento.
          </p>
        </div>

        <!-- CLÁUSULA TERCEIRA -->
        <div class="gov-clause">
          <div class="gov-clause-title">CLÁUSULA TERCEIRA – VALOR CONTRATUAL E CONDIÇÕES DE PAGAMENTO</div>
          <p class="gov-clause-p">
            O valor total da contratação é de <strong>R$ ${valorTotFmt}</strong>, compreendendo frete, impostos e garantia presencial de 3 anos em Lages.
          </p>
        </div>

        <!-- CERTIFICAÇÃO PREVENTIVA TCE/SC -->
        <div style="background: #F9FAFB; border: 1px solid #D1D5DB; padding: 10px 14px; margin-top: 14px; font-size: 8pt; break-inside: avoid;">
          <strong>CERTIFICAÇÃO DE AUDITORIA PREVENTIVA TCE/SC (DIMENSIONATI):</strong><br>
          Índice de Risco de Superdimensionamento (IRS): <strong>${demanda.irs}% — ${demanda.nivel_risco === 'BAIXO' ? '🟢 CONFORMIDADE PLENA' : demanda.nivel_risco === 'MEDIO' ? '🟡 MONITORAMENTO TÉCNICO' : '🔴 ALERTA DE SUPERDIMENSIONAMENTO'}</strong>.<br>
          Dimensionamento aprovado para o cargo de <strong>${demanda.cargo}</strong> ocupado por <strong>${nomeServidor} (Matrícula: ${matriculaServidor})</strong> no município de Lages/SC.
          ${demanda.justificativa_usuario ? `<br><em>Justificativa: "${demanda.justificativa_usuario}"</em>` : ''}
        </div>

        <!-- DATA E ASSINATURAS -->
        <div style="margin-top: 24px; text-align: right; font-weight: 700; font-size: 9pt; break-inside: avoid;">
          Lages/SC, ${dia} de ${mes} de ${ano}.
        </div>

        <div class="gov-signatures-block">
          <div>
            <div class="gov-sig-line">
              <strong>${nomeServidor.toUpperCase()}</strong><br>
              ${demanda.cargo}<br>
              <small>Matrícula nº ${matriculaServidor} • ${demanda.orgao}</small>
            </div>
          </div>
          <div>
            <div class="gov-sig-line">
              <strong>EMPRESA VENCEDORA DO CERTAME</strong><br>
              Representante Legal da CONTRATADA<br>
              <small>Assinatura Digital ICP-Brasil</small>
            </div>
          </div>
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
    const input = document.getElementById('inputEmailDestino');
    if (input) {
      if (this.usuarioLogado && !input.value) {
        input.value = this.usuarioLogado.email;
      }
      input.focus();
    }
  },

  fecharCaixaEmail() {
    const box = document.getElementById('boxEncaminharEmail');
    if (box) box.style.display = 'none';
    const feedback = document.getElementById('emailFeedbackMsg');
    if (feedback) feedback.style.display = 'none';
  },

  enviarPorEmail() {
    const input = document.getElementById('inputEmailDestino');
    const msg = document.getElementById('emailFeedbackMsg');
    const email = input ? input.value.trim() : '';

    if (!email || !email.includes('@') || !email.includes('.')) {
      alert('Por favor, informe um endereço de e-mail válido.');
      if (input) input.focus();
      return;
    }

    const protocolo = this.demanda.protocolo || 'ETP-2026-OFICIAL';
    const orgao = this.demanda.orgao || 'Prefeitura de Lages';

    if (msg) {
      msg.style.display = 'block';
      msg.style.background = '#ECFDF5';
      msg.style.color = '#065F46';
      msg.style.border = '1px solid #A7F3D0';
      msg.innerHTML = `
        ✅ <strong>Minuta Oficial Encaminhada com Sucesso!</strong><br>
        O documento protocolado sob o nº <strong>${protocolo}</strong> foi despachado para <strong>${email}</strong> e anexado aos autos de Lages/SC.
      `;
    }

    const assunto = encodeURIComponent(`Minuta de Contrato TIC Blindada - ${protocolo} - ${orgao}`);
    const corpoEmail = encodeURIComponent(`Prezados,\n\nSegue a minuta oficial do Termo de Contrato de TIC com especificações técnicas blindadas gerada pelo DimensionaTI SC para a Prefeitura de Lages/SC em conformidade com a Lei nº 14.133/2021.\n\n• Protocolo: ${protocolo}\n• Responsável: ${this.demanda.usuarioNome || 'Servidor'}\n• Órgão Contratante: ${orgao}\n• Valor Estimado: R$ ${this.demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nAtenciosamente,\nDiretoria de TIC - Município de Lages`);

    setTimeout(() => {
      window.open(`mailto:${email}?subject=${assunto}&body=${corpoEmail}`, '_blank');
    }, 700);
  },

  imprimirDocumento() {
    this.fecharCaixaEmail();
    window.print();
  },

  // ==========================================
  // PAINEL AUDITOR TCE/SC
  // ==========================================
  async carregarDadosAuditor() {
    try {
      const res = await fetch('/api/estatisticas');
      const stats = await res.json();

      document.getElementById('kpiTotalDemandas').innerText = stats.totalDemandas;
      document.getElementById('kpiTotalEconomia').innerText = `R$ ${stats.totalEconomia.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
      document.getElementById('kpiMediaIrs').innerText = `${stats.mediaIrs}%`;

      const criticos = (stats.riscoContagem.find(r => r.nivel_risco === 'ALTO') || {}).qtd || 0;
      document.getElementById('kpiAlertasCriticos').innerText = criticos;

      this.renderizarGraficosAuditor(stats);
    } catch (e) {
      console.error(e);
    }
  },

  renderizarGraficosAuditor(stats) {
    if (typeof Chart === 'undefined') return;

    const ctxRisco = document.getElementById('chartRiscoClean');
    if (ctxRisco) {
      if (this.chartRiscoInst) this.chartRiscoInst.destroy();

      const b = (stats.riscoContagem.find(r => r.nivel_risco === 'BAIXO') || {}).qtd || 0;
      const m = (stats.riscoContagem.find(r => r.nivel_risco === 'MEDIO') || {}).qtd || 0;
      const a = (stats.riscoContagem.find(r => r.nivel_risco === 'ALTO') || {}).qtd || 0;

      this.chartRiscoInst = new Chart(ctxRisco, {
        type: 'doughnut',
        data: {
          labels: ['Baixo Risco', 'Médio Risco', 'Alto Risco'],
          datasets: [{
            data: [b, m, a],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          cutout: '72%'
        }
      });
    }

    const ctxOrgaos = document.getElementById('chartOrgaosClean');
    if (ctxOrgaos) {
      if (this.chartOrgaosInst) this.chartOrgaosInst.destroy();

      const labels = stats.porOrgao.map(o => o.orgao.length > 20 ? o.orgao.substring(0, 20) + '...' : o.orgao);
      const valores = stats.porOrgao.map(o => o.valor_total);

      this.chartOrgaosInst = new Chart(ctxOrgaos, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: valores,
            backgroundColor: '#2E46C8',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { callback: v => 'R$ ' + (v / 1000) + 'k' } }
          }
        }
      });
    }
  },

  async carregarPerfisBackend() {
    try {
      const res = await fetch('/api/perfis');
      this.perfisDisponiveis = await res.json();
    } catch (e) {
      console.error('Erro ao buscar perfis:', e);
    }
  },

  // CANVAS DE PONTOS DECORATIVOS DO LOGIN DARK
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
        const alpha = Math.max(0.03, 0.5 - (dist / maxDist) * 0.5);
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
