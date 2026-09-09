import { Opportunity, OpportunityLevel } from "../types/opportunity";
import * as opportunityService from "./opportunityService";

export type Complexity = "Basic" | "Intermediate" | "Advanced";

export interface OpportunityAnalysis {
  id: string;
  title: string;
  company: string;
  type: Opportunity["type"];
  source: Opportunity["source"];
  level: Opportunity["level"];
  skills: string[];
  description: string;
  status: Opportunity["status"];
  complexity: Complexity;
}

/**
 * Complexity rules (deterministic, based solely on existing Opportunity fields):
 *
 * Level weight:
 *   junior / any  → 0
 *   mid           → 1
 *   senior / lead → 2
 *
 * Skills weight:
 *   1–2 skills    → 0
 *   3–4 skills    → 1
 *   5+ skills     → 2
 *
 * Total score → Complexity:
 *   0–1  → Basic
 *   2–3  → Intermediate
 *   4    → Advanced
 */
function calculateComplexity(opportunity: Opportunity): Complexity {
  const levelWeights: Record<OpportunityLevel, number> = {
    any: 0,
    junior: 0,
    mid: 1,
    senior: 2,
    lead: 2,
  };

  const levelScore = levelWeights[opportunity.level];

  const skillCount = opportunity.skills.length;
  const skillScore = skillCount >= 5 ? 2 : skillCount >= 3 ? 1 : 0;

  const total = levelScore + skillScore;

  if (total <= 1) return "Basic";
  if (total <= 3) return "Intermediate";
  return "Advanced";
}

/**
 * Analyses an opportunity by ID and returns a structured result
 * that includes a deterministic complexity classification.
 * Throws if the ID does not exist.
 */
export function analyze(id: string): OpportunityAnalysis {
  const opportunity = opportunityService.getById(id);

  return {
    id: opportunity.id,
    title: opportunity.title,
    company: opportunity.company,
    type: opportunity.type,
    source: opportunity.source,
    level: opportunity.level,
    skills: opportunity.skills,
    description: opportunity.description,
    status: opportunity.status,
    complexity: calculateComplexity(opportunity),
  };
}
