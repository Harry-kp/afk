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
import { SHORT_BREAK_OPTIONS, formatDuration, isCustomValue } from './constants';

export function ShortBreakSettings() {
  const [breakDuration, setBreakDuration, isLoading] = useSetting<number>('break_duration', 30);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSeconds, setCustomSeconds] = useState('');

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Short Break Duration</span>
          </Label>
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  const handleCustomSubmit = () => {
    const secs = parseInt(customSeconds, 10);
    if (secs >= 5 && secs <= 300) {
      setBreakDuration(secs);
      setShowCustomInput(false);
      setCustomSeconds('');
    }
  };

  const hasCustomValue = isCustomValue(breakDuration, SHORT_BREAK_OPTIONS);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="break_duration" className="flex flex-col space-y-1">
          <span>Short Break Duration</span>
        </Label>
        {showCustomInput ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              max="300"
              placeholder="secs"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
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
            value={String(breakDuration)}
            onValueChange={(val) => {
              if (val === 'custom') {
                setShowCustomInput(true);
              } else {
                setBreakDuration(Number(val));
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration">
                {formatDuration(breakDuration)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SHORT_BREAK_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
                {hasCustomValue && (
                  <SelectItem key={breakDuration} value={String(breakDuration)}>
                    {formatDuration(breakDuration)} (custom)
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
