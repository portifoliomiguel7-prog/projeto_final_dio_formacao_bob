/**
 * MCP tool handlers for the Opportunity Explorer.
 *
 * Architecture:
 *   MCP Tool → Service → Repository → JSON Data Source
 *
 * Each handler delegates entirely to an existing service.
 * No business logic lives here.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

import * as opportunityService from "../../src/services/opportunityService";
import * as analysisService from "../../src/services/analysisService";
import * as proposalService from "../../src/services/proposalService";

/**
 * Registers all four Opportunity Explorer tools on the given McpServer instance.
 */
export function registerTools(server: McpServer): void {
  // ── list_opportunities ───────────────────────────────────────────────────

  server.registerTool(
    "list_opportunities",
    {
      description:
        "Lista todas as oportunidades profissionais cadastradas no Opportunity Explorer. " +
        "Retorna id, title, company, type, level e status de cada oportunidade.",
    },
    async () => {
      try {
        const opportunities = opportunityService.listAll();
        const summary = opportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          company: opp.company,
          type: opp.type,
          level: opp.level,
          status: opp.status,
        }));
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Erro ao listar oportunidades: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── search_opportunities ──────────────────────────────────────────────────

  server.registerTool(
    "search_opportunities",
    {
      description:
        "Pesquisa oportunidades por termo livre (case-insensitive). " +
        "Busca em title, company, skills e description. " +
        "Parâmetro obrigatório: query.",
      inputSchema: {
        query: z.string().min(1).describe("Termo de busca (ex: TypeScript, Node.js, React)"),
      },
    },
    async ({ query }) => {
      try {
        const results = opportunityService.searchByTerm(query);
        if (results.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Nenhuma oportunidade encontrada para "${query}".`,
              },
            ],
          };
        }
        const summary = results.map((opp) => ({
          id: opp.id,
          title: opp.title,
          company: opp.company,
          type: opp.type,
          level: opp.level,
          status: opp.status,
          skills: opp.skills,
        }));
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Erro ao pesquisar oportunidades: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── analyze_opportunity ───────────────────────────────────────────────────

  server.registerTool(
    "analyze_opportunity",
    {
      description:
        "Analisa uma oportunidade pelo ID e retorna todos os campos mais a classificação " +
        "de complexidade determinística (Basic, Intermediate ou Advanced). " +
        "Parâmetro obrigatório: id.",
      inputSchema: {
        id: z.string().min(1).describe("ID da oportunidade (ex: opp-001)"),
      },
    },
    async ({ id }) => {
      try {
        const analysis = analysisService.analyze(id);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Erro: oportunidade "${id}" não encontrada.`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── generate_proposal ─────────────────────────────────────────────────────

  server.registerTool(
    "generate_proposal",
    {
      description:
        "Gera uma proposta profissional neutra para uma oportunidade pelo ID. " +
        "A proposta é determinística e não atribui experiência ao usuário. " +
        "Parâmetro obrigatório: id.",
      inputSchema: {
        id: z.string().min(1).describe("ID da oportunidade (ex: opp-001)"),
      },
    },
    async ({ id }) => {
      try {
        const result = proposalService.generateProposal(id);
        const output = [
          `Proposta para: ${result.title} — ${result.company}`,
          "",
          result.proposal,
        ].join("\n");
        return {
          content: [
            {
              type: "text" as const,
              text: output,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Erro: oportunidade "${id}" não encontrada.`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
