import { useState, useEffect } from 'react';
import { Components, createDirectLine } from 'botframework-webchat';
import { getDirectLineToken } from './utils/token';
import { styleOptions } from './styles/theme';
import ChatPage from './components/ChatPage';
import './styles/global.css';

const { Composer } = Components;

function App() {
  const [directLine, setDirectLine] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDirectLineToken()
      .then(token => {
        setDirectLine(createDirectLine({ token }));
      })
      .catch(err => {
        console.error('Failed to initialize DirectLine:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="chat-page">
        <div className="error-container">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!directLine) {
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <Composer directLine={directLine} styleOptions={styleOptions}>
      <ChatPage />
    </Composer>
  );
}

export default App;
