# Contributing to AFK

Thanks for your interest. AFK works and is maintained as needed, but it is not under
active development — so the most useful thing you can do before writing code is
check that the change is one we want to land.

## Before you open a pull request

**For anything bigger than a small fix, open an issue first** and wait for a reply,
so neither of us spends time on a change that will not land.

Pull requests likely to be closed:

- New dependencies or new Tauri plugins that were not agreed in an issue first
- Reformatting or renaming in files the change does not otherwise touch
- A rewrite of the UI, the state layer, or the build setup
- New settings for behaviour an existing setting already covers
- A behaviour change with no description of how to verify it by hand

Small fixes — a bug, a typo, a broken link, a platform quirk — go straight to a PR.

## Development setup

Prerequisites:

- [Node.js](https://nodejs.org/) v18 or higher
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: see [Tauri prerequisites](https://tauri.app/start/prerequisites/)

```bash
git clone https://github.com/Harry-kp/afk.git
cd afk
npm install
npm run dev
```

## Checks

There is no lint or build CI on pull requests — only a post-release distribution
check — so run this yourself before you push:

```bash
npm run lint
npm run build:vite   # writes dist/, which the Rust build needs
cd src-tauri && cargo clippy
```

`cargo clippy` fails with *"`frontendDist` ... doesn't exist"* if you skip
`build:vite`. Run `cargo fmt` on files you touched; the repo is not fully
formatted, so don't reformat anything else.

## Sending the change

Branch from `main`, then in the PR say what changed and how you checked it —
screenshots for UI changes.

## Code of conduct

Be respectful and inclusive; we follow the
[Contributor Covenant](https://www.contributor-covenant.org/).

## License

By contributing, you agree your contributions are licensed under the MIT License.
