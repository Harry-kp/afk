import { useState } from 'react';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { useSetting } from './hooks/useSetting';
import { SESSION_DURATION_OPTIONS, formatDuration, isCustomValue } from './constants';

export function FocusSettings() {
  const [sessionDuration, setSessionDuration, isLoading] = useSetting<number>('session_duration', 1500);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col">
            <span>Focus Duration</span>
          </Label>
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes, 10);
    if (mins >= 1 && mins <= 120) {
      setSessionDuration(mins * 60);
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  // Check if current value is custom (not in preset list)
  const hasCustomValue = isCustomValue(sessionDuration, SESSION_DURATION_OPTIONS);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="focus_duration" className="flex flex-col">
          <span>Focus Duration</span>
        </Label>
        {showCustomInput ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="120"
              placeholder="mins"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
              className="w-20 h-10 px-3 rounded-md border border-input bg-background text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
            >
              Set
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="h-10 px-3 rounded-md bg-muted text-muted-foreground text-sm hover:bg-muted/80"
            >
              ✕
            </button>
          </div>
        ) : (
          <Select
            value={String(sessionDuration)}
            onValueChange={(val) => {
              if (val === 'custom') {
                setShowCustomInput(true);
              } else {
                setSessionDuration(Number(val));
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration">
                {formatDuration(sessionDuration)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SESSION_DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
                {hasCustomValue && (
                  <SelectItem key={sessionDuration} value={String(sessionDuration)}>
                    {formatDuration(sessionDuration)} (custom)
                  </SelectItem>
                )}
                <SelectItem key="custom" value="custom" className="text-muted-foreground">
                  Custom...
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
