# AFK

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Harry-kp/afk/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/Harry-kp/afk)

A lightweight desktop application that helps you maintain focus and prevent burnout with intelligent break reminders. Built with Tauri for native performance and minimal resource usage.

## Quick Start

### macOS (Homebrew)

```bash
brew tap Harry-kp/tap
brew install --cask afk
```

### Other Platforms

Download the latest release for your platform from the [releases page](https://github.com/Harry-kp/afk/releases).

## Key Features

- **Customizable Work Sessions** - Set focus durations that match your workflow
- **Smart Break Management** - Automated short and long break scheduling
- **Fullscreen Break Reminders** - Impossible to ignore when it's time to rest
- **System Tray Integration** - Monitor time remaining without switching windows
- **Session Tracking** - Built-in dashboard to review your productivity patterns
- **Flexible Controls** - Pause, skip, or start breaks early as needed
- **Audio Notifications** - Configurable chimes for session transitions
- **Launch at Login** - Seamless integration into your daily routine
- **Cross-Platform** - Works on macOS, Windows, and Linux

## Why AFK?

Extended screen time without breaks leads to eye strain, decreased productivity, and burnout. AFK helps you build sustainable work habits by enforcing regular breaks based on proven time management techniques like the Pomodoro method. The application runs natively on your system with minimal resource usage, ensuring your break reminders don't become another source of slowdown.

## Configuration

Customize the application to match your preferred work style:

- **Focus Duration** - Length of work sessions (default: 25 minutes)
- **Short Break** - Duration of regular breaks (default: 30 seconds)
- **Long Break** - Duration of extended breaks (default: 2 minutes)
- **Sessions Before Long Break** - Cycles before triggering a long break
- **Pre-break Notifications** - Get advance warning before breaks start
- **Audio Alerts** - Enable sound notifications for session transitions
- **Launch at Login** - Automatically start with your system

All settings are accessible through the in-app Settings panel and persist between sessions.

## Development Setup

### Requirements

- Node.js 18 or higher
- Rust (latest stable version)
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **Linux**: `build-essential`, `libwebkit2gtk-4.1-dev`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Build from Source

```bash
# Clone the repository
git clone https://github.com/Harry-kp/afk.git
cd afk

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

The production build will be available in `src-tauri/target/release/bundle/`.

## Technical Architecture

Built with modern technologies for optimal performance and developer experience:

- **Backend**: Tauri 2.0 + Rust
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion

### Project Structure

```
src/                    # React application
├── components/         # Reusable UI components
├── lib/               # Utilities and Tauri IPC bridge
└── *.tsx              # Application pages

src-tauri/             # Rust backend
├── src/
│   ├── main.rs        # Application entry
│   ├── commands.rs    # IPC handlers
│   ├── state.rs       # Session management
│   ├── tray.rs        # System tray integration
│   └── utils.rs       # Helper functions
├── icons/             # App icons
├── resources/         # Audio assets
└── tauri.conf.json    # Tauri configuration
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and coding standards.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by [Harry-kp](https://github.com/Harry-kp)

---

**Built with** [Tauri](https://tauri.app/) • **UI Components** [Radix UI](https://www.radix-ui.com/) • **Icons** [Lucide](https://lucide.dev/)
