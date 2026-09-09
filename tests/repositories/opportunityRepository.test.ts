import * as repo from "../../src/repositories/opportunityRepository";

describe("opportunityRepository", () => {
  // ── findAll ────────────────────────────────────────────────────────────────

  describe("findAll()", () => {
    it("returns an array", () => {
      const result = repo.findAll();
      expect(Array.isArray(result)).toBe(true);
    });

    it("returns exactly 12 records", () => {
      expect(repo.findAll()).toHaveLength(12);
    });

    it("each record has all required fields", () => {
      const required = ["id", "title", "company", "type", "source", "skills", "level", "description", "status"];
      repo.findAll().forEach((opp) => {
        required.forEach((field) => {
          expect(opp).toHaveProperty(field);
        });
      });
    });

    it("skills is always an array", () => {
      repo.findAll().forEach((opp) => {
        expect(Array.isArray(opp.skills)).toBe(true);
      });
    });
  });

  // ── findById ───────────────────────────────────────────────────────────────

  describe("findById()", () => {
    it("finds an existing ID and returns the correct record", () => {
      const result = repo.findById("opp-001");
      expect(result).toBeDefined();
      expect(result!.id).toBe("opp-001");
      expect(result!.title).toBe("Backend Developer Node.js");
      expect(result!.company).toBe("TechCorp Brasil");
    });

    it("returns undefined for a non-existent ID", () => {
      expect(repo.findById("opp-999")).toBeUndefined();
    });

    it("returns undefined for an empty string", () => {
      expect(repo.findById("")).toBeUndefined();
    });

    it("finds opp-012 correctly", () => {
      const result = repo.findById("opp-012");
      expect(result).toBeDefined();
      expect(result!.company).toBe("EduTech Soluções");
    });
  });

  // ── search ─────────────────────────────────────────────────────────────────

  describe("search()", () => {
    it("finds by title (exact casing)", () => {
      const results = repo.search("React");
      const ids = results.map((r) => r.id);
      expect(ids).toContain("opp-002");
    });

    it("finds by title (lowercase)", () => {
      const results = repo.search("react");
      expect(results.length).toBeGreaterThan(0);
    });

    it("finds by title (uppercase)", () => {
      const results = repo.search("REACT");
      expect(results.length).toBeGreaterThan(0);
    });

    it("returns the same results regardless of term casing", () => {
      const upper = repo.search("TYPESCRIPT").map((r) => r.id);
      const lower = repo.search("typescript").map((r) => r.id);
      expect(upper).toEqual(lower);
    });

    it("finds by company name", () => {
      const results = repo.search("CloudSystems");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("opp-010");
    });

    it("finds by skill", () => {
      const results = repo.search("n8n");
      const ids = results.map((r) => r.id);
      expect(ids).toContain("opp-003");
      expect(ids).toContain("opp-011");
    });

    it("finds by description content", () => {
      // opp-002 description mentions "Jest"
      const results = repo.search("Jest");
      const ids = results.map((r) => r.id);
      expect(ids).toContain("opp-002");
    });

    it("returns empty array for a term with no matches", () => {
      expect(repo.search("angular-kubernetes-terraform")).toHaveLength(0);
    });

    it("returns multiple results for a common term", () => {
      const results = repo.search("Node.js");
      expect(results.length).toBeGreaterThan(1);
    });

    it("finds by partial skill name", () => {
      const results = repo.search("Postgre");
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
