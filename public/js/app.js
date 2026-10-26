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
    atividades: [1, 2],
    perfilRecomendado: null,
    perfilEscolhido: null,
    analiseTrava: null,
    protocolo: 'ETP-2026-0000',
    custo_total: 18500.00
  },

  perfisDisponiveis: [],
  chartRiscoInst: null,
  chartOrgaosInst: null,

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
    const p = u.nome.trim().split(' ');
    let ini = 'ME';
    if (p.length >= 2) ini = (p[0][0] + p[p.length - 1][0]).toUpperCase();
    else if (p.length === 1) ini = p[0].substring(0, 2).toUpperCase();

    document.getElementById('navAvatar').innerText = ini;
    document.getElementById('navNome').innerText = u.nome.split(' ')[0];
    document.getElementById('navSetor').innerText = u.setor || 'Lages';

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
  // LISTAGEM DE LICITAÇÕES
  // ==========================================
  async carregarDemandas() {
    try {
      const res = await fetch('/api/demandas');
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
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 28px; color: var(--dark-muted);">Nenhuma licitação encontrada.</td></tr>`;
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

    if (passo === 3) this.calcularHardware();
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

  toggleAtividade(id) {
    const box = document.getElementById(`act-${id}`);
    const idx = this.demanda.atividades.indexOf(id);

    if (idx > -1) {
      if (this.demanda.atividades.length === 1) {
        alert('Selecione ao menos uma atividade.');
        return;
      }
      this.demanda.atividades.splice(idx, 1);
      box?.classList.remove('selected');
    } else {
      this.demanda.atividades.push(id);
      box?.classList.add('selected');
    }
  },

  // ==========================================
  // CÁLCULOS DO HARDWARE
  // ==========================================
  async calcularHardware() {
    // Mapeamento justo e econômico para cada tipo de rotina pública:
    // 1 (Internet/SGPe) -> 8GB RAM
    // 2 (Textos/Ofícios/PDFs) -> 8GB RAM
    // 3 (Planilhas administrativas comuns) -> 8GB RAM
    // 4 (Power BI / Análise Pesada de Dados) -> 16GB RAM
    // 5 (Plantas CAD / QGIS) -> 32GB RAM + GPU
    // 6 (Edição 3D / Vídeos) -> 32GB RAM + GPU
    const map = { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6] };
    let sw = [];
    this.demanda.atividades.forEach(id => {
      if (map[id]) sw = sw.concat(map[id]);
    });

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
          softwares: this.demanda.atividades.map(i => `Atividade #${i}`),
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

    let catmat = perfil.id === 3 ? '482914' : perfil.id === 2 ? '471209' : '463821';
    let catmatNome = perfil.id === 3 ? 'Workstation Engenharia' : perfil.id === 2 ? 'Desktop Análise Dados' : 'Microcomputador Desktop Padrão';

    const valUnit = demanda.custo_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const valTot = demanda.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const nomeServ = demanda.usuario_nome || 'Servidor Responsável';
    const matServ = demanda.usuario_matricula || 'MAT-00000/PML';

    corpo.innerHTML = `
      <div class="gov-contract-doc">
        <div class="gov-contract-header">
          <div style="font-weight: 800; font-size: 0.82rem; letter-spacing: 1px; color: #4B5563;">ESTADO DE SANTA CATARINA</div>
          <h2>PREFEITURA DO MUNICÍPIO DE LAGES</h2>
          <p style="font-weight: 700; color: #111827; margin-top: 2px;">${demanda.orgao.toUpperCase()}</p>
          <div style="margin-top: 8px; padding: 6px; background: #F3F4F6; border: 1px solid #D1D5DB; font-size: 8.5pt;">
            <strong>MINUTA OFICIAL DE CONTRATO TIC • LEI Nº 14.133/2021</strong><br>
            ${processoAdm} • Contrato Administrativo nº ${numContrato}
          </div>
        </div>

        <p class="gov-clause-p">
          O <strong>MUNICÍPIO DE LAGES</strong>, por intermédio do(a) <strong>${demanda.orgao}</strong>, representado pelo servidor <strong>${nomeServ}</strong>, matrícula nº <strong>${matServ}</strong>, e a empresa vencedora do certame, celebram o presente contrato com as cláusulas a seguir:
        </p>

        <div class="gov-clause">
          <div class="gov-clause-title">CLÁUSULA PRIMEIRA – OBJETO E ESPECIFICAÇÃO BLINDADA</div>
          <p class="gov-clause-p">
            Aquisição de computadores para o setor de <strong>${demanda.setor}</strong>, conforme diretrizes técnicas do sistema DimensionaTI SC.
          </p>

          <table class="gov-table">
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">ITEM</th>
                <th style="width: 50%;">ESPECIFICAÇÃO PADRONIZADA (ANTI-PRODUTO INFERIOR)</th>
                <th style="width: 15%; text-align: center;">CATMAT</th>
                <th style="width: 10%; text-align: center;">QTD.</th>
                <th style="width: 20%; text-align: right;">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;"><strong>1</strong></td>
                <td>
                  <strong>${perfil.nome}</strong><br>
                  <small>
                    • CPU: ${perfil.processador}<br>
                    • RAM: ${perfil.ram}<br>
                    • SSD: ${perfil.armazenamento}<br>
                    • Periféricos: ${perfil.perifericos}
                  </small>
                </td>
                <td style="text-align: center;"><strong>${catmat}</strong><br><span style="font-size: 7pt;">${catmatNome}</span></td>
                <td style="text-align: center;"><strong>${demanda.quantidade_usuarios}</strong></td>
                <td style="text-align: right;"><strong>R$ ${valTot}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="tech-spec-box">
            <strong>CLÁUSULAS OBRIGATÓRIAS DE BLINDAGEM:</strong><br>
            • <strong>Placa-mãe OEM Corporativa:</strong> BIOS com logo da marca e chip TPM 2.0 ativo.<br>
            • <strong>Fonte 80 Plus Bronze Certificada:</strong> PFC Ativo com eficiência mínima de 85%.<br>
            • <strong>Monitor Ergonômico (NR-17):</strong> Painel IPS com ajuste de altura vertical de 100mm.<br>
            • <strong>Garantia On-Site 36 Meses em Lages/SC:</strong> Atendimento presencial no município em até 48 horas úteis.
          </div>
        </div>

        <div class="gov-clause">
          <div class="gov-clause-title">CLÁUSULA SEGUNDA – VALOR E VIGÊNCIA</div>
          <p class="gov-clause-p">
            O valor total do fornecimento é de <strong>R$ ${valTot}</strong> (R$ ${valUnit} unitário). Prazo de vigência contratual de 12 meses, prorrogável para efeito de garantia técnica de 3 anos.
          </p>
        </div>

        <div style="background: #F9FAFB; border: 1px solid #D1D5DB; padding: 8px 12px; margin-top: 14px; font-size: 8pt;">
          <strong>CERTIFICAÇÃO AUDITORIA TCE/SC:</strong> IRS ${demanda.irs}% (${demanda.nivel_risco}) • Aprovado para ${demanda.cargo} no município de Lages/SC.
        </div>

        <div style="margin-top: 24px; text-align: right; font-weight: 700; font-size: 9pt;">
          Lages/SC, ${dia} de ${mes} de ${ano}.
        </div>

        <div class="gov-signatures-block">
          <div>
            <div class="gov-sig-line">
              <strong>${nomeServ.toUpperCase()}</strong><br>
              ${demanda.cargo}<br>
              <small>Matrícula nº ${matServ} • PML</small>
            </div>
          </div>
          <div>
            <div class="gov-sig-line">
              <strong>EMPRESA VENCEDORA DO PREGÃO</strong><br>
              Representante Legal da Contratada<br>
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
  async carregarAuditor() {
    try {
      const res = await fetch('/api/estatisticas');
      const s = await res.json();

      document.getElementById('kpiTotal').innerText = s.totalDemandas;
      document.getElementById('kpiEco').innerText = `R$ ${s.totalEconomia.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
      document.getElementById('kpiRisco').innerText = `${s.mediaIrs}%`;

      const cr = (s.riscoContagem.find(r => r.nivel_risco === 'ALTO') || {}).qtd || 0;
      document.getElementById('kpiAlertas').innerText = cr;

      this.renderizarGraficosAuditor(s);
    } catch (e) {
      console.error(e);
    }
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
