# Contributing to AFK

Thank you for your interest in contributing to AFK! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Windows**: [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - **Linux**: See [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/#linux)

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Harry-kp/afk.git
   cd afk
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development:
   ```bash
   npm run dev
   ```

## Project Structure

```
afk/
├── src/renderer/          # React frontend
│   ├── components/        # UI components (Radix UI based)
│   ├── lib/               # Utilities and Tauri bridge
│   └── *.tsx              # Page components
├── src-tauri/
│   ├── src/               # Rust backend
│   │   ├── main.rs        # Entry point
│   │   ├── commands.rs    # IPC handlers
│   │   ├── state.rs       # App state
│   │   ├── tray.rs        # System tray
│   │   └── utils.rs       # Utilities
│   └── tauri.conf.json    # Tauri config
└── index.html             # Entry HTML
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code conventions
- Use functional components with hooks
- Run `npm run lint` before committing

### Rust

- Follow standard Rust conventions
- Use `cargo fmt` to format code
- Run `cargo clippy` for linting
- Document public APIs with doc comments

## Making Changes

### Branching

- Create a feature branch from `main`:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Use descriptive branch names:
  - `feature/` for new features
  - `fix/` for bug fixes
  - `docs/` for documentation updates

### Commits

- Write clear, concise commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference issues when applicable: "Fix #123: Description"

### Pull Requests

1. Ensure your code builds without errors:
   ```bash
   npm run build
   ```
2. Update documentation if needed
3. Create a pull request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Link to related issues

## Testing

### Frontend

```bash
npm run test
```

### Backend (Rust)

```bash
cd src-tauri
cargo test
```

## Reporting Issues

When reporting issues, please include:

- OS and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console/error logs

## Feature Requests

We welcome feature suggestions! Please:

- Check existing issues first
- Describe the use case
- Explain why it would benefit users

## Code of Conduct

Be respectful and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make AFK better!
