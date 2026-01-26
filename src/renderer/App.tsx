import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import Break from './Break';
import Settings from './Settings';
import Overview from './Overview';
import Stats from './Stats';

import './App.css';

function ViewManager() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'stats'>('dashboard');
  const [viewType, setViewType] = useState<string | null>(null);
  const [breakDuration, setBreakDuration] = useState<number>(30);

  useEffect(() => {
    // Get the view type from URL query params
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('settings')) {
      setViewType('settings');
      setCurrentView('settings');
    } else if (params.has('dashboard')) {
      setViewType('dashboard');
      setCurrentView('dashboard');
    } else if (params.has('stats')) {
      setViewType('stats');
      setCurrentView('stats');
    } else if (params.has('long-break')) {
      setViewType('long-break');
      const duration = params.get('duration');
      if (duration) setBreakDuration(parseInt(duration, 10));
    } else if (params.has('break')) {
      setViewType('break');
      const duration = params.get('duration');
      if (duration) setBreakDuration(parseInt(duration, 10));
    } else {
      // Default to dashboard
      setViewType('dashboard');
    }
  }, []);

  // Listen for navigation events from tray menu
  useEffect(() => {
    const unlisten = listen<string>('navigate', (event) => {
      if (event.payload === 'settings') {
        setCurrentView('settings');
      } else if (event.payload === 'dashboard') {
        setCurrentView('dashboard');
      } else if (event.payload === 'stats') {
        setCurrentView('stats');
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  if (viewType === 'settings' || viewType === 'dashboard' || viewType === 'stats') {
    if (currentView === 'settings') {
      return <Settings setShowSettings={(show) => setCurrentView(show ? 'settings' : 'dashboard')} />;
    }
    if (currentView === 'stats') {
      return <Stats onBack={() => setCurrentView('dashboard')} />;
    }
    return (
      <Overview 
        setShowSettings={(show) => setCurrentView(show ? 'settings' : 'dashboard')}
        setShowStats={(show) => setCurrentView(show ? 'stats' : 'dashboard')}
      />
    );
  }

  if (viewType === 'break' || viewType === 'long-break') {
    return <Break isLongBreak={viewType === 'long-break'} initialDuration={breakDuration} />;
  }

  // Loading state
  return null;
}

export default function App() {
  return <ViewManager />;
}
