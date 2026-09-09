/**
 * Shared TypeScript types used across the MCP server.
 * These re-export the interfaces from the parent project's services so
 * the tools module has strong typing without duplicating definitions.
 */
export type {
  Opportunity,
  OpportunityType,
  OpportunitySource,
  OpportunityLevel,
  OpportunityStatus,
} from "../../src/types/opportunity";

export type { OpportunityAnalysis, Complexity } from "../../src/services/analysisService";

export type { ProposalResult } from "../../src/services/proposalService";
