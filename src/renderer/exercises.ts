/**
 * Exercise suggestions for break screens
 * Short exercises for quick breaks, longer exercises for long breaks
 */

export interface Exercise {
  id: string;
  title: string;
  instruction: string;
  duration: number;  // Suggested duration in seconds
  category: 'eyes' | 'neck' | 'shoulders' | 'wrists' | 'breathing' | 'stretch' | 'mindfulness';
  icon: string;  // Emoji
  forLongBreak?: boolean;  // If true, only show during long breaks
}

// ============================================================================
// Eye Exercises (Primary - 20-20-20 rule)
// ============================================================================

const eyeExercises: Exercise[] = [
  {
    id: 'look-away',
    title: 'Look Away',
    instruction: 'Focus on something at least 20 feet (6 meters) away for 20 seconds. Let your eye muscles relax.',
    duration: 20,
    category: 'eyes',
    icon: '👁️',
  },
  {
    id: 'blink-slowly',
    title: 'Slow Blinks',
    instruction: 'Close your eyes gently for 2 seconds, then open. Repeat 5 times. This refreshes your tear film.',
    duration: 15,
    category: 'eyes',
    icon: '😌',
  },
  {
    id: 'eye-circles',
    title: 'Eye Circles',
    instruction: 'Roll your eyes slowly in a circle — clockwise, then counter-clockwise. Keep your head still.',
    duration: 20,
    category: 'eyes',
    icon: '🔄',
  },
  {
    id: 'palming',
    title: 'Palm Your Eyes',
    instruction: 'Rub your palms together to warm them, then gently cup them over your closed eyes. Breathe deeply.',
    duration: 30,
    category: 'eyes',
    icon: '🙌',
    forLongBreak: true,
  },
  {
    id: 'focus-shift',
    title: 'Focus Shift',
    instruction: 'Hold your thumb 6 inches from your face. Focus on it, then something distant. Alternate 5 times.',
    duration: 20,
    category: 'eyes',
    icon: '👍',
  },
];

// ============================================================================
// Neck & Shoulders (Common problem areas for desk workers)
// ============================================================================

const neckExercises: Exercise[] = [
  {
    id: 'neck-tilt',
    title: 'Neck Tilt',
    instruction: 'Slowly tilt your head to the right, hold for 10 seconds. Return to center. Repeat on the left.',
    duration: 25,
    category: 'neck',
    icon: '🙂',
  },
  {
    id: 'chin-tuck',
    title: 'Chin Tuck',
    instruction: 'Pull your chin straight back (like making a double chin). Hold for 5 seconds. Release. Repeat 3 times.',
    duration: 20,
    category: 'neck',
    icon: '😶',
  },
  {
    id: 'shoulder-rolls',
    title: 'Shoulder Rolls',
    instruction: 'Roll your shoulders forward 5 times, then backward 5 times. Slow, controlled circles.',
    duration: 20,
    category: 'shoulders',
    icon: '💪',
  },
  {
    id: 'shoulder-shrug',
    title: 'Shoulder Shrug',
    instruction: 'Raise your shoulders up towards your ears. Hold for 5 seconds. Drop them completely. Repeat 3 times.',
    duration: 20,
    category: 'shoulders',
    icon: '🤷',
  },
];

// ============================================================================
// Wrist & Hand Exercises (For typing strain)
// ============================================================================

const wristExercises: Exercise[] = [
  {
    id: 'wrist-circles',
    title: 'Wrist Circles',
    instruction: 'Extend your arms, make fists, and rotate your wrists in circles. 10 times each direction.',
    duration: 20,
    category: 'wrists',
    icon: '✊',
  },
  {
    id: 'finger-stretch',
    title: 'Finger Stretch',
    instruction: 'Spread your fingers wide, hold for 5 seconds. Make a fist, hold for 5 seconds. Repeat 3 times.',
    duration: 20,
    category: 'wrists',
    icon: '🖐️',
  },
  {
    id: 'prayer-stretch',
    title: 'Prayer Stretch',
    instruction: 'Press palms together in front of chest, fingers pointing up. Lower hands while keeping palms together until you feel a stretch.',
    duration: 25,
    category: 'wrists',
    icon: '🙏',
    forLongBreak: true,
  },
];

// ============================================================================
// Breathing Exercises (Stress relief)
// ============================================================================

