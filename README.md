# BotFramework Chat - Custom Components

A React chat application with **fully custom UI components** built on top of BotFramework WebChat's hooks layer. Supports Microsoft Copilot Studio bots via Direct Line or the M365 Agents SDK.

## Quick Start

See it in action without any bot configuration:

```bash
npm install
npm run dev
```

Open http://localhost:5173/?demo

This runs an interactive HR assistant demo that showcases streaming text, adaptive cards, markdown tables, and suggested actions - all client-side.

## Connection Modes

### Demo Mode (No Setup Required)
```
http://localhost:5173/?demo
```
- **No bot connection required** - runs entirely client-side
- Interactive guided walkthrough of an HR assistant scenario
- Demonstrates all UI features: streaming, adaptive cards, markdown tables, suggested actions

### Direct Line
```
http://localhost:5173/
```
- Connects to Copilot Studio via Direct Line token endpoint
- Messages appear when complete (no streaming)
- Requires `VITE_TOKEN_ENDPOINT` in `.env`

### M365 Agents SDK (Streaming)
```
http://localhost:5173/?m365
```
- Uses `@microsoft/agents-copilotstudio-client`
- **Real-time streaming** - text appears as it's generated
- Requires Azure app registration with `CopilotStudio.Copilots.Invoke` permission

## Environment Variables

Create a `.env` file for bot connection modes:

```bash
# Direct Line mode
VITE_TOKEN_ENDPOINT=https://your-environment.api.powerplatform.com/.../directline/token

# M365 SDK mode (for streaming)
VITE_ENVIRONMENT_ID=your-environment-id
VITE_AGENT_IDENTIFIER=your-agent-schema-name
VITE_TENANT_ID=your-azure-tenant-id
VITE_APP_CLIENT_ID=your-azure-app-client-id
```

## Implementation Approach

Instead of using WebChat's pre-built `<ReactWebChat>` component, this project uses the **Composer + Hooks** pattern:

```
┌─────────────────────────────────────────┐
│            Custom UI Layer              │
│  (ChatTranscript, SendBox, Typing...)   │
├─────────────────────────────────────────┤
│         WebChat Hooks Layer             │
│  (useActivities, useSendMessage, etc.)  │
├─────────────────────────────────────────┤
│           Composer Context              │
│     (Provides hooks to descendants)     │
├─────────────────────────────────────────┤
│        DirectLine / Mock Layer          │
│    (Connection to bot or simulation)    │
└─────────────────────────────────────────┘
```

The `<Composer>` component wraps WebChat's state machine in a React Context. Custom components access chat functionality via hooks like `useActivities()` and `useSendMessage()`, giving us **full styling control** without fighting WebChat's dynamically generated class names.

For detailed documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Direct Line mode entry point |
| `src/AppM365.jsx` | M365 Agents SDK mode entry point |
| `src/AppDemo.jsx` | Demo mode entry point |
| `src/components/ChatTranscript.jsx` | Message display with streaming support |
| `src/components/SendBox.jsx` | Text input and send button |
| `src/components/MessageAttachments.jsx` | Adaptive card rendering |
| `src/demo/` | Mock DirectLine and demo scenario |

## References

- [BotFramework WebChat Hooks](https://github.com/microsoft/BotFramework-WebChat/blob/main/docs/HOOKS.md)
- [WebChat Recomposing UI Sample](https://github.com/microsoft/BotFramework-WebChat/tree/main/samples/06.recomposing-ui/d.plain-ui)
- [M365 Agents SDK](https://www.npmjs.com/package/@microsoft/agents-copilotstudio-client)
