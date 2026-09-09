---
description: Analisa uma oportunidade do Opportunity Explorer pelo ID informado
argument-hint: <id>
---
Execute o seguinte comando no terminal do projeto Opportunity Explorer e apresente o resultado:

```bash
npx ts-node src/index.ts analisar "$1"
```

Exiba a análise completa da oportunidade de ID "$1", incluindo: ID, título, empresa, tipo, origem, nível, skills, descrição, status e complexidade calculada (Basic, Intermediate ou Advanced).

Se o ID não for encontrado, informe claramente que a oportunidade não existe.

Se o ID não for informado, solicite ao usuário que forneça o ID da oportunidade (exemplo: opp-001).
