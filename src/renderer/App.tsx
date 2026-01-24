import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import Break from './Break';
import Settings from './Settings';
import Overview from './Overview';

import './App.css';

function ViewManager() {
  const [showSettings, setShowSettings] = useState(false);
  const [viewType, setViewType] = useState<string | null>(null);

  useEffect(() => {
    // Get the view type from URL query params
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('settings')) {
      setViewType('settings');
      setShowSettings(true);
    } else if (params.has('dashboard')) {
      setViewType('dashboard');
      setShowSettings(false);
    } else if (params.has('long-break')) {
      setViewType('long-break');
    } else if (params.has('break')) {
      setViewType('break');
    } else {
      // Default to dashboard
      setViewType('dashboard');
    }
  }, []);

  // Listen for navigation events from tray menu
  useEffect(() => {
    const unlisten = listen<string>('navigate', (event) => {
      if (event.payload === 'settings') {
        setShowSettings(true);
      } else if (event.payload === 'dashboard') {
        setShowSettings(false);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  if (viewType === 'settings' || viewType === 'dashboard') {
    return showSettings ? (
      <Settings setShowSettings={setShowSettings} />
    ) : (
      <Overview setShowSettings={setShowSettings} />
    );
  }

  if (viewType === 'break' || viewType === 'long-break') {
    return <Break isLongBreak={viewType === 'long-break'} />;
  }

  // Loading state
  return null;
}

export default function App() {
  return <ViewManager />;
}
