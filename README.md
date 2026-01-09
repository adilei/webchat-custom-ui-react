# BotFramework Chat - Custom Components

A React chat application connecting to Microsoft Copilot Studio using the BotFramework WebChat library with **fully custom UI components**.

## Implementation Approach

This project demonstrates how to build a custom chat UI while leveraging BotFramework WebChat's business logic layer. Instead of using the pre-built `<ReactWebChat>` component or `BasicTranscript`/`BasicSendBox`, we build custom React components that consume WebChat's hooks directly.

### Architecture

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
│            Direct Line SDK              │
│    (Connection to bot via WebSocket)    │
└─────────────────────────────────────────┘
```

### How It Works: Composer + Hooks

The BotFramework WebChat library is designed in layers. At its core is a **state machine** powered by Redux that manages:
- The Direct Line connection (WebSocket to the bot)
- Chat activities (messages, events, typing indicators)
- Send box state
- User/bot identity

The `<Composer>` component wraps this state machine in a React Context, making it available to any descendant component via hooks.

#### The Composer Pattern

```jsx
// App.jsx
import { Components, createDirectLine } from 'botframework-webchat';
const { Composer } = Components;

function App() {
  const [directLine, setDirectLine] = useState(null);

  useEffect(() => {
    // Get token and create Direct Line connection
    fetchToken().then(token => {
      setDirectLine(createDirectLine({ token }));
    });
  }, []);

  return (
    <Composer directLine={directLine}>
      {/* Any component here can use WebChat hooks */}
      <ChatTranscript />
      <SendBox />
    </Composer>
  );
}
```

The `Composer` doesn't render any UI itself - it just provides the context. This means you can put **any React components** inside it and they'll have access to the chat state via hooks.

#### Using Hooks in Custom Components

Once inside the `Composer`, components access chat functionality through hooks:

```jsx
// ChatTranscript.jsx
import { hooks } from 'botframework-webchat';
const { useActivities } = hooks;

function ChatTranscript() {
  // useActivities returns [activities, setActivities]
  // activities is an array of all chat messages/events
  const [activities] = useActivities();

  const messages = activities.filter(a => a.type === 'message');

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={`message--${msg.from.role}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}
```

```jsx
// SendBox.jsx
import { hooks } from 'botframework-webchat';
const { useSendMessage } = hooks;

function SendBox() {
  const [text, setText] = useState('');
  // useSendMessage returns a function to send messages
  const sendMessage = useSendMessage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text);  // Sends to bot via Direct Line
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
```

#### Available Hooks

| Hook | Returns | Purpose |
|------|---------|---------|
| `useActivities()` | `[activities, setActivities]` | All chat activities (messages, events) |
| `useSendMessage()` | `sendMessage(text)` | Function to send a message |
| `useActiveTyping()` | `[typingUsers]` | Object of users currently typing |
| `usePostActivity()` | `postActivity(activity)` | Send any activity type |
| `useSendFiles()` | `sendFiles(files)` | Send file attachments |
| `useScrollToEnd()` | `scrollToEnd()` | Scroll transcript to bottom |

#### Data Flow

```
User types message
        ↓
SendBox calls sendMessage(text)
        ↓
Composer dispatches to Redux store
        ↓
Direct Line sends to bot via WebSocket
        ↓
Bot responds via WebSocket
        ↓
Direct Line receives response
        ↓
Redux store updates activities
        ↓
useActivities() triggers re-render
        ↓
ChatTranscript displays new message
```

### Why Custom Components?

The default WebChat components use dynamically generated class names (e.g., `webchat__send-box__xyz123`) that are:
- Not part of the public API
- Subject to change between versions
- Difficult to override with CSS

By building custom components, we get:
- **Full styling control** - standard CSS classes we define
- **Simpler code** - no fighting with `!important` or attribute selectors
- **Stability** - no breaking changes from internal class name updates

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Initializes Direct Line and wraps app in `<Composer>` |
| `src/components/ChatTranscript.jsx` | Displays messages using `useActivities` hook |
| `src/components/SendBox.jsx` | Text input using `useSendMessage` hook |
| `src/components/TypingIndicator.jsx` | Animated dots using `useActiveTyping` hook |
| `src/styles/global.css` | All styling for custom components |

### Hooks Used

```jsx
import { hooks } from 'botframework-webchat';

const { useActivities } = hooks;      // Get all chat activities/messages
const { useSendMessage } = hooks;     // Send a message to the bot
const { useActiveTyping } = hooks;    // Detect when bot is typing
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with your token endpoint:
   ```
   VITE_TOKEN_ENDPOINT=https://your-pva-endpoint/directline/token
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Branches

- `main` - Uses WebChat's built-in `BasicTranscript` and `BasicSendBox` components
- `custom-components` - Fully custom React components with hooks (this branch)

## References

- [BotFramework WebChat Recomposing UI Sample](https://github.com/microsoft/BotFramework-WebChat/tree/main/samples/06.recomposing-ui/d.plain-ui)
- [WebChat Hooks Documentation](https://github.com/microsoft/BotFramework-WebChat/blob/main/docs/HOOKS.md)
- [Direct Line API](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts)
