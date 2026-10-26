# 🏛️ DimensionaTI SC
### Sistema Inteligente de Dimensionamento de Hardware e Auditoria Preventiva para Compras Públicas
*Trabalho Acadêmico desenvolvido para Hackathon GovTech / Controle Social*  
*Em conformidade com a Lei Federal nº 14.133/2021 (Nova Lei de Licitações e Contratos)*

---

## 📌 1. Visão Geral e Justificativa Acadêmica

As compras públicas de equipamentos de informática frequentemente incorrem em duas falhas críticas de planejamento:
1. **Superdimensionamento (Desperdício de Recursos Públicos):** Servidores com rotinas estritamente administrativas ou de atendimento ao cidadão adquirem computadores de alto desempenho (ex: Core i7/i9 com placas de vídeo profissionais) sem justificativa técnica ou aderência às tarefas executadas.
2. **Subdimensionamento (Perda de Produtividade):** Setores de engenharia, saúde ou análise de dados recebem computadores básicos que não suportam as ferramentas de trabalho (ex: AutoCAD, QGIS, Power BI), travando as atividades do órgão.

O **DimensionaTI SC** resolve esse gargalo ao atuar diretamente na **Fase Interna de Planejamento da Contratação** (Art. 18 da Lei nº 14.133/2021), automatizando a elaboração do **Estudo Técnico Preliminar (ETP)** e integrando um **Painel de Auditoria Preventiva para o Tribunal de Contas do Estado de Santa Catarina (TCE/SC)**.

---

## 🛠️ 2. Arquitetura do Software (100% Gratuito e Aberto)

Para atender ao caráter acadêmico com **custo zero** e facilidade de execução local pelos avaliadores:
* **Frontend:** HTML5 Semântico, CSS3 (com Identidade Visual do Governo de Santa Catarina e TCE/SC) e JavaScript Moderno (Vanilla ES6+).
* **Visualização Analítica:** Chart.js para dashboards do Tribunal de Contas.
* **Backend:** Node.js com Express estruturado em API REST modular.
* **Banco de Dados:** **SQLite Nativo** (`node:sqlite`), sem necessidade de instalar servidores pesados (como MySQL ou PostgreSQL) ou pagar provedores de nuvem.

---

## 📐 3. Os 4 Módulos do Sistema

### 1. Wizard do Servidor (Requisitante)
* Coleta dados do órgão, setor, cargo e quantidade de estações.
* Apresenta catálogo intuitivo de softwares e ferramentas de rotina (divididos em Administrativo, Análise de Dados e Engenharia/Design).

### 2. Motor de Recomendação & Trava Inteligente
* Mapeia os softwares declarados para a especificação técnica ideal (Perfis 1, 2 ou 3).
* **Trava de Superdimensionamento:** Se o usuário tentar selecionar uma máquina muito superior à sua rotina, o sistema:
  * Emite um alerta vibrante de risco.
  * Calcula a variação de custo e o prejuízo orçamentário em tempo real.
  * Eleva o **IRS (Índice de Risco de Superdimensionamento)** para até 92%.
  * Exige o preenchimento de **Justificativa Técnica Especial**.

### 3. Minuta Oficial do ETP (Lei nº 14.133/2021)
* Emite documento formal padronizado contendo:
  * Descrição da necessidade.
  * Levantamento de mercado e dimensionamento.
  * Especificação técnica padronizada dos equipamentos e periféricos ergonômicos (NR-17).
  * Estimativa de quantitativos e economia aos cofres públicos.
  * Parecer de auditoria preventiva e campos para assinatura digital.
  * Suporte nativo para **Imprimir e Salvar em PDF** formatado.

### 4. Painel do Auditor TCE/SC
* Monitoramento de processos licitatórios em tempo real em todo o Estado de Santa Catarina.
* Gráfico de dispersão de risco (Baixo, Médio e Alto).
* Tabela de auditoria com busca e filtros dinâmicos por município, órgão e nível de risco.

---

## 🚀 4. Como Executar o Projeto

### Pré-requisito
* Ter o **Node.js** instalado no computador.

### Passo Único (Windows)
Basta dar **duplo clique** no arquivo executável:
```
iniciar.bat
```
O script iniciará o servidor e abrirá o seu navegador padrão automaticamente em `http://localhost:3000`.

### Execução via Terminal / Linha de Comando:
```bash
# 1. Entre na pasta do projeto
cd dimensionati-sc

# 2. Inicie o servidor
node server.js

# 3. Acesse no navegador
http://localhost:3000
```

---

## 🎤 5. Roteiro Sugerido para o Pitch da Banca (3 Minutos)

* **[0:00 - 0:45] O Problema:**
  > *"Boa tarde! Vocês sabiam que prefeituras e órgãos em Santa Catarina chegam a comprar computadores de R$ 13 mil para setores que usam apenas navegador e texto? Isso não é necessariamente má-fé: é a falta de conhecimento técnico de quem faz o pedido na ponta."*

* **[0:45 - 1:30] A Solução:**
  > *"Apresentamos o **DimensionaTI SC**. Uma plataforma inteligente que transforma as rotinas de trabalho e os softwares do servidor na especificação exata de hardware, eliminando compras superfaturadas ou subdimensionadas."*

* **[1:30 - 2:15] Demonstração Rápida (Use o 'Modo Pitch'):**
  > *(Clique em **'Caso 2: Alerta TCE'** no topo da tela)*  
  > *"Vejam ao vivo: quando um setor administrativo tenta requisitar computadores de ponta com placas gráficas de última geração, a **Trava Inteligente** é acionada! O sistema calcula o sobrecusto de centenas de milhares de reais, eleva o Índice de Risco (IRS) para 92% e exige justificativa formal."*

* **[2:15 - 3:00] Visão do Tribunal e Conclusão:**
  > *(Clique na aba **'4. Painel de Auditoria TCE/SC'**)*  
  > *"Para o Tribunal de Contas do Estado, entregamos uma auditoria preventiva em tempo real antes da licitação ser homologada. Com o DimensionaTI SC, cumprimos a Lei 14.133, geramos economia milionária aos cofres públicos e valorizamos o imposto do cidadão catarinense. Muito obrigado!"*

---

## 📄 6. Licença
Projeto acadêmico disponibilizado sob licença MIT para fins educacionais e de inovação pública.
