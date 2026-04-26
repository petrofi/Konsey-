# Contributing to Konsey

Thank you for your interest in contributing to Konsey! 🎉 This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/petrofi/Konsey-.git
   cd konsey
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Configure** environment:
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```
5. **Start** the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Prerequisites

- Node.js ≥ 16.0.0
- npm ≥ 8.0.0
- A modern web browser

### Project Structure

```
konsey/
├── index.html          # Main page
├── css/styles.css      # Styles
├── js/                 # Frontend JavaScript
├── server/             # Backend Express server
│   ├── index.js        # Entry point
│   └── routes/         # API route handlers
├── assets/             # Static assets (SVG icons)
└── docs/               # Documentation
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

## ✏️ Making Changes

### Branch Naming

Use descriptive branch names with prefixes:
- `feature/` — New features (e.g., `feature/add-export-pdf`)
- `fix/` — Bug fixes (e.g., `fix/history-panel-overflow`)
- `docs/` — Documentation updates (e.g., `docs/update-api-guide`)
- `refactor/` — Code refactoring (e.g., `refactor/discussion-engine`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(agents): add GPT-4 agent support
fix(discussion): resolve race condition in phase transitions
docs(readme): update installation instructions
style(css): improve mobile responsiveness
```

## 🔀 Pull Request Process

1. **Update** your fork with the latest `main` branch
2. **Create** a feature branch from `main`
3. **Make** your changes with clear commits
4. **Test** your changes locally
5. **Push** your branch and open a Pull Request
6. **Describe** your changes clearly in the PR description
7. **Wait** for review — maintainers will review and provide feedback

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-reviewed the code changes
- [ ] Added/updated comments for complex logic
- [ ] Changes don't break existing functionality
- [ ] Tested on multiple browsers (if UI changes)
- [ ] Updated documentation if needed

## 🎨 Style Guide

### JavaScript
- Use ES6+ features (arrow functions, template literals, destructuring)
- Use `const` by default, `let` when reassignment is needed
- Add JSDoc comments for functions
- Use meaningful variable and function names

### CSS
- Use CSS custom properties (variables) defined in `:root`
- Follow BEM-like naming for new classes
- Maintain the dark theme color palette
- Ensure responsive design for all new components

### HTML
- Use semantic HTML5 elements
- Include ARIA attributes for accessibility
- Maintain proper heading hierarchy

## 🐛 Reporting Bugs

Open an issue using the **Bug Report** template and include:

1. **Description** — Clear description of the bug
2. **Steps to Reproduce** — Numbered steps to reproduce
3. **Expected Behavior** — What you expected to happen
4. **Actual Behavior** — What actually happened
5. **Environment** — Browser, OS, Node.js version
6. **Screenshots** — If applicable

## 💡 Suggesting Features

Open an issue using the **Feature Request** template and include:

1. **Problem** — What problem does this solve?
2. **Proposed Solution** — How should it work?
3. **Alternatives** — Any alternative approaches considered?
4. **Additional Context** — Screenshots, mockups, examples

---

Thank you for contributing! Every contribution makes Konsey better. ⚖️
