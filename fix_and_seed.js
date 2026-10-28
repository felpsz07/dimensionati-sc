// fix_and_seed.js
const { db } = require('./database');

console.log('--- Corrigindo Instituições e Configurando Cenário Completo ---');

db.exec('PRAGMA foreign_keys = OFF;');

// 1. Corrige Instituições com caracteres UTF-8 perfeitos
const insertInst = db.prepare(`
  INSERT OR REPLACE INTO instituicoes (id, nome, tipo, secretaria, municipio, ativo)
  VALUES (?, ?, ?, ?, ?, 1)
`);

const instituicoes = [
  [1, 'Escola Municipal A', 'escola', 'Secretaria Municipal de Educação', 'Lages'],
  [2, 'Escola Municipal B', 'escola', 'Secretaria Municipal de Educação', 'Lages'],
  [3, 'Escola Municipal C', 'escola', 'Secretaria Municipal de Educação', 'Lages'],
  [4, 'Secretaria Municipal de Educação (SME)', 'secretaria', 'Secretaria Municipal de Educação', 'Lages'],
  [5, 'Secretaria Municipal de Saúde (SMS)', 'secretaria', 'Secretaria Municipal de Saúde', 'Lages'],
  [6, 'Unidade de Saúde A (UBS Centro)', 'unidade_saude', 'Secretaria Municipal de Saúde', 'Lages'],
  [7, 'Unidade de Saúde B (UBS Coral)', 'unidade_saude', 'Secretaria Municipal de Saúde', 'Lages'],
  [8, 'Secretaria de Planejamento e Obras (SEPLAN)', 'secretaria', 'Secretaria de Planejamento e Obras', 'Lages'],
  [9, 'Secretaria da Fazenda e Finanças', 'secretaria', 'Secretaria da Fazenda', 'Lages'],
  [10, 'Diretoria Geral de TIC (Prefeitura de Lages)', 'secretaria', 'Prefeitura do Município de Lages', 'Lages']
];

for (const inst of instituicoes) {
  insertInst.run(...inst);
}
console.log('✅ 10 Instituições cadastradas com sucesso.');

// 2. Garante Usuários vinculados
// Angelita: Diretora - Escola Municipal A (id: 1)
// Maria Eduarda: Diretora - Escola Municipal B (id: 2)
// Carla Cristina: Diretora - Escola Municipal C (id: 3)
// Camila Ramos: Gestora - UBS Centro (id: 6)
// Admin: Geral TIC (id: 10, tipo_usuario: 'admin')

const updateUsers = [
  { email: 'angelita.escola@lages.sc.gov.br', nome: 'Profa. Angelita de Souza', cargo: 'Diretora Escolar', orgao: 'Secretaria Municipal de Educação', setor: 'Escola Municipal A', matricula: 'MAT-51001/PML', tipo: 'diretora', inst: 1, avatar: '👩‍🏫' },
  { email: 'maria.prof@lages.sc.gov.br', nome: 'Profa. Maria Eduarda Alencar', cargo: 'Diretora Escolar', orgao: 'Secretaria Municipal de Educação', setor: 'Escola Municipal B', matricula: 'MAT-48921/PML', tipo: 'diretora', inst: 2, avatar: '👩‍🏫' },
  { email: 'carla.escola@lages.sc.gov.br', nome: 'Profa. Carla Cristina Silveira', cargo: 'Diretora Escolar', orgao: 'Secretaria Municipal de Educação', setor: 'Escola Municipal C', matricula: 'MAT-52440/PML', tipo: 'diretora', inst: 3, avatar: '👩‍🏫' },
  { email: 'camila.saude@lages.sc.gov.br', nome: 'Dra. Camila Ramos', cargo: 'Enfermeira Chefe e Gestora de UBS', orgao: 'Secretaria Municipal de Saúde', setor: 'Unidade de Saúde A (UBS Centro)', matricula: 'MAT-55319/PML', tipo: 'padrao', inst: 6, avatar: '👩‍⚕️' },
  { email: 'admin@lages.sc.gov.br', nome: 'Administrador Geral de TIC', cargo: 'Diretor de TIC e Licitações', orgao: 'Prefeitura do Município de Lages', setor: 'Diretoria Geral de TIC', matricula: 'MAT-00001/TIC', tipo: 'admin', inst: 10, avatar: '👑' }
];

