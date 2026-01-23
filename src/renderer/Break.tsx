import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { track } from './lib/analytics';
import { AuroraBackground } from './components/ui/aurora-background';
import { COPIES } from './constants';
import { getCurrentWindow } from '@tauri-apps/api/window';

function getTime(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  const result = { hrs: 0, mins: 0, secs: 0 };

  if (hours > 0) {
    result.hrs = hours;
  }

  if (minutes > 0) {
    result.mins = minutes;
  }

  if (seconds > 0) {
    result.secs = seconds;
  }

  return result;
}

const copy = COPIES[Math.floor(Math.random() * COPIES.length)];

function Break({ isLongBreak }: { isLongBreak: boolean }) {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize break duration from store (must fetch from backend, not cache)
  useEffect(() => {
    const initDuration = async () => {
      const key = isLongBreak ? 'long_break_duration' : 'break_duration';
      const defaultDuration = isLongBreak ? 120 : 30;
      
      // MUST use getAsync to fetch actual value from backend
      // The break window is a new window with fresh cache defaults
      const duration = await window.electron.store.getAsync<number>(key);
      setSeconds(duration ?? defaultDuration);
    };
    initDuration();
  }, [isLongBreak]);

  // Countdown timer
  useEffect(() => {
    if (seconds === null) return;
    
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Clear interval and close
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seconds !== null]); // Only start when initialized

  // Handle break end - trigger closing animation
  useEffect(() => {
    if (seconds === 0 && !isClosing) {
      setIsClosing(true);
      // End break and start new session
      window.electron.session.endBreak();
    }
  }, [seconds, isClosing]);

  // Actually close window after animation completes
  useEffect(() => {
    if (shouldClose) {
      getCurrentWindow().close().catch(console.error);
    }
  }, [shouldClose]);

  // Confetti effect for long breaks
  useEffect(() => {
    if (!isLongBreak) return;
    
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [isLongBreak]);

  const handleSkipBreak = async () => {
    if (isClosing) return;
    setIsClosing(true);
    
    track('break_skipped');
    await window.electron.session.skipBreak();
    // Window will close after animation completes
  };

  const handleSnooze = async () => {
    if (isClosing) return;
    setIsClosing(true);
    
    track('break_snoozed');
    await window.electron.session.snooze();
    // Window will close after animation completes
  };

  // Show loading state while initializing
  if (seconds === null) {
    return (
      <AuroraBackground>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Preparing your break...</div>
        </div>
      </AuroraBackground>
    );
  }

  const { mins, secs } = getTime(seconds);

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 1 }}
        animate={isClosing 
          ? { opacity: 0, scale: 0.95, y: 0 } 
          : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{
          duration: isClosing ? 0.4 : 0.8,
          delay: isClosing ? 0 : 0.3,
          ease: 'easeInOut',
        }}
        onAnimationComplete={() => {
          if (isClosing) {
            setShouldClose(true);
          }
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
          {mins > 0 && (
            <div className="flex flex-col p-2 rounded-box text-neutral-content">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': mins } as React.CSSProperties} />
              </span>
              mins
            </div>
          )}
            <div className="flex flex-col p-2 rounded-box text-neutral-content">
              <span className="countdown font-mono text-5xl">
              <span style={{ '--value': secs } as React.CSSProperties} />
              </span>
              secs
            </div>
        </div>
        <div className="text-3xl md:text-7xl font-bold text-white text-center">
          {copy.title}
        </div>
        <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4">
          {copy.subtitle}
        </div>
        <div className="flex gap-4">
        <button
          type="button"
            className="bg-white rounded-full w-fit text-black px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={handleSkipBreak}
            disabled={isClosing}
        >
          Skip this break
        </button>
        <button
          type="button"
            className="bg-white rounded-full w-fit text-black px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={handleSnooze}
            disabled={isClosing}
        >
          Snooze for 5 minutes
        </button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

export default Break;
