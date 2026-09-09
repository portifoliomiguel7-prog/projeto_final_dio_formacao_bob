/**
 * MCP Tools tests.
 *
 * Strategy: test the tool handler logic by invoking the underlying services directly,
 * mirroring exactly what each tool handler does. This validates the integration
 * between MCP tools and the services without requiring a live MCP transport.
 *
 * Additionally, verify that registerTools() registers all 4 expected tools.
 */

import * as opportunityService from "../../src/services/opportunityService";
import * as analysisService from "../../src/services/analysisService";
import * as proposalService from "../../src/services/proposalService";
import { registerTools } from "../src/tools";

// ── registerTools registration check ─────────────────────────────────────────

describe("registerTools()", () => {
  it("registers exactly 4 tools on an McpServer instance", async () => {
    // We use a spy-based mock to count registrations without starting a transport
    const registeredNames: string[] = [];
    const mockServer = {
      registerTool: (name: string, _config: unknown, _cb: unknown) => {
        registeredNames.push(name);
        return {};
      },
    };

    registerTools(mockServer as never);

    expect(registeredNames).toHaveLength(4);
    expect(registeredNames).toContain("list_opportunities");
    expect(registeredNames).toContain("search_opportunities");
    expect(registeredNames).toContain("analyze_opportunity");
    expect(registeredNames).toContain("generate_proposal");
  });
});

// ── list_opportunities ────────────────────────────────────────────────────────

describe("tool: list_opportunities", () => {
  it("service returns 12 opportunities", () => {
    const opps = opportunityService.listAll();
    expect(opps).toHaveLength(12);
  });

  it("each opportunity has id, title, company, type, level, status", () => {
    const opps = opportunityService.listAll();
    opps.forEach((opp) => {
      expect(opp).toHaveProperty("id");
      expect(opp).toHaveProperty("title");
      expect(opp).toHaveProperty("company");
      expect(opp).toHaveProperty("type");
      expect(opp).toHaveProperty("level");
      expect(opp).toHaveProperty("status");
    });
  });

  it("returns an array", () => {
    expect(Array.isArray(opportunityService.listAll())).toBe(true);
  });
});

// ── search_opportunities ──────────────────────────────────────────────────────

describe("tool: search_opportunities", () => {
  it("returns results for a valid query", () => {
    const results = opportunityService.searchByTerm("TypeScript");
    expect(results.length).toBeGreaterThan(0);
  });

  it("is case-insensitive: 'typescript' matches same results as 'TypeScript'", () => {
    const lower = opportunityService.searchByTerm("typescript").map((r) => r.id);
    const mixed = opportunityService.searchByTerm("TypeScript").map((r) => r.id);
    expect(lower).toEqual(mixed);
  });

  it("returns empty array for unknown query", () => {
    expect(opportunityService.searchByTerm("angular-xyz-unknown")).toHaveLength(0);
  });

  it("returns empty array for empty query (service guard)", () => {
    expect(opportunityService.searchByTerm("")).toHaveLength(0);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(opportunityService.searchByTerm("   ")).toHaveLength(0);
  });

  it("finds n8n opportunities", () => {
    const results = opportunityService.searchByTerm("n8n");
    expect(results).toHaveLength(2);
  });

  it("finds by company name", () => {
    const results = opportunityService.searchByTerm("CloudSystems");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("opp-010");
  });
});

// ── analyze_opportunity ───────────────────────────────────────────────────────

describe("tool: analyze_opportunity", () => {
  it("returns analysis for a valid ID", () => {
    const analysis = analysisService.analyze("opp-001");
    expect(analysis).toBeDefined();
    expect(analysis.id).toBe("opp-001");
  });

  it("returns all required fields", () => {
    const analysis = analysisService.analyze("opp-004");
    expect(analysis).toHaveProperty("id");
    expect(analysis).toHaveProperty("title");
    expect(analysis).toHaveProperty("company");
    expect(analysis).toHaveProperty("type");
    expect(analysis).toHaveProperty("source");
    expect(analysis).toHaveProperty("level");
    expect(analysis).toHaveProperty("skills");
    expect(analysis).toHaveProperty("description");
    expect(analysis).toHaveProperty("status");
    expect(analysis).toHaveProperty("complexity");
  });

  it("throws for a non-existent ID", () => {
    expect(() => analysisService.analyze("opp-999")).toThrow();
  });

  it("returns complexity: Basic for opp-003 (any/3skills → score 1)", () => {
    expect(analysisService.analyze("opp-003").complexity).toBe("Basic");
  });

  it("returns complexity: Intermediate for opp-001 (mid/4skills → score 2)", () => {
    expect(analysisService.analyze("opp-001").complexity).toBe("Intermediate");
  });

  it("returns complexity: Advanced for opp-004 (senior/5skills → score 4)", () => {
    expect(analysisService.analyze("opp-004").complexity).toBe("Advanced");
  });

  it("complexity is one of the three valid values for all opportunities", () => {
    const valid = ["Basic", "Intermediate", "Advanced"];
    opportunityService.listAll().forEach((opp) => {
      const { complexity } = analysisService.analyze(opp.id);
      expect(valid).toContain(complexity);
    });
  });
});

// ── generate_proposal ─────────────────────────────────────────────────────────

describe("tool: generate_proposal", () => {
  it("returns a proposal for a valid ID", () => {
    const result = proposalService.generateProposal("opp-001");
    expect(result).toBeDefined();
    expect(result.proposal.length).toBeGreaterThan(0);
  });

  it("throws for a non-existent ID", () => {
    expect(() => proposalService.generateProposal("opp-999")).toThrow();
  });

  it("proposal text is not empty", () => {
    const { proposal } = proposalService.generateProposal("opp-004");
    expect(proposal.trim().length).toBeGreaterThan(0);
  });

  it("proposal contains the company name", () => {
    const result = proposalService.generateProposal("opp-004");
    expect(result.proposal).toContain("Produto SaaS BR");
  });

  it("proposal contains the opportunity title", () => {
    const result = proposalService.generateProposal("opp-004");
    expect(result.proposal).toContain("Engenheiro Full Stack");
  });

  it("proposal uses neutral language (contains 'interesse')", () => {
    const { proposal } = proposalService.generateProposal("opp-001");
    expect(proposal.toLowerCase()).toContain("interesse");
  });

  it("proposal does NOT claim user experience", () => {
    const forbidden = [
      "tenho experiência",
      "minha experiência",
      "já trabalhei",
      "trabalhei com",
      "experiência em",
      "sou especialista",
    ];
    const { proposal } = proposalService.generateProposal("opp-010");
    forbidden.forEach((phrase) => {
      expect(proposal.toLowerCase()).not.toContain(phrase);
    });
  });

  it("proposal returns correct id, title and company fields", () => {
    const result = proposalService.generateProposal("opp-006");
    expect(result.id).toBe("opp-006");
    expect(result.title).toBe("Freelance – API REST com Node.js");
    expect(result.company).toBe("Cliente Direto – E-commerce");
  });
});
