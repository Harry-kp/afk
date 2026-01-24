export interface Copy {
  title: string;
  subtitle: string;
}

// ============================================
// TIMING OPTIONS (Single Source of Truth)
// ============================================

export interface TimingOption {
  value: number;  // in seconds
  label: string;
}

// Focus/Session Duration Options (in seconds)
export const SESSION_DURATION_OPTIONS: TimingOption[] = [
  { value: 300, label: '5 min' },      // Quick task
  { value: 600, label: '10 min' },     // Short focus
  { value: 900, label: '15 min' },     // Light work
  { value: 1200, label: '20 min' },    // Standard short
  { value: 1500, label: '25 min' },    // Pomodoro classic
  { value: 1800, label: '30 min' },    // Half hour
  { value: 2700, label: '45 min' },    // Deep work
  { value: 3600, label: '60 min' },    // Full hour
];

// Short Break Duration Options (in seconds)
export const SHORT_BREAK_OPTIONS: TimingOption[] = [
  { value: 15, label: '15 sec' },
  { value: 20, label: '20 sec' },
  { value: 30, label: '30 sec' },
  { value: 45, label: '45 sec' },
  { value: 60, label: '1 min' },
  { value: 90, label: '1.5 min' },
  { value: 120, label: '2 min' },
];

// Long Break Duration Options (in seconds)
export const LONG_BREAK_OPTIONS: TimingOption[] = [
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
  { value: 900, label: '15 min' },
];

// Sessions before Long Break
export const LONG_BREAK_AFTER_OPTIONS: TimingOption[] = [
  { value: 2, label: '2 sessions' },
  { value: 3, label: '3 sessions' },
  { value: 4, label: '4 sessions' },
  { value: 5, label: '5 sessions' },
  { value: 6, label: '6 sessions' },
];

// Pre-break Reminder Options (in seconds)
export const PRE_BREAK_REMINDER_OPTIONS: TimingOption[] = [
  { value: 15, label: '15 sec' },
  { value: 30, label: '30 sec' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 300, label: '5 min' },
];

// Helper to format seconds to readable string
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return mins === 1 ? '1 min' : `${mins} min`;
  }
  return `${mins}m ${secs}s`;
}

// Helper to check if value is in options list
export function isCustomValue(value: number, options: TimingOption[]): boolean {
  return !options.some(opt => opt.value === value);
}

// Short break quotes - gentle, quick reminders
export const COPIES: Copy[] = [
  {
    title: 'Refresh Your Vision',
    subtitle: 'Take a moment to refocus and recharge.',
  },
  {
    title: 'Relax Your Gaze',
    subtitle: 'Let your eyes take a short vacation.',
  },
  {
    title: 'Pause and Reflect',
    subtitle: 'Rest your eyes, rejuvenate your mind.',
  },
  { title: 'Eyes on Break', subtitle: 'Time to give your eyes a breather.' },
  { title: 'Lookout Lounge', subtitle: 'Lounge back, let your gaze wander.' },
  {
    title: 'Visual Timeout',
    subtitle: 'Relaxation for your eyes, clarity for your mind.',
  },
  {
    title: 'Look Away',
    subtitle: 'Briefly divert your gaze for renewed focus.',
  },
  { title: 'Blink Break', subtitle: 'Close your eyes, relax your mind.' },
  { title: 'Soothing Sight', subtitle: 'Ease the strain, enhance the view.' },
  { title: 'Optical Oasis', subtitle: 'Escape the screen, embrace the calm.' },
  { title: 'Vision Vacation', subtitle: 'See the world anew.' },
  { title: 'Gaze Break', subtitle: 'Rest, reset, and return refreshed.' },
  { title: 'Eyes Unwind', subtitle: 'Ease the tension, enhance the clarity.' },
  { title: 'Visual Respite', subtitle: 'Brief breaks for brighter views.' },
  { title: 'Sight Serenity', subtitle: 'A moment of calm for clearer vision.' },
  { title: 'Focus Pause', subtitle: 'Step back, relax, regain focus.' },
  { title: 'Eyes Ease', subtitle: 'Take a breather, ease the strain.' },
  { title: 'Gaze Grace', subtitle: 'Give your eyes the grace they deserve.' },
];

// Long break quotes - warm, grateful, mindful (not demanding attention)
export const LONG_BREAK_COPIES: Copy[] = [
  { title: 'Well Rested', subtitle: 'You showed up. That matters.' },
  { title: 'Breathe Deep', subtitle: 'This moment is yours. No rush.' },
  { title: 'Gentle Pause', subtitle: 'Thank your eyes for all they do.' },
  { title: 'Be Still', subtitle: 'Progress isn\'t always visible. Trust it.' },
  { title: 'Quiet Moment', subtitle: 'Let the world wait a little longer.' },
  { title: 'Soft Landing', subtitle: 'You\'ve been focused. Now just be.' },
  { title: 'Kindness Break', subtitle: 'Be gentle with yourself today.' },
  { title: 'Present Moment', subtitle: 'Right here is exactly where you need to be.' },
  { title: 'Rest Well', subtitle: 'Your effort is enough. Always.' },
  { title: 'Simply Be', subtitle: 'Nothing to fix. Nothing to prove.' },
  { title: 'Peaceful Pause', subtitle: 'Let your thoughts drift like clouds.' },
  { title: 'Grateful Rest', subtitle: 'Small breaks, big difference.' },
];

