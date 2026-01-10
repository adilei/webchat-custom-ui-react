# Architecture: Composer + Hooks Pattern

This document explains how BotFramework WebChat's Composer and hooks system works, and how this project uses it to build fully custom UI components.

## How It Works

The BotFramework WebChat library is designed in layers. At its core is a **state machine** powered by Redux that manages:
- The Direct Line connection (WebSocket to the bot)
- Chat activities (messages, events, typing indicators)
- Send box state
- User/bot identity

The `<Composer>` component wraps this state machine in a React Context, making it available to any descendant component via hooks.

## The Composer Pattern

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

## Using Hooks in Custom Components

Once inside the `Composer`, components access chat functionality through hooks:

### Reading Messages

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

### Sending Messages

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

## Available Hooks

| Hook | Returns | Purpose |
|------|---------|---------|
| `useActivities()` | `[activities, setActivities]` | All chat activities (messages, events) |
| `useSendMessage()` | `sendMessage(text)` | Function to send a message |
| `useActiveTyping()` | `[typingUsers]` | Object of users currently typing |
| `usePostActivity()` | `postActivity(activity)` | Send any activity type |
| `useSendFiles()` | `sendFiles(files)` | Send file attachments |
| `useScrollToEnd()` | `scrollToEnd()` | Scroll transcript to bottom |

## Data Flow

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

## Streaming Support

When using the M365 Agents SDK, responses stream in real-time. The SDK emits activities with `channelData` that indicates streaming state:

```javascript
// Streaming chunk (type: 'typing')
{
  type: 'typing',
  text: 'partial text...',
  channelData: {
    streamType: 'streaming',
    streamId: 'abc123',
    streamSequence: 0,
    chunkType: 'delta'
  }
}

// Final message
{
  type: 'message',
  text: 'complete response text',
  channelData: {
    streamType: 'final',
    streamId: 'abc123'
  }
}
```

The `ChatTranscript` component accumulates delta chunks during streaming and displays the final message once it arrives.

## Why Custom Components?

The default WebChat components use dynamically generated class names (e.g., `webchat__send-box__xyz123`) that are:
- Not part of the public API
- Subject to change between versions
- Difficult to override with CSS

By building custom components, we get:
- **Full styling control** - standard CSS classes we define
- **Simpler code** - no fighting with `!important` or attribute selectors
- **Stability** - no breaking changes from internal class name updates

## Key Implementation Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Initializes Direct Line and wraps app in `<Composer>` |
| `src/components/ChatTranscript.jsx` | Displays messages using `useActivities` hook |
| `src/components/SendBox.jsx` | Text input using `useSendMessage` hook |
| `src/components/TypingIndicator.jsx` | Animated dots using `useActiveTyping` hook |
| `src/components/MessageAttachments.jsx` | Renders adaptive cards |
| `src/styles/global.css` | All styling for custom components |

## References

- [BotFramework WebChat Recomposing UI Sample](https://github.com/microsoft/BotFramework-WebChat/tree/main/samples/06.recomposing-ui/d.plain-ui)
- [WebChat Hooks Documentation](https://github.com/microsoft/BotFramework-WebChat/blob/main/docs/HOOKS.md)
- [Direct Line API](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts)
