# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-26

### Added
- Multi-agent AI discussion platform with Claude, Gemini, and Grok
- 5-phase structured debate engine (Input → Initial Views → Cross-Critique → Revision → Arbiter)
- Backend server with Express.js and API integrations (Anthropic, Google Gemini, Groq)
- Fallback response templates for offline/demo usage
- Discussion history with localStorage persistence
- Dark glassmorphism UI theme with smooth animations
- Responsive design for desktop, tablet, and mobile
- Accessibility support (ARIA labels, keyboard shortcuts, screen reader)
- Rate limiting and CORS protection
- API client with retry logic and timeout handling
- Cross-critique rotation system (Claude→Gemini, Gemini→Grok, Grok→Claude)
- Arbiter evaluation with summary generation
- Copy-to-clipboard functionality for discussion summaries
- SVG logos for each AI agent
- Comprehensive documentation (Architecture, API Setup, User Guide)

### Security
- Server-side API key storage (never exposed to client)
- Input validation on both client and server
- Rate limiting (100 requests per 15-minute window)
- CORS protection with configurable origins

## [1.0.0] - 2026-03-01

### Added
- Initial prototype with basic discussion flow
- Single-page HTML interface
- Basic agent templates
