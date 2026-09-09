import * as proposalService from "../../src/services/proposalService";

/** Phrases that would incorrectly attribute experience to the user */
const FORBIDDEN_PHRASES = [
  "tenho experiência",
  "minha experiência",
  "já trabalhei",
  "trabalhei com",
  "experiência em",
  "anos de experiência",
  "sou especialista",
];

describe("proposalService", () => {
  // ── generateProposal – success ─────────────────────────────────────────────

  describe("generateProposal() – valid ID", () => {
    it("returns a ProposalResult object for a valid ID", () => {
      const result = proposalService.generateProposal("opp-001");
      expect(result).toBeDefined();
    });

    it("result has required fields: id, title, company, proposal", () => {
      const result = proposalService.generateProposal("opp-001");
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("company");
      expect(result).toHaveProperty("proposal");
    });

    it("id matches the requested opportunity", () => {
      expect(proposalService.generateProposal("opp-001").id).toBe("opp-001");
    });

    it("title is not empty", () => {
      const { title } = proposalService.generateProposal("opp-001");
      expect(title.length).toBeGreaterThan(0);
    });

    it("company is not empty", () => {
      const { company } = proposalService.generateProposal("opp-001");
      expect(company.length).toBeGreaterThan(0);
    });

    it("proposal text is not empty", () => {
      const { proposal } = proposalService.generateProposal("opp-001");
      expect(proposal.length).toBeGreaterThan(0);
    });

    it("proposal text contains the company name", () => {
      const result = proposalService.generateProposal("opp-004");
      expect(result.proposal).toContain("Produto SaaS BR");
    });

    it("proposal text contains the opportunity title", () => {
      const result = proposalService.generateProposal("opp-004");
      expect(result.proposal).toContain("Engenheiro Full Stack");
    });

    it("proposal text contains at least one skill from the opportunity", () => {
      const result = proposalService.generateProposal("opp-001");
      const skills = ["Node.js", "TypeScript", "PostgreSQL", "REST API"];
      const foundAny = skills.some((skill) => result.proposal.includes(skill));
      expect(foundAny).toBe(true);
    });

    it("proposal uses neutral language (interest expression)", () => {
      const result = proposalService.generateProposal("opp-001");
      // Must contain interest-based phrasing, not experience claims
      expect(result.proposal.toLowerCase()).toContain("interesse");
    });
  });

  // ── generateProposal – neutrality ─────────────────────────────────────────

  describe("generateProposal() – neutrality guarantee", () => {
    const testIds = ["opp-001", "opp-004", "opp-006", "opp-008", "opp-012"];

    testIds.forEach((id) => {
      FORBIDDEN_PHRASES.forEach((phrase) => {
        it(`[${id}] proposal does not claim user experience: "${phrase}"`, () => {
          const { proposal } = proposalService.generateProposal(id);
          expect(proposal.toLowerCase()).not.toContain(phrase.toLowerCase());
        });
      });
    });
  });

  // ── generateProposal – job vs freelance ───────────────────────────────────

  describe("generateProposal() – type labelling", () => {
    it("job opportunity uses 'vaga' in proposal text", () => {
      const result = proposalService.generateProposal("opp-001"); // type: job
      expect(result.proposal).toContain("vaga");
    });

    it("freelance opportunity uses 'projeto freelance' in proposal text", () => {
      const result = proposalService.generateProposal("opp-006"); // type: freelance
      expect(result.proposal).toContain("projeto freelance");
    });
  });

  // ── generateProposal – error ───────────────────────────────────────────────

  describe("generateProposal() – invalid ID", () => {
    it("throws an Error for a non-existent ID", () => {
      expect(() => proposalService.generateProposal("opp-999")).toThrow(Error);
    });

    it("error message contains the missing ID", () => {
      expect(() => proposalService.generateProposal("opp-999")).toThrow("opp-999");
    });
  });
});
