# Documentação — Opportunity Explorer

Índice da documentação técnica do projeto.

---

## Documentos

| Documento | Descrição |
|---|---|
| [README principal](../README.md) | Visão geral, instalação, execução, exemplos |
| [Arquitetura](ARCHITECTURE.md) | Camadas, fluxos CLI/Bob/MCP, decisões técnicas |
| [Slash Commands](../.bob/SLASH_COMMANDS_README.md) | Comandos do IBM Bob, sintaxe, exemplos, erros |
| [MCP Server](../mcp/README.md) | Tools MCP, parâmetros, configuração |
| [Guia de Instalação MCP](../mcp/GUIA_INSTALACAO.md) | Passo a passo: instalar, compilar, configurar |
| [Relatório de Testes](../TEST_REPORT.md) | Resultados, cobertura, cenários validados |

---

## Dados

O arquivo [`src/data/opportunities.json`](../src/data/opportunities.json) contém 12 oportunidades fictícias utilizadas para demonstrar o comportamento do sistema.

Os IDs seguem o formato `opp-001` a `opp-012`. Todos os exemplos de comandos e documentação utilizam IDs desse arquivo.

### Estrutura de cada oportunidade

```json
{
  "id": "opp-001",
  "title": "Backend Developer Node.js",
  "company": "TechCorp Brasil",
  "type": "job",
  "source": "linkedin",
  "skills": ["Node.js", "TypeScript", "PostgreSQL", "REST API"],
  "level": "mid",
  "description": "...",
  "status": "new"
}
```
