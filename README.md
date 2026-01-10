# BotFramework Chat - Custom Components

A React chat application with **fully custom UI components** built on top of BotFramework WebChat's hooks layer. Supports Microsoft Copilot Studio agents via Direct Line or the M365 Agents SDK.

## Quick Start

See it in action without any agent configuration:

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
- **No agent connection required** - runs entirely client-side
- Interactive guided walkthrough of an HR assistant scenario
- Demonstrates all UI features: streaming, adaptive cards, markdown tables, suggested actions

### Direct Line
```
http://localhost:5173/
```
- Connects to Copilot Studio via Direct Line token endpoint
- Messages appear when complete (no streaming)
- Requires `VITE_TOKEN_ENDPOINT` in `.env`
- **Note:** Currently only supports unauthenticated traffic (no user sign-in)

### M365 Agents SDK (Streaming)
```
http://localhost:5173/?m365
```
- Uses `@microsoft/agents-copilotstudio-client`
- **Real-time streaming** - text appears as it's generated
- Supports authenticated users via MSAL popup
- Requires Azure app registration (see setup below)

## Direct Line Setup

1. In Copilot Studio, go to **Settings > Security > Web channel security**
2. Copy the **Token endpoint** URL
3. Add to `.env`:
   ```bash
   VITE_TOKEN_ENDPOINT=https://your-environment.api.powerplatform.com/.../directline/token
   ```

> **Limitation:** This implementation currently only supports unauthenticated Direct Line connections. User authentication would require additional token exchange logic.

## M365 Agents SDK Setup

The M365 SDK mode requires an Azure app registration to authenticate users and call the Copilot Studio API.

### 1. Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com) > **Microsoft Entra ID** > **App registrations**
2. Click **New registration**
3. Configure:
   - **Name:** `Copilot Studio Web Client` (or your preferred name)
   - **Supported account types:** Accounts in this organizational directory only
   - **Redirect URI:** Select **Single-page application (SPA)** and enter `http://localhost:5173`
4. Click **Register**
5. Copy the **Application (client) ID** and **Directory (tenant) ID**

### 2. Add API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** > **APIs my organization uses**
3. Search for `CopilotStudio` and select **CopilotStudio**
4. Select **Delegated permissions**
5. Check `CopilotStudio.Copilots.Invoke`
6. Click **Add permissions**
7. Click **Grant admin consent** (requires admin)

### 3. Get Copilot Studio Agent Details

1. In [Copilot Studio](https://copilotstudio.microsoft.com), open your agent
2. Go to **Settings > Advanced > Metadata**
3. Copy:
   - **Environment ID** (GUID from the environment URL)
   - **Schema name** (e.g., `cr123_myAgent`)

### 4. Configure Environment Variables

Create `.env` file:

```bash
VITE_ENVIRONMENT_ID=12345678-1234-1234-1234-123456789012
VITE_AGENT_IDENTIFIER=cr123_myAgent
VITE_TENANT_ID=your-azure-tenant-id
VITE_APP_CLIENT_ID=your-azure-app-client-id
```

### 5. Run with M365 Mode

```bash
npm run dev
```

Open http://localhost:5173/?m365 - you'll be prompted to sign in via Microsoft popup.

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
│   (Connection to agent or simulation)   │
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
