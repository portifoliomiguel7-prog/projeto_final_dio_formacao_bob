# Guia de Instalação — Opportunity Explorer MCP Server

## 1. Requisitos

| Requisito | Versão mínima |
|---|---|
| Node.js | 18.x ou superior |
| npm | 9.x ou superior |

Verifique:
```bash
node --version
npm --version
```

---

## 2. Instalação

A partir da **raiz do projeto** `opportunity-explorer/`:

```bash
cd mcp
npm install
```

---

## 3. Build

```bash
cd mcp
npm run build
```

Saída esperada: nenhum erro, arquivo `mcp/build/index.js` criado.

Verificação:
```bash
# A partir da raiz do projeto:
node mcp/build/index.js
# Saída esperada no stderr:
# Opportunity Explorer MCP Server running on stdio
# (pressione Ctrl+C para encerrar)
```

---

## 4. Testes

```bash
cd mcp
npm test
```

Resultado esperado: **26 testes passando, 0 falhos.**

---

## 5. Configuração no IBM Bob

O arquivo `.bob/mcp.json` já está configurado na raiz do projeto com o seguinte conteúdo:

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

Este arquivo é detectado automaticamente pelo Bob quando o workspace é aberto.

> **Importante:** o `cwd` usa `${workspaceFolder}`, que o Bob resolve para a raiz do projeto. O `args` usa um caminho relativo a esse diretório.

### Alternativa com caminho absoluto (Windows)

Se necessário substituir por caminho absoluto:
```json
{
  "mcpServers": {
    "opportunity-explorer": {
      "command": "node",
      "args": ["E:\\caminho\\para\\opportunity-explorer\\mcp\\build\\index.js"]
    }
  }
}
```

---

## 6. Validação no Bob

Após abrir o workspace no Bob:

1. Abra o painel MCP do Bob.
2. Verifique que **opportunity-explorer** aparece como conectado.
3. As seguintes tools devem estar disponíveis:
   - `list_opportunities`
   - `search_opportunities`
   - `analyze_opportunity`
   - `generate_proposal`

### Teste rápido no chat do Bob

```
Use a tool list_opportunities
```

```
Use a tool search_opportunities with query "TypeScript"
```

```
Use a tool analyze_opportunity with id "opp-004"
```

```
Use a tool generate_proposal with id "opp-001"
```

---

## 7. Rebuild após alterações

Se o código fonte for alterado:

```bash
cd mcp
npm run build
```

O Bob recarrega automaticamente o servidor após o rebuild.

---

## Resolução de problemas

| Sintoma | Possível causa | Solução |
|---|---|---|
| Servidor não aparece no Bob | Build não foi executado | Execute `npm run build` em `mcp/` |
| "Cannot find module" | `node_modules` ausente | Execute `npm install` em `mcp/` |
| Tool retorna erro de ID | ID não existe em `opportunities.json` | Use IDs válidos: opp-001 a opp-012 |
| Servidor conecta mas não responde | Arquivo JSON corrompido | Verifique `src/data/opportunities.json` |