for (const u of updateUsers) {
  const existing = db.prepare('SELECT id FROM usuarios WHERE LOWER(email) = ?').get(u.email.toLowerCase());
  if (existing) {
    db.prepare(`
      UPDATE usuarios 
      SET nome = ?, cargo = ?, orgao = ?, setor = ?, matricula = ?, tipo_usuario = ?, instituicao_id = ?, avatar = ?
      WHERE id = ?
    `).run(u.nome, u.cargo, u.orgao, u.setor, u.matricula, u.tipo, u.inst, u.avatar, existing.id);
  } else {
    db.prepare(`
      INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar, tipo_usuario, instituicao_id)
      VALUES (?, ?, '123456', ?, ?, ?, 'Lages', ?, 1, '[1,2]', ?, ?, ?)
    `).run(u.nome, u.email, u.cargo, u.orgao, u.setor, u.matricula, u.avatar, u.tipo, u.inst);
  }
}
console.log('✅ Usuários atualizados e vinculados às instituições.');

// 3. Atualizar demandas existentes para apontar para as instituições certas (evitar NULL)
db.exec(`
  UPDATE demandas SET instituicao_id = 1 WHERE instituicao_id IS NULL AND (setor LIKE '%Escola Municipal A%' OR orgao LIKE '%Educação%');
  UPDATE demandas SET instituicao_id = 2 WHERE instituicao_id IS NULL AND setor LIKE '%Escola Municipal B%';
  UPDATE demandas SET instituicao_id = 6 WHERE instituicao_id IS NULL AND orgao LIKE '%Saúde%';
  UPDATE demandas SET instituicao_id = 8 WHERE instituicao_id IS NULL AND orgao LIKE '%Planejamento%';
  UPDATE demandas SET instituicao_id = 9 WHERE instituicao_id IS NULL AND orgao LIKE '%Fazenda%';
  UPDATE demandas SET instituicao_id = 10 WHERE instituicao_id IS NULL;
`);

// 4. Cenário de Teste Obrigatório (DOD-2026-0001, DOD-2026-0002, DOD-2026-0003, DOD-2026-0004)
// Exclui versões anteriores desses protocolos específicos para recriar perfeitos
db.prepare("DELETE FROM demandas WHERE protocolo IN ('DOD-2026-0001', 'DOD-2026-0002', 'DOD-2026-0003', 'DOD-2026-0004')").run();

const insertDem = db.prepare(`
  INSERT INTO demandas (
    protocolo, usuario_id, usuario_nome, usuario_matricula,
    orgao, municipio, setor, cargo, quantidade_usuarios,
    softwares, perfil_recomendado_id, perfil_escolhido_id, status,
    justificativa_usuario, justificativa_tecnica_automatica,
    custo_unitario, custo_total, economia_estimada, irs, nivel_risco,
    tipo_necessidade, respostas_diagnostico, diagnostico_interpretado,
    recomendacao_preliminar, recursos_existentes, dod_conteudo,
    dod_validado, dod_validado_por, dod_validado_em,
    etp_gerado, instituicao_id
  ) VALUES (
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    1, 'Téc. Roberto Valente (TIC)', datetime('now', '-3 hours'),
    0, ?
  )
`);

