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

// Short break quotes - gentle, quick reminders including health tips
export const COPIES: Copy[] = [
  // Motivational
  { title: 'Refresh Your Vision', subtitle: 'Take a moment to refocus and recharge.' },
  { title: 'Relax Your Gaze', subtitle: 'Let your eyes take a short vacation.' },
  { title: 'Pause and Reflect', subtitle: 'Rest your eyes, rejuvenate your mind.' },
  { title: 'Eyes on Break', subtitle: 'Time to give your eyes a breather.' },
  { title: 'Visual Timeout', subtitle: 'Relaxation for your eyes, clarity for your mind.' },
  { title: 'Blink Break', subtitle: 'Close your eyes, relax your mind.' },
  { title: 'Soothing Sight', subtitle: 'Ease the strain, enhance the view.' },
  { title: 'Vision Vacation', subtitle: 'See the world anew.' },
  { title: 'Gaze Break', subtitle: 'Rest, reset, and return refreshed.' },
  { title: 'Visual Respite', subtitle: 'Brief breaks for brighter views.' },
  { title: 'Focus Pause', subtitle: 'Step back, relax, regain focus.' },
  // Eye exercises
  { title: 'Look Away', subtitle: 'Focus on something 20 feet away for 20 seconds. Let your eye muscles relax.' },
  { title: 'Slow Blinks', subtitle: 'Close your eyes gently for 2 seconds, then open. Repeat a few times to refresh your tear film.' },
  { title: 'Eye Circles', subtitle: 'Roll your eyes slowly in a circle, clockwise then counter-clockwise. Keep your head still.' },
  { title: 'Focus Shift', subtitle: 'Look at your thumb up close, then something distant. Alternate a few times.' },
  // Neck and shoulders
  { title: 'Neck Tilt', subtitle: 'Slowly tilt your head to the right, hold for a moment. Return to center. Repeat on the left.' },
  { title: 'Shoulder Rolls', subtitle: 'Roll your shoulders forward a few times, then backward. Slow, controlled circles.' },
  { title: 'Shoulder Shrug', subtitle: 'Raise your shoulders up towards your ears. Hold briefly. Drop them completely.' },
  // Wrists
  { title: 'Wrist Circles', subtitle: 'Extend your arms, make fists, and rotate your wrists in circles both directions.' },
  { title: 'Finger Stretch', subtitle: 'Spread your fingers wide, hold. Make a fist, hold. Release the tension.' },
  // Breathing
  { title: 'Deep Breath', subtitle: 'Breathe in slowly through your nose. Hold briefly. Exhale slowly through your mouth.' },
  { title: 'Belly Breathing', subtitle: 'Place hand on belly. Breathe deeply so your belly rises. Exhale slowly.' },
  // Hydration
  { title: 'Hydration Check', subtitle: 'When did you last drink water? Your body and eyes need it.' },
  { title: 'Water Break', subtitle: 'Take a sip of water. Staying hydrated helps prevent dry eyes.' },
];

// Long break quotes - warm, grateful, mindful with health tips
export const LONG_BREAK_COPIES: Copy[] = [
  // Mindfulness
  { title: 'Well Rested', subtitle: 'You showed up. That matters.' },
  { title: 'Breathe Deep', subtitle: 'This moment is yours. No rush.' },
  { title: 'Gentle Pause', subtitle: 'Thank your eyes for all they do.' },
  { title: 'Be Still', subtitle: 'Progress isn\'t always visible. Trust it.' },
  { title: 'Quiet Moment', subtitle: 'Let the world wait a little longer.' },
  { title: 'Soft Landing', subtitle: 'You\'ve been focused. Now just be.' },
  { title: 'Present Moment', subtitle: 'Right here is exactly where you need to be.' },
  { title: 'Simply Be', subtitle: 'Nothing to fix. Nothing to prove.' },
  { title: 'Peaceful Pause', subtitle: 'Let your thoughts drift like clouds.' },
  // Stretches
  { title: 'Stand and Stretch', subtitle: 'Stand up. Reach both arms overhead and stretch upward. Hold for a moment.' },
  { title: 'Side Stretch', subtitle: 'Stand with feet hip-width. Raise one arm, lean to the opposite side. Hold, then switch.' },
  { title: 'Chest Opener', subtitle: 'Clasp hands behind your back. Straighten arms, lift chest, squeeze shoulder blades together.' },
  { title: 'Seated Twist', subtitle: 'Sit tall. Place one hand on the opposite knee, twist gently. Hold, then switch sides.' },
  // Eye care
  { title: 'Palm Your Eyes', subtitle: 'Rub your palms together to warm them. Gently cup them over your closed eyes. Breathe.' },
  { title: 'Distance Gaze', subtitle: 'Look out a window at the farthest point you can see. Let your eyes fully relax.' },
  // Breathing
  { title: 'Box Breathing', subtitle: 'Inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds. Repeat.' },
  { title: 'Calming Breath', subtitle: 'Close your eyes. Breathe in for 4, out for 6. Feel your body settle.' },
  // Movement
  { title: 'Walk Around', subtitle: 'Take a short walk. Even a few steps helps your circulation and clears your mind.' },
  { title: 'Body Scan', subtitle: 'Close your eyes. Mentally scan from head to toes. Notice any tension. Breathe into it.' },
  // Hydration
  { title: 'Refill Time', subtitle: 'Good moment to refill your water. Your body works better when hydrated.' },
];

