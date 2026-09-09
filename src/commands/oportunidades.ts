import * as opportunityService from "../services/opportunityService";
import { formatOpportunityList } from "../utils/formatter";

/**
 * Command: /oportunidades
 * Lists all opportunities.
 */
export function run(): void {
  const opportunities = opportunityService.listAll();
  console.log(formatOpportunityList(opportunities));
}
