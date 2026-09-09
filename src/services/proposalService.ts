import * as opportunityService from "./opportunityService";

export interface ProposalResult {
  id: string;
  title: string;
  company: string;
  proposal: string;
}

/**
 * Generates a short, professional, fully deterministic proposal text
 * based exclusively on existing Opportunity fields.
 * No experience or skills are attributed to the user.
 * Throws if the ID does not exist.
 */
export function generateProposal(id: string): ProposalResult {
  const opp = opportunityService.getById(id);

  const typeLabel = opp.type === "job" ? "vaga" : "projeto freelance";
  const skillList = opp.skills.join(", ");
  const levelLabel: Record<string, string> = {
    junior: "nível júnior",
    mid: "nível pleno",
    senior: "nível sênior",
    lead: "nível lead/tech lead",
    any: "qualquer nível de experiência",
  };
  const level = levelLabel[opp.level] ?? opp.level;

  const proposal = [
    `Prezados(as) da ${opp.company},`,
    ``,
    `Tenho interesse em contribuir com uma solução envolvendo ${skillList} para a ${typeLabel} "${opp.title}".`,
    ``,
    `A oportunidade está alinhada com minha busca por desafios de ${level}, e acredito que posso agregar valor ao contexto descrito.`,
    ``,
    `Estou à disposição para uma conversa inicial onde possamos alinhar expectativas e discutir os detalhes da posição.`,
    ``,
    `Atenciosamente,`,
    `[Seu nome]`,
  ].join("\n");

  return {
    id: opp.id,
    title: opp.title,
    company: opp.company,
    proposal,
  };
}
