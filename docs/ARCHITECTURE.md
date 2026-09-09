# Arquitetura — Opportunity Explorer

## Visão Geral

O Opportunity Explorer é organizado em camadas com responsabilidades bem definidas. Nenhuma camada salta uma camada abaixo dela: commands chamam services, services chamam o repository, e o repository acessa o JSON.

```
Usuário
  └── Interface (CLI / Slash Command / MCP Client)
        └── Command Handler
              └── Service
                    └── Repository
                              └── JSON Data Source
```

---

## Camadas

### Command

**Localização:** `src/commands/`

**Arquivos:**
- `oportunidades.ts` — handler do comando `/oportunidades`
- `buscar.ts` — handler do comando `/buscar <termo>`
- `analisar.ts` — handler do comando `/analisar <id>`
- `proposta.ts` — handler do comando `/proposta <id>`

**Responsabilidade:** Receber o input do CLI, validar argumentos obrigatórios, chamar o service correspondente e formatar a saída para o terminal. Não contém regras de negócio.

---

### Service

**Localização:** `src/services/`

**Arquivos:**
- `opportunityService.ts` — listagem, busca por ID, busca por termo
- `analysisService.ts` — análise determinística com cálculo de complexidade
- `proposalService.ts` — geração de proposta profissional neutra

**Responsabilidade:** Conter toda a lógica de negócio. São reutilizados por CLI, Slash Commands e MCP sem duplicação.

**Regra de complexidade (analysisService):**

| Variável | Critério | Score |
|---|---|---|
| `levelScore` | junior / any | 0 |
| `levelScore` | mid | 1 |
| `levelScore` | senior / lead | 2 |
| `skillScore` | 1–2 skills | 0 |
| `skillScore` | 3–4 skills | 1 |
| `skillScore` | 5+ skills | 2 |

| Total | Complexidade |
|---|---|
| 0–1 | Basic |
| 2–3 | Intermediate |
| 4 | Advanced |

---

### Repository

**Localização:** `src/repositories/opportunityRepository.ts`

**Responsabilidade:** Único ponto de acesso ao arquivo de dados. Expõe três funções:

- `findAll()` — retorna todas as oportunidades
- `findById(id)` — retorna uma oportunidade por ID ou `undefined`
- `search(term)` — busca case-insensitive em title, company, skills e description

Nenhuma outra camada lê o arquivo JSON diretamente.

---

### JSON Data Source

**Localização:** `src/data/opportunities.json`

**Responsabilidade:** Fonte de dados local. Contém 12 oportunidades fictícias para fins de demonstração. Cada registro segue a interface `Opportunity` definida em `src/types/opportunity.ts`.

**Campos de cada oportunidade:**

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único (ex: `opp-001`) |
| `title` | string | Título da vaga ou projeto |
| `company` | string | Empresa ou cliente |
| `type` | `job` \| `freelance` | Tipo da oportunidade |
| `source` | string | Plataforma de origem |
| `skills` | string[] | Tecnologias exigidas |
| `level` | string | Nível de senioridade |
| `description` | string | Descrição completa |
| `status` | string | Status de acompanhamento |

---

### Bob Slash Commands

**Localização:** `.bob/commands/`

**Arquivos:**
- `oportunidades.md` → `/oportunidades`
- `buscar.md` → `/buscar <termo>`
- `analisar.md` → `/analisar <id>`
- `proposta.md` → `/proposta <id>`

**Responsabilidade:** Arquivos Markdown com frontmatter reconhecido pelo IBM Bob. Cada arquivo instrui o Bob a executar o comando CLI correspondente e apresentar o resultado. Não contêm regras de negócio.

**Frontmatter utilizado:**

```yaml
---
description: <descrição exibida no menu de comandos>
argument-hint: <id>        # apenas para comandos com parâmetro
---
```

---

### MCP Layer

**Localização:** `mcp/src/`

