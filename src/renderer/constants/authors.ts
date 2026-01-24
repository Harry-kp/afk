// =============================================================================
// Author & Social Constants
// Centralized configuration for all author credits across the app
// =============================================================================

export const AUTHORS = {
  chaitanya: {
    name: 'Chaitanya Aaditya',
    displayName: 'Chaitanya',
    github: 'https://github.com/holaChaitanya',
    twitter: 'https://x.com/holaChaitanya',
    twitterHandle: '@holaChaitanya',
    email: 'ca.chaitanya.2204@gmail.com',
  },
  harry: {
    name: 'Harry-kp',
    displayName: 'Harry-kp',
    github: 'https://github.com/Harry-kp',
    twitter: 'https://x.com/Harshitc007',
    twitterHandle: '@Harshitc007',
    email: 'chaudharyharshit9@gmail.com',
  },
} as const;

export const APP_INFO = {
  name: 'AFK',
  version: '1.0.0',
  tagline: 'Step away from your keyboard',
  description: 'A break reminder for developers who forget to blink.',
  website: 'https://afk-app.vercel.app',
  releases: 'https://github.com/Harry-kp/afk-releases/releases/latest',
  copyright: '© 2024-2026 All rights reserved',
} as const;

// Helper to get both authors' names
export const getAuthorsDisplay = () => 
  `${AUTHORS.chaitanya.displayName} & ${AUTHORS.harry.displayName}`;

