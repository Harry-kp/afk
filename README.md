<p align="center">
  <img src="https://raw.githubusercontent.com/Harry-kp/afk/main/landing/assets/icon.png" alt="AFK" width="120" height="120">
</p>

<h1 align="center">AFK</h1>

<p align="center">
  <strong>A break reminder for developers who forget to blink.</strong>
</p>

<p align="center">
  <a href="https://github.com/Harry-kp/afk/actions/workflows/release.yml"><img src="https://github.com/Harry-kp/afk/actions/workflows/release.yml/badge.svg" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/Harry-kp/afk/releases/latest"><img src="https://img.shields.io/github/v/release/Harry-kp/afk?label=download" alt="Latest Release"></a>
  <a href="https://github.com/Harry-kp/afk"><img src="https://img.shields.io/github/stars/Harry-kp/afk?style=social" alt="GitHub Stars"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</p>

<p align="center">
  <a href="https://afk-app.vercel.app">Website</a> •
  <a href="https://github.com/Harry-kp/afk/releases/latest">Download</a> •
  <a href="#install">Install</a>
</p>

---

AFK is a lightweight break reminder that lives in your menu bar. It follows the **20-20-20 rule**: every 20 minutes, look at something 20 feet away for 20 seconds. Simple, unobtrusive, effective.

<p align="center">
  <a href="https://afk-app.vercel.app">
    <img src="https://raw.githubusercontent.com/Harry-kp/afk/main/landing/assets/demo.gif" alt="AFK Demo" width="600">
  </a>
</p>

## Why AFK?

It was 2 AM. Four hours deep into debugging. Eyes burning, neck stiff, hadn't blinked in what felt like forever.

Most break reminders are either too aggressive (popup every 5 minutes) or too easy to ignore (a tiny notification you dismiss without thinking). AFK strikes a balance: a fullscreen reminder you can't miss, but with skip/snooze options when you're in flow. No guilt trips, no gamification — just a simple tool that does one thing well.

### AFK vs Alternatives

| Feature | AFK | Stretchly | Time Out | Pomatez |
|---------|:---:|:---------:|:--------:|:-------:|
| Open source | ✅ | ✅ | ❌ | ✅ |
| Fullscreen breaks | ✅ | ✅ | ✅ | ❌ |
| Menu bar timer | ✅ | ✅ | ❌ | ❌ |
| Statistics dashboard | ✅ | ❌ | ❌ | ❌ |
| Health exercises | ✅ | ✅ | ❌ | ❌ |
| Global shortcuts | ✅ | ✅ | ❌ | ❌ |
| App size | < 5 MB | ~200 MB | ~15 MB | ~100 MB |
| Built with | Rust + Tauri | Electron | Native | Electron |
| macOS | ✅ | ✅ | ✅ | ✅ |
| Linux | ✅ | ✅ | ❌ | ✅ |
| Windows | 🔜 | ✅ | ❌ | ✅ |

## Install

**macOS — Homebrew (recommended)**

```bash
brew tap Harry-kp/tap
brew install --cask afk
```

**macOS — Direct Download**

Download the latest `.dmg` from [releases](https://github.com/Harry-kp/afk/releases/latest).

> First launch: Right-click → Open → Open (required for apps outside the App Store)

**Linux — AppImage**

Download the `.AppImage` from [releases](https://github.com/Harry-kp/afk/releases/latest), then:

```bash
chmod +x Afk_*.AppImage
./Afk_*.AppImage
```

**Linux — Debian/Ubuntu**

```bash
# Download the .deb from releases, then:
sudo dpkg -i afk_*.deb
```

## Features

- **Fullscreen break reminders** — Gentle overlays that respect your workflow
- **Configurable timing** — 15-50 min sessions, 20s-5 min breaks
- **Long breaks** — Automatic extended breaks after multiple sessions
- **Menu bar timer** — Always know when your next break is
- **Statistics dashboard** — Track focus time, breaks, and streaks
- **Global keyboard shortcuts** — Control AFK from anywhere (⌘⇧N, ⌘⇧P, ⌘⇧B, ⌘⇧S)
- **Health reminders** — Stretches, eye exercises, and hydration tips during breaks
- **Skip or snooze** — You're in control
- **Launch at login** — Set it and forget it
- **No account required** — Your data stays on your machine

## Roadmap

- [x] Linux support (AppImage + .deb)
- [ ] Windows support
- [ ] Customizable break screen themes
- [ ] Plugin system for custom exercises
- [ ] CLI mode for headless/SSH sessions

Have an idea? [Open a discussion](https://github.com/Harry-kp/afk/discussions).

## Development

```bash
# Prerequisites: Node.js 18+, Rust, Xcode CLI tools (macOS)

git clone https://github.com/Harry-kp/afk.git
cd afk
npm install
npm run dev
```

<details>
<summary>Build for production</summary>

```bash
npm run build
# Output: src-tauri/target/release/bundle/
```
</details>

<details>
<summary>Tech stack</summary>

- **Framework**: Tauri + Rust
- **Frontend**: React, TypeScript, Tailwind CSS
- **Build**: Vite
</details>

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Harry-kp/afk&type=Date)](https://star-history.com/#Harry-kp/afk&Date)

---

<p align="center">
  Built by <a href="https://github.com/holaChaitanya">Chaitanya</a> & <a href="https://github.com/Harry-kp">Harry</a><br>
  <a href="https://x.com/holaChaitanya">@holaChaitanya</a> • <a href="https://x.com/Harry_kp_">@Harry_kp_</a>
</p>
