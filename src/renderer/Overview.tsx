import { useEffect, useState, useCallback } from 'react';
import {
  Play,
  Settings,
  EyeOff,
  CirclePause,
  ChevronsRight,
  CircleStop,
} from 'lucide-react';
import { track } from './lib/analytics';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { useToast } from './components/ui/use-toast';
import { Toaster } from './components/ui/toaster';

export function getReadableTime(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  let result = '';

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    result += `${formattedHours}h`;
  }

  if (minutes > 0) {
    result += `${formattedMinutes}m`;
  }

  if (seconds > 0) {
    result += `${formattedSeconds}s`;
  }

  return result || '00s';
}

interface SessionState {
  is_active: boolean;
  is_paused: boolean;
  end_time: string | null;
  remaining_secs: number;
  short_break_count: number;
}

function Overview({
  setShowSettings,
}: {
  setShowSettings: (arg0: boolean) => void;
}) {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [displayTime, setDisplayTime] = useState<string>('');
  const [breakDuration, setBreakDuration] = useState(30);
  const [sessionDuration, setSessionDuration] = useState(1500);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const isActive = sessionState?.is_active ?? false;
  const isPaused = sessionState?.is_paused ?? false;
  const hasSession = isActive || isPaused;

  // Fetch session state from backend
  const fetchSessionState = useCallback(async () => {
    const state = await window.electron.session.getState();
    if (state) {
      setSessionState(state);
      if (state.remaining_secs > 0) {
        setDisplayTime(getReadableTime(state.remaining_secs));
      }
    }
  }, []);

  // Initialize state from store (must use async to get actual values from backend)
  useEffect(() => {
    const initState = async () => {
      // Get settings from backend (not cache!)
      const storedSessionDuration = await window.electron.store.getAsync<number>('session_duration');
      const storedBreakDuration = await window.electron.store.getAsync<number>('break_duration');
      
      if (storedSessionDuration) setSessionDuration(storedSessionDuration);
      if (storedBreakDuration) setBreakDuration(storedBreakDuration);
      
      // Fetch initial session state
      await fetchSessionState();
    };
    initState();
  }, [fetchSessionState]);

  // Poll session state every second
  useEffect(() => {
    const interval = setInterval(fetchSessionState, 1000);
    return () => clearInterval(interval);
  }, [fetchSessionState]);

  // Action handlers with loading state
  const handleStartSession = async () => {
    setIsLoading(true);
    track('start-session');
    await window.electron.session.start();
    await fetchSessionState();
    setIsLoading(false);
  };

  const handlePauseSession = async () => {
    setIsLoading(true);
    track('pause-session');
    await window.electron.session.pause();
    await fetchSessionState();
    setIsLoading(false);
  };

  const handleResumeSession = async () => {
    setIsLoading(true);
    track('resume_session');
    await window.electron.session.resume();
    await fetchSessionState();
    setIsLoading(false);
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    track('end-session');
    await window.electron.session.end();
    await fetchSessionState();
    setIsLoading(false);
  };

  const handleSkipBreak = async () => {
    setIsLoading(true);
    track('skip-break');
    toast({
      title: 'Upcoming break will be skipped',
      description: 'You have got more time for your focused work',
    });
    await window.electron.session.skipBreak();
    await fetchSessionState();
    setIsLoading(false);
  };

  const handleTakeBreakNow = async () => {
    setIsLoading(true);
    track('take-break-now');
    await window.electron.session.takeBreakNow();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[100vh] items-center justify-around text-white">
      <Toaster />
      <div className="text-base font-medium text-neutral-200 pb-16">
        👀 Take a Break
      </div>
      <div className="text-center">
        {!hasSession ? (
          <>
            <div className="text-2xl font-bold text-white text-center">
              Wave goodbye to eye strain! 👋🏻
            </div>
            <div className="font-xl text-center text-neutral-200 py-4 mb-8">
              <span className="underline decoration-yellow underline-offset-4">
                Subtle reminders
              </span>{' '}
              for mindful breaks from screens&nbsp;
              <span className="underline decoration-yellow underline-offset-4">
                without disturbing focus
              </span>
              <br />
              Customize breaks for a journey to&nbsp;
              <span className="underline decoration-yellow underline-offset-4">
                better eye health
              </span>
            </div>
          </>
        ) : undefined}
        {hasSession ? (
          <>
            <div className="text-center text-sm font-normal text-neutral-200 py-4 mb-8">
              Take a break in action, your eyes will thank you!&nbsp;
            </div>
            {isActive && (
              <div className="text-3xl font-normal text-white text-center">
                Next break begins in&nbsp;
                <span className="font-mono underline underline-offset-4 decoration-yellow">
                  {displayTime}
                </span>
              </div>
            )}
            {isPaused && (
              <div className="text-2xl font-bold text-white text-center">
                Session paused
              </div>
            )}
            <div className="mt-8 text-base font-medium">
              {isPaused && (
                <Button
                  variant="link"
                  onClick={handleResumeSession}
                  disabled={isLoading}
                >
                  <Play width={20} height={20} />
                  &nbsp;Resume Session
                </Button>
              )}
              {isActive && (
                <Button
                  variant="link"
                  onClick={handleTakeBreakNow}
                  disabled={isLoading}
                >
                  <EyeOff width={20} height={20} />
                  &nbsp;Start this break now
                </Button>
              )}
              {isActive && (
                <Button
                  variant="link"
                  onClick={handlePauseSession}
                  disabled={isLoading}
                >
                  <CirclePause width={20} height={20} />
                  &nbsp;Pause Session
                </Button>
              )}
              <Button
                variant="link"
                onClick={handleEndSession}
                disabled={isLoading}
              >
                <CircleStop width={20} height={20} />
                &nbsp;End session
              </Button>
              {isActive && (
                <Button
                  variant="link"
                  onClick={handleSkipBreak}
                  disabled={isLoading}
                >
                  <ChevronsRight width={20} height={20} />
                  &nbsp;Skip this break
                </Button>
              )}
            </div>
          </>
        ) : undefined}
        {!hasSession && (
          <button
            type="button"
            onClick={handleStartSession}
            disabled={isLoading}
            style={{ borderRadius: 8 }}
            className="w-[190px] relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50"
          >
            <span
              style={{ borderRadius: 8 }}
              className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#EBD18F_0%,#B9841D_50%,#EBD18F_100%)]"
            />
            <span
              style={{ borderRadius: 8 }}
              className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-zinc-900 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
            >
              <Play width={20} height={20} />
              &nbsp;Start Session
            </span>
          </button>
        )}
      </div>
      <div className="font-xl text-center text-neutral-200 py-4 flex items-baseline mt-20">
        After every&nbsp;
        &nbsp;
        <Select
          value={String(sessionDuration)}
          onValueChange={(val: string) => {
            track('session-duration-changed');
            const numVal = Number(val);
            setSessionDuration(numVal);
            window.electron.store.set('session_duration', numVal);
          }}
        >
          <SelectTrigger className="w-[70px] px-0">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={900} value="900">
                1 mins
              </SelectItem>
              <SelectItem key={1200} value="1200">
                20 mins
              </SelectItem>
              <SelectItem key={1500} value="1500">
                25 mins
              </SelectItem>
              <SelectItem key={1800} value="1800">
                30 mins
              </SelectItem>
              <SelectItem key={2100} value="2100">
                35 mins
              </SelectItem>
              <SelectItem key={2400} value="2400">
                40 mins
              </SelectItem>
              <SelectItem key={2700} value="2700">
                45 mins
              </SelectItem>
              <SelectItem key={3000} value="3000">
                50 mins
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        &nbsp;remind me to take breaks of&nbsp;
        &nbsp;
        <Select
          value={String(breakDuration)}
          onValueChange={(val: string) => {
            track('break-duration-changed');
            const numVal = Number(val);
            setBreakDuration(numVal);
            window.electron.store.set('break_duration', numVal);
          }}
        >
          <SelectTrigger className="w-[70px] px-0">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={20} value="20">
                20 secs
              </SelectItem>
              <SelectItem key={25} value="25">
                25 secs
              </SelectItem>
              <SelectItem key={30} value="30">
                30 secs
              </SelectItem>
              <SelectItem key={35} value="35">
                35 secs
              </SelectItem>
              <SelectItem key={45} value="45">
                45 secs
              </SelectItem>
              <SelectItem key={50} value="50">
                50 secs
              </SelectItem>
              <SelectItem key={55} value="55">
                55 secs
              </SelectItem>
              <SelectItem key={60} value="60">
                1 min
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="link"
          className="pl-0 ml-2"
          onClick={() => {
            track('show-settings-clicked');
            setShowSettings(true);
          }}
        >
          Settings&nbsp; <Settings width={20} height={20} />
        </Button>
      </div>
    </div>
  );
}

export default Overview;
