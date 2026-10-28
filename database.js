// database.js - Conexão e Schema SQLite nativo (Node.js v22+)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'dimensionati.db');
const db = new DatabaseSync(dbPath);

try {
  db.exec('PRAGMA foreign_keys = OFF;');
} catch (e) {
  console.warn('Aviso PRAGMA:', e.message);
}

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      cargo TEXT NOT NULL,
      orgao TEXT NOT NULL,
      setor TEXT NOT NULL,
      municipio TEXT NOT NULL DEFAULT 'Lages',
      matricula TEXT NOT NULL,
      perfil_padrao_id INTEGER NOT NULL DEFAULT 1,
      atividades_padrao TEXT NOT NULL, -- JSON array de IDs de atividades
      avatar TEXT,
      tipo_usuario TEXT NOT NULL DEFAULT 'padrao',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS softwares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      perfil_minimo INTEGER NOT NULL,
      descricao TEXT,
      impacto_ram TEXT,
      impacto_gpu TEXT
    );

    CREATE TABLE IF NOT EXISTS perfis_hardware (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      processador TEXT NOT NULL,
      ram TEXT NOT NULL,
      armazenamento TEXT NOT NULL,
      gpu TEXT NOT NULL,
      perifericos TEXT NOT NULL,
      custo_unitario_estimado REAL NOT NULL,
      especificacao_tecnica_completa TEXT,
      cor_identificadora TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protocolo TEXT UNIQUE NOT NULL,
      usuario_id INTEGER,
      usuario_nome TEXT,
      usuario_matricula TEXT,
      orgao TEXT NOT NULL,
      municipio TEXT NOT NULL,
      setor TEXT NOT NULL,
      cargo TEXT NOT NULL,
      quantidade_usuarios INTEGER NOT NULL,
      softwares TEXT NOT NULL,
      perfil_recomendado_id INTEGER NOT NULL,
      perfil_escolhido_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      justificativa_usuario TEXT,
      justificativa_tecnica_automatica TEXT,
      custo_unitario REAL NOT NULL,
      custo_total REAL NOT NULL,
      economia_estimada REAL NOT NULL,
      irs INTEGER NOT NULL,
      nivel_risco TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  // Popula usuários padrão se vazio
  const userCount = db.prepare('SELECT COUNT(*) as total FROM usuarios').get().total;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      [
        'Profa. Maria Eduarda Alencar',
        'maria.prof@lages.sc.gov.br',
        '123456',
        'Professora e Coordenadora Pedagógica',
        'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
        'Escolas Municipais (SME Lages)',
        'Lages',
        'MAT-48921/PML',
        1,
        JSON.stringify([1, 2]),
        '👩‍🏫'
      ],
      [
        'Eng. Carlos Eduardo Silveira',
        'carlos.eng@lages.sc.gov.br',
        '123456',
        'Engenheiro Civil - Fiscal de Obras',
        'Prefeitura do Município de Lages - Secretaria de Planejamento e Obras',
        'Planejamento & Obras (SEPLAN Lages)',
        'Lages',
        'MAT-31204/PML',
        3,
        JSON.stringify([5, 6]),
        '👷‍♂️'
      ],
      [
        'João Pedro Andrade',
        'joao.admin@lages.sc.gov.br',
        '123456',
        'Auxiliar Administrativo de Atendimento',
        'Prefeitura do Município de Lages - Secretaria de Administração',
        'Administrativo & Atendimento (Prefeitura)',
        'Lages',
        'MAT-19402/PML',
        1,
        JSON.stringify([1, 2, 3]),
        '👨‍💼'
      ],
      [
        'Dra. Camila Ramos',
        'camila.saude@lages.sc.gov.br',
        '123456',
        'Enfermeira Chefe e Gestora de UBS',
        'Prefeitura do Município de Lages - Secretaria Municipal de Saúde',
        'Saúde & Unidades Básicas (UBS Lages)',
        'Lages',
        'MAT-55319/PML',
        1,
        JSON.stringify([1, 2]),
        '👩‍⚕️'
      ],
      [
        'Marcos Vinicius Furtado',
        'marcos.auditor@lages.sc.gov.br',
        '123456',
        'Auditor Fiscal da Receita Municipal',
        'Prefeitura do Município de Lages - Secretaria da Fazenda',
        'Fazenda & Finanças de Lages',
        'Lages',
        'MAT-28104/PML',
        2,
        JSON.stringify([1, 3, 4]),
        '📊'
      ]
    ];

    for (const u of users) {
      insertUser.run(...u);
    }
  }

  // Popula perfis se vazio
  const perfCount = db.prepare('SELECT COUNT(*) as total FROM perfis_hardware').get().total;
  if (perfCount === 0) {
    const insertPerf = db.prepare(`
      INSERT INTO perfis_hardware (id, nome, descricao, processador, ram, armazenamento, gpu, perifericos, custo_unitario_estimado, especificacao_tecnica_completa, cor_identificadora)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const perfis = [
      [
        1,
        'Perfil 1: Administrativo e Atendimento Básico (Padronizado Lages)',
        'Configuração econômica dimensionada para navegação no SGPe/SEI, portais municipais, digitação de textos, ofícios e planilhas de rotina.',
        'Processador x86-64 Quad-Core físico, 8 threads, clock base 3.4GHz, cache 12MB (Intel Core i3 12ª/13ª Ger ou AMD Ryzen 3 4100/5300G), pontuação mínima PassMark de 8.500 pontos, suporte TPM 2.0 integrado.',
        '8 GB DDR4 3200MHz (1x 8GB ou 2x 4GB Dual-Channel), com slot DIMM livre para expansão futura até 32GB ou 64GB.',
        'SSD 256 GB NVMe M.2 PCIe 3.0, leitura mínima de 2.000 MB/s, durabilidade mínima de 150 TBW.',
        'Controlador Gráfico Integrado compatível com DirectX 12 e saídas digitais HDMI / DisplayPort.',
        'Monitor 23.8" Full HD IPS com base ergonômica ajustável em altura (Norma Regulamentadora NR-17); Kit Teclado e Mouse USB ABNT2; Fonte bivolt PFC Ativo certificada 80 Plus Bronze.',
        1850.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Placa-mãe OEM corporativa desenvolvida pelo fabricante do equipamento ou com BIOS customizada contendo logo institucional da marca; chip TPM 2.0 físico ativo; gabinete tool-less com sensor de intrusão; fonte certificada 80 Plus Bronze; garantia técnica on-site de 36 meses com atendimento presencial em Lages/SC.',
        '#10B981'
      ],
      [
        2,
        'Perfil 2: Análise de Dados e Gestão Intermediária',
        'Configuração intermediária para análise de grandes volumes contábeis, Power BI, relatórios analíticos, DBeaver e múltiplos sistemas concorrentes.',
        'Processador Hexa-Core com 12 threads, clock turbo 4.4GHz+, cache 18MB+ (Intel Core i5 12400/13400 ou AMD Ryzen 5 5600G), pontuação mínima PassMark de 18.000 pontos.',
        '16 GB DDR4 ou DDR5 3200/4800MHz (2x 8GB Dual-Channel), expansível até 64GB.',
        'SSD 512 GB NVMe M.2 PCIe 4.0 x4, leitura mínima de 3.500 MB/s e escrita de 2.500 MB/s.',
        'Controlador Gráfico de Alta Performance com suporte a 2 telas simultâneas nativas.',
        '2x Monitores 23.8" Full HD IPS com suporte articulado ergonômico a pistão a gás (Dual-Head); Nobreak Senoidal 1000VA; Teclado e Mouse ergonômicos.',
        3600.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Suporte a virtualização VT-x/AMD-V; 4 portas USB 3.2; fonte 80 Plus Bronze; garantia on-site de 36 meses com atendimento em até 48h úteis em Lages/SC.',
        '#2563EB'
      ],
      [
        3,
        'Perfil 3: Engenharia, Obras e Geoprocessamento (SEPLAN / Obras)',
        'Estação de trabalho de alto desempenho gráfico com GPU dedicada para projetos viários, AutoCAD Civil 3D, QGIS, maquetes 3D e renderização de obras municipais.',
        'Processador Octa-Core de Alta Performance com 16+ threads, clock turbo 5.0GHz+, cache 24MB+ (Intel Core i7 13700/14700 ou AMD Ryzen 7 7700X), pontuação mínima PassMark de 30.000 pontos.',
        '32 GB DDR5 5200MHz Dual-Channel (2x 16GB) com dissipador de calor.',
        'SSD 1 TB NVMe M.2 PCIe 4.0 Gen4, leitura mínima de 5.000 MB/s e escrita de 4.200 MB/s.',
        'Placa de Vídeo Dedicada Profissional NVIDIA GeForce RTX 4060 8GB GDDR6 ou NVIDIA RTX A1000/A2000 com barramento de 128-bit mínimo.',
        '2x Monitores 27" IPS QHD (2560x1440) 99% sRGB; Mouse vertical de precisão; Nobreak Senoidal 1500VA.',
        8200.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Certificação ISV para Autodesk e ArcGIS; refrigeração para carga contínua; fonte 650W 80 Plus Gold; garantia técnica on-site de 36 meses com atendimento presencial em Lages/SC.',
        '#7C3AED'
      ]
    ];

    for (const p of perfis) {
      insertPerf.run(...p);
    }
  }

  // Popula demandas de exemplo para Lages se vazio
  const demCount = db.prepare('SELECT COUNT(*) as total FROM demandas').get().total;
  if (demCount === 0) {
    const insertDemanda = db.prepare(`
      INSERT INTO demandas (
        protocolo, usuario_id, usuario_nome, usuario_matricula, orgao, municipio, setor, cargo,
        quantidade_usuarios, softwares, perfil_recomendado_id, perfil_escolhido_id, status,
        justificativa_usuario, justificativa_tecnica_automatica, custo_unitario, custo_total,
        economia_estimada, irs, nivel_risco, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const demandasSeed = [
      [
        'DOD-2026-0023',
        1,
        'Profa. Maria Eduarda Alencar',
        'MAT-48921/PML',
        'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
        'Lages',
        'Escolas Municipais (SME Lages)',
        'Professora e Coordenadora',
        10,
        JSON.stringify(['Navegar internet e SGPe', 'Digitar ofícios e planos de aula']),
        1,
        1,
        'AUTORIZADA',
        '',
        'Recomendação econômica validada para rotina escolar.',
        2200.00,
        22000.00,
        76000.00,
        5,
        'BAIXO',
        '2026-10-26 14:15:00'
      ],
      [
        'DOD-2026-0022',
        4,
        'Dra. Camila Ramos',
        'MAT-55319/PML',
        'Prefeitura do Município de Lages - Secretaria Municipal de Saúde',
        'Lages',
        'Saúde & Unidades Básicas (UBS Lages)',
        'Enfermeira Chefe / Gestora UBS',
        15,
        JSON.stringify(['Prontuário Eletrônico SUS', 'Navegação e Sistemas Web']),
        1,
        1,
        'AUTORIZADA',
        '',
        'Especificação básica sem desperdício para postos de saúde.',
        2200.00,
        33000.00,
        114000.00,
        8,
        'BAIXO',
        '2026-10-26 11:30:00'
      ],
      [
        'DOD-2026-0021',
        2,
        'Eng. Carlos Eduardo Silveira',
        'MAT-31204/PML',
        'Prefeitura do Município de Lages - Secretaria de Planejamento e Obras',
        'Lages',
        'Planejamento & Obras (SEPLAN Lages)',
        'Engenheiro Civil - Fiscal',
        4,
        JSON.stringify(['AutoCAD Civil 3D', 'QGIS Lages', 'Plantas Viárias']),
        3,
        3,
        'AUTORIZADA',
        'Workstations para georreferenciamento e projetos viários municipais.',
        'Necessidade de alto poder gráfico justificada para corpo de engenharia.',
        9800.00,
        39200.00,
        0.00,
        12,
        'BAIXO',
        '2026-10-25 16:45:00'
      ],
      [
        'DOD-2026-0020',
        5,
        'Marcos Vinicius Furtado',
        'MAT-28104/PML',
        'Prefeitura do Município de Lages - Secretaria da Fazenda',
        'Lages',
        'Fazenda & Finanças de Lages',
        'Auditor Fiscal da Receita',
        8,
        JSON.stringify(['Power BI', 'Cruzamento de Grandes Bases de Dados', 'Auditoria']),
        2,
        2,
        'AUTORIZADA',
        'Análise de grandes volumes fiscais do município.',
        'Configuração intermediária com tela dupla homologada para auditoria fiscal.',
        4500.00,
        36000.00,
        42400.00,
        15,
        'BAIXO',
        '2026-10-25 09:20:00'
      ],
      [
        'DOD-2026-0019',
        3,
        'João Pedro Andrade',
        'MAT-19402/PML',
        'Prefeitura do Município de Lages - Secretaria de Administração',
        'Lages',
        'Administrativo & Atendimento (Prefeitura)',
        'Auxiliar Administrativo',
        12,
        JSON.stringify(['Atendimento ao Cidadão', 'Protocolo e SGPe']),
        1,
        2,
        'SOB ANÁLISE',
        'Solicitado modelo intermediário para rotina simples.',
        'Alerta TCE/SC: Desvio moderado em relação ao perfil recomendado.',
        4500.00,
        54000.00,
        0.00,
        48,
        'MEDIO',
        '2026-10-24 15:10:00'
      ],
      [
        'DOD-2026-0018',
        1,
        'Carlos Alberto Mendes',
        'MAT-11029/PML',
        'Câmara Municipal de Vereadores de Lages',
        'Lages',
        'Gabinete Parlamentar',
        'Assessor Legislativo',
        5,
        JSON.stringify(['Digitação de Projetos de Lei']),
        1,
        3,
        'CANCELADA',
        'Pedido de workstations gamers indeferido pela controladoria interna.',
        'Superdimensionamento grave identificado pelo TCE/SC.',
        9800.00,
        49000.00,
        0.00,
        92,
        'ALTO',
        '2026-10-23 10:05:00'
      ]
    ];

    for (const d of demandasSeed) {
      insertDemanda.run(...d);
    }
  }

  // Atualização garantida dos valores de mercado e 8GB de RAM para o Perfil 1
  try {
    try {
      db.exec(`ALTER TABLE usuarios ADD COLUMN tipo_usuario TEXT DEFAULT 'padrao';`);
    } catch (e) {}

    // Garante que o usuário Admin exista
    const adminExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@lages.sc.gov.br');
    if (!adminExiste) {
      db.prepare(`
        INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar, tipo_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'Administrador Geral de TIC',
        'admin@lages.sc.gov.br',
        '123456',
        'Diretor de TIC e Licitações',
        'Prefeitura do Município de Lages - Diretoria de TIC',
        'Diretoria Geral de Tecnologia e Governança',
        'Lages',
        'MAT-00001/PML',
        2,
        JSON.stringify([1, 2, 4]),
        '👑',
        'admin'
      );
    } else {
      db.prepare(`UPDATE usuarios SET tipo_usuario = 'admin' WHERE email = 'admin@lages.sc.gov.br'`).run();
    }

    // Garante a Diretora Angelita como conta de demonstração
    const angelitaExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('angelita.escola@lages.sc.gov.br');
    if (!angelitaExiste) {
      db.prepare(`
        INSERT INTO usuarios (nome, email, senha, cargo, orgao, setor, municipio, matricula, perfil_padrao_id, atividades_padrao, avatar, tipo_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'Profa. Angelita de Souza',
        'angelita.escola@lages.sc.gov.br',
        '123456',
        'Diretora de Escola Municipal',
        'Prefeitura do Município de Lages - Secretaria Municipal de Educação',
        'Escolas Municipais (SME Lages)',
        'Lages',
        'MAT-48920/PML',
        1,
        JSON.stringify([1, 2, 3]),
        '👩‍💼',
        'padrao'
      );
    }

    db.exec(`
      UPDATE perfis_hardware SET
        processador = 'Quad-Core x86-64 3.4GHz+ (PassMark 8.500+)',
        ram = '8 GB DDR4 3200MHz (expansível até 32GB)',
        armazenamento = 'SSD 256 GB NVMe M.2',
        perifericos = 'Monitor 23.8" IPS com ajuste vertical de altura (NR-17); Kit Teclado/Mouse ABNT2; Fonte 80 Plus Bronze.',
        custo_unitario_estimado = 1850.00
      WHERE id = 1;

      UPDATE perfis_hardware SET
        processador = 'Hexa-Core 4.4GHz+ (PassMark 18.000+)',
        ram = '16 GB DDR4/DDR5 Dual-Channel',
        armazenamento = 'SSD 512 GB NVMe M.2',
        perifericos = '2x Monitores 23.8" Full HD IPS com suporte articulado (Dual-Monitor); Nobreak 1000VA.',
        custo_unitario_estimado = 3600.00
      WHERE id = 2;

      UPDATE perfis_hardware SET
        processador = 'Octa-Core 5.0GHz+ (PassMark 30.000+)',
        ram = '32 GB DDR5 5200MHz Dual-Channel',
        armazenamento = 'SSD 1 TB NVMe Gen4 + GPU NVIDIA RTX Dedicada',
        perifericos = '2x Monitores 27" IPS QHD (2560x1440); Mouse de precisão; Nobreak 1500VA.',
        custo_unitario_estimado = 8200.00
      WHERE id = 3;

      UPDATE demandas SET custo_unitario = 1850.00, custo_total = 18500.00 WHERE perfil_escolhido_id = 1 AND quantidade_usuarios = 10;
      UPDATE demandas SET custo_unitario = 1850.00, custo_total = 27750.00 WHERE perfil_escolhido_id = 1 AND quantidade_usuarios = 15;
    `);

    try {
      db.exec('ALTER TABLE demandas ADD COLUMN motivo_cancelamento TEXT;');
    } catch (colErr) {}

    // Migração de novas colunas para o fluxo Diagnóstico -> DOD -> Validação TI -> ETP
    const novasColunasDemandas = [
      "ALTER TABLE demandas ADD COLUMN tipo_necessidade TEXT DEFAULT 'computador';",
      "ALTER TABLE demandas ADD COLUMN respostas_diagnostico TEXT;",
      "ALTER TABLE demandas ADD COLUMN diagnostico_interpretado TEXT;",
      "ALTER TABLE demandas ADD COLUMN recomendacao_preliminar TEXT;",
      "ALTER TABLE demandas ADD COLUMN recursos_existentes TEXT;",
      "ALTER TABLE demandas ADD COLUMN dod_conteudo TEXT;",
      "ALTER TABLE demandas ADD COLUMN dod_validado INTEGER DEFAULT 0;",
      "ALTER TABLE demandas ADD COLUMN dod_validado_por TEXT;",
      "ALTER TABLE demandas ADD COLUMN dod_validado_em DATETIME;",
      "ALTER TABLE demandas ADD COLUMN etp_gerado INTEGER DEFAULT 0;",
      "ALTER TABLE demandas ADD COLUMN etp_conteudo TEXT;",
      "ALTER TABLE demandas ADD COLUMN etp_gerado_por TEXT;",
      "ALTER TABLE demandas ADD COLUMN etp_gerado_em DATETIME;",
      "ALTER TABLE demandas ADD COLUMN ajustes_solicitados TEXT;",
      "ALTER TABLE demandas ADD COLUMN motivo_reprovacao TEXT;",
      "ALTER TABLE demandas ADD COLUMN responsavel_analise TEXT;",
      "ALTER TABLE demandas ADD COLUMN etp_numero TEXT DEFAULT NULL;",
      "ALTER TABLE demandas ADD COLUMN instituicao_id INTEGER REFERENCES instituicoes(id);",
      "ALTER TABLE demandas ADD COLUMN etp_id INTEGER REFERENCES etps(id);",
      "ALTER TABLE usuarios ADD COLUMN instituicao_id INTEGER REFERENCES instituicoes(id);",
      "ALTER TABLE etps ADD COLUMN tipo_necessidade TEXT DEFAULT 'computador';",
      "ALTER TABLE etps ADD COLUMN titulo TEXT DEFAULT 'Estudo Técnico Preliminar';",
      "ALTER TABLE etps ADD COLUMN objetivo_consolidado TEXT;",
      "ALTER TABLE etps ADD COLUMN quantidade_total INTEGER DEFAULT 1;",
      "ALTER TABLE etps ADD COLUMN custo_unitario_estimado REAL DEFAULT 0;",
      "ALTER TABLE etps ADD COLUMN custo_total_estimado REAL DEFAULT 0;",
      "ALTER TABLE etps ADD COLUMN economia_estimada_total REAL DEFAULT 0;",
      "ALTER TABLE etps ADD COLUMN conteudo_etp TEXT;",
      "ALTER TABLE etps ADD COLUMN gerado_por TEXT;",
      "ALTER TABLE etps ADD COLUMN gerado_em DATETIME DEFAULT CURRENT_TIMESTAMP;",
      "ALTER TABLE etps ADD COLUMN status TEXT DEFAULT 'Validado pelo TI';",
      "ALTER TABLE etps ADD COLUMN validado_por TEXT;",
      "ALTER TABLE etps ADD COLUMN validado_em DATETIME;",
      "ALTER TABLE etp_dods ADD COLUMN etp_protocolo TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN dod_protocolo TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN instituicao_nome TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN custo_total REAL DEFAULT 0;",
      "ALTER TABLE etp_dods ADD COLUMN solicitante_nome TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN cargo TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN motivo_necessidade TEXT;",
      "ALTER TABLE etp_dods ADD COLUMN data_vinculacao DATETIME DEFAULT CURRENT_TIMESTAMP;",
      "ALTER TABLE etp_instituicoes ADD COLUMN instituicao_nome TEXT;",
      "ALTER TABLE etp_instituicoes ADD COLUMN quantidade_total INTEGER DEFAULT 1;",
      "ALTER TABLE etp_instituicoes ADD COLUMN custo_total REAL DEFAULT 0;"
    ];

    for (const sql of novasColunasDemandas) {
      try {
        db.exec(sql);
      } catch (err) {
        // Coluna já existe
      }
    }

    // Migração de protocolos: Requisições/DODs recebem prefixo DOD-2026-XXXX;
    // O prefixo ETP-2026-XXXX fica reservado apenas para quando o ETP for gerado!
    try {
      // Para as demandas que já geraram ETP, registra o etp_numero
      db.exec(`
        UPDATE demandas 
        SET etp_numero = protocolo 
        WHERE (status = 'ETP gerado' OR etp_gerado = 1) AND etp_numero IS NULL;

        -- Converte o identificador da requisição/DOD para DOD-
        UPDATE demandas 
        SET protocolo = 'DOD-' || SUBSTR(protocolo, 5) 
        WHERE protocolo LIKE 'ETP-%';

        -- Atualiza histórico correspondente
        UPDATE historico_demandas 
        SET protocolo = 'DOD-' || SUBSTR(protocolo, 5) 
        WHERE protocolo LIKE 'ETP-%';
      `);
    } catch (migErr) {
      console.warn('Aviso migração DOD/ETP prefixo:', migErr.message);
    }

    // Cria tabela de rastreabilidade e histórico de auditoria
    db.exec(`
      CREATE TABLE IF NOT EXISTS historico_demandas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        demanda_id INTEGER,
        protocolo TEXT NOT NULL,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        acao TEXT NOT NULL,
        usuario_nome TEXT NOT NULL,
        usuario_cargo TEXT,
        tipo_usuario TEXT,
        detalhes TEXT,
        status_resultante TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS instituicoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        secretaria TEXT NOT NULL,
        municipio TEXT NOT NULL DEFAULT 'Lages',
        ativo INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS etps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        protocolo TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        objetivo_consolidado TEXT NOT NULL,
        tipo_necessidade TEXT NOT NULL DEFAULT 'computador',
        quantidade_total INTEGER NOT NULL,
        custo_unitario_estimado REAL NOT NULL,
        custo_total_estimado REAL NOT NULL,
        economia_estimada_total REAL NOT NULL,
        conteudo_etp TEXT,
        gerado_por TEXT NOT NULL,
        gerado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'Validado pelo TI',
        validado_por TEXT,
        validado_em DATETIME
      );

      CREATE TABLE IF NOT EXISTS etp_dods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        etp_id INTEGER NOT NULL,
        etp_protocolo TEXT NOT NULL,
        demanda_id INTEGER NOT NULL,
        dod_protocolo TEXT NOT NULL,
        instituicao_id INTEGER NOT NULL,
        instituicao_nome TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        custo_total REAL NOT NULL,
        solicitante_nome TEXT NOT NULL,
        cargo TEXT,
        motivo_necessidade TEXT,
        data_vinculacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (etp_id) REFERENCES etps(id),
        FOREIGN KEY (demanda_id) REFERENCES demandas(id)
      );

      CREATE TABLE IF NOT EXISTS etp_instituicoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        etp_id INTEGER NOT NULL,
        instituicao_id INTEGER NOT NULL,
        instituicao_nome TEXT NOT NULL,
        quantidade_total INTEGER NOT NULL,
        custo_total REAL NOT NULL,
        FOREIGN KEY (etp_id) REFERENCES etps(id),
        FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
      );
    `);

    // Normalização dos status das demandas existentes para o novo fluxo
    db.exec(`
      UPDATE demandas SET status = 'Validado pelo TI', dod_validado = 1, dod_validado_por = 'Téc. Roberto Valente - TIC', dod_validado_em = datetime('now', '-2 hours')
      WHERE status IN ('AUTORIZADA', 'Aprovado Direto', 'HOMOLOGADO TI', 'Homologado TI');

      UPDATE demandas SET status = 'Em análise pelo TI'
      WHERE status IN ('SOB ANÁLISE', 'Sob Análise', 'Requer Justificativa', 'Bloqueado TCE');

      UPDATE demandas SET status = 'Cancelado'
      WHERE status IN ('CANCELADA', 'CANCELADO');
    `);

    // Popula histórico inicial para demandas sem histórico
    const totalHistorico = db.prepare('SELECT COUNT(*) as c FROM historico_demandas').get().c;
    if (totalHistorico === 0) {
      const todasDemandas = db.prepare('SELECT id, protocolo, usuario_nome, cargo, status, created_at, dod_validado, dod_validado_por FROM demandas').all();
      const insertHist = db.prepare(`
        INSERT INTO historico_demandas (demanda_id, protocolo, data_hora, acao, usuario_nome, usuario_cargo, tipo_usuario, detalhes, status_resultante)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const d of todasDemandas) {
        insertHist.run(
          d.id,
          d.protocolo,
          d.created_at || new Date().toISOString(),
          'Solicitação criada pelo servidor e DOD gerado automaticamente',
          d.usuario_nome || 'Servidor Solicitante',
          d.cargo || 'Servidor',
          'servidor',
          'Diagnóstico de rotina concluído. Documento de Formalização da Demanda (DOD) gerado automaticamente.',
          'Enviado para TI'
        );

        if (d.dod_validado === 1) {
          insertHist.run(
            d.id,
            d.protocolo,
            new Date(Date.now() - 3600000).toISOString(),
            'DOD validado pelo Técnico de TI',
            d.dod_validado_por || 'Téc. Roberto Valente (TIC)',
            'Diretoria de TIC',
            'admin',
            'Análise técnica concluída e aprovada. Liberação concedida para elaboração do ETP.',
            'Validado pelo TI'
          );
        } else if (d.status === 'Cancelado') {
          insertHist.run(
            d.id,
            d.protocolo,
            new Date().toISOString(),
            'Solicitação cancelada',
            d.usuario_nome || 'Servidor Solicitante',
            d.cargo || 'Servidor',
            'servidor',
            'Cancelamento formalizado pelo solicitante.',
            'Cancelado'
          );
        }
      }
    }
    // Seed de Instituições se tabela estiver vazia
    try {
      const totalInst = db.prepare('SELECT COUNT(*) as c FROM instituicoes').get().c;
      if (totalInst === 0) {
        const insertInst = db.prepare(`
          INSERT OR REPLACE INTO instituicoes (id, nome, tipo, secretaria, municipio, ativo)
          VALUES (?, ?, ?, ?, ?, 1)
        `);
        const instituicoesIniciais = [
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
        for (const inst of instituicoesIniciais) {
          insertInst.run(...inst);
        }
      }
    } catch (instErr) {
      console.warn('Aviso seed instituicoes:', instErr.message);
    }
  } catch (e) {
    console.warn('Aviso atualização perfis e migrações:', e.message);
  }

  // Reativa chaves estrangeiras
  try {
    db.exec('PRAGMA foreign_keys = ON;');
  } catch (e) {}
}

initDatabase();

function registrarHistorico(demandaId, protocolo, acao, usuarioNome, usuarioCargo, tipoUsuario, detalhes, statusResultante) {
  try {
    const stmt = db.prepare(`
      INSERT INTO historico_demandas (demanda_id, protocolo, data_hora, acao, usuario_nome, usuario_cargo, tipo_usuario, detalhes, status_resultante)
      VALUES (?, ?, datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(demandaId, protocolo, acao, usuarioNome, usuarioCargo, tipoUsuario, detalhes, statusResultante);
  } catch (err) {
    console.error('Erro ao registrar histórico da demanda:', err.message);
  }
}

module.exports = { db, registrarHistorico };