// DOD-2026-0001 - Escola Municipal A (2 notebooks, Validado)
insertDem.run(
  'DOD-2026-0001',
  9, // Profa. Angelita
  'Profa. Angelita de Souza',
  'MAT-51001/PML',
  'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
  'Lages',
  'Escola Municipal A - Secretaria Escolar',
  'Diretora Escolar',
  2,
  JSON.stringify([1, 2]),
  1,
  1,
  'Validado pelo TI',
  'Necessidade de 2 notebooks para atendimento da secretaria escolar, coordenação pedagógica e preenchimento do diário de classe eletrônico.',
  'Diagnóstico técnico confirmou perfil administrativo básico com necessidade de mobilidade interna. Recomendado Notebook Corporativo 15.6 polegadas Intel Core i5/Ryzen 5, 16GB RAM, SSD 512GB.',
  3450.00,
  6900.00,
  12700.00,
  5,
  'BAIXO',
  'computador',
  JSON.stringify({
    tipoDispositivo: 'notebook',
    perfilUso: 'administrativo',
    rotina: ['gestao_escolar', 'documentos_planilhas', 'sistemas_corporativos'],
    sistemas: ['Sistema de Gestão Escolar (SME)', 'Navegador Web / Portais', 'Pacote Office'],
    mobilidade: 'sim',
    multiplasTelas: 'nao',
    motivo: 'equipamento_novo'
  }),
  'Uso administrativo escolar com mobilidade interna. Demanda de 2 notebooks para secretaria e coordenação pedagógica da Escola Municipal A.',
  JSON.stringify({
    tipoEquipamento: 'Notebook Corporativo',
    especificacaoResumida: 'Processador 6 Cores / 12 Threads, 16 GB DDR4/DDR5, SSD 512 GB NVMe, Tela 15.6" Full HD, Windows 11 Pro.',
    quantidadeRecomendada: 2,
    estimativaUnitaria: 3450.00,
    estimativaTotal: 6900.00
  }),
  JSON.stringify(['Desktops antigos com mais de 8 anos obsoletos e sem mobilidade']),
  JSON.stringify({
    objeto: 'Aquisição de 02 (dois) computadores portáteis (notebooks) corporativos para atendimento das rotinas administrativas e pedagógicas da Escola Municipal A.',
    justificativa: 'Atendimento aos objetivos pedagógicos municipais, modernização do registro escolar e garantia de mobilidade nas dependências da Escola Municipal A.',
    localEntrega: 'Escola Municipal A - Rua das Acácias, nº 120, Bairro Universitário, Lages/SC'
  }),
  1 // instituicao_id = 1
);

// DOD-2026-0002 - Escola Municipal B (3 notebooks, Validado)
insertDem.run(
  'DOD-2026-0002',
  1, // Profa. Maria Eduarda
  'Profa. Maria Eduarda Alencar',
  'MAT-48921/PML',
  'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
  'Lages',
  'Escola Municipal B - Secretaria e Direção',
  'Diretora Escolar',
  3,
  JSON.stringify([1, 2]),
  1,
  1,
  'Validado pelo TI',
  'Necessidade de 3 notebooks para equipe de gestão escolar, secretaria e planejamento pedagógico da Escola Municipal B.',
  'Diagnóstico técnico confirmou perfil administrativo padrão com necessidade de deslocamento para reuniões e salas de aula. Especificação técnica compatível com o padrão SME Lages.',
  3450.00,
  10350.00,
  19050.00,
  5,
  'BAIXO',
  'computador',
  JSON.stringify({
    tipoDispositivo: 'notebook',
    perfilUso: 'administrativo',
    rotina: ['gestao_escolar', 'documentos_planilhas', 'sistemas_corporativos'],
    sistemas: ['Sistema de Gestão Escolar (SME)', 'Navegador Web / Portais', 'Pacote Office'],
    mobilidade: 'sim',
    multiplasTelas: 'nao',
    motivo: 'equipamento_novo'
  }),
  'Uso administrativo e pedagógico escolar. Demanda de 3 notebooks para direção e coordenação da Escola Municipal B.',
  JSON.stringify({
    tipoEquipamento: 'Notebook Corporativo',
    especificacaoResumida: 'Processador 6 Cores / 12 Threads, 16 GB DDR4/DDR5, SSD 512 GB NVMe, Tela 15.6" Full HD, Windows 11 Pro.',
    quantidadeRecomendada: 3,
    estimativaUnitaria: 3450.00,
    estimativaTotal: 10350.00
  }),
  JSON.stringify(['1 computador de mesa antigo na secretaria compartilhado por 3 servidores']),
  JSON.stringify({
    objeto: 'Aquisição de 03 (três) computadores portáteis (notebooks) corporativos para renovação do parque computacional da Escola Municipal B.',
    justificativa: 'Garantir infraestrutura de TIC adequada para a gestão escolar da Escola Municipal B, viabilizando o uso concomitante do sistema escolar municipal e planejamento de aulas.',
    localEntrega: 'Escola Municipal B - Av. Duque de Caxias, nº 840, Bairro Coral, Lages/SC'
  }),
  2 // instituicao_id = 2
);

