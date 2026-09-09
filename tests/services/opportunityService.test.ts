import * as service from "../../src/services/opportunityService";

describe("opportunityService", () => {
  // ── listAll ────────────────────────────────────────────────────────────────

  describe("listAll()", () => {
    it("returns all 12 opportunities", () => {
      expect(service.listAll()).toHaveLength(12);
    });

    it("returns Opportunity objects with required fields", () => {
      const opps = service.listAll();
      opps.forEach((opp) => {
        expect(opp).toHaveProperty("id");
        expect(opp).toHaveProperty("title");
        expect(opp).toHaveProperty("skills");
      });
    });
  });

  // ── getById ────────────────────────────────────────────────────────────────

  describe("getById()", () => {
    it("returns the correct opportunity for a valid ID", () => {
      const opp = service.getById("opp-004");
      expect(opp.id).toBe("opp-004");
      expect(opp.title).toBe("Engenheiro Full Stack – Next.js");
    });

    it("throws an Error for a non-existent ID", () => {
      expect(() => service.getById("opp-999")).toThrow(Error);
    });

    it("error message contains the missing ID", () => {
      expect(() => service.getById("opp-999")).toThrow("opp-999");
    });

    it("throws for an empty string ID", () => {
      expect(() => service.getById("")).toThrow(Error);
    });
  });

  // ── searchByTerm ───────────────────────────────────────────────────────────

  describe("searchByTerm()", () => {
    it("returns results for a valid term", () => {
      const results = service.searchByTerm("TypeScript");
      expect(results.length).toBeGreaterThan(0);
    });

    it("is case-insensitive (lowercase)", () => {
      const lower = service.searchByTerm("typescript");
      const upper = service.searchByTerm("TypeScript");
      expect(lower.map((r) => r.id)).toEqual(upper.map((r) => r.id));
    });

    it("is case-insensitive (uppercase)", () => {
      const result = service.searchByTerm("TYPESCRIPT");
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns empty array when no results match", () => {
      expect(service.searchByTerm("angular-kubernetes-x99")).toHaveLength(0);
    });

    it("returns empty array for an empty string", () => {
      expect(service.searchByTerm("")).toHaveLength(0);
    });

    it("returns empty array for a whitespace-only string", () => {
      expect(service.searchByTerm("   ")).toHaveLength(0);
    });

    it("trims whitespace before searching", () => {
      const trimmed = service.searchByTerm("  Python  ");
      const normal = service.searchByTerm("Python");
      expect(trimmed.map((r) => r.id)).toEqual(normal.map((r) => r.id));
    });

    it("finds n8n opportunities", () => {
      const results = service.searchByTerm("n8n");
      expect(results).toHaveLength(2);
    });
  });
});
