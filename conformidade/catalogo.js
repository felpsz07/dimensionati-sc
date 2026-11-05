// conformidade/catalogo.js
// Catálogo versionado de referências normativas/técnicas e critérios de conformidade do DimensionaTI.
//
// REGRAS DE MANUTENÇÃO
// - Não inventar dispositivos. Toda referência deve ter fonte oficial consultada e data de verificação.
// - "aplicabilidade" diferencia o que obriga o Município de Lages do que é apenas referência:
//     'confirmada'                -> norma aplicável ao Município (pode gerar "Não conforme").
//     'nao_confirmada'            -> aplicabilidade ao Município ainda não confirmada (nunca gera "Não conforme").
//     'nao_aplicavel_diretamente' -> obrigatória para outro âmbito (ex.: SISP federal); usada só como referência técnica.
//     'institucional'             -> padrão interno do DimensionaTI/Diretoria de TIC; não é norma.
// - Qualquer alteração neste arquivo gera uma NOVA versão de regras (hash). Verificações antigas
//   mantêm a versão e o snapshot com que foram executadas.

const CATALOGO_ROTULO = '2026.11-r1';
const DATA_VERIFICACAO = '2026-11-05';

const REFERENCIAS = [
  {
    id: 'LEI14133_ART18',
    titulo: 'Lei nº 14.133/2021 — art. 18 (fase preparatória, descrição da necessidade e ETP)',
    tipo: 'norma_obrigatoria',
    dispositivo: 'Art. 18, caput e inciso I; §1º (elementos do ETP); §2º (elementos obrigatórios: incisos I, IV, VI, VIII e XIII do §1º)',
    fonte: 'Planalto — texto compilado da Lei nº 14.133/2021',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    aplicabilidade: 'confirmada',
    nota_aplicabilidade: 'Lei nacional de normas gerais; o art. 1º abrange as administrações públicas dos Municípios.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: []
  },
  {
    id: 'LEI14133_ART20',
    titulo: 'Lei nº 14.133/2021 — art. 20 (itens de consumo de qualidade comum; vedação de artigos de luxo)',
    tipo: 'norma_obrigatoria',
    dispositivo: 'Art. 20, caput e §1º (limites definidos em regulamento de cada Poder/ente)',
    fonte: 'Planalto — texto compilado da Lei nº 14.133/2021',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    aplicabilidade: 'nao_confirmada',
    nota_aplicabilidade: 'O dispositivo trata de "itens de consumo"; computadores costumam ser classificados como bens permanentes. O enquadramento comum/luxo depende de regulamento municipal, não localizado. Usado apenas como orientação de economicidade.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Regulamento municipal do art. 20, §1º, não localizado na pesquisa.']
  },
  {
    id: 'LEI14133_ART41',
    titulo: 'Lei nº 14.133/2021 — art. 41, I (indicação de marca ou modelo)',
    tipo: 'norma_obrigatoria',
    dispositivo: 'Art. 41, I, alíneas "a" a "d" (indicação de marca somente em hipóteses justificadas formalmente, inclusive como mera referência)',
    fonte: 'Planalto — texto compilado da Lei nº 14.133/2021',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    aplicabilidade: 'confirmada',
    nota_aplicabilidade: 'Aplicável ao Município. A verificação automática apenas detecta menção a marca; a existência de justificativa formal deve ser confirmada pelo TI.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: []
  },
  {
    id: 'PORTARIA_SGD_2715_2023',
    titulo: 'Portaria SGD/MGI nº 2.715/2023 — Modelo de Contratação e Gestão de Estações de Trabalho',
    tipo: 'referencia_tecnica',
    dispositivo: 'Modelo de contratação de desktops, notebooks, workstations e monitores (dimensionamento, vida útil, sustentabilidade)',
    fonte: 'Portal gov.br — Secretaria de Governo Digital (MGI)',
    url: 'https://www.gov.br/governodigital/pt-br',
    aplicabilidade: 'nao_aplicavel_diretamente',
    nota_aplicabilidade: 'Obrigatória para órgãos do SISP (Poder Executivo Federal). Para o Município de Lages, serve como referência técnica, salvo adoção por ato municipal.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Parâmetros específicos (vida útil, configurações mínimas) não foram incorporados aos perfis do DimensionaTI.']
  },
  {
    id: 'DECRETO_LAGES_20682_2023',
    titulo: 'Decreto Municipal de Lages nº 20.682/2023 — regulamentação local da Lei nº 14.133/2021',
    tipo: 'norma_obrigatoria',
    dispositivo: 'Procedimentos da fase preparatória (DFD/DOD, ETP, TR) e modelos oficiais municipais',
    fonte: 'Portal da Prefeitura de Lages (modelos de DFD/ETP citados no rodapé dos documentos do sistema)',
    url: 'https://www.lages.sc.gov.br',
    aplicabilidade: 'nao_confirmada',
    nota_aplicabilidade: 'Número citado nos modelos oficiais usados pelo sistema e em pesquisa na web; o texto integral e a vigência não foram conferidos. Requer confirmação pela Procuradoria-Geral do Município.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Texto integral não conferido.']
  },
  {
    id: 'NR17_ERGONOMIA',
    titulo: 'NR-17 — Ergonomia (redação da Portaria MTP nº 423/2021)',
    tipo: 'referencia_tecnica',
    dispositivo: 'Requisitos ergonômicos de postos com monitor (citado no Perfil 1: ajuste de altura do monitor)',
    fonte: 'Portal gov.br — Normas Regulamentadoras (Ministério do Trabalho e Emprego)',
    url: 'https://www.gov.br/trabalho-e-emprego/pt-br',
    aplicabilidade: 'nao_confirmada',
    nota_aplicabilidade: 'As NRs regem relações de emprego (CLT). A aplicação a servidores estatutários depende de legislação municipal, não confirmada. Tratada como referência técnica.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Perfil 1 cita "Norma Regulamentadora NR-17" como se fosse obrigação; aplicabilidade não confirmada.']
  },
  {
    id: 'LEI13146_LBI',
    titulo: 'Lei nº 13.146/2015 — Lei Brasileira de Inclusão (acessibilidade no trabalho)',
    tipo: 'norma_obrigatoria',
    dispositivo: 'Art. 34, §1º (ambientes de trabalho acessíveis e inclusivos) e disposições sobre tecnologia assistiva',
    fonte: 'Planalto — texto compilado da Lei nº 13.146/2015',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm',
    aplicabilidade: 'confirmada',
    nota_aplicabilidade: 'Lei nacional aplicável às pessoas jurídicas de direito público. A lei não define configuração de hardware: o requisito concreto deve ser definido pelo TI caso a caso.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Nenhum perfil prevê recursos de tecnologia assistiva.']
  },
  {
    id: 'PASSMARK',
    titulo: 'PassMark CPU Benchmark — pontuação de referência de processadores',
    tipo: 'referencia_tecnica',
    dispositivo: 'Pontuação mínima de CPU adotada nos perfis (8.500 / 18.000 / 30.000)',
    fonte: 'PassMark Software (base pública de benchmarks)',
    url: 'https://www.cpubenchmark.net',
    aplicabilidade: 'institucional',
    nota_aplicabilidade: 'Referência de mercado escolhida pela equipe; não é norma. Os limiares adotados não têm memória de cálculo registrada no sistema.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Limiares de pontuação sem memória de cálculo documentada.']
  },
  {
    id: 'PADRAO_DIMENSIONATI',
    titulo: 'Padrão institucional DimensionaTI — perfis 1, 2 e 3 e mapeamento atividade/software → perfil',
    tipo: 'padrao_institucional',
    dispositivo: 'Motor /api/calcular-perfil e cadastro perfis_hardware (database.js)',
    fonte: 'Código-fonte do DimensionaTI SC',
    url: '',
    aplicabilidade: 'institucional',
    nota_aplicabilidade: 'Critério técnico interno. Recomenda-se formalizar os perfis por ato da Diretoria de TIC para que sirvam de padrão oficial.',
    verificado_em: DATA_VERIFICACAO,
    divergencias: ['Perfis não foram formalizados por ato administrativo identificado no sistema.']
  }
];

