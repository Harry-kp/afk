# AFK Landing Page

Simple landing page for AFK - the break reminder app.

## Local Development

Serve the files locally:

```bash
cd landing
npx serve .
```

Or use Python:

```bash
cd landing
python3 -m http.server 3000
```

Then open http://localhost:3000

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
cd landing
npx vercel --prod
```

### Option 2: GitHub Integration

1. Push the `landing` folder to a GitHub repository
2. Import the repository on [vercel.com](https://vercel.com)
3. Set the root directory to `landing`
4. Deploy

Vercel will auto-deploy on every push to main.

## Assets Needed

Before deploying, add these images to `assets/`:

- `screenshot.png` - App screenshot (recommended: 1200x800px)
- `og-image.png` - Social media preview image (recommended: 1200x630px)

The `icon.png` is already copied from the main app.

## Custom Domain

After deploying to Vercel:

1. Go to your project settings
2. Add your custom domain (e.g., afk.app)
3. Update DNS records as instructed

## Updating the Version

When releasing a new version, update:

1. The `v1.0.0` in `index.html` footer
2. The Homebrew cask formula in `homebrew-tap/Casks/afk.rb`

