import * as proposalService from "../services/proposalService";

/**
 * Command: /proposta <id>
 * Generates a professional proposal for an opportunity by ID.
 */
export function run(id: string | undefined): void {
  if (!id || !id.trim()) {
    console.error("Erro: informe o ID da oportunidade. Exemplo: proposta opp-001");
    process.exit(1);
  }

  try {
    const result = proposalService.generateProposal(id.trim());
    const divider = "─".repeat(60);
    console.log(divider);
    console.log(`Proposta para: ${result.title} — ${result.company}`);
    console.log(divider);
    console.log(result.proposal);
    console.log(divider);
  } catch (err) {
    console.error(`Erro: oportunidade "${id}" não encontrada.`);
    process.exit(1);
  }
}