// Fundamentação de cada perfil — origem de cada requisito. Não altera os perfis cadastrados.
const FUNDAMENTACAO_PERFIS = {
  1: {
    formatos_especificados: ['desktop'],
    monitores_previstos: 1,
    requisitos: [
      { item: 'Processador', valor_ref: 'Quad-Core, PassMark ≥ 8.500', origem: 'PADRAO_DIMENSIONATI', referencias: ['PASSMARK'] },
      { item: 'Memória RAM', valor_ref: '8 GB', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Armazenamento', valor_ref: 'SSD 256 GB NVMe', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Monitor', valor_ref: '1 monitor 23,8" com ajuste de altura', origem: 'PADRAO_DIMENSIONATI', referencias: ['NR17_ERGONOMIA'] },
      { item: 'Garantia', valor_ref: '36 meses on-site', origem: 'PADRAO_DIMENSIONATI', referencias: [] }
    ],
    observacoes: ['Perfil não especifica notebook, embora o diagnóstico recomende notebook quando há mobilidade.']
  },
  2: {
    formatos_especificados: ['desktop'],
    monitores_previstos: 2,
    requisitos: [
      { item: 'Processador', valor_ref: 'Hexa-Core, PassMark ≥ 18.000', origem: 'PADRAO_DIMENSIONATI', referencias: ['PASSMARK'] },
      { item: 'Memória RAM', valor_ref: '16 GB', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Armazenamento', valor_ref: 'SSD 512 GB NVMe', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Monitores', valor_ref: '2 monitores 23,8"', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Nobreak', valor_ref: '1000 VA', origem: 'PADRAO_DIMENSIONATI', referencias: [] }
    ],
    observacoes: ['Perfil não especifica notebook.']
  },
  3: {
    formatos_especificados: ['desktop'],
    monitores_previstos: 2,
    requisitos: [
      { item: 'Processador', valor_ref: 'Octa-Core, PassMark ≥ 30.000', origem: 'PADRAO_DIMENSIONATI', referencias: ['PASSMARK'] },
      { item: 'Memória RAM', valor_ref: '32 GB', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'GPU', valor_ref: 'GPU dedicada (marca citada na especificação)', origem: 'PADRAO_DIMENSIONATI', referencias: ['LEI14133_ART41'] },
      { item: 'Monitores', valor_ref: '2 monitores 27" QHD', origem: 'PADRAO_DIMENSIONATI', referencias: [] },
      { item: 'Certificação ISV', valor_ref: 'Autodesk / ArcGIS', origem: 'PADRAO_DIMENSIONATI', referencias: ['LEI14133_ART41'] }
    ],
    observacoes: ['Especificação de GPU cita marca única; requer justificativa (art. 41, I) ou indicação "ou equivalente".', 'Perfil não especifica notebook (mobile workstation).']
  }
};

// Mapeamento software/atividade → perfil mínimo (padrão institucional, derivado do motor existente).
const MAPA_SOFTWARE = [
  { nivel: 3, rotulo: 'Engenharia/CAD/Geoprocessamento', regex: /autocad|qgis|\bbim\b|civil\s*3d|revit|plantas|\bcad\b|arcgis|topograf/i },
  { nivel: 2, rotulo: 'Análise de dados/BI', regex: /power\s*bi|dashboards?|dbeaver|grandes\s+bases|cruzamento|\bbi\b/i },
  { nivel: 1, rotulo: 'Rotina administrativa/escolar', regex: /word|texto|planilha|m[eé]dias|internet|sgpe|\bsei\b|di[aá]rio|notas|reuni|meet|teams|navega|prontu[aá]rio|atendimento|protocolo|of[ií]cio|digita|projetos de lei|sistemas web|auditoria/i }
];

// Necessidades especiais declaradas pelo servidor (pergunta simples do diagnóstico).
const NECESSIDADES_ESPECIAIS = {
  acessibilidade: {
    rotulo: 'Acessibilidade (leitor de tela, ampliação, teclado adaptado)',
    requisito: 'Recursos de tecnologia assistiva/acessibilidade no posto de trabalho',
    motivo: 'Nenhum perfil cadastrado prevê recursos de acessibilidade ou tecnologia assistiva.',
    referencias: ['LEI13146_LBI'],
    alternativas: ['Perfil de referência + kit de tecnologia assistiva definido pelo TI', 'Software leitor de tela/ampliação sem alteração de hardware', 'Monitor maior ou periféricos adaptados']
  },
  edicao_multimidia: {
    rotulo: 'Edição de vídeo, fotos ou materiais gráficos',
    requisito: 'Processamento de mídia (vídeo/imagem) e fidelidade de cores',
    motivo: 'Nenhum perfil foi dimensionado para edição de vídeo/imagem; o Perfil 3 é orientado a CAD/geoprocessamento.',
    referencias: ['PADRAO_DIMENSIONATI'],
    alternativas: ['Perfil 2 com memória ampliada', 'Perfil 3 (GPU dedicada) — verificar risco de superdimensionamento', 'Estação compartilhada da unidade para edição']
  },
  trabalho_campo: {
    rotulo: 'Uso em campo ou ambiente externo',
    requisito: 'Equipamento robusto/portátil para uso externo',
    motivo: 'Os perfis especificam apenas computadores de mesa; não há requisitos de robustez, bateria ou proteção.',
    referencias: ['PADRAO_DIMENSIONATI'],
    alternativas: ['Notebook corporativo com capa/proteção', 'Tablet corporativo', 'Equipamento rugged (avaliar custo)']
  },
  programa_nao_listado: {
    rotulo: 'Programa pesado que não está na lista',
    requisito: 'Software não catalogado com requisitos possivelmente superiores aos perfis',
    motivo: 'O software informado não consta do mapeamento de perfis; os requisitos mínimos do fabricante precisam ser verificados.',
    referencias: ['PADRAO_DIMENSIONATI'],
    alternativas: ['Enquadrar no perfil que atende aos requisitos do fabricante', 'Executar o software em servidor/estação compartilhada', 'Licença em nuvem/SaaS']
  }
};

const TIPOS_FORA_DO_ESCOPO = {
  monitor: 'Monitor avulso', impressora: 'Impressora', software: 'Sistema/licença de software',
  manutencao: 'Manutenção de equipamento', indeciso: 'Necessidade não definida pelo servidor'
};

const ROTULOS_RESULTADO = {
  compativel: 'Compatível',
  pendente: 'Pendente de verificação',
  superdimensionamento: 'Possível superdimensionamento',
  excepcionalidade: 'Excepcionalidade',
  nao_conforme: 'Não conforme'
};

const EXPLICACAO_RESULTADO = {
  compativel: 'A solução atende aos critérios verificados.',
  pendente: 'Faltam informações ou confirmação técnica/normativa para concluir a verificação.',
  superdimensionamento: 'A solução indicada pode superar as necessidades justificadas pelas atividades declaradas.',
  excepcionalidade: 'A necessidade apresentada não é adequadamente atendida pelos perfis existentes. A decisão cabe à equipe de TI.',
  nao_conforme: 'Foi identificado descumprimento fundamentado de regra efetivamente aplicável ao Município.'
};

const MARCAS_HARDWARE = /\b(intel|nvidia|dell|lenovo|hp|positivo|asus|acer|samsung|lg|apple)\b|\bamd\b(?!-v)/ig;

module.exports = {
  CATALOGO_ROTULO, DATA_VERIFICACAO, REFERENCIAS, FUNDAMENTACAO_PERFIS, MAPA_SOFTWARE,
  NECESSIDADES_ESPECIAIS, TIPOS_FORA_DO_ESCOPO, ROTULOS_RESULTADO, EXPLICACAO_RESULTADO, MARCAS_HARDWARE
};
