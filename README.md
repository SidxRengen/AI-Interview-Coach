# 🎯 SDE Interview Coach Chatbot

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**An AI-powered interview coach that simulates real interview guidance with domain-specific expertise**

[Live Demo](https://ai-interview-coach-three-bay.vercel.app/) • [Report Bug](https://github.com/yourusername/ai-interview-coach/issues) • [Request Feature](https://github.com/yourusername/ai-interview-coach/issues)

</div>

---

## 🔥 Overview

I built an AI-powered interview coach that helps users prepare for different domains like **DSA**, **HR**, and **System Design**. Instead of a generic chatbot, this product is designed to simulate real interview guidance with structured responses and domain-specific expertise.

---

## 🎯 Why I Built This

Interview preparation is often scattered across multiple resources - YouTube videos, blog posts, practice platforms, and books. I wanted to create a **focused, interactive tool** that:

- ✅ **Guides thinking** instead of giving direct answers
- ✅ **Adapts based on interview domain** (technical vs. behavioral)
- ✅ **Feels like a real interviewer** with structured responses
- ✅ **Provides context-aware coaching** that remembers conversation history
- ✅ **Saves progress** so users can continue sessions later

The result is a personalized interview coach that helps users practice in a realistic, low-pressure environment.

---

## ✨ Features

### 🎨 Dynamic Theming
- Dark mode by default with glassmorphism effects
- Color themes change based on selected mode:
  - **DSA** → Blue theme
  - **HR** → Orange theme  
  - **System Design** → Violet theme
- Smooth transitions and animated backgrounds

### 💬 Interactive Chat Interface
- Real-time message streaming
- Typing indicator during AI response
- Auto-scroll to latest message
- Message grouping and styling based on role

### 🧠 Domain-Specific Coaching
| Mode | Focus Area | Coaching Style |
|------|------------|----------------|
| **DSA** | Data Structures & Algorithms | Step-by-step problem solving, complexity analysis, optimization tips |
| **HR** | Behavioral Interviews | STAR method guidance, communication skills, career advice |
| **System Design** | Architecture Design | Structured approach, trade-offs, scalability considerations |

### 🧊 Modern UI/UX
- Glassmorphism design with backdrop blur effects
- Animated gradient backgrounds
- Responsive layout for desktop and mobile
- Smooth animations and transitions
- Custom scrollbar styling

### 📁 Persistent Chat Sessions
- Automatic saving of conversations
- Session history with timestamps
- Auto-generated chat names from first message
- Delete and switch between sessions
- Local storage persistence

### 🔒 Enhanced UX
- UI locking during AI response to prevent double submissions
- Loading states with animated thinking indicator
- Error handling with user-friendly messages
- Keyboard shortcuts (Enter to send)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theming
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for accessible components
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography

### Backend
- **API Routes**: Next.js API routes for serverless functions
- **AI Integration**: [OpenRouter API](https://openrouter.ai/) for LLM access
- **Model**: GPT-4o-mini for fast, quality responses

### Deployment
- **Hosting**: [Vercel](https://vercel.com/) for optimal Next.js deployment
- **Environment Variables**: Secure API key management

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- OpenRouter API key (or OpenAI API key)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interview-coach.git
   cd ai-interview-coach
