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
        'Configuração econômica dimensionada para navegação no SGPe/SEI, sistemas web municipais, digitação de documentos e PDFs.',
        'Processador x86-64 Quad-Core físico, 8 threads, clock base 3.4GHz, cache 12MB (Intel Core i3 12ª/13ª Ger ou AMD Ryzen 3 4100/5300G), pontuação mínima PassMark CPU Mark de 9.500 pontos, suporte TPM 2.0 integrado.',
        '8 GB ou 16 GB DDR4 3200MHz (2x 8GB Dual Channel), 2 slots DIMM com suporte a expansão até 64GB.',
        'SSD 256 GB ou 512 GB NVMe M.2 PCIe 3.0 x4, taxa de leitura sequencial mínima de 2.100 MB/s e escrita de 1.200 MB/s, TBW mínimo de 150 TBW.',
        'Controlador Gráfico Integrado compatível com DirectX 12 e OpenGL 4.5, com saídas HDMI 2.0 e DisplayPort nativas.',
        'Monitor 23.8" Full HD (1920x1080) painel IPS anti-reflexo, bordas ultrafinas, base com ajuste de altura mínimo de 100mm, rotação e inclinação (Conforme NR-17 de Ergonomia); Kit Teclado e Mouse USB ABNT2 durabilidade 10M cliques; Fonte PFC Ativo 80 Plus Bronze 85%+ de eficiência.',
        2200.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Placa-mãe OEM corporativa desenvolvida pelo mesmo fabricante ou homologada formalmente, com BIOS em português; suporte a UEFI 2.8+; chip TPM 2.0 físico integrado; gabinete tool-less com sensor de intrusão; certificação de segurança elétrica INMETRO/IEC 62368-1 e compatibilidade eletromagnética CISPR 32; garantia técnica on-site de 36 meses com atendimento em Lages/SC.',
        '#059669'
      ],
      [
        2,
        'Perfil 2: Análise de Dados e Gestão Intermediária',
        'Configuração intermediária para análise de grandes planilhas, relatórios contábeis, Power BI, DBeaver e múltiplos sistemas concorrentes.',
        'Processador Hexa-Core com 12 threads ou Octa-Core, clock turbo 4.4GHz+, cache 18MB+ (Intel Core i5 12400/13400 ou AMD Ryzen 5 5600G/7600), pontuação mínima PassMark de 19.000 pontos.',
        '16 GB ou 32 GB DDR4/DDR5 3200/4800MHz Dual Channel, expansível até 64GB.',
        'SSD 512 GB NVMe M.2 PCIe 4.0 x4, leitura sequencial mínima de 3.500 MB/s e escrita de 2.500 MB/s.',
        'Controlador Gráfico de Alta Performance com suporte a multitelas simultâneas (mínimo 2 saídas digitais HDMI/DP).',
        '2x Monitores 23.8" Full HD IPS com suporte articulado ergonômico a pistão a gás (Dual-Monitor); Teclado e Mouse ergonômicos; Nobreak Senoidal puro 1000VA com autonomia mínima de 20 minutos para salvar rotinas de dados.',
        4500.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Suporte a virtualização VT-x/AMD-V; 4 portas USB 3.2 Gen1; placa de rede Gigabit Ethernet 10/100/1000 com Wake-on-LAN; fonte bivolt automática 80 Plus Bronze; garantia on-site de 36 meses com reposição de peças em Lages/SC.',
        '#2563EB'
      ],
      [
        3,
        'Perfil 3: Engenharia, Obras e Geoprocessamento (SEPLAN / Obras)',
        'Estação de trabalho de alto desempenho gráfico com GPU dedicada para projetos viários, AutoCAD Civil 3D, QGIS, Revit BIM e edição de imagem/vídeo.',
        'Processador Octa-Core de Alta Performance com 16+ threads, clock turbo 5.0GHz+, cache 24MB+ (Intel Core i7 13700/14700 ou AMD Ryzen 7 7700X), pontuação mínima PassMark de 32.000 pontos.',
        '32 GB a 64 GB DDR5 5200MHz Dual Channel com dissipador de calor metálico.',
        'SSD 1 TB NVMe M.2 PCIe 4.0 Gen4, leitura sequencial mínima de 5.000 MB/s e escrita de 4.200 MB/s.',
        'Placa de Vídeo Dedicada Profissional NVIDIA GeForce RTX 3060/4060 8GB GDDR6 ou NVIDIA RTX A1000/A2000 com 3072+ núcleos CUDA e barramento 128-bit mínimo.',
        '2x Monitores 27" IPS com resolução QHD (2560x1440) ou 4K, 99% sRGB fidelidade de cor, base com ajuste vertical ergonômico; Mouse vertical ergonômico de precisão; Nobreak Senoidal 1500VA.',
        9800.00,
        'ESPECIFICAÇÃO DE LICITAÇÃO BLINDADA: Sistema de refrigeração para trabalho contínuo sob carga 100%; fonte de 650W com certificação 80 Plus Gold com 90%+ de eficiência energética; certificação ISV (Independent Software Vendor) para Autodesk e ArcGIS; garantia técnica on-site de 36 meses com atendimento em Lages/SC.',
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
        'ETP-2026-0023',
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
        'ETP-2026-0022',
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
        'ETP-2026-0021',
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
        'ETP-2026-0020',
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
        'ETP-2026-0019',
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
        'ETP-2026-0018',
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

  // Reativa chaves estrangeiras
  try {
    db.exec('PRAGMA foreign_keys = ON;');
  } catch (e) {}
}

initDatabase();

module.exports = { db };