// DOD-2026-0003 - Escola Municipal C (1 notebook, Validado)
insertDem.run(
  'DOD-2026-0003',
  10, // Profa. Carla Cristina
  'Profa. Carla Cristina Silveira',
  'MAT-52440/PML',
  'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
  'Lages',
  'Escola Municipal C - Coordenação',
  'Diretora Escolar',
  1,
  JSON.stringify([1, 2]),
  1,
  1,
  'Validado pelo TI',
  'Solicitação de 1 notebook corporativo para a coordenação pedagógica da Escola Municipal C.',
  'Diagnóstico confirmou necessidade de mobilidade e uso administrativo escolar. Especificação padronizada compatível com as Escolas A e B.',
  3450.00,
  3450.00,
  6350.00,
  5,
  'BAIXO',
  'computador',
  JSON.stringify({
    tipoDispositivo: 'notebook',
    perfilUso: 'administrativo',
    rotina: ['gestao_escolar', 'documentos_planilhas'],
    sistemas: ['Sistema de Gestão Escolar (SME)', 'Navegador Web / Portais', 'Pacote Office'],
    mobilidade: 'sim',
    multiplasTelas: 'nao',
    motivo: 'equipamento_novo'
  }),
  'Demanda de 1 notebook corporativo para a coordenação pedagógica da Escola Municipal C.',
  JSON.stringify({
    tipoEquipamento: 'Notebook Corporativo',
    especificacaoResumida: 'Processador 6 Cores / 12 Threads, 16 GB DDR4/DDR5, SSD 512 GB NVMe, Tela 15.6" Full HD, Windows 11 Pro.',
    quantidadeRecomendada: 1,
    estimativaUnitaria: 3450.00,
    estimativaTotal: 3450.00
  }),
  JSON.stringify(['Nenhum notebook disponível na coordenação']),
  JSON.stringify({
    objeto: 'Aquisição de 01 (um) computador portátil (notebook) corporativo para a coordenação pedagógica da Escola Municipal C.',
    justificativa: 'Suporte às atividades de coordenação e acompanhamento de turmas na Escola Municipal C.',
    localEntrega: 'Escola Municipal C - Rua São Joaquim, nº 45, Bairro Centro, Lages/SC'
  }),
  3 // instituicao_id = 3
);

