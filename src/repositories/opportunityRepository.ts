import * as fs from "fs";
import * as path from "path";
import { Opportunity } from "../types/opportunity";

const DATA_PATH = path.resolve(__dirname, "../data/opportunities.json");

function loadAll(): Opportunity[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Opportunity[];
}

/**
 * Returns every opportunity stored in the data source.
 */
export function findAll(): Opportunity[] {
  return loadAll();
}

/**
 * Returns a single opportunity by its exact ID, or undefined if not found.
 */
export function findById(id: string): Opportunity | undefined {
  return loadAll().find((opp) => opp.id === id);
}

/**
 * Returns all opportunities whose title, company, skills or description
 * contain the given term (case-insensitive).
 */
export function search(term: string): Opportunity[] {
  const normalized = term.toLowerCase();

  return loadAll().filter((opp) => {
    const inTitle = opp.title.toLowerCase().includes(normalized);
    const inCompany = opp.company.toLowerCase().includes(normalized);
    const inDescription = opp.description.toLowerCase().includes(normalized);
    const inSkills = opp.skills.some((skill) =>
      skill.toLowerCase().includes(normalized)
    );

    return inTitle || inCompany || inDescription || inSkills;
  });
}