const breathingExercises: Exercise[] = [
  {
    id: 'deep-breath',
    title: 'Deep Breath',
    instruction: 'Breathe in slowly through your nose for 4 counts. Hold for 4 counts. Exhale through mouth for 6 counts.',
    duration: 30,
    category: 'breathing',
    icon: '🌬️',
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    instruction: 'Inhale 4 seconds → Hold 4 seconds → Exhale 4 seconds → Hold 4 seconds. Repeat 3 times.',
    duration: 60,
    category: 'breathing',
    icon: '📦',
    forLongBreak: true,
  },
  {
    id: 'belly-breath',
    title: 'Belly Breathing',
    instruction: 'Place hand on belly. Breathe deeply so your belly rises. Exhale slowly. Feel your hand fall.',
    duration: 30,
    category: 'breathing',
    icon: '🫁',
  },
];

// ============================================================================
// Standing/Stretch Exercises (For long breaks)
// ============================================================================

const stretchExercises: Exercise[] = [
  {
    id: 'stand-stretch',
    title: 'Stand & Stretch',
    instruction: 'Stand up. Reach both arms overhead, interlace fingers, and stretch upward. Hold for 15 seconds.',
    duration: 20,
    category: 'stretch',
    icon: '🧘',
    forLongBreak: true,
  },
  {
    id: 'side-stretch',
    title: 'Side Stretch',
    instruction: 'Stand with feet hip-width. Raise right arm, lean left. Hold 15 seconds. Switch sides.',
    duration: 35,
    category: 'stretch',
    icon: '🌊',
    forLongBreak: true,
  },
  {
    id: 'chest-opener',
    title: 'Chest Opener',
    instruction: 'Clasp hands behind your back. Straighten arms, lift chest, squeeze shoulder blades together. Hold 15 seconds.',
    duration: 20,
    category: 'stretch',
    icon: '🦅',
    forLongBreak: true,
  },
  {
    id: 'spinal-twist',
    title: 'Seated Twist',
    instruction: 'Sit tall. Place right hand on left knee, twist gently to the left. Hold 15 seconds. Switch sides.',
    duration: 35,
    category: 'stretch',
    icon: '🔀',
    forLongBreak: true,
  },
];

// ============================================================================
// Mindfulness (Mental refresh)
// ============================================================================

const mindfulnessExercises: Exercise[] = [
  {
    id: 'body-scan',
    title: 'Quick Body Scan',
    instruction: 'Close your eyes. Mentally scan from head to toes. Notice any tension. Breathe into those areas.',
    duration: 45,
    category: 'mindfulness',
    icon: '🧠',
    forLongBreak: true,
  },
  {
    id: 'gratitude',
    title: 'Gratitude Moment',
    instruction: 'Think of three things you\'re grateful for right now. Let yourself smile.',
    duration: 20,
    category: 'mindfulness',
    icon: '💝',
  },
  {
    id: 'window-gaze',
    title: 'Window Gaze',
    instruction: 'Look out a window (or imagine one). Notice 3 things you see. Let your mind wander peacefully.',
    duration: 30,
    category: 'mindfulness',
    icon: '🪟',
  },
];

// ============================================================================
// Export & Helpers
// ============================================================================

export const allExercises: Exercise[] = [
  ...eyeExercises,
  ...neckExercises,
  ...wristExercises,
  ...breathingExercises,
  ...stretchExercises,
  ...mindfulnessExercises,
];

/**
 * Get a random exercise appropriate for the break type
 * @param isLongBreak - Whether this is a long break
 * @param excludeIds - Exercise IDs to exclude (to avoid repetition)
 */
export function getRandomExercise(isLongBreak: boolean, excludeIds: string[] = []): Exercise {
  let available = allExercises.filter(e => !excludeIds.includes(e.id));
  
  if (isLongBreak) {
    // Long breaks can have any exercise, but prefer longer ones
    // Shuffle and pick, with slight preference for forLongBreak exercises
    const longBreakExercises = available.filter(e => e.forLongBreak);
    const shortExercises = available.filter(e => !e.forLongBreak);
    
    // 70% chance to pick a long break exercise if available
    if (longBreakExercises.length > 0 && Math.random() < 0.7) {
      available = longBreakExercises;
    }
  } else {
    // Short breaks: only exercises that aren't marked as long-break-only
    available = available.filter(e => !e.forLongBreak);
  }
  
  // Fallback if filtering left nothing
  if (available.length === 0) {
    available = eyeExercises; // Always have eye exercises as fallback
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Get an eye exercise (always relevant for screen breaks)
 */
export function getEyeExercise(): Exercise {
  return eyeExercises[Math.floor(Math.random() * eyeExercises.length)];
}

/**
 * Get category display name
 */
export function getCategoryName(category: Exercise['category']): string {
  const names: Record<Exercise['category'], string> = {
    eyes: 'Eye Care',
    neck: 'Neck Relief',
    shoulders: 'Shoulder Relief',
    wrists: 'Wrist Care',
    breathing: 'Breathing',
    stretch: 'Stretch',
    mindfulness: 'Mindfulness',
  };
  return names[category];
}