**Arquivos:**
- `index.ts` — inicializa `McpServer` + `StdioServerTransport`
- `tools.ts` — registra as 4 tools via `server.registerTool()`
- `types.ts` — re-exports de tipos do projeto principal

**Responsabilidade:** Expor as funcionalidades do Opportunity Explorer via Model Context Protocol (transport stdio). Cada tool delega integralmente ao service correspondente — nenhuma regra de negócio reside no MCP.

**Tools registradas:**

| Tool | Service |
|---|---|
| `list_opportunities` | `opportunityService.listAll()` |
| `search_opportunities` | `opportunityService.searchByTerm()` |
| `analyze_opportunity` | `analysisService.analyze()` |
| `generate_proposal` | `proposalService.generateProposal()` |

---

## Fluxo CLI

```
Usuário (terminal)
  └── src/index.ts          (parse de process.argv)
        └── src/commands/   (handler do comando)
              └── src/services/  (regras de negócio)
                    └── src/repositories/  (acesso ao JSON)
                              └── src/data/opportunities.json
```

**Exemplo:**
```bash
npm run dev -- buscar TypeScript
# → index.ts identifica "buscar" e chama buscar.run("TypeScript")
# → buscar.ts chama opportunityService.searchByTerm("TypeScript")
# → opportunityService.ts chama repository.search("TypeScript")
# → repository lê opportunities.json e filtra os registros
# → resultado formatado é impresso no terminal
```

---

## Fluxo IBM Bob (Slash Command)

```
Usuário (chat Bob)
  └── /buscar TypeScript
        └── .bob/commands/buscar.md   (instrução ao Bob)
              └── npx ts-node src/index.ts buscar "TypeScript"
                    └── src/commands/buscar.ts
                          └── src/services/opportunityService.ts
                                └── src/repositories/opportunityRepository.ts
                                          └── src/data/opportunities.json
```

O Slash Command instrui o Bob a executar o CLI. A lógica de negócio é a mesma utilizada no terminal.

---

## Fluxo MCP

```
MCP Client (IBM Bob ou outro cliente)
  └── tool: search_opportunities { query: "TypeScript" }
        └── mcp/src/tools.ts   (handler da tool)
              └── src/services/opportunityService.ts
                    └── src/repositories/opportunityRepository.ts
                              └── src/data/opportunities.json
```

O MCP Server é iniciado como processo filho pelo cliente (stdio transport). As tools delegam aos mesmos services usados pelo CLI.

---

## Decisões Arquiteturais

### JSON em vez de banco de dados

Decisão deliberada para manter o projeto simples, sem dependências de infraestrutura, adequado para demonstração e avaliação acadêmica. A camada de Repository isola esse detalhe — trocar JSON por banco exigiria alterar apenas o repository.

### Ausência de dependências de runtime no projeto principal

O projeto principal (`src/`) não possui dependências de runtime (somente `devDependencies`). Utiliza exclusivamente módulos nativos do Node.js: `fs`, `path`, `process`. O MCP Server possui apenas `@modelcontextprotocol/sdk` como dependência de produção.

### Services compartilhados entre CLI e MCP

Os services em `src/services/` são utilizados tanto pelos command handlers quanto pelas MCP tools. Nenhuma lógica foi duplicada.

### Lógica determinística

A análise de complexidade e a geração de proposta são completamente determinísticas. O mesmo input sempre produz o mesmo output, facilitando testes e rastreabilidade.

### Repository como ponto único de acesso aos dados

Nenhuma outra camada acessa `opportunities.json` diretamente. Isso garante que mudanças na fonte de dados (ex: troca por banco) afetem apenas o repository.

---

## Princípios Aplicados

| Princípio | Como foi aplicado |
|---|---|
| **Separação de responsabilidades** | Cada camada tem papel único e bem definido |
| **Reutilização** | Services são compartilhados por CLI, Slash Commands e MCP |
| **Testabilidade** | Cada camada pode ser testada de forma isolada (100% de cobertura em statements) |
| **Baixo acoplamento** | Commands não conhecem o repository; MCP não conhece o JSON |
