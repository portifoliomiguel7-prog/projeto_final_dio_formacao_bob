# Slash Commands — Opportunity Explorer

Comandos personalizados do IBM Bob para o projeto **Opportunity Explorer**.

## Visão Geral do Fluxo

```
IBM Bob (chat)
  └── Slash Command (.bob/commands/*.md)
        └── src/index.ts  (CLI entry point)
              └── src/commands/*.ts  (command handlers)
                    └── src/services/*.ts  (business logic)
                          └── src/repositories/opportunityRepository.ts
                                └── src/data/opportunities.json
```

Os Slash Commands são wrappers finos: não contêm regras de negócio.
Toda lógica permanece nas camadas de Service e Repository.

---

## Comandos Disponíveis

### `/oportunidades`

| Campo       | Valor                                                             |
|-------------|-------------------------------------------------------------------|
| Arquivo     | `.bob/commands/oportunidades.md`                                  |
| Sintaxe     | `/oportunidades`                                                  |
| Parâmetros  | Nenhum                                                            |
| Objetivo    | Lista todas as oportunidades cadastradas no Opportunity Explorer  |

**Exemplo:**
```
/oportunidades
```

**Comportamento esperado:**
Exibe todas as 12 oportunidades com ID, título, empresa, tipo, nível e status.

**Possíveis erros:**
- Nenhum esperado; caso o arquivo JSON esteja corrompido, o Node.js retornará um erro de parse.

---

### `/buscar`

| Campo       | Valor                                                             |
|-------------|-------------------------------------------------------------------|
| Arquivo     | `.bob/commands/buscar.md`                                         |
| Sintaxe     | `/buscar <termo>`                                                 |
| Parâmetros  | `<termo>` — palavra ou expressão a pesquisar (obrigatório)        |
| Objetivo    | Pesquisa oportunidades por termo em título, empresa, skills e descrição |

**Exemplos:**
```
/buscar TypeScript
/buscar Node.js
/buscar REST API
```

**Comportamento esperado:**
- Busca case-insensitive.
- Retorna lista filtrada de oportunidades.
- Se não houver resultados: `Nenhuma oportunidade encontrada para "<termo>".`

**Possíveis erros:**
- Termo não informado → solicita o termo ao usuário.
- Termo sem resultado → mensagem amigável, sem erro de execução.

---

### `/analisar`

| Campo       | Valor                                                             |
|-------------|-------------------------------------------------------------------|
| Arquivo     | `.bob/commands/analisar.md`                                       |
| Sintaxe     | `/analisar <id>`                                                  |
| Parâmetros  | `<id>` — ID exato da oportunidade (obrigatório)                   |
| Objetivo    | Analisa uma oportunidade com cálculo determinístico de complexidade |

**IDs válidos (amostra):**
```
opp-001  opp-002  opp-003  opp-004  opp-005  opp-006
opp-007  opp-008  opp-009  opp-010  opp-011  opp-012
```

**Exemplos:**
```
/analisar opp-010
/analisar opp-001
```

**Comportamento esperado:**
Exibe ID, título, empresa, tipo, origem, nível, skills, descrição, status e **complexidade** (Basic / Intermediate / Advanced).

Regra de complexidade:
- `levelScore`: junior/any=0, mid=1, senior/lead=2
- `skillScore`: 1–2 skills=0, 3–4=1, 5+=2
- Total 0–1 → Basic | 2–3 → Intermediate | 4 → Advanced

**Possíveis erros:**
- ID não informado → solicita o ID ao usuário.
- ID inexistente → `Erro: oportunidade "<id>" não encontrada.` (exit code 1).

---

### `/proposta`

| Campo       | Valor                                                             |
|-------------|-------------------------------------------------------------------|
| Arquivo     | `.bob/commands/proposta.md`                                       |
| Sintaxe     | `/proposta <id>`                                                  |
| Parâmetros  | `<id>` — ID exato da oportunidade (obrigatório)                   |
| Objetivo    | Gera uma proposta profissional neutra baseada nos dados da oportunidade |

**Exemplos:**
```
/proposta opp-004
/proposta opp-006
```

**Comportamento esperado:**
Retorna texto profissional dirigido à empresa, citando título, skills e nível.
Não afirma experiência do usuário — utiliza formulações neutras como:
> "Tenho interesse em contribuir com uma solução envolvendo..."

**Possíveis erros:**
- ID não informado → solicita o ID ao usuário.
- ID inexistente → `Erro: oportunidade "<id>" não encontrada.` (exit code 1).

---

## Notas Técnicas

- Os comandos usam `npx ts-node` para execução direta sem build prévio.
- Para usar a versão compilada, substitua `npx ts-node src/index.ts` por `node dist/index.js` após `npm run build`.
- Nenhuma lógica de negócio reside nos arquivos `.md` — eles apenas disparam o CLI existente.
