
# AI-Powered Software Engineering Portfolio & Assistant

A responsive, high-performance personal developer portfolio integrated with a real-time, streaming AI conversational agent. Built with modern web technologies, WebGL shaders, serverless API architecture, and powered by Groq's low-latency LLM infrastructure.

**Live Demo:** https://portfolio-opal-psi-47.vercel.app

---

## Key Features

* **Real-Time Token Streaming:** Dynamic, token-by-token text streaming via Server-Sent Events (SSE) for zero-perceived-latency AI responses.
* **Stream Control & Abort Handling:** Active `AbortController` integration allowing mid-generation cancellation without breaking application state or losing partial text output.
* **Responsive Viewport Auto-Scroll:** Intelligent auto-scrolling pinned to streaming output tokens while preserving manual scroll overrides on mobile and desktop viewports.
* **WebGL Ambient Shader Canvas:** Interactive background canvas executing custom GLSL fragment shaders with smooth wave blending and mouse tracking.
* **Secure Serverless Architecture:** Vercel serverless function endpoint (`/api/chat`) isolating API authorization keys completely on the server side.
* **Direct EmailJS Integration:** Contact form integration allowing visitor inquiries directly without backend server overhead.

---

## Tech Stack & Architecture Overview

* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+), WebGL/GLSL
* **Backend / API:** Vercel Serverless Functions (Node.js)
* **AI Provider:** Groq API (llama-3.3-70b-versatile)
* **Deployment / CI/CD:** Vercel, GitHub Actions

---

## Environment Variables

To run this project locally or deploy your own instance, configure the following environment variable in your root `.env` or Vercel dashboard:

| Variable Name | Description | Required |
| :--- | :--- | :--- |
| GROQ_API_KEY | Secret API key obtained from the Groq Developer Console | Yes |

---

## Local Development & Setup

1. Clone the repository:
   git clone https://github.com/Assistantnajam/portfolio.git
   cd portfolio

2. Install dependencies:
   npm install

3. Configure Environment Variables:
   Create a .env file in the root directory:
   GROQ_API_KEY=your_groq_api_key_here

4. Run the local development server:
   npm run dev
   # or test with Vercel CLI
   vercel dev

---

## Production Hygiene & Engineering Decisions

* **Rate Limiting & Input Capping:** The API endpoint enforces payload limits on input length and conversation history length to protect serverless instances against resource exhaustion and API key draining.
* **Timeout Controls:** Configured maxDuration parameters on Vercel API routes to cleanly terminate hanging server-sent event streams.
* **Cross-Browser Verification:** Verified layout, touch handling, and canvas rendering across Chrome, Firefox, Safari, and iOS Safari.

---

## AI Tools Usage & Development Transparency

This project was built leveraging modern AI-assisted engineering workflows:

* **Interface Choreography:** Gemini and Claude were utilized to draft robust SSE reader logic and manage asynchronous AbortController state transitions.
* **Shader Engineering:** Assisted in debugging GLSL fragment shader coordinate normalization and WebGL canvas resize triggers.
* **Optimization & Refactoring:** Code structure was iteratively audited for mobile viewport consistency and accessible DOM markup.

