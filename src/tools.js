/**
 * MCP 工具注册
 */

import { z } from 'zod';
import * as github from './github.js';
import * as gitlab from './gitlab.js';

export function registerTools(server) {
  // --- GitHub ---

  server.tool(
    'github_get_file',
    {
      owner: z.string().describe('Repository owner (username or org)'),
      repo: z.string().describe('Repository name'),
      path: z.string().describe('File path, e.g. src/index.js'),
      ref: z
        .string()
        .optional()
        .describe('Branch or commit SHA, defaults to main branch')
    },
    async ({ owner, repo, path, ref }) => {
      try {
        const result = await github.getFile(owner, repo, path, ref);
        return {
          content: [
            {
              type: 'text',
              text: `📄 ${result.path} (${result.size} bytes)\n\n${result.content}`
            }
          ]
        };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${err.message}` }]
        };
      }
    }
  );

  server.tool(
    'github_search_code',
    {
      searchKey: z.string().describe('Repository searchKey'),
      repo: z.string().optional().describe('Limit to repo, e.g. facebook/react')
    },
    async ({ searchKey, repo }) => {
      try {
        const result = await github.searchCode(searchKey, repo);
        const list = result.content
          .map((f) => `📄 ${f.repo} → ${f.path}`)
          .join('\n');
        return { content: [{ type: 'text', text: list || '没有找到结果' }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${err.message}` }]
        };
      }
    }
  );

  server.tool(
    'github_list_files',
    {
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      path: z.string().optional().describe('Directory path, empty for root'),
      ref: z.string().optional().describe('Branch or commit SHA')
    },
    async ({ owner, repo, path, ref }) => {
      try {
        const files = await github.listFiles(owner, repo, path, ref);
        const list = files
          .map((f) => `${f.type === 'dir' ? '📁' : '📄'} ${f.path}`)
          .join('\n');
        return { content: [{ type: 'text', text: list }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${err.message}` }]
        };
      }
    }
  );

  // --- GitLab ---

  server.tool(
    'gitlab_get_file',
    {
      project: z
        .string()
        .describe(
          "Project ID or URL-encoded path, e.g. '12345' or 'group/project'"
        ),
      path: z.string().describe('File path'),
      ref: z
        .string()
        .optional()
        .describe('Branch or commit SHA, defaults to main')
    },
    async ({ project, path, ref }) => {
      try {
        const result = await gitlab.getFile(project, path, ref);
        return {
          content: [
            {
              type: 'text',
              text: `📄 ${result.path} (${result.size} bytes)\n\n${result.content}`
            }
          ]
        };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${err.message}` }]
        };
      }
    }
  );

  server.tool(
    'gitlab_list_files',
    {
      project: z.string().describe('Project ID or path'),
      path: z.string().optional().describe('Directory path, empty for root'),
      ref: z.string().optional().describe('Branch or commit SHA')
    },
    async ({ project, path, ref }) => {
      try {
        const files = await gitlab.listFiles(project, path, ref);
        const list = files
          .map((f) => `${f.type === 'tree' ? '📁' : '📄'} ${f.path}`)
          .join('\n');
        return { content: [{ type: 'text', text: list }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${err.message}` }]
        };
      }
    }
  );
}
