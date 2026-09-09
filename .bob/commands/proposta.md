---
description: Gera uma proposta profissional para uma oportunidade do Opportunity Explorer pelo ID informado
argument-hint: <id>
---
Execute o seguinte comando no terminal do projeto Opportunity Explorer e apresente o resultado:

```bash
npx ts-node src/index.ts proposta "$1"
```

Exiba a proposta gerada para a oportunidade de ID "$1". A proposta é um texto profissional e neutro baseado nos dados da oportunidade (título, empresa, tipo, nível e skills).

Se o ID não for encontrado, informe claramente que a oportunidade não existe.

Se o ID não for informado, solicite ao usuário que forneça o ID da oportunidade (exemplo: opp-001).
