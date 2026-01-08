# MCP Servers Setup Guide

This project has MCP (Model Context Protocol) servers configured for enhanced Claude Code capabilities.

## Installed MCP Servers

### Solana Blockchain Servers

1. **Solana MCP Official** - Official Solana Foundation MCP server
   - Real-time documentation access
   - Account queries
   - Transaction analysis
   - CPI generation

2. **Solana OpenSVM** - Comprehensive RPC integration
   - 73+ Solana RPC methods
   - WebSocket subscription support
   - All commitment levels supported
   - Requires: `SOLANA_RPC_URL` (optional, defaults to mainnet)

3. **Solana Agent Kit** - SendAI's agent toolkit
   - 60+ on-chain actions
   - Token trading, DeFi operations
   - NFT management
   - Requires: `SOLANA_PRIVATE_KEY` and `SOLANA_RPC_URL`

### Productivity Servers

4. **Docker MCP** - Container management
   - Build, inspect, manage containers
   - View logs and troubleshoot

5. **Playwright MCP** - Browser automation
   - Web scraping and testing
   - Page navigation and interaction
   - Screenshot capture

6. **PostgreSQL MCP** - Database operations
   - Direct database queries
   - Schema management
   - Requires: `POSTGRES_CONNECTION_STRING`

7. **Sentry MCP** - Error tracking (optional)
   - Error analysis and monitoring
   - Performance tracking
   - Requires: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG_SLUG`

8. **Zapier MCP** - Workflow automation (optional)
   - Connect to 5000+ apps
   - Requires: `ZAPIER_API_KEY`

9. **Apidog MCP** - API development (optional)
   - Generate code from API specs
   - Requires: `APIDOG_API_KEY`

## Already Installed (Global)

These are in your `~/.claude.json`:
- **Memory** - Persistent knowledge graph
- **Sequential Thinking** - Extended reasoning
- **Puppeteer** - Browser automation
- **Fetch** - Web content fetching
- **GitHub** - GitHub integration
- **Git** - Git operations
- **Brave Search** - Web search
- **Context7** - Context management
- **Figma** - Design integration

## Setup Instructions

### 1. Create Environment File

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Configure Required Variables

**Minimum setup (for Solana features):**
```bash
# In your .env file
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Free mainnet
# Or use a premium RPC:
# SOLANA_RPC_URL=https://your-quicknode-url.solana-mainnet.quiknode.pro/
# SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

**For Solana Agent Kit (trading/DeFi operations):**
```bash
SOLANA_PRIVATE_KEY=your_base58_private_key_here
```

**For PostgreSQL:**
```bash
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/dbname
```

### 3. Load Environment Variables

Claude Code will automatically load `.env` files from your project directory.

Alternatively, export them in your shell:
```bash
export $(cat .env | xargs)
```

### 4. Verify Installation

Start Claude Code and check MCP servers:
```bash
claude
```

Then in Claude Code:
```
/mcp
```

You should see all servers listed. Servers requiring environment variables will show an error if not configured.

### 5. Enable/Disable Servers

You can @-mention servers to toggle them:
```
@solana-agent-kit
```

Or use the `/mcp` command:
```
/mcp enable solana-agent-kit
/mcp disable zapier
```

## Getting API Keys

### Solana RPC URLs
- **Free**: https://api.mainnet-beta.solana.com (rate limited)
- **QuickNode**: https://www.quicknode.com/ (recommended)
- **Helius**: https://www.helius.dev/ (recommended)
- **Alchemy**: https://www.alchemy.com/solana

### Solana Private Key
**⚠️ SECURITY WARNING**: Only use a wallet with minimal funds for testing!

To export from Phantom/Solflare:
1. Go to Settings → Security
2. Export Private Key
3. Copy the base58 string

### Optional Service Keys
- **Sentry**: https://sentry.io/settings/account/api/auth-tokens/
- **Zapier**: https://zapier.com/app/developer
- **Apidog**: https://apidog.com/

## Troubleshooting

### MCP Server Not Loading

1. Check if the package exists:
```bash
npm info @opensvm/solana-mcp-server
```

2. Check environment variables:
```bash
echo $SOLANA_RPC_URL
```

3. View MCP logs:
```bash
claude --mcp-debug
```

### Permission Errors

Some MCP tools may require permission. Use:
```
/permissions
```

To manage tool access rules.

### Server Timing Out

Increase timeout (default 60s):
```bash
export MCP_TIMEOUT=120000  # 2 minutes in ms
```

## Environment Variable Expansion

The `.mcp.json` file supports environment variable expansion:
- `${VAR_NAME}` - Required variable (fails if not set)
- `${VAR_NAME:-default}` - Optional with default value

## Updating MCP Servers

Since we're using `npx -y`, servers are automatically fetched at the latest version each time. To lock versions, modify `.mcp.json`:

```json
{
  "mcpServers": {
    "solana-agent-kit": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@sendaifun/solana-agent-kit-mcp@1.2.3"],
      ...
    }
  }
}
```

## Security Best Practices

1. **Never commit `.env`** - It's already in `.gitignore`
2. **Use separate wallets** - Don't use your main wallet's private key
3. **Limit permissions** - Only allow necessary tools
4. **Rotate keys** - Regularly update API keys
5. **Review tool usage** - Check `/mcp` regularly

## Additional Resources

- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Solana MCP Server Docs](https://opensvm.github.io/solana-mcp-server/)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
