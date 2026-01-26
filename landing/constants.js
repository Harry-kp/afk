// =============================================================================
// Shared Constants for Landing Page
// Keep in sync with: src/renderer/constants/authors.ts
// =============================================================================

// Make constants global for data attribute lookup
window.AUTHORS = {
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
};

window.APP_INFO = {
  name: 'AFK',
  version: '1.1.0',
  tagline: 'Step away from your keyboard',
  description: 'A break reminder for developers who forget to blink.',
  website: 'https://afk-app.vercel.app',
  releases: 'https://github.com/Harry-kp/afk-releases/releases/latest',
  homebrew: 'brew tap Harry-kp/tap && brew install --cask afk',
};

// Populate elements with data-const attribute
function populateConstants() {
  // Text content
  document.querySelectorAll('[data-const]').forEach(el => {
    const path = el.getAttribute('data-const');
    const value = getNestedValue(path);
    if (value) el.textContent = value;
  });

  // Links (href)
  document.querySelectorAll('[data-const-href]').forEach(el => {
    const path = el.getAttribute('data-const-href');
    const value = getNestedValue(path);
    if (value) el.href = value;
  });
}

function getNestedValue(path) {
  const parts = path.split('.');
  let value = window;
  
  for (const part of parts) {
    value = value[part];
    if (value === undefined) return null;
  }
  
  return value;
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateConstants);
} else {
  populateConstants();
}

