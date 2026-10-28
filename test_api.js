// test_api.js
async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Iniciando Testes da API do DimensionaTI ---\n');

  // Teste 1: Login Profa. Angelita (Escola A)
  const loginAngelita = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'angelita.escola@lages.sc.gov.br', senha: '123' })
  }).then(r => r.json());

  console.log('1. Login Profa. Angelita:');
  console.log('   Nome:', loginAngelita.usuario.nome);
  console.log('   Instituição:', loginAngelita.usuario.instituicao_nome, '(ID:', loginAngelita.usuario.instituicao_id, ')');
  console.log('   Tipo:', loginAngelita.usuario.tipo_usuario);

  // Teste 2: Profa. Angelita lista demandas (só deve ver Escola A)
  const demandasAngelita = await fetch(`${baseUrl}/api/demandas?usuarioId=${loginAngelita.usuario.id}&tipoUsuario=${loginAngelita.usuario.tipo_usuario}`).then(r => r.json());
  console.log('\n2. Demandas visíveis para Profa. Angelita: total =', demandasAngelita.length);
  const todasSaoEscolaA = demandasAngelita.every(d => d.instituicao_id === 1);
  console.log('   Todas pertencem à Escola A (ID 1)?', todasSaoEscolaA ? '✅ SIM' : '❌ NÃO');
  demandasAngelita.slice(0, 3).forEach(d => console.log(`   - ${d.protocolo} | Inst: ${d.instituicao_nome} | Qtd: ${d.quantidade_usuarios} | Status: ${d.status}`));

  // Teste 3: Profa. Angelita tenta acessar DOD-2026-0002 (Escola B) diretamente via ID/URL (Regra 403)
  console.log('\n3. Teste de Segurança: Profa. Angelita tenta acessar requisição da Escola B (DOD-2026-0002):');
  const resTentativaAcesso = await fetch(`${baseUrl}/api/demandas/DOD-2026-0002?usuarioId=${loginAngelita.usuario.id}&tipoUsuario=${loginAngelita.usuario.tipo_usuario}`);
  console.log('   Status HTTP retornado:', resTentativaAcesso.status);
  const dataTentativa = await resTentativaAcesso.json();
  if (resTentativaAcesso.status === 403) {
    console.log('   ✅ SUCESSO: Acesso bloqueado pelo backend com 403 Forbidden!');
    console.log('   Mensagem de erro:', dataTentativa.error);
  } else {
    console.log('   ❌ FALHA: Deveria ter bloqueado com 403!', dataTentativa);
  }

  // Teste 4: Admin lista demandas para ETP
  console.log('\n4. Listar Demandas Aptas para Agrupamento em ETP:');
  const demandasEtp = await fetch(`${baseUrl}/api/demandas-para-etp`).then(r => r.json());
  console.log('   Total de DODs validados encontrados:', demandasEtp.length);
  demandasEtp.filter(d => ['DOD-2026-0001','DOD-2026-0002','DOD-2026-0003','DOD-2026-0004'].includes(d.protocolo)).forEach(d => {
    console.log(`   - ${d.protocolo}: ${d.instituicao_nome} (${d.quantidade_usuarios} un) - Disponível: ${d.disponivel_agrupamento ? '✅' : '❌'}`);
  });

  // Teste 5: Agrupar DOD-0001 (Escola A), DOD-0002 (Escola B) e DOD-0003 (Escola C) em um único ETP
  console.log('\n5. Agrupar DOD-2026-0001 + DOD-2026-0002 + DOD-2026-0003 em ETP único:');
  const resAgrupar = await fetch(`${baseUrl}/api/etps/agrupar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dodProtocolos: ['DOD-2026-0001', 'DOD-2026-0002', 'DOD-2026-0003'],
      titulo: 'Aquisição Unificada de Notebooks para Escolas Municipais A, B e C',
      objetivoConsolidado: 'Aquisição conjunta de computadores portáteis para renovação e modernização do parque computacional das unidades escolares da Rede Municipal de Ensino de Lages.',
      usuarioNome: 'Téc. Roberto Valente',
      usuarioCargo: 'Diretoria Geral de TIC'
    })
  });
  const dataAgrupado = await resAgrupar.json();
  console.log('   Status HTTP:', resAgrupar.status);
  if (resAgrupar.ok) {
    console.log('   ✅ ETP Consolidado Gerado com Sucesso!');
    console.log('   Protocolo ETP:', dataAgrupado.protocolo);
    console.log('   Quantidade Total Consolidada:', dataAgrupado.quantidadeTotal, 'notebooks (Esperado: 2 + 3 + 1 = 6)');
    console.log('   Custo Total Consolidado: R$', dataAgrupado.custoTotalEstimado);
    console.log('   Economia Estimada Total: R$', dataAgrupado.economiaEstimadaTotal);
    console.log('   Instituições Participantes:', dataAgrupado.instituicoesParticipantes.map(i => `${i.instituicaoNome} (${i.quantidade} un)`).join(', '));
  } else {
    console.log('   ❌ Erro ao agrupar:', dataAgrupado);
  }

  // Teste 6: Verificar se os DODs agrupados foram marcados com etp_id e status 'ETP gerado'
  console.log('\n6. Verificar Rastreabilidade dos DODs após o agrupamento:');
  const d1 = await fetch(`${baseUrl}/api/demandas/DOD-2026-0001`).then(r => r.json());
  console.log('   DOD-2026-0001: status =', d1.demanda.status, '| ETP Vinculado =', d1.demanda.etp_numero);

  // Teste 7: Tentativa de agrupar novamente DOD-0001 (deve falhar para evitar duplicidade)
  console.log('\n7. Teste de Prevenção de Duplicidade: tentar agrupar DOD-2026-0001 novamente:');
  const resDup = await fetch(`${baseUrl}/api/etps/agrupar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dodProtocolos: ['DOD-2026-0001'],
      titulo: 'Tentativa duplicada',
      usuarioNome: 'Admin'
    })
  });
  console.log('   Status HTTP:', resDup.status);
  const dataDup = await resDup.json();
  if (resDup.status === 400) {
    console.log('   ✅ SUCESSO: Duplicidade bloqueada pelo backend!');
    console.log('   Mensagem:', dataDup.error);
  } else {
    console.log('   ❌ FALHA: Deveria ter bloqueado duplicidade!', dataDup);
  }
}

runTests().catch(console.error);
