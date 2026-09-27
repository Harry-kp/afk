# Security Policy

## Reporting a vulnerability

Do not open a public issue. Report it privately through
[GitHub's vulnerability reporting](https://github.com/Harry-kp/afk/security/advisories/new),
with what you found, how to reproduce it, and its impact.

AFK is maintained as needed rather than full time, so expect an acknowledgment within
a week. Reporters are credited in the release notes unless they prefer not to be.

## What AFK stores, and what it sends

AFK tracks when you are at your keyboard, so it is fair to ask where that goes.

- **Everything stays on your machine.** Two files, written by the app and owned by
  you, in `~/Library/Application Support/com.afk.app/` on macOS or
  `~/.local/share/com.afk.app/` on Linux. `settings.json` holds your session and break durations, chime and startup
  preferences. `stats.json` holds one row per day — date, total focus seconds,
  breaks taken, breaks skipped — plus your streak. Rows older than 90 days are
  pruned on load. No window titles, no application names, no keystrokes, no
  screenshots.

- **No account, and no server.** AFK has no backend. Nothing is uploaded, and there
  is nothing to sign in to.

- **No analytics in released builds.** The source contains a Mixpanel wrapper
  (`src/renderer/lib/analytics.ts`) that is inert unless `VITE_MIXPANEL_TOKEN` is set
  at build time. The release workflow does not set it, so published builds send no
  events. If you build from source without a `.env`, the same applies.

- **No auto-update check.** AFK does not phone home for new versions; Homebrew or a
  manual download is how you upgrade.

- **Permissions it asks the OS for:** notifications, launch at login (only when you
  enable it in Settings), and the four global keyboard shortcuts. It does not request
  accessibility, screen recording, or network permissions.

To delete everything AFK has stored, remove the directory above, or
`brew uninstall --zap --cask Harry-kp/tap/afk`.

## Known limitations

- **Builds are not signed or notarized.** macOS quarantines the app on first launch;
  the [README](README.md#install) covers the workaround. Because the build is
  unsigned, you cannot verify through Apple that a downloaded `.dmg` is the one this
  repository produced. Notarized builds are planned.
