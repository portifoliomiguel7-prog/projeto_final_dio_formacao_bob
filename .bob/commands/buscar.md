---
description: Pesquisa oportunidades no Opportunity Explorer pelo termo fornecido
argument-hint: <termo>
---
Execute o seguinte comando no terminal do projeto Opportunity Explorer e apresente o resultado:

```bash
npx ts-node src/index.ts buscar "$1"
```

Exiba as oportunidades encontradas para o termo "$1", mostrando ID, título, empresa, tipo, nível e status de cada resultado.

Se nenhuma oportunidade for encontrada, informe claramente que não há resultados para o termo pesquisado.

Se o termo não for informado, solicite ao usuário que forneça um termo de busca.