// DOD-2026-0004 - Unidade de Saúde A (1 computador para atendimento, Validado)
insertDem.run(
  'DOD-2026-0004',
  4, // Dra. Camila Ramos
  'Dra. Camila Ramos',
  'MAT-55319/PML',
  'Prefeitura do Município de Lages - Secretaria Municipal de Saúde',
  'Lages',
  'Unidade Básica de Saúde A (UBS Centro) - Recepção e Triagem',
  'Enfermeira Chefe e Gestora de UBS',
  1,
  JSON.stringify([1, 2]),
  1,
  1,
  'Validado pelo TI',
  'Necessidade de 1 computador de mesa (desktop) com monitor para o guichê de recepção e triagem da UBS Centro.',
  'Diagnóstico técnico confirmou estação fixa de atendimento com prontuário eletrônico e-SUS e agendamento de consultas. Perfil Administrativo Padrão Desktop.',
  2480.00,
  2480.00,
  7320.00,
  5,
  'BAIXO',
  'computador',
  JSON.stringify({
    tipoDispositivo: 'desktop',
    perfilUso: 'atendimento',
    rotina: ['atendimento_publico', 'sistemas_corporativos'],
    sistemas: ['e-SUS APS / Prontuário Eletrônico', 'Navegador Web', 'Sistema Municipal de Regulação'],
    mobilidade: 'nao',
    multiplasTelas: 'nao',
    motivo: 'equipamento_defeito'
  }),
  'Demanda de 1 computador de mesa (desktop) com monitor para guichê de triagem da UBS Centro.',
  JSON.stringify({
    tipoEquipamento: 'Computador Desktop Corporativo + Monitor 21.5"',
    especificacaoResumida: 'Processador 6 Cores, 16 GB RAM, SSD 256 GB NVMe, Monitor 21.5" IPS Full HD, Teclado e Mouse USB ABNT2.',
    quantidadeRecomendada: 1,
    estimativaUnitaria: 2480.00,
    estimativaTotal: 2480.00
  }),
  JSON.stringify(['Computador anterior queimou placa-mãe após oscilação elétrica']),
  JSON.stringify({
    objeto: 'Aquisição de 01 (um) computador de mesa corporativo com monitor para guichê de acolhimento da UBS Centro.',
    justificativa: 'Restabelecimento imediato do atendimento aos cidadãos e preenchimento de prontuários eletrônicos e-SUS.',
    localEntrega: 'Unidade de Saúde A (UBS Centro) - Praça da Catedral, nº 200, Centro, Lages/SC'
  }),
  6 // instituicao_id = 6
);

// Registra histórico das 4 demandas
const demandasCriadas = db.prepare("SELECT id, protocolo, usuario_nome, cargo, status FROM demandas WHERE protocolo IN ('DOD-2026-0001','DOD-2026-0002','DOD-2026-0003','DOD-2026-0004')").all();

for (const d of demandasCriadas) {
  // Limpa histórico anterior dessas 4
  db.prepare('DELETE FROM historico_demandas WHERE demanda_id = ? OR protocolo = ?').run(d.id, d.protocolo);

  db.prepare(`
    INSERT INTO historico_demandas (demanda_id, protocolo, data_hora, acao, usuario_nome, usuario_cargo, tipo_usuario, detalhes, status_resultante)
    VALUES (?, ?, datetime('now', '-3 hours'), 'Solicitação criada pelo servidor e DOD gerado automaticamente', ?, ?, 'servidor', 'Diagnóstico de rotina concluído sem preenchimento técnico manual. DOD gerado pelo DimensionaTI.', 'Enviado para TI')
  `).run(d.id, d.protocolo, d.usuario_nome, d.cargo);

  db.prepare(`
    INSERT INTO historico_demandas (demanda_id, protocolo, data_hora, acao, usuario_nome, usuario_cargo, tipo_usuario, detalhes, status_resultante)
    VALUES (?, ?, datetime('now', '-2 hours'), 'DOD validado tecnicamente pelo TI', 'Téc. Roberto Valente (TIC)', 'Diretoria Geral de TIC', 'admin', 'Análise técnica concluída e aprovada. Demanda homologada e apta para agrupamento em ETP.', 'Validado pelo TI')
  `).run(d.id, d.protocolo);
}

console.log('✅ Demandas do cenário 20 criadas com sucesso (DOD-2026-0001, DOD-2026-0002, DOD-2026-0003, DOD-2026-0004).');
console.log('--- Configuração concluída com sucesso! ---');
