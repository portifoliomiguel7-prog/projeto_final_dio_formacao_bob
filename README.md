# Opportunity Explorer

Aplicação CLI desenvolvida em **Node.js** e **TypeScript** para organizar, pesquisar e analisar oportunidades profissionais — vagas de emprego e projetos freelance.

Desenvolvida como **Projeto Final da Formação IBM com Bob** na [DIO](https://www.dio.me/), utilizando o IBM Bob como agente de desenvolvimento ao longo de todo o processo.

---

## Sobre o projeto

O Opportunity Explorer resolve o problema de organização e avaliação de oportunidades profissionais de forma simples, sem banco de dados e sem frontend.

A aplicação permite:

- **Listar** todas as oportunidades cadastradas
- **Pesquisar** oportunidades por termo livre (título, empresa, skills ou descrição)
- **Analisar** uma oportunidade com classificação determinística de complexidade
- **Gerar uma proposta** profissional e neutra baseada nos dados da oportunidade

As mesmas funcionalidades estão disponíveis via:

- **CLI** (linha de comando) — uso direto no terminal
- **Slash Commands do IBM Bob** — integração com o agente de IA no editor
- **MCP Server** — protocolo Model Context Protocol para clientes compatíveis

A fonte de dados é um arquivo JSON local: [`src/data/opportunities.json`](src/data/opportunities.json).

---

## Funcionalidades

### Listar oportunidades

Retorna todas as oportunidades cadastradas com ID, título, empresa, tipo, nível e status.

```bash
npm run dev -- oportunidades
```

### Buscar oportunidades

Pesquisa por termo livre. A busca é **case-insensitive** e abrange título, empresa, skills e descrição.

```bash
npm run dev -- buscar TypeScript
npm run dev -- buscar "REST API"
```

### Analisar oportunidade

Exibe todos os campos de uma oportunidade e calcula sua **complexidade** (Basic, Intermediate ou Advanced) com base no nível exigido e na quantidade de skills.

```bash
npm run dev -- analisar opp-001
npm run dev -- analisar opp-010
```

### Gerar proposta

Gera um texto profissional e neutro para abordar uma oportunidade. A proposta é determinística — não utiliza IA externa e não atribui experiência ao usuário.

```bash
npm run dev -- proposta opp-004
npm run dev -- proposta opp-006
```

---

## Slash Commands do IBM Bob

Os comandos estão configurados em [`.bob/commands/`](.bob/commands/) e podem ser executados diretamente no chat do Bob.

| Comando | Parâmetro | Descrição |
|---|---|---|
| `/oportunidades` | — | Lista todas as oportunidades |
| `/buscar` | `<termo>` | Pesquisa por termo livre |
| `/analisar` | `<id>` | Analisa uma oportunidade pelo ID |
| `/proposta` | `<id>` | Gera proposta para uma oportunidade pelo ID |

**Exemplos com dados reais:**

```
/oportunidades
/buscar TypeScript
/buscar n8n
/analisar opp-010
/proposta opp-004
```

> Documentação completa: [`.bob/SLASH_COMMANDS_README.md`](.bob/SLASH_COMMANDS_README.md)

---

## MCP Server

O projeto inclui um MCP Server em [`mcp/`](mcp/) que expõe as funcionalidades via Model Context Protocol (transporte stdio).

**Tools disponíveis:**

| Tool | Parâmetro | Descrição |
|---|---|---|
| `list_opportunities` | — | Lista todas as oportunidades |
| `search_opportunities` | `query: string` | Pesquisa por termo |
| `analyze_opportunity` | `id: string` | Analisa oportunidade pelo ID |
| `generate_proposal` | `id: string` | Gera proposta pelo ID |

O servidor já está configurado para o IBM Bob em [`.bob/mcp.json`](.bob/mcp.json).

> Documentação: [`mcp/README.md`](mcp/README.md)  
> Instalação passo a passo: [`mcp/GUIA_INSTALACAO.md`](mcp/GUIA_INSTALACAO.md)

---

## Arquitetura

```
Usuário
  └── CLI / Slash Command / MCP Client
        └── Command Handler  (src/commands/)
              └── Service    (src/services/)
                    └── Repository  (src/repositories/)
                              └── opportunities.json  (src/data/)
```

| Camada | Localização | Responsabilidade |
|---|---|---|
| **Commands** | `src/commands/` | Recebe input, chama services, formata saída |
| **Services** | `src/services/` | Regras de negócio: listagem, busca, análise, proposta |
| **Repository** | `src/repositories/` | Único ponto de acesso ao arquivo JSON |
| **Data Source** | `src/data/` | `opportunities.json` — dados das oportunidades |
| **Slash Commands** | `.bob/commands/` | Wrappers `.md` que disparam o CLI via IBM Bob |
| **MCP** | `mcp/src/` | Expõe os services via MCP sem duplicar regras |

> Detalhes: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Estrutura do projeto

```
opportunity-explorer/
├── .bob/
│   ├── commands/
│   │   ├── analisar.md
│   │   ├── buscar.md
│   │   ├── oportunidades.md
│   │   └── proposta.md
│   ├── mcp.json
│   └── SLASH_COMMANDS_README.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── README.md
├── mcp/
│   ├── src/
│   │   ├── index.ts
│   │   ├── tools.ts
│   │   └── types.ts
│   ├── tests/
│   │   └── tools.test.ts
│   ├── GUIA_INSTALACAO.md
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
├── src/
│   ├── commands/
│   │   ├── analisar.ts
│   │   ├── buscar.ts
│   │   ├── oportunidades.ts
│   │   └── proposta.ts
│   ├── data/
│   │   └── opportunities.json
│   ├── repositories/
│   │   └── opportunityRepository.ts
│   ├── services/
│   │   ├── analysisService.ts
│   │   ├── opportunityService.ts
│   │   └── proposalService.ts
│   ├── types/
│   │   └── opportunity.ts
│   ├── utils/
│   │   └── formatter.ts
│   └── index.ts
├── tests/
│   ├── commands/
│   │   └── commands.test.ts
│   ├── integration/
│   │   └── opportunityFlow.test.ts
│   ├── repositories/
│   │   └── opportunityRepository.test.ts
│   ├── services/
│   │   ├── analysisService.test.ts
│   │   ├── opportunityService.test.ts
│   │   └── proposalService.test.ts
│   └── utils/
│       └── formatter.test.ts
├── jest.config.js
├── package.json
├── TEST_REPORT.md
└── tsconfig.json
```

---

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| IBM Bob | Agente de desenvolvimento — geração e revisão de código ao longo de todo o projeto |
| Node.js | Runtime da aplicação |
| TypeScript | Linguagem principal — tipagem estática |
| Jest | Framework de testes automatizados |
| ts-jest | Integração TypeScript + Jest |
| @modelcontextprotocol/sdk | SDK oficial MCP (v1.30.0) |
| JSON | Fonte de dados local |
| Git / GitHub | Controle de versão |
| Markdown | Documentação |

---

## Requisitos

- **Node.js** — versão conforme `mcp/` exige `>=18` (recomendado: versão LTS atual)
- **npm** — incluso com Node.js

---

## Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd opportunity-explorer
npm install
```

Para instalar as dependências do MCP Server:

```bash
cd mcp
npm install
```

---

## Execução

### Scripts disponíveis (projeto principal)

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev -- <comando>` | Executa via ts-node (sem build) |
| `build` | `npm run build` | Compila TypeScript para `dist/` |
| `test` | `npm test` | Executa todos os testes |
| `test:coverage` | `npm run test:coverage` | Testes com relatório de cobertura |

### Exemplos de execução

```bash
npm run dev -- oportunidades
npm run dev -- buscar TypeScript
npm run dev -- buscar "REST API"
npm run dev -- analisar opp-001
npm run dev -- analisar opp-010
npm run dev -- proposta opp-004
npm run dev -- proposta opp-006
```

### MCP Server

```bash
cd mcp
npm run build   # compila para mcp/build/index.js
npm start       # executa o servidor
npm test        # executa os testes do MCP
```

---

## Testes

Resultados atuais (executados em Node.js v24):

| Métrica | Resultado |
|---|---|
| Test Suites | 8 |
| Testes totais | 155 |
| Passed | 155 |
| Failed | 0 |

**Cobertura do projeto principal (`src/`):**

| Métrica | Resultado |
|---|---|
| Statements | 100% |
| Branches | 93.1% |
| Functions | 100% |
| Lines | 100% |

```bash
npm test              # todos os testes
npm run test:coverage # com cobertura
```

> Relatório completo: [`TEST_REPORT.md`](TEST_REPORT.md)

---

## Exemplo de fluxo completo

```bash
# 1. Listar todas as oportunidades
npm run dev -- oportunidades

# 2. Buscar por tecnologia
npm run dev -- buscar TypeScript
# → retorna 7 resultados, incluindo opp-001

# 3. Analisar a oportunidade selecionada
npm run dev -- analisar opp-001
# → Backend Developer Node.js | TechCorp Brasil | Complexidade: Intermediate

# 4. Gerar proposta
npm run dev -- proposta opp-001
# → Proposta neutra dirigida à TechCorp Brasil
```

---

## Tratamento de erros

O sistema responde com mensagens compreensíveis para as situações mais comuns:

| Situação | Resposta |
|---|---|
| Termo de busca vazio | Mensagem de erro + instrução de uso |
| Busca sem resultado | `Nenhuma oportunidade encontrada para "<termo>".` |
| ID inexistente | `Erro: oportunidade "<id>" não encontrada.` |
| Comando desconhecido | Mensagem de erro + lista de comandos disponíveis |

Em todos os casos de erro, o processo termina com `exit code 1`.

---

## Limitações atuais

A versão entregue foi desenvolvida com escopo deliberadamente reduzido para fins acadêmicos e de demonstração:

- Os dados são fictícios e armazenados em arquivo JSON local
- Não há banco de dados
- Não há interface web ou frontend
- As propostas são geradas de forma determinística, sem IA externa
- Não há autenticação ou controle de acesso

Essas características fazem parte do escopo do Projeto Final e permitem foco na arquitetura, testes e integração com IBM Bob.

---

## Próximas evoluções possíveis

As sugestões abaixo **não fazem parte da versão entregue**:

- Persistência em banco de dados relacional
- API REST para acesso externo
- Interface web para visualização
- Importação automática de oportunidades de fontes externas
- Integração com plataformas como LinkedIn ou Gupy

---

## Licença

MIT
