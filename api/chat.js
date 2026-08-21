export default async function handler(req, res) {
  // Set CORS headers so your frontend can communicate with this API route without blockages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the Groq API key is configured in Environment Variables
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is missing in environment variables.' });
  }

  const { message, messages } = req.body || {};
  const conversationHistory = Array.isArray(messages) && messages.length > 0
    ? messages
    : [{ role: 'user', content: message || '' }];

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: 'system',
            content: `You are Najam's AI Assistant on his personal portfolio. Answer questions about Syed Najam Ul Hassan using these details:
            - Education: BS Software Engineering at CUST.
            - Tech Stack: JavaScript, React, Node.js, Python, Three.js, C#, WebGL/GLSL, MongoDB.
            - Experience: AI & Frontend Intern at FlyRank, Generative AI Intern at Arch Technologies.
            - Projects: LuminaList, 3D Product Showcase, Capstone Recipe App, WhatsApp Roast Bot.
            Keep responses helpful, brief, and professional.`
          },
          ...conversationHistory
        ],
        temperature: 0.7,
        stream: true
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API Error Details:', errorText);
      return res.status(groqResponse.status).json({ error: 'Failed to communicate with Groq API', details: errorText });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('Internal Server Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch AI response' });
    } else {
      res.end();
    }
  }
}