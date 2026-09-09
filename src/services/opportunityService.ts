import { Opportunity } from "../types/opportunity";
import * as repository from "../repositories/opportunityRepository";

/**
 * Returns all available opportunities.
 */
export function listAll(): Opportunity[] {
  return repository.findAll();
}

/**
 * Returns a single opportunity by ID.
 * Throws an error if no opportunity with the given ID exists.
 */
export function getById(id: string): Opportunity {
  const opportunity = repository.findById(id);
  if (!opportunity) {
    throw new Error(`Opportunity not found: ${id}`);
  }
  return opportunity;
}

/**
 * Searches opportunities by a free-text term.
 * Matches against title, company, skills and description (case-insensitive).
 * Returns an empty array when no results are found.
 */
export function searchByTerm(term: string): Opportunity[] {
  const trimmed = term.trim();
  if (!trimmed) {
    return [];
  }
  return repository.search(trimmed);
}
