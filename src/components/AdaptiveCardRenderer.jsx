import { useEffect, useRef, useCallback } from 'react';
import * as AdaptiveCards from 'adaptivecards';
import { hooks } from 'botframework-webchat';
import { darkThemeHostConfig } from '../config/adaptiveCardHostConfig';

const { usePostActivity } = hooks;

function AdaptiveCardRenderer({ card, activityId }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const postActivity = usePostActivity();

  // Handle Action.Submit - sends data back to bot
  const handleExecuteAction = useCallback(
    (action) => {
      if (
        action instanceof AdaptiveCards.SubmitAction ||
        action instanceof AdaptiveCards.ExecuteAction
      ) {
        // Build the activity to send back
        const activity = {
          type: 'message',
          value: action.data,
          text: action.title || undefined,
          channelData: {
            postBack: true,
            sourceActivityId: activityId,
          },
        };

        postActivity(activity);
      } else if (action instanceof AdaptiveCards.OpenUrlAction) {
        // Open URL in new tab
        if (action.url) {
          window.open(action.url, '_blank', 'noopener,noreferrer');
        }
      }
      // ShowCardAction is handled internally by adaptivecards
    },
    [postActivity, activityId]
  );

  // Handle anchor clicks within the card
  const handleAnchorClick = useCallback((element, anchor) => {
    if (anchor?.href) {
      window.open(anchor.href, '_blank', 'noopener,noreferrer');
      return true; // Prevent default
    }
    return false;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !card) return;

    // Create the AdaptiveCard instance
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();

    // Apply the dark theme host config
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(darkThemeHostConfig);

    // Set up action handler
    adaptiveCard.onExecuteAction = handleExecuteAction;

    // Set up anchor click handler
    adaptiveCard.onAnchorClicked = handleAnchorClick;

    // Parse the card JSON
    try {
      adaptiveCard.parse(card);
    } catch (error) {
      console.error('Failed to parse adaptive card:', error);
      return;
    }

    // Render the card
    const renderedCard = adaptiveCard.render();

    // Store ref for cleanup
    const container = containerRef.current;

    if (renderedCard) {
      // Clear previous content
      container.innerHTML = '';
      container.appendChild(renderedCard);
      cardRef.current = adaptiveCard;
    }

    // Cleanup on unmount
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      cardRef.current = null;
    };
  }, [card, handleExecuteAction, handleAnchorClick]);

  return (
    <div
      ref={containerRef}
      className="adaptive-card-container"
      role="region"
      aria-label="Interactive card"
    />
  );
}

export default AdaptiveCardRenderer;
