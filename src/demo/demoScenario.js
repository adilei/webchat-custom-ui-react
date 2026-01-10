/**
 * Demo scenario - guided interactive walkthrough.
 * Shows suggestions at each step so users know what to do.
 */

import { feedbackCard, timeOffCard } from './sampleCards.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Exact values sent by suggested action buttons
const BUTTON_VALUES = {
  TIME_OFF: 'i want to request time off',
  BALANCE: 'what is my leave balance?',
  POLICIES: 'tell me about company policies',
  THANKS: 'that was helpful, thanks!',
};

/**
 * Stream text in realistic chunks (not word-by-word)
 */
async function streamText(text, emitStreamChunk, emitFinalMessage) {
  const streamId = `stream-${Date.now()}`;

  // Split into chunks of 3-6 words for more realistic streaming
  const words = text.split(' ');
  const chunks = [];
  let i = 0;

  while (i < words.length) {
    const chunkSize = Math.floor(Math.random() * 4) + 3; // 3-6 words
    chunks.push(words.slice(i, i + chunkSize).join(' '));
    i += chunkSize;
  }

  let accumulated = '';

  for (let j = 0; j < chunks.length; j++) {
    const chunk = chunks[j];
    accumulated += (j > 0 ? ' ' : '') + chunk;
    emitStreamChunk(streamId, j, (j > 0 ? ' ' : '') + chunk);
    // Variable delay between chunks (80-200ms)
    await wait(80 + Math.random() * 120);
  }

  // Small pause before finalizing
  await wait(100);
  emitFinalMessage(streamId, accumulated);
}

/**
 * Run the guided demo scenario
 */
export async function runDemoScenario(directLine) {
  const { emitActivity } = directLine;

  await wait(1500);

  // Welcome with suggestions
  emitActivity({
    text: "Hi! I'm your HR assistant. I can help you with time off requests, view your leave balance, and answer questions about company policies.\n\nTry one of the options below to get started!",
    suggestedActions: {
      actions: [
        { type: 'imBack', title: 'Request time off', value: 'I want to request time off' },
        { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
        { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
      ],
    },
  });
}

/**
 * Handle user messages - respond to exact button values
 */
export function setupUserMessageHandler(directLine) {
  const { emitActivity, emitTyping, emitStreamChunk, emitFinalMessage } = directLine;

  directLine.onUserActivity(async (activity) => {
    // Handle adaptive card submissions (value is an object, not a string)
    if (activity.value && typeof activity.value === 'object') {
      await wait(300);
      emitTyping();
      await wait(1500);

      if (activity.value.action === 'submitFeedback') {
        const rating = activity.value.rating || 'not specified';
        emitActivity({
          text: `Thank you for your feedback! You rated us **${rating}/5**.${activity.value.comments ? `\n\nYour comments: "${activity.value.comments}"` : ''}\n\nIs there anything else I can help you with?`,
          suggestedActions: {
            actions: [
              { type: 'imBack', title: 'Request time off', value: 'I want to request time off' },
              { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
              { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
            ],
          },
        });
      } else if (activity.value.action === 'submitTimeOff') {
        const { leaveType, startDate, endDate } = activity.value;
        emitActivity({
          text: `Your **${leaveType || 'vacation'}** request has been submitted!\n\n- **Start:** ${startDate || 'Not specified'}\n- **End:** ${endDate || 'Not specified'}\n\nYou'll receive a confirmation email once approved. Anything else?`,
          suggestedActions: {
            actions: [
              { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
              { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
              { type: 'imBack', title: 'Thanks!', value: 'That was helpful, thanks!' },
            ],
          },
        });
      } else {
        emitActivity({
          text: 'Got it! Is there anything else I can help you with?',
          suggestedActions: {
            actions: [
              { type: 'imBack', title: 'Request time off', value: 'I want to request time off' },
              { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
              { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
            ],
          },
        });
      }
      return;
    }

    // Handle text messages - match exact button values
    if (!activity.text) return;

    const text = activity.text.toLowerCase().trim();

    // Time off request
    if (text === BUTTON_VALUES.TIME_OFF) {
      await wait(300);
      emitTyping();
      await wait(1500);
      emitActivity({
        text: "I can help you with that! Here's your time off request form:",
        attachments: [timeOffCard],
        suggestedActions: {
          actions: [
            { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
            { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
          ],
        },
      });
      return;
    }

    // View leave balance
    if (text === BUTTON_VALUES.BALANCE) {
      await wait(300);
      emitTyping();
      await wait(1400);
      emitActivity({
        text: "Here's your current leave balance:\n\n| Type | Available | Accrual |\n|------|-----------|----------|\n| **Sick Days** | 24 hours | 8h/quarter |\n| **Wellness** | 40 hours | 5 days/year |\n| **Vacation** | 80 hours | 8h/month |\n\nWould you like to request time off?",
        suggestedActions: {
          actions: [
            { type: 'imBack', title: 'Request time off', value: 'I want to request time off' },
            { type: 'imBack', title: 'Company policies', value: 'Tell me about company policies' },
            { type: 'imBack', title: 'Thanks!', value: 'That was helpful, thanks!' },
          ],
        },
      });
      return;
    }

    // Company policies - streaming response
    if (text === BUTTON_VALUES.POLICIES) {
      await wait(300);
      emitTyping();
      await wait(1200);

      const streamingText =
        'Our company offers flexible work arrangements, competitive benefits, and a supportive culture. Key policies include **unlimited PTO** (with manager approval), **remote work options**, and comprehensive health coverage. For detailed information, please visit the HR portal or reach out to your HR representative.';

      await streamText(streamingText, emitStreamChunk, emitFinalMessage);

      await wait(600);
      emitActivity({
        text: 'Here are some helpful resources:\n\n- [Employee Handbook](https://example.com/handbook)\n- [Benefits Portal](https://example.com/benefits)\n- [IT Support](https://example.com/support)\n\nAnything else I can help with?',
        suggestedActions: {
          actions: [
            { type: 'imBack', title: 'Request time off', value: 'I want to request time off' },
            { type: 'imBack', title: 'View leave balance', value: 'What is my leave balance?' },
            { type: 'imBack', title: 'Thanks!', value: 'That was helpful, thanks!' },
          ],
        },
      });
      return;
    }

    // Thanks - show feedback
    if (text === BUTTON_VALUES.THANKS) {
      await wait(300);
      emitTyping();
      await wait(1300);
      emitActivity({
        text: "You're welcome! Before you go, would you mind sharing your feedback?",
        attachments: [feedbackCard],
      });
      return;
    }

    // Unscripted input - silently ignore (no response)
  });
}
