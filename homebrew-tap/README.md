# Homebrew Tap for AFK

This is the official Homebrew tap for [AFK](https://github.com/Harry-kp/afk) - a break reminder app for developers.

## Installation

```bash
brew tap Harry-kp/tap
brew install --cask afk
```

## Updating

```bash
brew upgrade --cask afk
```

## Uninstalling

```bash
brew uninstall --cask afk
```

## About AFK

AFK helps you maintain healthy work habits by reminding you to take regular breaks. It lives in your menu bar and gently prompts you to step away from your keyboard at customizable intervals.

- Customizable work sessions (15-50 minutes)
- Short and long break support
- Pre-break notifications
- Optional chime sounds
- Starts with your Mac

## Setup This Tap (For Maintainers)

1. Create a new GitHub repository named `homebrew-tap`
2. Copy the contents of this folder to the new repository
3. Push to GitHub

Users can then install with:
```bash
brew tap Harry-kp/tap
brew install --cask afk
```

## Updating the Cask

After releasing a new version:

1. Update the `version` in `Casks/afk.rb`
2. Download the new DMG and calculate SHA256:
   ```bash
   shasum -a 256 AFK_x.x.x_universal.dmg
   ```
3. Update the `sha256` in `Casks/afk.rb`
4. Commit and push

Or use the automated GitHub Action in the main AFK repository.

