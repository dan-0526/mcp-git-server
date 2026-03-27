#!/usr/bin/env node

/**
 * MCP Git Server
 * 通过 MCP 协议获取 GitHub / GitLab 仓库代码
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';

const server = new McpServer({
  name: 'mcp-git-server',
  version: '0.1.0'
});

registerTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 mcp-git-server running (stdio)');
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
