<p align="center">
  <img src="assets/icons/claude.svg" width="48" alt="Claude" />
  <img src="assets/icons/gemini.svg" width="48" alt="Gemini" />
  <img src="assets/icons/grok.svg" width="48" alt="Grok" />
</p>

<h1 align="center">⚖️ Konsey</h1>

<p align="center">
  <strong>Multi-Agent AI Discussion Platform</strong><br/>
  <em>Structured debates between Claude, Gemini &amp; Grok with cross-critique and arbiter evaluation</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#installation">Installation</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/version-2.0.0-purple?style=flat-square" alt="Version" />
</p>

---

## ✨ What is Konsey?

**Konsey** (Turkish for "Council") is an AI-powered deliberation platform that orchestrates structured multi-agent debates. Instead of relying on a single AI perspective, Konsey pits three distinct AI personalities against each other in a rigorous 5-phase discussion process — producing richer, more balanced, and epistemically superior insights.

> 🎯 **Goal:** Better discussions through pluralistic thinking and structured intellectual conflict.

---

## 🎭 The Council Members

| Agent | Role | Personality | Focus |
|-------|------|-------------|-------|
| 🔬 **Claude** | Methodologist | Analytical & Cautious | Exposes assumptions, flags logical errors |
| ✨ **Gemini** | Synthesizer | Creative & Intuitive | Connects ideas across domains, sees the big picture |
| 🔥 **Grok** | Contrarian | Provocative & Skeptical | Challenges consensus, asks uncomfortable questions |

---

## 🚀 Features

- **5-Phase Structured Debate** — User Input → Initial Views → Cross-Critique → Revision → Arbiter Evaluation
- **Three Distinct AI Personalities** — Each agent brings a unique perspective with tailored system prompts
- **Cross-Critique System** — Agents critique each other in a rotating pattern (Claude→Gemini→Grok→Claude)
- **Revision & Self-Correction** — Agents revise their positions based on received criticism
- **Arbiter Summary** — Automatic synthesis of common ground, unresolved disagreements, and strongest arguments
- **Discussion History** — All discussions are saved locally and can be revisited
- **Fallback Templates** — Works offline with pre-built response templates when APIs are unavailable
- **Dark Glassmorphism UI** — Premium dark theme with glassmorphism effects and smooth animations
- **Fully Responsive** — Works beautifully on desktop, tablet, and mobile
- **Accessible** — ARIA labels, keyboard navigation (Ctrl+Enter to start), screen reader support

---

## 🔄 How It Works

```
User Question
    ↓
┌─────────────────────────────────────┐
│  Phase 1: User Input                │
│  Display the question               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Phase 2: Initial Responses         │
│  Claude → Gemini → Grok            │
│  Each provides their perspective    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Phase 3: Cross-Critique            │
│  Claude critiques Gemini            │
│  Gemini critiques Grok              │
│  Grok critiques Claude              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Phase 4: Revision                  │
│  Each agent revises their position  │
│  based on the criticism received    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Phase 5: Arbiter Evaluation        │
│  Summary of common ground,         │
│  unresolved disagreements &         │
│  strongest argument chains          │
└─────────────────────────────────────┘
    ↓
Discussion Complete → Copy & Share
```

---

## 📦 Installation

### Prerequisites

- **Node.js** ≥ 16.0.0
- **npm** ≥ 8.0.0
- API keys for at least one provider (see [Configuration](#configuration))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/petrofi/konsey.git
cd konsey

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start the server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in your API keys:

```env
# Claude API (Anthropic)
# Get your key at: https://console.anthropic.com
CLAUDE_API_KEY=your_claude_api_key_here

# Google Gemini API
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Groq API (for Grok agent)
# Get your key at: https://console.groq.com
GROK_API_KEY=your_groq_api_key_here
```

> **Note:** The system works even without API keys — it falls back to built-in response templates for offline/demo usage.

### Optional Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment (`development` / `production`) |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `RATE_LIMIT_WINDOW` | `15` | Rate limit window (minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

---

## 🖥️ Usage

1. **Enter a topic** — Type any question or debate topic in the input area
2. **Start the discussion** — Click "🚀 Tartışmayı Başlat" or press `Ctrl+Enter`
3. **Watch the debate unfold** — Each agent presents, critiques, and revises in sequence
4. **Review the summary** — The arbiter provides a final evaluation at the end
5. **Copy or restart** — Copy the summary to your clipboard or start a new discussion

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Enter` | Start discussion |
| `Tab` | Navigate between elements |
| `Enter` | Activate focused button |

---

## 🏗️ Architecture

```
konsey/
├── index.html              # Main HTML page
├── css/
│   └── styles.css          # Complete styling (dark glassmorphism theme)
├── js/
│   ├── api-client.js       # API client with retry logic & timeout
│   ├── agents.js           # Agent definitions & personality templates
│   ├── discussion.js       # 5-phase discussion engine
│   └── app.js              # UI logic, history, event handling
├── server/
│   ├── index.js            # Express server entry point
│   └── routes/
│       ├── claude.js       # Anthropic Claude API integration
│       ├── gemini.js       # Google Gemini API integration
│       └── grok.js         # Groq API integration
├── assets/
│   └── icons/              # SVG logos for each agent
├── docs/                   # Detailed documentation
│   ├── ARCHITECTURE.md     # System architecture diagrams
│   ├── API_SETUP.md        # API setup guide
│   └── USER_GUIDE.md       # Detailed user guide
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies & scripts
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
└── LICENSE                 # MIT License
```

### API Flow

```
Browser → api-client.js → Express Server → AI Provider APIs
                                ↓
                          Rate Limiting
                          CORS Protection
                          Input Validation
                          Error Handling
```

---

## 🛡️ Security

- **API keys** are stored server-side only (never exposed to the client)
- **Rate limiting** prevents abuse (100 requests per 15-minute window)
- **CORS protection** restricts cross-origin requests
- **Input sanitization** on both client and server side
- **Error handling** with graceful fallbacks

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) — Claude API
- [Google](https://ai.google.dev) — Gemini API
- [Groq](https://groq.com) — Fast inference API
- [Inter Font](https://fonts.google.com/specimen/Inter) — Typography
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — Monospace font

---

<p align="center">
  <strong>Konsey v2.0.0</strong> — <em>Epistemic quality through pluralistic thinking</em> ⚖️
</p>
