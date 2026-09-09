/**
 * Integration test: full opportunity flow
 *
 * Validates that all layers work together:
 * list → search → select → analyze → generate proposal
 */
import * as opportunityService from "../../src/services/opportunityService";
import * as analysisService from "../../src/services/analysisService";
import * as proposalService from "../../src/services/proposalService";

describe("Integration: opportunity flow", () => {
  it("lists opportunities, finds one, analyses it, and generates a proposal", () => {
    // Step 1: list all
    const all = opportunityService.listAll();
    expect(all.length).toBeGreaterThan(0);

    // Step 2: search by a real technology
    const searchResults = opportunityService.searchByTerm("TypeScript");
    expect(searchResults.length).toBeGreaterThan(0);

    // Step 3: pick the first result
    const selected = searchResults[0];
    expect(selected.id).toBeTruthy();
    expect(selected.skills).toContain("TypeScript");

    // Step 4: analyse the selected opportunity
    const analysis = analysisService.analyze(selected.id);
    expect(analysis.id).toBe(selected.id);
    expect(analysis.title).toBe(selected.title);
    expect(["Basic", "Intermediate", "Advanced"]).toContain(analysis.complexity);

    // Step 5: generate a proposal
    const proposal = proposalService.generateProposal(selected.id);
    expect(proposal.id).toBe(selected.id);
    expect(proposal.proposal.length).toBeGreaterThan(0);
    expect(proposal.proposal).toContain(selected.company);
  });

  it("search returns subset of listAll", () => {
    const all = opportunityService.listAll();
    const results = opportunityService.searchByTerm("Node.js");
    const allIds = all.map((o) => o.id);
    results.forEach((r) => {
      expect(allIds).toContain(r.id);
    });
  });

  it("analysis ID always matches the requested opportunity ID", () => {
    const opps = opportunityService.listAll();
    opps.forEach((opp) => {
      const analysis = analysisService.analyze(opp.id);
      expect(analysis.id).toBe(opp.id);
    });
  });

  it("proposal ID always matches the requested opportunity ID", () => {
    const opps = opportunityService.listAll();
    opps.forEach((opp) => {
      const result = proposalService.generateProposal(opp.id);
      expect(result.id).toBe(opp.id);
    });
  });

  it("all 12 opportunities can be individually analysed without error", () => {
    const opps = opportunityService.listAll();
    expect(() => {
      opps.forEach((opp) => analysisService.analyze(opp.id));
    }).not.toThrow();
  });

  it("all 12 opportunities can have proposals generated without error", () => {
    const opps = opportunityService.listAll();
    expect(() => {
      opps.forEach((opp) => proposalService.generateProposal(opp.id));
    }).not.toThrow();
  });

  it("error propagates correctly through the full flow for an invalid ID", () => {
    expect(() => analysisService.analyze("opp-INVALID")).toThrow();
    expect(() => proposalService.generateProposal("opp-INVALID")).toThrow();
  });
});
