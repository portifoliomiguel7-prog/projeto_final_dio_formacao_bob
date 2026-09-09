import * as analysisService from "../services/analysisService";
import { formatAnalysis } from "../utils/formatter";

/**
 * Command: /analisar <id>
 * Analyses a single opportunity by ID.
 */
export function run(id: string | undefined): void {
  if (!id || !id.trim()) {
    console.error("Erro: informe o ID da oportunidade. Exemplo: analisar opp-001");
    process.exit(1);
  }

  try {
    const analysis = analysisService.analyze(id.trim());
    console.log(formatAnalysis(analysis));
  } catch (err) {
    console.error(`Erro: oportunidade "${id}" não encontrada.`);
    process.exit(1);
  }
}
