#!/usr/bin/env node
/**
 * Opportunity Explorer — MCP Server entry point.
 *
 * Transport: stdio (standard input/output)
 * All logging goes to stderr so stdout remains clean for the MCP protocol.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { registerTools } from "./tools";

const server = new McpServer({
  name: "opportunity-explorer",
  version: "1.0.0",
});

registerTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Opportunity Explorer MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
