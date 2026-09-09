# Opportunity Explorer — MCP Server

MCP Server que expõe as funcionalidades do **Opportunity Explorer** para clientes compatíveis com o Model Context Protocol (MCP), incluindo o IBM Bob.

## O que é este servidor?

Este servidor implementa o Model Context Protocol sobre transporte **stdio** e permite que agentes de IA utilizem as funcionalidades já existentes do Opportunity Explorer — listagem, busca, análise e geração de proposta — sem replicar nenhuma regra de negócio.

## Arquitetura

```
Cliente MCP (IBM Bob / outro)
    └── MCP Tool (mcp/src/tools.ts)
            └── Service (src/services/*.ts)
                    └── Repository (src/repositories/opportunityRepository.ts)
                                └── src/data/opportunities.json
```

Nenhuma tool acessa `opportunities.json` diretamente.
Nenhuma regra de negócio está duplicada no MCP.

## Tools disponíveis

### `list_opportunities`

| Campo       | Valor                                                    |
|-------------|----------------------------------------------------------|
| Parâmetros  | Nenhum                                                   |
| Serviço     | `opportunityService.listAll()`                           |
| Retorno     | Array JSON com id, title, company, type, level, status   |

**Exemplo de invocação:**
```
list_opportunities
```

---

### `search_opportunities`

| Campo       | Valor                                                              |
|-------------|--------------------------------------------------------------------|
| Parâmetros  | `query: string` (obrigatório)                                      |
| Serviço     | `opportunityService.searchByTerm(query)`                           |
| Retorno     | Array JSON com oportunidades encontradas, ou mensagem sem resultado |

Busca é case-insensitive. Campos pesquisados: title, company, skills, description.

**Exemplos:**
```
search_opportunities { "query": "TypeScript" }
search_opportunities { "query": "n8n" }
search_opportunities { "query": "REST API" }
```

---

### `analyze_opportunity`

| Campo       | Valor                                                              |
|-------------|--------------------------------------------------------------------|
| Parâmetros  | `id: string` (obrigatório)                                         |
| Serviço     | `analysisService.analyze(id)`                                      |
| Retorno     | JSON com todos os campos + complexity (Basic/Intermediate/Advanced) |

**Exemplos com IDs reais:**
```
analyze_opportunity { "id": "opp-001" }
analyze_opportunity { "id": "opp-004" }
analyze_opportunity { "id": "opp-010" }
```

**Possíveis erros:**
- ID inexistente → `isError: true` + mensagem amigável.

---

### `generate_proposal`

| Campo       | Valor                                                          |
|-------------|----------------------------------------------------------------|
| Parâmetros  | `id: string` (obrigatório)                                     |
| Serviço     | `proposalService.generateProposal(id)`                         |
| Retorno     | Texto profissional neutro baseado nos dados da oportunidade     |

A proposta não atribui experiência ao usuário. Usa formulações neutras como "Tenho interesse em contribuir...".

**Exemplos com IDs reais:**
```
generate_proposal { "id": "opp-004" }
generate_proposal { "id": "opp-006" }
```

**Possíveis erros:**
- ID inexistente → `isError: true` + mensagem amigável.

---

## Instalação

```bash
cd mcp
npm install
```

## Build

```bash
cd mcp
npm run build
```

Saída: `mcp/build/index.js`

## Execução (teste manual)

```bash
node mcp/build/index.js
```

O servidor aguarda mensagens JSON-RPC no stdin. Para uso normal, configure no cliente MCP.

## Configuração no IBM Bob

Arquivo: `.bob/mcp.json` (já criado na raiz do projeto)

```json
{
  "mcpServers": {
    "opportunity-explorer": {
      "command": "node",
      "args": ["mcp/build/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

O servidor será carregado automaticamente ao abrir o workspace no Bob.

## Testes

```bash
cd mcp
npm test
```

26 testes automatizados validam todas as 4 tools.

## Dependências

| Pacote | Versão | Finalidade |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.30.0 | SDK oficial MCP — McpServer, StdioServerTransport |
| `zod` | ^4.x (bundled com SDK) | Validação de schema dos inputs |
