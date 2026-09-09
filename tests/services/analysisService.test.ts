import * as analysisService from "../../src/services/analysisService";

describe("analysisService", () => {
  // ── analyze – success ──────────────────────────────────────────────────────

  describe("analyze() – valid ID", () => {
    it("returns an analysis object for a valid ID", () => {
      const result = analysisService.analyze("opp-001");
      expect(result).toBeDefined();
    });

    it("returns all required fields", () => {
      const result = analysisService.analyze("opp-001");
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("company");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("source");
      expect(result).toHaveProperty("level");
      expect(result).toHaveProperty("skills");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("complexity");
    });

    it("id and title match the original opportunity", () => {
      const result = analysisService.analyze("opp-001");
      expect(result.id).toBe("opp-001");
      expect(result.title).toBe("Backend Developer Node.js");
    });

    it("complexity is one of the three valid values", () => {
      const valid = ["Basic", "Intermediate", "Advanced"];
      const result = analysisService.analyze("opp-001");
      expect(valid).toContain(result.complexity);
    });
  });

  // ── analyze – error ────────────────────────────────────────────────────────

  describe("analyze() – invalid ID", () => {
    it("throws an Error for a non-existent ID", () => {
      expect(() => analysisService.analyze("opp-999")).toThrow(Error);
    });

    it("error message contains the missing ID", () => {
      expect(() => analysisService.analyze("opp-999")).toThrow("opp-999");
    });
  });

  // ── complexity: Basic ──────────────────────────────────────────────────────
  // opp-003: level=any(0) + 3 skills(1) = 1 → Basic
  // opp-008: level=junior(0) + 4 skills(1) = 1 → Basic

  describe("complexity: Basic", () => {
    it("opp-003 (any level, 3 skills) → Basic", () => {
      expect(analysisService.analyze("opp-003").complexity).toBe("Basic");
    });

    it("opp-008 (junior level, 4 skills) → Basic", () => {
      expect(analysisService.analyze("opp-008").complexity).toBe("Basic");
    });
  });

  // ── complexity: Intermediate ───────────────────────────────────────────────
  // opp-001: level=mid(1) + 4 skills(1) = 2 → Intermediate
  // opp-007: level=lead(2) + 4 skills(1) = 3 → Intermediate

  describe("complexity: Intermediate", () => {
    it("opp-001 (mid level, 4 skills) → Intermediate", () => {
      expect(analysisService.analyze("opp-001").complexity).toBe("Intermediate");
    });

    it("opp-007 (lead level, 4 skills) → Intermediate", () => {
      expect(analysisService.analyze("opp-007").complexity).toBe("Intermediate");
    });
  });

  // ── complexity: Advanced ───────────────────────────────────────────────────
  // opp-004: level=senior(2) + 5 skills(2) = 4 → Advanced
  // opp-010: level=senior(2) + 5 skills(2) = 4 → Advanced

  describe("complexity: Advanced", () => {
    it("opp-004 (senior level, 5 skills) → Advanced", () => {
      expect(analysisService.analyze("opp-004").complexity).toBe("Advanced");
    });

    it("opp-010 (senior level, 5 skills) → Advanced", () => {
      expect(analysisService.analyze("opp-010").complexity).toBe("Advanced");
    });
  });
});
