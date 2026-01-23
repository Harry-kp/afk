# AFK

**AFK** (Away From Keyboard) is a desktop application designed to help users maintain a healthy work-life balance by reminding them to take regular breaks during their work sessions. Built with Tauri for a lightweight, fast, and native experience.

## Quick Install (macOS)

```bash
brew tap Harry-kp/tap
brew install --cask afk
```

## Features

- Customizable work session durations
- Automatic break reminders with fullscreen overlay
- Configurable short and long break durations
- Long break support after multiple work sessions
- System tray timer display with remaining/elapsed time
- Dashboard for session tracking
- Pause and resume session functionality
- Option to skip breaks or take them early
- Pre-break notifications with optional chime sounds
- Configurable chime sounds for different events
- Launch at login capability
- Cross-platform support (macOS, Windows, Linux)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Platform-specific dependencies for Tauri:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **Linux**: `build-essential`, `libwebkit2gtk-4.1-dev`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Harry-kp/afk.git
   cd afk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

The built application will be available in `src-tauri/target/release/bundle/`.

## Technology Stack

- **Backend**: [Tauri](https://tauri.app/) + Rust
- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion

## Project Structure

```
afk/
├── src/
│   └── renderer/          # React frontend
│       ├── components/    # UI components
│       ├── lib/           # Utilities and Tauri bridge
│       └── *.tsx          # Page components
├── src-tauri/
│   ├── src/               # Rust backend
│   │   ├── main.rs        # Application entry point
│   │   ├── commands.rs    # IPC command handlers
│   │   ├── state.rs       # Session/settings state
│   │   ├── tray.rs        # System tray
│   │   └── utils.rs       # Utilities
│   ├── icons/             # Application icons
│   ├── resources/         # Audio files
│   └── tauri.conf.json    # Tauri configuration
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
└── package.json
```

## Configuration

The application stores settings using Tauri's store plugin. Settings can be configured through the in-app Settings panel:

- **Focus Duration**: Work session length (default: 25 minutes)
- **Short Break**: Short break duration (default: 30 seconds)
- **Long Break**: Long break duration (default: 2 minutes)
- **Sessions Before Long Break**: Number of sessions before a long break
- **Pre-break Notification**: Warning before break starts
- **Chime Sounds**: Audio notifications for session events
- **Launch at Login**: Start app automatically on system boot

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Harry-kp
- GitHub: [@Harry-kp](https://github.com/Harry-kp)
- Email: chaudharyharshit9@gmail.com

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
