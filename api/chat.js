export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}