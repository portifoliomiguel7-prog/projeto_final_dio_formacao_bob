export type OpportunityType = "job" | "freelance";

export type OpportunitySource = "linkedin" | "gupy" | "99freelas" | "workana" | "direct" | "other";

export type OpportunityLevel = "junior" | "mid" | "senior" | "lead" | "any";

export type OpportunityStatus = "new" | "applied" | "in_progress" | "discarded" | "closed";

export interface Opportunity {
  /** Unique identifier */
  id: string;
  /** Job or project title */
  title: string;
  /** Company or client name */
  company: string;
  /** Whether it is a full-time job or a freelance project */
  type: OpportunityType;
  /** Platform or origin of the opportunity */
  source: OpportunitySource;
  /** Required technical skills */
  skills: string[];
  /** Seniority level expected */
  level: OpportunityLevel;
  /** Full description of the opportunity */
  description: string;
  /** Current tracking status */
  status: OpportunityStatus;
}
