import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { listen } from '@tauri-apps/api/event';
import confetti from 'canvas-confetti';
import { track } from './lib/analytics';
import { AuroraBackground } from './components/ui/aurora-background';
import { COPIES, LONG_BREAK_COPIES } from './constants';

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

// Start fading out when this many seconds are left
const FADE_START_SECONDS = 3;

function Break({ isLongBreak, initialDuration }: { isLongBreak: boolean; initialDuration: number }) {
  // Initialize with the duration from URL - no loading state needed
  const [seconds, setSeconds] = useState<number>(initialDuration);
  const [isClosing, setIsClosing] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Select quote based on break type (memoized to stay consistent during break)
  const copy = useMemo(() => {
    const quotes = isLongBreak ? LONG_BREAK_COPIES : COPIES;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [isLongBreak]);

  // Listen for backend break-tick events (single source of truth)
  useEffect(() => {
    const unlistenTick = listen<number>('break-tick', (event) => {
      setSeconds(event.payload);
    });

    const unlistenEnd = listen('break-end', () => {
      // Backend signals break is ending - start fade out
      setIsFading(true);
    });

    return () => {
      unlistenTick.then((fn) => fn());
      unlistenEnd.then((fn) => fn());
    };
  }, []);

  // Start fading when approaching end
  useEffect(() => {
    if (seconds <= FADE_START_SECONDS && seconds > 0 && !isFading) {
      setIsFading(true);
    }
  }, [seconds, isFading]);

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
    setIsFading(true);
    
    track('break_skipped');
    // Backend will close all windows
    await window.electron.session.skipBreak();
  };

  const handleSnooze = async () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsFading(true);
    
    track('break_snoozed');
    // Backend will close all windows
    await window.electron.session.snooze();
  };

  const { mins, secs } = getTime(seconds);

  // Calculate opacity based on fading state
  const getAnimateState = () => {
    if (isClosing) {
      // User skipped/snoozed - quick fade out
      return { opacity: 0, scale: 0.95, y: 0 };
    }
    if (isFading) {
      // Last few seconds - gradual fade out
      return { opacity: 0, scale: 0.98, y: -10 };
    }
    // Normal state
    return { opacity: 1, y: 0, scale: 1 };
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 1 }}
        animate={getAnimateState()}
        transition={{
          // Fading takes the full FADE_START_SECONDS, closing is quicker
          duration: isClosing ? 0.5 : isFading ? FADE_START_SECONDS : 0.8,
          delay: (isClosing || isFading) ? 0 : 0.3,
          ease: 'easeOut',
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
