# Project: BotFramework Chat

Custom React chat UI for Microsoft Copilot Studio using BotFramework WebChat hooks.

## Tech Stack

- React 19 + Vite 7
- BotFramework WebChat (hooks pattern, not default UI)
- M365 Agents SDK for streaming mode
- MSAL for Azure AD authentication

## Architecture

```
Composer (WebChat context provider)
  └── Custom Components (ChatTranscript, SendBox, etc.)
        └── WebChat Hooks (useActivities, useSendMessage, etc.)
              └── Direct Line / M365 SDK connection
```

## Key Files

| File | Purpose |
|------|---------|
| `src/main.jsx` | Entry point, routes to App or AppM365 based on URL |
| `src/App.jsx` | Direct Line mode |
| `src/AppM365.jsx` | M365 SDK streaming mode |
| `src/components/ChatTranscript.jsx` | Message display using `useActivities` |
| `src/components/SendBox.jsx` | Input using `useSendMessage` |
| `src/components/TypingIndicator.jsx` | Typing animation using `useActiveTyping` |
| `src/components/AdaptiveCardRenderer.jsx` | Renders adaptive cards with dark theme |
| `src/components/MessageAttachments.jsx` | Routes attachments to appropriate renderer |
| `src/config/adaptiveCardHostConfig.js` | Dark theme HostConfig for adaptive cards |
| `src/utils/token.js` | Direct Line token fetching |
| `src/utils/auth.js` | MSAL authentication |

## Adaptive Cards

Adaptive cards are rendered using the `adaptivecards` library with a custom dark theme HostConfig.

- Cards appear below message text with a subtle separator
- Styling matches the app's dark theme (white text, sky-blue links, rounded blue buttons)
- Action.Submit sends data back to bot via `usePostActivity`
- Action.OpenUrl opens links in new tab
- CSS overrides in `src/styles/adaptiveCards.css`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Connection Modes

- **Direct Line**: `http://localhost:5173/` - No streaming
- **M365 SDK**: `http://localhost:5173/?m365` - Real-time streaming

## Environment Variables

See `.env.example` for required variables per mode.
