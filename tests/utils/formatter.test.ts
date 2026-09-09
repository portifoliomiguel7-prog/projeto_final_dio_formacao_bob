import { Opportunity } from "../../src/types/opportunity";
import {
  formatOpportunitySummary,
  formatOpportunityList,
  formatAnalysis,
} from "../../src/utils/formatter";
import { OpportunityAnalysis } from "../../src/services/analysisService";

const sampleJob: Opportunity = {
  id: "opp-001",
  title: "Backend Developer Node.js",
  company: "TechCorp Brasil",
  type: "job",
  source: "linkedin",
  skills: ["Node.js", "TypeScript"],
  level: "mid",
  description: "Sample description.",
  status: "new",
};

const sampleFreelance: Opportunity = {
  ...sampleJob,
  id: "opp-003",
  type: "freelance",
  status: "applied",
};

const sampleAnalysis: OpportunityAnalysis = {
  id: "opp-001",
  title: "Backend Developer Node.js",
  company: "TechCorp Brasil",
  type: "job",
  source: "linkedin",
  level: "mid",
  skills: ["Node.js", "TypeScript"],
  description: "Sample description.",
  status: "new",
  complexity: "Intermediate",
};

describe("formatter", () => {
  // ── formatOpportunitySummary ───────────────────────────────────────────────

  describe("formatOpportunitySummary()", () => {
    it("includes the opportunity ID", () => {
      expect(formatOpportunitySummary(sampleJob)).toContain("opp-001");
    });

    it("includes the title", () => {
      expect(formatOpportunitySummary(sampleJob)).toContain("Backend Developer Node.js");
    });

    it("includes the company", () => {
      expect(formatOpportunitySummary(sampleJob)).toContain("TechCorp Brasil");
    });

    it("shows 'Vaga' for job type", () => {
      expect(formatOpportunitySummary(sampleJob)).toContain("Vaga");
    });

    it("shows 'Freelance' for freelance type", () => {
      expect(formatOpportunitySummary(sampleFreelance)).toContain("Freelance");
    });

    it("includes the status", () => {
      expect(formatOpportunitySummary(sampleJob)).toContain("new");
    });
  });

  // ── formatOpportunityList ──────────────────────────────────────────────────

  describe("formatOpportunityList()", () => {
    it("returns 'Nenhuma oportunidade encontrada.' for empty array", () => {
      expect(formatOpportunityList([])).toBe("Nenhuma oportunidade encontrada.");
    });

    it("includes count in header for non-empty list", () => {
      expect(formatOpportunityList([sampleJob])).toContain("1 oportunidade(s)");
    });

    it("includes count for multiple results", () => {
      expect(formatOpportunityList([sampleJob, sampleFreelance])).toContain("2 oportunidade(s)");
    });

    it("contains each opportunity ID in the output", () => {
      const output = formatOpportunityList([sampleJob, sampleFreelance]);
      expect(output).toContain("opp-001");
      expect(output).toContain("opp-003");
    });
  });

  // ── formatAnalysis ─────────────────────────────────────────────────────────

  describe("formatAnalysis()", () => {
    it("includes the ID", () => {
      expect(formatAnalysis(sampleAnalysis)).toContain("opp-001");
    });

    it("includes the title", () => {
      expect(formatAnalysis(sampleAnalysis)).toContain("Backend Developer Node.js");
    });

    it("includes the complexity", () => {
      expect(formatAnalysis(sampleAnalysis)).toContain("Intermediate");
    });

    it("includes the company", () => {
      expect(formatAnalysis(sampleAnalysis)).toContain("TechCorp Brasil");
    });

    it("includes the description", () => {
      expect(formatAnalysis(sampleAnalysis)).toContain("Sample description.");
    });

    it("includes skills", () => {
      const output = formatAnalysis(sampleAnalysis);
      expect(output).toContain("Node.js");
    });
  });
});
