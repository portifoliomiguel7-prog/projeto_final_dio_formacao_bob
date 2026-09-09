import { Opportunity } from "../types/opportunity";
import { OpportunityAnalysis } from "../services/analysisService";

const DIVIDER = "─".repeat(60);

/**
 * Formats a single opportunity as a compact one-line summary.
 */
export function formatOpportunitySummary(opp: Opportunity): string {
  const level = opp.level.padEnd(6);
  const type = opp.type === "job" ? "Vaga      " : "Freelance ";
  return `[${opp.id}] ${opp.title}\n    ${opp.company} | ${type} | ${level} | ${opp.status}`;
}

/**
 * Formats a list of opportunities with a header and dividers.
 */
export function formatOpportunityList(opps: Opportunity[]): string {
  if (opps.length === 0) {
    return "Nenhuma oportunidade encontrada.";
  }
  const header = `${opps.length} oportunidade(s) encontrada(s):\n${DIVIDER}`;
  const rows = opps.map(formatOpportunitySummary).join(`\n${DIVIDER}\n`);
  return `${header}\n${rows}\n${DIVIDER}`;
}

/**
 * Formats a full OpportunityAnalysis result.
 */
export function formatAnalysis(analysis: OpportunityAnalysis): string {
  const lines = [
    DIVIDER,
    `Análise de Oportunidade`,
    DIVIDER,
    `ID          : ${analysis.id}`,
    `Título      : ${analysis.title}`,
    `Empresa     : ${analysis.company}`,
    `Tipo        : ${analysis.type}`,
    `Origem      : ${analysis.source}`,
    `Nível       : ${analysis.level}`,
    `Skills      : ${analysis.skills.join(", ")}`,
    `Status      : ${analysis.status}`,
    `Complexidade: ${analysis.complexity}`,
    DIVIDER,
    `Descrição:`,
    analysis.description,
    DIVIDER,
  ];
  return lines.join("\n");
}
