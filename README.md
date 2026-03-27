# mcp-git-server

通过 [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) 获取 GitHub / GitLab 仓库代码的 Server。

支持所有兼容 MCP 的客户端：Kiro、Codex、Claude Desktop、Cursor、VS Code (Copilot) 等。

## 提供的工具

| 工具 | 说明 |
|------|------|
| `github_get_file` | 获取 GitHub 仓库中指定文件的内容 |
| `github_list_files` | 列出 GitHub 仓库的文件目录 |
| `gitlab_get_file` | 获取 GitLab 仓库中指定文件的内容 |
| `gitlab_list_files` | 列出 GitLab 仓库的文件目录 |

## 快速开始

```bash
git clone https://github.com/你的用户名/mcp-git-server.git
cd mcp-git-server
npm install
```

## 配置密钥

你需要准备 Token（按需选一个或都配）：

**GitHub Token:**
1. 打开 https://github.com/settings/tokens
2. Generate new token (classic) → 勾选 `repo` 权限
3. 复制 token

**GitLab Token:**
1. GitLab → Preferences → Access Tokens
2. 创建 token → 勾选 `read_repository`
3. 复制 token

> ⚠️ Token 不要提交到仓库，通过下面各客户端的 `env` 配置传入。

## 客户端配置

下面的 `command` 路径请替换为你本机的实际路径。

### Kiro

编辑 `.kiro/settings/mcp.json`（工作区）或 `~/.kiro/settings/mcp.json`（全局）：

```json
{
  "mcpServers": {
    "git-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-git-server/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITLAB_TOKEN": "glpat-your_token_here",
        "GITLAB_URL": "https://gitlab.com"
      }
    }
  }
}
```

### Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）：

```json
{
  "mcpServers": {
    "git-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-git-server/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITLAB_TOKEN": "glpat-your_token_here",
        "GITLAB_URL": "https://gitlab.com"
      }
    }
  }
}
```

### Cursor

编辑 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "git-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-git-server/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITLAB_TOKEN": "glpat-your_token_here",
        "GITLAB_URL": "https://gitlab.com"
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

编辑 `.vscode/mcp.json`（工作区级别）：

```json
{
  "servers": {
    "git-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mcp-git-server/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITLAB_TOKEN": "glpat-your_token_here",
        "GITLAB_URL": "https://gitlab.com"
      }
    }
  }
}
```

### OpenAI Codex CLI

编辑 `~/.codex/config.json`：

```json
{
  "mcpServers": {
    "git-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-git-server/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITLAB_TOKEN": "glpat-your_token_here",
        "GITLAB_URL": "https://gitlab.com"
      }
    }
  }
}
```

## 项目结构

```
mcp-git-server/
├── src/
│   ├── index.js      # 入口，启动 MCP Server
│   ├── tools.js      # 工具注册
│   ├── github.js     # GitHub API 封装
│   └── gitlab.js     # GitLab API 封装
├── .env.example       # 环境变量模板（仅参考）
├── .gitignore
├── package.json
└── README.md
```

## 使用示例

配置好后，在聊天中直接说：

- "帮我看看 github 上 facebook/react 的 package.json"
- "列出 gitlab 项目 mygroup/myproject 的 src 目录"
- "读一下 github 上 vuejs/core 的 main 分支的 README.md"

## License

MIT
