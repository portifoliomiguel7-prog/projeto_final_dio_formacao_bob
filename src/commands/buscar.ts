import * as opportunityService from "../services/opportunityService";
import { formatOpportunityList } from "../utils/formatter";

/**
 * Command: /buscar <term>
 * Searches opportunities by a free-text term.
 */
export function run(term: string | undefined): void {
  if (!term || !term.trim()) {
    console.error("Erro: informe um termo para busca. Exemplo: buscar TypeScript");
    process.exit(1);
  }

  const results = opportunityService.searchByTerm(term);

  if (results.length === 0) {
    console.log(`Nenhuma oportunidade encontrada para "${term}".`);
    return;
  }

  console.log(formatOpportunityList(results));
}
