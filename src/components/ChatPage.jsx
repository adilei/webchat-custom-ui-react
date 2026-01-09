import { Components } from 'botframework-webchat';
import Header from './Header';
import Footer from './Footer';

const { BasicTranscript, BasicSendBox, BasicToaster } = Components;

function ChatPage() {
  return (
    <div className="chat-page">
      <Header />

      <main className="chat-main">
        <div className="chat-container">
          <BasicToaster />
          <BasicTranscript />
        </div>
      </main>

      <div className="sendbox-wrapper">
        <BasicSendBox placeholder="How can I help? Ask me anything" />
      </div>

      <Footer />
    </div>
  );
}

export default ChatPage;
