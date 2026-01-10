import AdaptiveCardRenderer from './AdaptiveCardRenderer';

const ADAPTIVE_CARD_CONTENT_TYPE = 'application/vnd.microsoft.card.adaptive';

function MessageAttachments({ attachments, activityId }) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="message__attachments">
      {attachments.map((attachment, index) => {
        const key = `${activityId}-attachment-${index}`;

        // Handle Adaptive Cards
        if (attachment.contentType === ADAPTIVE_CARD_CONTENT_TYPE) {
          return (
            <AdaptiveCardRenderer
              key={key}
              card={attachment.content}
              activityId={activityId}
            />
          );
        }

        // Handle image attachments
        if (attachment.contentType?.startsWith('image/')) {
          return (
            <img
              key={key}
              src={attachment.contentUrl}
              alt={attachment.name || 'Image attachment'}
              className="message__image-attachment"
            />
          );
        }

        // Handle other attachment types (file download link)
        if (attachment.contentUrl) {
          return (
            <a
              key={key}
              href={attachment.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="message__file-attachment"
            >
              {attachment.name || 'Download attachment'}
            </a>
          );
        }

        // Unknown attachment type - skip
        return null;
      })}
    </div>
  );
}

export default MessageAttachments;
