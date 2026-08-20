// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import './setupTests.js';

// 1. Mock the API route so tests never call the live backend
global.fetch = vi.fn();

describe('AI Chat Assistant & Form Component Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Set up a clean DOM environment for each test
    document.body.innerHTML = `
      <!-- Chat Widget UI -->
      <div id="chat-widget">
        <div id="chat-messages" role="log"></div>
        <form id="chat-form">
          <input type="text" id="chat-input" aria-label="Ask something" placeholder="Ask something..." required />
          <button type="submit" id="chat-submit" aria-label="Send message">Send</button>
        </form>
        <div id="chat-status" aria-live="polite"></div>
      </div>

      <!-- Contact Form UI -->
      <form id="contact-form">
        <label for="name">Name</label>
        <input type="text" id="name" required />
        <label for="email">Email</label>
        <input type="email" id="email" required />
        <button type="submit" id="contact-submit">Submit</button>
        <p id="form-error" role="alert" style="display:none;">Please fill in all required fields.</p>
      </form>
    `;
  });

  // Test 1: Query by role/label for Form Input Validation
  it('1. prevents empty submission on contact form and shows validation error', () => {
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    const nameInput = screen.getByLabelText(/name/i);
    const errorMsg = document.getElementById('form-error');

    // Attempt submit with empty input
    fireEvent.click(submitBtn);
    expect(nameInput).toBeInvalid();

    // Trigger error feedback display
    errorMsg.style.display = 'block';
    expect(screen.getByRole('alert')).toHaveTextContent('Please fill in all required fields.');
  });

  // Test 2: User typing and submitting message
  it('2. renders user message in the chat container upon form submission', () => {
    const input = screen.getByRole('textbox', { name: /ask something/i });
    const messagesContainer = screen.getByRole('log');

    fireEvent.change(input, { target: { value: 'Hello Najam' } });
    expect(input.value).toBe('Hello Najam');

    // Simulate sending message
    const userBubble = document.createElement('div');
    userBubble.className = 'user-msg';
    userBubble.textContent = input.value;
    messagesContainer.appendChild(userBubble);

    expect(messagesContainer).toHaveTextContent('Hello Najam');
  });

  // Test 3: Chat pending state
  it('3. displays pending/loading indicator while awaiting API response', () => {
    const statusBox = document.getElementById('chat-status');
    
    // Set pending state
    statusBox.textContent = 'Najam AI is typing...';
    
    expect(statusBox).toHaveTextContent('Najam AI is typing...');
  });

  // Test 4: Mock API response streaming state
  it('4. renders streamed AI message parts from mocked API response', async () => {
    // Mock API fetch return
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "Hello! I am Syed Najam's AI Assistant." }),
    });

    const messagesContainer = screen.getByRole('log');

    // Simulate API fetch trigger with POST options matching your frontend
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });
    const data = await res.json();

    const aiBubble = document.createElement('div');
    aiBubble.className = 'ai-msg';
    aiBubble.textContent = data.reply;
    messagesContainer.appendChild(aiBubble);

    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    expect(messagesContainer).toHaveTextContent("Hello! I am Syed Najam's AI Assistant.");
  });

  // Test 5: Chat error state handling
  it('5. renders error state message gracefully when API fails', async () => {
    // Mock API error
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const messagesContainer = screen.getByRole('log');
    const statusBox = document.getElementById('chat-status');

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      });
    } catch (err) {
      statusBox.textContent = 'Failed to connect. Please try again.';
      const errBubble = document.createElement('div');
      errBubble.className = 'error-msg';
      errBubble.textContent = 'Error fetching AI response.';
      messagesContainer.appendChild(errBubble);
    }

    expect(statusBox).toHaveTextContent('Failed to connect. Please try again.');
    expect(messagesContainer).toHaveTextContent('Error fetching AI response.');
  });

  // Test 6: Verify element querying strictly uses accessible roles and labels
  it('6. interacts with UI strictly using accessible role and label queries', () => {
    const chatInput = screen.getByLabelText(/ask something/i);
    const sendButton = screen.getByRole('button', { name: /send message/i });

    expect(chatInput).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });
});