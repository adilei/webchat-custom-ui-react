import { useEffect, useRef } from 'react';
import { hooks } from 'botframework-webchat';
import Markdown from 'react-markdown';

const { useActivities } = hooks;

function ChatTranscript() {
  const [activities] = useActivities();
  const endRef = useRef(null);

  // Filter to only message activities and normalize
  const messages = activities
    .filter(activity => activity.type === 'message' && activity.text)
    .map(activity => ({
      id: activity.id || activity.timestamp,
      text: activity.text,
      from: activity.from?.role || 'bot',
      timestamp: activity.timestamp,
    }));

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="transcript">
      {messages.length === 0 ? (
        <div className="transcript-empty">
          <p>Start a conversation...</p>
        </div>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            className={`message message--${msg.from}`}
          >
            <div className="message__bubble">
              <Markdown
                components={{
                  // Open links in new tab
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {msg.text}
              </Markdown>
            </div>
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatTranscript;
