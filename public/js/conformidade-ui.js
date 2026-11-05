// public/js/conformidade-ui.js
// Integração de interface para Validação de Conformidade e Análise de Excepcionalidades (DimensionaTI SC)
(() => {
  if (typeof app === 'undefined') return;

  const CORES_RESULTADO = {
    compativel: { bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.4)', text: '#10B981', icone: '✓' },
    pendente: { bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.4)', text: '#F59E0B', icone: '⏳' },
    superdimensionamento: { bg: 'rgba(249, 115, 22, 0.16)', border: 'rgba(249, 115, 22, 0.45)', text: '#F97316', icone: '⚠️' },
    excepcionalidade: { bg: 'rgba(168, 85, 247, 0.16)', border: 'rgba(168, 85, 247, 0.45)', text: '#C084FC', icone: '🔎' },
    nao_conforme: { bg: 'rgba(239, 68, 68, 0.16)', border: 'rgba(239, 68, 68, 0.45)', text: '#EF4444', icone: '✕' }
  };

  const ROTULO_APLICABILIDADE = {
    confirmada: { texto: 'Norma aplicável ao Município', cor: '#10B981' },
    nao_confirmada: { texto: 'Aplicabilidade municipal pendente de confirmação', cor: '#F59E0B' },
    nao_aplicavel_diretamente: { texto: 'Referência técnica federal (SISP) — não obrigatória ao Município', cor: '#38BDF8' },
    institucional: { texto: 'Padrão técnico institucional (DimensionaTI)', cor: '#A78BFA' }
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  // 1. Pergunta simples e opcional no Wizard para o servidor (sem jargão técnico)
  app.toggleNecessidadeEspecial = function (codigo, btn) {
    if (!this.demanda.necessidadesEspeciais) this.demanda.necessidadesEspeciais = [];
    if (codigo === 'nenhuma') {
      this.demanda.necessidadesEspeciais = [];
      document.querySelectorAll('.chip-nec-especial').forEach(b => b.classList.toggle('active', b.dataset.nec === 'nenhuma'));
    } else {
      const idx = this.demanda.necessidadesEspeciais.indexOf(codigo);
      if (idx > -1) this.demanda.necessidadesEspeciais.splice(idx, 1);
      else this.demanda.necessidadesEspeciais.push(codigo);
      document.querySelectorAll('.chip-nec-especial').forEach(b => {
        if (b.dataset.nec === 'nenhuma') b.classList.toggle('active', this.demanda.necessidadesEspeciais.length === 0);
        else if (b.dataset.nec === codigo) b.classList.toggle('active', this.demanda.necessidadesEspeciais.includes(codigo));
      });
    }
    const boxDet = document.getElementById('boxDetalheNecessidadeEspecial');
    if (boxDet) boxDet.style.display = this.demanda.necessidadesEspeciais.length > 0 ? 'block' : 'none';
  };

  app.setDetalheNecessidadeEspecial = function (val) {
    this.demanda.necessidadeEspecialDescricao = val;
  };

  const oldAbrirWizardNovo = app.abrirWizardNovo.bind(app);
  app.abrirWizardNovo = function () {
    this.demanda.necessidadesEspeciais = [];
    this.demanda.necessidadeEspecialDescricao = '';
    document.querySelectorAll('.chip-nec-especial').forEach(b => b.classList.toggle('active', b.dataset.nec === 'nenhuma'));
    const inp = document.getElementById('inputDetalheNecessidadeEspecial');
    if (inp) inp.value = '';
    const box = document.getElementById('boxDetalheNecessidadeEspecial');
    if (box) box.style.display = 'none';
    return oldAbrirWizardNovo();
  };

  // Intercepta o envio de /api/demandas para incluir necessidadesEspeciais nas respostas do diagnóstico
  const origFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    try {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (init && init.method === 'POST' && url.endsWith('/api/demandas') && typeof init.body === 'string') {
        const body = JSON.parse(init.body);
        if (app.usuarioLogado?.id && !body.usuarioId) body.usuarioId = app.usuarioLogado.id;
        let respDiag = {};
        try { respDiag = typeof body.respostasDiagnostico === 'string' ? JSON.parse(body.respostasDiagnostico) : (body.respostasDiagnostico || {}); } catch {}
        respDiag.necessidadesEspeciais = Array.isArray(app.demanda?.necessidadesEspeciais) && app.demanda.necessidadesEspeciais.length
          ? app.demanda.necessidadesEspeciais
          : ['nenhuma'];
        if (app.demanda?.necessidadeEspecialDescricao) {
          respDiag.necessidadeEspecialDescricao = app.demanda.necessidadeEspecialDescricao;
        }
        body.respostasDiagnostico = JSON.stringify(respDiag);
        init.body = JSON.stringify(body);
      } else if (init && ['POST', 'PUT'].includes(init.method) && url.includes('/api/demandas/') && typeof init.body === 'string') {
        const body = JSON.parse(init.body);
        if (app.usuarioLogado?.id && !body.usuarioId) {
          body.usuarioId = app.usuarioLogado.id;
          init.body = JSON.stringify(body);
        }
      }
    } catch {}
    return origFetch(input, init);
  };

  // 2. Destaque de conformidade e pendências na tabela do TI (sem poluir visão do servidor)
  const oldRenderizarTabela = app.renderizarTabela.bind(app);
  app.renderizarTabela = function (demandas) {
    oldRenderizarTabela(demandas);
    if (!this.ehUsuarioAdmin() || !Array.isArray(demandas)) return;
    const tbody = document.getElementById('tbodyDemandas');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    demandas.forEach((d, idx) => {
      const tr = rows[idx];
      if (!tr || !d.conformidade_resumo) return;
      const cellStatus = tr.querySelector('.col-status');
      if (!cellStatus) return;
      const cr = d.conformidade_resumo;
      const cor = CORES_RESULTADO[cr.resultado] || CORES_RESULTADO.pendente;
      const ex = cr.excepcionalidade;
      let extraTag = '';
      if (ex && (ex.status === 'aguardando_ti' || ex.status === 'ajustes_solicitados')) {
        extraTag = `<div style="margin-top:4px;font-size:0.72rem;font-weight:700;color:#C084FC;">🔎 ${esc(ex.rotulo_status)}</div>`;
      }
      const badgeHtml = `
        <div class="conf-mini-pill" style="margin-top:5px;display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:0.72rem;font-weight:700;background:${cor.bg};border:1px solid ${cor.border};color:${cor.text};" title="Resultado da verificação de conformidade">
          <span>${cor.icone}</span> <span>${esc(cr.rotulo)}</span>
        </div>
        ${extraTag}
      `;
      cellStatus.insertAdjacentHTML('beforeend', badgeHtml);
    });
  };

  // 3. Integração da Aba "Conformidade & Exceções" no Painel de Análise do TI
  const oldSetAbaAnaliseTi = app.setAbaAnaliseTi.bind(app);
  app.setAbaAnaliseTi = function (aba) {
    oldSetAbaAnaliseTi(aba);
    if (aba === 'conformidade') {
      document.getElementById('tabAnaliseConformidade')?.classList.add('active');
      document.getElementById('paneAnaliseConformidade')?.classList.add('active');
    }
  };

  const oldAbrirPainelAnaliseTi = app.abrirPainelAnaliseTi.bind(app);
  app.abrirPainelAnaliseTi = async function (protocolo) {
    await oldAbrirPainelAnaliseTi(protocolo);
    const ehAdmin = this.ehUsuarioAdmin();
    const tabConf = document.getElementById('tabAnaliseConformidade');
    if (tabConf) tabConf.style.display = ehAdmin ? 'inline-flex' : 'none';
    if (ehAdmin) {
      await this.carregarPainelConformidadeTi(protocolo);
    }
  };

  app.carregarPainelConformidadeTi = async function (protocolo) {
    const container = document.getElementById('analiseCorpoConformidade');
    if (!container) return;
    container.innerHTML = `<div style="padding:20px;color:var(--dark-muted);">Carregando verificação de conformidade e referências normativas...</div>`;
    try {
      const u = this.usuarioLogado;
      const res = await fetch(`/api/demandas/${protocolo}/conformidade?usuarioId=${u?.id || ''}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        container.innerHTML = `<div style="padding:20px;color:#EF4444;">${esc(err.error || 'Não foi possível carregar os dados de conformidade.')}</div>`;
        return;
      }
      const conf = await res.json();
      this.conformidadeAtual = conf;
      this.renderizarPainelConformidadeTi(conf);
    } catch (e) {
      container.innerHTML = `<div style="padding:20px;color:#EF4444;">Erro ao consultar conformidade: ${esc(e.message)}</div>`;
    }
  };

  app.reexecutarVerificacaoConformidade = async function (protocolo) {
    try {
      const u = this.usuarioLogado;
      const res = await fetch(`/api/demandas/${protocolo}/conformidade/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: u?.id })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Erro ao reexecutar verificação.');
        return;
      }
      this.conformidadeAtual = data.conformidade;
      this.renderizarPainelConformidadeTi(data.conformidade);
      await this.carregarHistoricoDemanda(protocolo);
      await this.carregarDemandas();
      this.toast?.('Verificação de conformidade atualizada com sucesso.', 'success');
    } catch (e) {
      alert('Erro ao reexecutar verificação: ' + e.message);
    }
  };

  app.abrirExcepcionalidadeManualTi = async function (protocolo) {
    const reqEl = document.getElementById('inputExcManualRequisito');
    const motEl = document.getElementById('inputExcManualMotivo');
    const requisito = reqEl?.value.trim() || '';
    const motivo = motEl?.value.trim() || '';
    if (requisito.length < 5 || motivo.length < 10) {
      alert('Informe o requisito não atendido (mín. 5 caracteres) e o motivo técnico (mín. 10 caracteres).');
      return;
    }
    try {
      const res = await fetch(`/api/demandas/${protocolo}/excepcionalidade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requisito, motivo, usuarioId: this.usuarioLogado?.id })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Não foi possível registrar excepcionalidade.');
        return;
      }
      this.conformidadeAtual = data.conformidade;
      this.renderizarPainelConformidadeTi(data.conformidade);
      await this.carregarHistoricoDemanda(protocolo);
      await this.carregarDemandas();
    } catch (e) {
      alert('Erro ao abrir análise de excepcionalidade: ' + e.message);
    }
  };

  app.registrarDecisaoExcepcionalidadeTi = async function (protocolo, decisao) {
    const just = document.getElementById('txtExcJustificativaTecnica')?.value.trim() || '';
    const sol = document.getElementById('txtExcSolucaoAprovada')?.value.trim() || '';
    const ori = document.getElementById('txtExcOrientacaoServidor')?.value.trim() || '';

    const alternativas = [];
    document.querySelectorAll('.exc-alt-row').forEach(row => {
      const desc = row.querySelector('.exc-alt-desc')?.value.trim() || '';
      const sel = row.querySelector('.exc-alt-viavel')?.value || '';
      const obs = row.querySelector('.exc-alt-obs')?.value.trim() || '';
      if (desc) {
        alternativas.push({
          descricao: desc,
          viavel: sel === 'sim' ? true : sel === 'nao' ? false : null,
          observacao: obs
        });
      }
    });

    try {
      const res = await fetch(`/api/demandas/${protocolo}/excepcionalidade/decisao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: this.usuarioLogado?.id,
          decisao,
          justificativaTecnica: just,
          solucaoAprovada: sol,
          orientacaoServidor: ori,
          alternativas
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Não foi possível salvar a decisão.');
        return;
      }
      this.conformidadeAtual = data.conformidade;
      this.renderizarPainelConformidadeTi(data.conformidade);
      await this.carregarHistoricoDemanda(protocolo);
      await this.carregarDemandas();
      this.toast?.('Decisão técnica de excepcionalidade registrada.', 'success');
    } catch (e) {
      alert('Erro ao registrar decisão: ' + e.message);
    }
  };

  app.renderizarPainelConformidadeTi = function (conf) {
    const container = document.getElementById('analiseCorpoConformidade');
    if (!container || !conf || !conf.atual) return;
    const at = conf.atual;
    const cor = CORES_RESULTADO[at.resultado] || CORES_RESULTADO.pendente;
    const ex = conf.excepcionalidade;

    const badgeTab = document.getElementById('badgeTabConformidade');
    if (badgeTab) {
      badgeTab.style.display = 'inline-block';
      badgeTab.style.background = cor.bg;
      badgeTab.style.color = cor.text;
      badgeTab.style.border = `1px solid ${cor.border}`;
      badgeTab.style.padding = '2px 7px';
      badgeTab.style.borderRadius = '999px';
      badgeTab.style.fontSize = '0.72rem';
      badgeTab.style.marginLeft = '6px';
      badgeTab.innerText = at.rotulo;
    }

    const alertaDesatualizado = (conf.regras_desatualizadas || (conf.perfil_alterado_desde_verificacao && conf.perfil_alterado_desde_verificacao.length))
      ? `<div style="margin-bottom:14px;padding:12px 16px;border-radius:10px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);color:var(--dark-text);font-size:0.85rem;">
          <strong>🔒 Preservação de Histórico Ativa:</strong> Esta verificação foi executada sob a versão <code>${esc(conf.versao?.rotulo)} (#${esc(conf.versao?.id)})</code>.
          ${conf.perfil_alterado_desde_verificacao?.length ? `O perfil de hardware sofreu alterações posteriores nos campos (${esc(conf.perfil_alterado_desde_verificacao.join(', '))}), mas o registro original desta demanda permanece preservado.` : ''}
        </div>`
      : '';

    const pendenciasHtml = (at.pendencias && at.pendencias.length)
      ? `<div style="margin-top:12px;padding:12px 14px;border-radius:10px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.35);">
          <strong style="color:#F59E0B;font-size:0.84rem;display:block;margin-bottom:6px;">⚠️ Pendências que exigem avaliação do TI:</strong>
          <ul style="margin:0;padding-left:18px;font-size:0.84rem;color:var(--dark-text);line-height:1.5;">
            ${at.pendencias.map(p => `<li>${esc(p)}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const rChave = at.respostas || {};
    const blocoPerguntasChave = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:18px;">
        <div style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:14px;">
          <small style="color:var(--dark-muted);font-weight:700;font-size:0.75rem;text-transform:uppercase;">1. Atende à necessidade apresentada?</small>
          <div style="margin-top:6px;font-weight:700;color:var(--dark-text);font-size:0.9rem;">${esc(rChave.atende_necessidade || '—')}</div>
        </div>
        <div style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:14px;">
          <small style="color:var(--dark-muted);font-weight:700;font-size:0.75rem;text-transform:uppercase;">2. Alinhada aos critérios e normas aplicáveis?</small>
          <div style="margin-top:6px;font-weight:700;color:var(--dark-text);font-size:0.9rem;">${esc(rChave.alinhado_criterios || '—')}</div>
        </div>
        <div style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:14px;">
          <small style="color:var(--dark-muted);font-weight:700;font-size:0.75rem;text-transform:uppercase;">3. Há justificativa suficiente para exceção?</small>
          <div style="margin-top:6px;font-weight:700;color:var(--dark-text);font-size:0.9rem;">${esc(rChave.excecao_justificada || '—')}</div>
        </div>
      </div>
    `;

    const comparacaoRows = (at.comparacao || []).map(c => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid var(--dark-border);font-weight:700;color:var(--dark-text);">${esc(c.aspecto)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--dark-border);color:var(--dark-muted);">${esc(c.perfil)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--dark-border);color:var(--dark-text);">${esc(c.necessidade)}</td>
      </tr>
    `).join('');

    let blocoExcepcionalidade = '';
    if (ex) {
      const altsBase = (ex.alternativas_avaliadas && ex.alternativas_avaliadas.length)
        ? ex.alternativas_avaliadas
        : (ex.alternativas_sugeridas || []).map(d => ({ descricao: d, viavel: null, observacao: '' }));
      if (altsBase.length === 0) {
        altsBase.push({ descricao: `Manter Perfil ${ex.perfil_referencia_id || 1} padrão com adequação pontual`, viavel: null, observacao: '' });
      }
      const podeDecidir = ex.status === 'aguardando_ti';
      blocoExcepcionalidade = `
        <div style="background:var(--dark-surface);border:1px solid rgba(168,85,247,0.45);border-radius:14px;padding:18px;margin-bottom:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <span style="font-size:0.75rem;font-weight:800;color:#C084FC;text-transform:uppercase;">Análise de Excepcionalidade Técnica</span>
              <h4 style="margin:2px 0 0 0;color:var(--dark-text);font-size:1.05rem;">${esc(ex.requisito_nao_atendido)}</h4>
            </div>
            <span style="padding:4px 12px;border-radius:999px;font-size:0.8rem;font-weight:700;background:rgba(168,85,247,0.18);color:#C084FC;">
              ${esc(ex.rotulo_status)}
            </span>
          </div>
          <p style="margin:0 0 10px 0;font-size:0.88rem;color:var(--dark-muted);">
            <strong>Perfil de referência inicial:</strong> Perfil ${esc(ex.perfil_referencia_id || at.perfil_referencia_id)} •
            <strong>Motivo da excepcionalidade:</strong> ${esc(ex.motivo)}
          </p>
          ${(ex.informacoes_complementares && ex.informacoes_complementares.length) ? `
            <div style="margin-bottom:12px;padding:10px 12px;border-radius:8px;background:rgba(56,189,248,0.1);font-size:0.84rem;">
              <strong>Informações complementares enviadas pelo servidor:</strong>
              ${ex.informacoes_complementares.map(ic => `<div style="margin-top:4px;">• <em>${esc(ic.texto)}</em> (${esc(ic.autor)})</div>`).join('')}
            </div>
          ` : ''}

          ${podeDecidir ? `
            <div style="margin-top:12px;border-top:1px solid var(--dark-border);padding-top:12px;">
              <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--dark-text);margin-bottom:6px;">Avaliação de Alternativas Viáveis (obrigatório avaliar ao menos 1 para aprovar):</label>
              <div id="listaAlternativasExc" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                ${altsBase.map(a => `
                  <div class="exc-alt-row" style="display:grid;grid-template-columns:2fr 1fr 2fr;gap:8px;align-items:center;">
                    <input type="text" class="dark-input exc-alt-desc" value="${esc(a.descricao)}" placeholder="Alternativa avaliada">
                    <select class="dark-input exc-alt-viavel">
                      <option value="">Avaliar...</option>
                      <option value="sim" ${a.viavel === true ? 'selected' : ''}>Viável</option>
                      <option value="nao" ${a.viavel === false ? 'selected' : ''}>Inviável</option>
                    </select>
                    <input type="text" class="dark-input exc-alt-obs" value="${esc(a.observacao || '')}" placeholder="Observação técnica / custo">
                  </div>
                `).join('')}
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                <div>
                  <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--dark-text);margin-bottom:4px;">Justificativa Técnica da Equipe de TI (mín. 30 caracteres):</label>
                  <textarea id="txtExcJustificativaTecnica" class="dark-input" rows="3" style="height:auto;padding:8px;" placeholder="Fundamente tecnicamente a análise da necessidade apresentada em face dos perfis padronizados...">${esc(ex.justificativa_tecnica || '')}</textarea>
                </div>
                <div>
                  <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--dark-text);margin-bottom:4px;">Solução Excepcional Aprovada (se aprovar) ou Orientação ao Servidor (se pedir ajustes):</label>
                  <textarea id="txtExcSolucaoAprovada" class="dark-input" rows="2" style="height:auto;padding:8px;margin-bottom:6px;" placeholder="Se aprovar: especifique a configuração/solução excepcional autorizada...">${esc(ex.solucao_aprovada || '')}</textarea>
                  <input type="text" id="txtExcOrientacaoServidor" class="dark-input" placeholder="Se solicitar ajustes: pergunta simples para o servidor responder...">
                </div>
              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
                <button type="button" class="btn-action-warn" onclick="app.registrarDecisaoExcepcionalidadeTi('${esc(conf.protocolo)}', 'ajustes')">
                  ⚠️ Solicitar Informações ao Servidor
                </button>
                <button type="button" class="btn-action-danger" onclick="app.registrarDecisaoExcepcionalidadeTi('${esc(conf.protocolo)}', 'rejeitar')">
                  ✕ Rejeitar Excepcionalidade
                </button>
                <button type="button" class="btn-action-success" onclick="app.registrarDecisaoExcepcionalidadeTi('${esc(conf.protocolo)}', 'aprovar')">
                  ✓ Aprovar Excepcionalidade Técnica
                </button>
              </div>
            </div>
          ` : `
            <div style="margin-top:10px;padding:12px;border-radius:10px;background:rgba(15,23,42,0.35);font-size:0.85rem;color:var(--dark-text);">
              <div><strong>Decisão registrada:</strong> ${esc(ex.rotulo_status)} • <strong>Responsável:</strong> ${esc(ex.decidido_por || '—')} • <strong>Data:</strong> ${esc(ex.decidido_em || '—')}</div>
              <div style="margin-top:6px;"><strong>Justificativa técnica:</strong> ${esc(ex.justificativa_tecnica || '—')}</div>
              ${ex.solucao_aprovada ? `<div style="margin-top:4px;"><strong>Solução aprovada:</strong> ${esc(ex.solucao_aprovada)}</div>` : ''}
            </div>
          `}
        </div>
      `;
    } else {
      blocoExcepcionalidade = `
        <details style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:12px 16px;margin-bottom:18px;">
          <summary style="cursor:pointer;font-weight:700;color:var(--dark-text);font-size:0.9rem;">
            ➕ Registrar Análise de Excepcionalidade Manualmente (Equipe de TI)
          </summary>
          <div style="margin-top:12px;display:grid;grid-template-columns:1fr 2fr auto;gap:10px;align-items:end;">
            <div>
              <label style="font-size:0.78rem;color:var(--dark-muted);display:block;margin-bottom:4px;">Requisito não atendido pelo perfil</label>
              <input type="text" id="inputExcManualRequisito" class="dark-input" placeholder="Ex.: Placa de captura / Periférico assistivo">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--dark-muted);display:block;margin-bottom:4px;">Motivo técnico da excepcionalidade</label>
              <input type="text" id="inputExcManualMotivo" class="dark-input" placeholder="Descreva por que os perfis 1, 2 e 3 não atendem adequadamente">
            </div>
            <button type="button" class="btn-secondary-glass" style="height:42px;" onclick="app.abrirExcepcionalidadeManualTi('${esc(conf.protocolo)}')">
              Abrir Excepcionalidade
            </button>
          </div>
        </details>
      `;
    }

    const criteriosHtml = (at.criterios || []).map(c => {
      const badgeCor = c.resultado === 'atende' ? '#10B981' : c.resultado === 'nao_atende' ? '#EF4444' : c.resultado === 'pendente' ? '#F59E0B' : '#38BDF8';
      const refs = (c.referencias || []).map(r => {
        const ap = ROTULO_APLICABILIDADE[r.aplicabilidade] || { texto: r.aplicabilidade, cor: '#94A3B8' };
        return `<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 8px;border-radius:6px;font-size:0.72rem;background:rgba(255,255,255,0.05);border:1px solid var(--dark-border);color:${ap.cor};" title="${esc(ap.texto)}">${esc(r.titulo)} (${esc(ap.texto)})</span>`;
      }).join('');
      return `
        <div style="padding:10px 12px;border-bottom:1px solid var(--dark-border);display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
          <div style="flex:1;">
            <div style="font-weight:700;color:var(--dark-text);font-size:0.88rem;">${esc(c.titulo)}</div>
            <div style="font-size:0.82rem;color:var(--dark-muted);margin-top:2px;">${esc(c.explicacao)}</div>
            ${refs ? `<div style="margin-top:4px;">${refs}</div>` : ''}
          </div>
          <span style="font-size:0.75rem;font-weight:800;color:${badgeCor};text-transform:uppercase;white-space:nowrap;">${esc(c.resultado)}</span>
        </div>
      `;
    }).join('');

    const historicoVerifHtml = (conf.historico || []).map(h => `
      <div style="font-size:0.8rem;padding:6px 0;border-bottom:1px solid var(--dark-border);color:var(--dark-muted);">
        <strong>#${esc(h.id)}</strong> • Resultado: <strong style="color:var(--dark-text);">${esc(h.resultado)}</strong> •
        Origem: ${esc(h.origem)} • Versão: <code>${esc(h.versao_rotulo)}</code> (${esc((h.versao_hash || '').slice(0, 10))}) •
        Em: ${esc(h.criado_em)} por ${esc(h.criado_por)}
      </div>
    `).join('');

    container.innerHTML = `
      ${alertaDesatualizado}
      <div style="background:${cor.bg};border:1px solid ${cor.border};border-radius:14px;padding:16px 20px;margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <span style="font-size:0.75rem;font-weight:800;color:${cor.text};text-transform:uppercase;">Status da Verificação de Conformidade</span>
            <h3 style="margin:2px 0 4px 0;color:var(--dark-text);font-size:1.25rem;">${cor.icone} ${esc(at.rotulo)}</h3>
            <p style="margin:0;font-size:0.88rem;color:var(--dark-text);">${esc(at.explicacao)}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem;color:var(--dark-muted);margin-bottom:6px;">
              Verificação #${esc(at.id)} • Regras <code>${esc(conf.versao?.rotulo)}</code>
            </div>
            <button type="button" class="btn-secondary-glass" style="padding:6px 12px;font-size:0.82rem;" onclick="app.reexecutarVerificacaoConformidade('${esc(conf.protocolo)}')">
              🔄 Reexecutar Verificação
            </button>
          </div>
        </div>
        ${pendenciasHtml}
      </div>

      ${blocoPerguntasChave}
      ${blocoExcepcionalidade}

      <div style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:16px;margin-bottom:18px;">
        <h4 style="margin:0 0 10px 0;font-size:0.95rem;color:var(--dark-text);">Comparação: Perfil Padrão de Referência vs. Necessidade Apresentada</h4>
        <table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
          <thead>
            <tr style="text-align:left;color:var(--dark-muted);border-bottom:1px solid var(--dark-border);">
              <th style="padding:6px 10px;">Aspecto</th>
              <th style="padding:6px 10px;">Perfil Padrão (Perfil ${esc(at.perfil_referencia_id)})</th>
              <th style="padding:6px 10px;">Necessidade Apresentada pelo Servidor</th>
            </tr>
          </thead>
          <tbody>${comparacaoRows}</tbody>
        </table>
      </div>

      <div style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;overflow:hidden;margin-bottom:18px;">
        <div style="padding:12px 16px;border-bottom:1px solid var(--dark-border);font-weight:700;color:var(--dark-text);font-size:0.95rem;">
          Critérios Técnicos e Normativos Verificados
        </div>
        <div>${criteriosHtml}</div>
      </div>

      <details style="background:var(--dark-surface);border:1px solid var(--dark-border);border-radius:12px;padding:12px 16px;">
        <summary style="cursor:pointer;font-weight:700;color:var(--dark-text);font-size:0.9rem;">
          🕒 Histórico de Verificações e Versões de Regras (${(conf.historico || []).length})
        </summary>
        <div style="margin-top:10px;">${historicoVerifHtml}</div>
      </details>
    `;
  };

  // 4. Integração com Validação do DOD pelo TI (solicita parecer se houver superdimensionamento ou direciona para exceção aberta)
  app.validarDodTi = async function (protocolo) {
    if (!this.ehUsuarioAdmin()) return;
    let parecerConformidade = '';
    const conf = this.conformidadeAtual;
    if (conf?.excepcionalidade && ['aguardando_ti', 'ajustes_solicitados'].includes(conf.excepcionalidade.status)) {
      alert(`Há uma análise de excepcionalidade em aberto (${conf.excepcionalidade.rotulo_status}).\n\nConclua a avaliação na aba "⚖️ Conformidade & Exceções" antes de validar o DOD.`);
      this.setAbaAnaliseTi('conformidade');
      return;
    }
    if (conf?.atual?.resultado === 'superdimensionamento') {
      const p = prompt('A verificação apontou POSSÍVEL SUPERDIMENSIONAMENTO.\n\nInforme o parecer técnico fundamentado (mínimo 20 caracteres) para autorizar a validação do DOD:');
      if (p === null) return;
      parecerConformidade = p.trim();
    } else if (!confirm(`Deseja validar formalmente o DOD da demanda ${protocolo}?\n\nEsta ação registra a conformidade técnica e libera a geração do Estudo Técnico Preliminar (ETP).`)) {
      return;
    }

    try {
      const res = await fetch(`/api/demandas/${protocolo}/validar-dod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: this.usuarioLogado?.id,
          usuarioNome: this.usuarioLogado?.nome || 'Técnico de TIC Responsável',
          usuarioCargo: this.usuarioLogado?.cargo || 'Analista de Governança TIC',
          parecerConformidade
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✓ DOD do protocolo ${protocolo} validado com sucesso!\nA geração de ETP está agora liberada.`);
        await this.carregarDemandas();
        await this.abrirPainelAnaliseTi(protocolo);
      } else {
        alert(data.error || 'Não foi possível validar o DOD.');
        if (data.codigo === 'EXCECAO_EM_ABERTO' || data.codigo === 'PARECER_OBRIGATORIO') {
          this.setAbaAnaliseTi('conformidade');
        }
      }
    } catch (e) {
      alert('Erro na comunicação com o servidor: ' + e.message);
    }
  };

  // 5. Integração documental: Quadro Técnico de Conformidade e Excepcionalidade no DOD/DFD e no ETP
  function gerarBlocoConformidadeDocumento(c) {
    if (!c) return '';
    const ex = c.excepcionalidade;
    const altsHtml = (ex?.alternativas_avaliadas && ex.alternativas_avaliadas.length)
      ? ex.alternativas_avaliadas.map(a => `${esc(a.descricao)} (${a.viavel === true ? 'Viável' : a.viavel === false ? 'Inviável' : 'Avaliada'}${a.observacao ? ': ' + esc(a.observacao) : ''})`).join('; ')
      : 'Padrões dos Perfis 1, 2 e 3 verificados.';
    return `
      <div class="lages-section-card" style="margin-top:14px;">
        <div class="lages-section-header">ANEXO TÉCNICO DE CONFORMIDADE E EXCEPCIONALIDADE (DIMENSIONATI SC)</div>
        <div class="lages-section-body" style="font-size:0.86rem;line-height:1.5;">
          <div><strong>1. Resultado da Verificação de Conformidade:</strong> ${esc(c.rotulo)} — ${esc(c.explicacao)} (Verificação #${esc(c.verificacao_id)}, Regras ${esc(c.versao_regras)}).</div>
          <div style="margin-top:4px;"><strong>2. Perfil Técnico de Referência:</strong> Perfil ${esc(c.perfil_referencia_id)} (Recomendado preliminarmente: Perfil ${esc(c.perfil_recomendado_id)}).</div>
          <div style="margin-top:4px;"><strong>3. Critérios Verificados:</strong> ${(c.criterios || []).map(cr => `${esc(cr.titulo)}: ${esc(cr.resultado)}`).join(' • ')}.</div>
          ${(c.pendencias && c.pendencias.length) ? `<div style="margin-top:4px;"><strong>4. Pendências Registradas:</strong> ${c.pendencias.map(esc).join('; ')}</div>` : ''}
          ${ex ? `
            <div style="margin-top:6px;padding-top:6px;border-top:1px dashed #CBD5E1;">
              <strong>5. Análise de Excepcionalidade Técnica (${esc(ex.rotulo_status)}):</strong><br>
              • <em>Requisito não atendido pelo perfil padrão:</em> ${esc(ex.requisito_nao_atendido)} (${esc(ex.motivo)})<br>
              • <em>Alternativas avaliadas:</em> ${altsHtml}<br>
              • <em>Justificativa técnica e decisão do TI:</em> ${esc(ex.justificativa_tecnica || 'Aguardando parecer conclusivo da equipe de TI.')}
              ${ex.solucao_aprovada ? `<br>• <em>Solução excepcional aprovada:</em> ${esc(ex.solucao_aprovada)}` : ''}
              ${ex.decidido_por ? `<br>• <em>Responsável pela decisão:</em> ${esc(ex.decidido_por)} em ${esc(ex.decidido_em || '')}` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  const oldRenderizarModalEtp = app.renderizarModalEtp.bind(app);
  app.renderizarModalEtp = function (demanda, perfil) {
    oldRenderizarModalEtp(demanda, perfil);
    const corpo = document.getElementById('corpoDocumentoEtp');
    const c = demanda?.conformidade_resumo;
    if (!corpo || !c || corpo.querySelector('.anexo-conformidade-doc')) return;
    const footer = corpo.querySelector('.lages-doc-footer-legal');
    const wrapper = document.createElement('div');
    wrapper.className = 'anexo-conformidade-doc';
    wrapper.innerHTML = gerarBlocoConformidadeDocumento(c);
    if (footer && footer.parentNode) footer.parentNode.insertBefore(wrapper, footer);
    else corpo.appendChild(wrapper);
  };

  const oldRenderizarEtpCompleto = app.renderizarEtpCompleto.bind(app);
  app.renderizarEtpCompleto = function (d, etp) {
    oldRenderizarEtpCompleto(d, etp);
    const corpo = document.getElementById('corpoEtpCompleto');
    const c = d?.conformidade_resumo;
    if (!corpo || !c || corpo.querySelector('.anexo-conformidade-doc')) return;
    const footer = corpo.querySelector('.lages-doc-footer-legal');
    const wrapper = document.createElement('div');
    wrapper.className = 'anexo-conformidade-doc';
    wrapper.innerHTML = gerarBlocoConformidadeDocumento(c);
    if (footer && footer.parentNode) footer.parentNode.insertBefore(wrapper, footer);
    else corpo.appendChild(wrapper);
  };
})();
