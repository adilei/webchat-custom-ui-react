# BotFramework Chat - Custom Components

A React chat application with **fully custom UI components** built on top of BotFramework WebChat's hooks layer. Supports Microsoft Copilot Studio bots via Direct Line or the M365 Agents SDK.

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

The `<Composer>` component wraps WebChat's state machine (activities, connection status, etc.) in a React Context. Custom components inside the Composer access chat functionality via hooks like `useActivities()` and `useSendMessage()`.

This gives us **full styling control** without fighting WebChat's dynamically generated class names.

For detailed documentation on the hooks pattern and available APIs, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Connection Modes

### Direct Line (Default)
```
http://localhost:5173/
```
- Connects to Copilot Studio via Direct Line token endpoint
- Messages appear when complete (no streaming)
- Simpler setup - no Azure app registration required

### M365 Agents SDK (Streaming)
```
http://localhost:5173/?m365
```
- Uses `@microsoft/agents-copilotstudio-client`
- **Real-time streaming** - text appears as it's generated
- Supports typing indicators, citations, and rich responses
- Requires Azure app registration with `CopilotStudio.Copilots.Invoke` permission

### Demo Mode (Simulation)
```
http://localhost:5173/?demo
```
- **No bot connection required** - runs entirely client-side
- Interactive guided walkthrough of an HR assistant scenario
- Demonstrates all UI features: streaming, adaptive cards, markdown tables, suggested actions
- Uses a mock DirectLine that simulates bot responses

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (not needed for demo mode):
   ```bash
   # Direct Line mode
   VITE_TOKEN_ENDPOINT=https://your-environment.api.powerplatform.com/.../directline/token

   # M365 SDK mode (for streaming)
   VITE_ENVIRONMENT_ID=your-environment-id
   VITE_AGENT_IDENTIFIER=your-agent-schema-name
   VITE_TENANT_ID=your-azure-tenant-id
   VITE_APP_CLIENT_ID=your-azure-app-client-id
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open one of:
   - http://localhost:5173/ (Direct Line)
   - http://localhost:5173/?m365 (M365 Agents SDK)
   - http://localhost:5173/?demo (Demo mode)

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
