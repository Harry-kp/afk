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
import { Switch } from './components/ui/switch';
import { useSetting } from './hooks/useSetting';
import { LONG_BREAK_OPTIONS, LONG_BREAK_AFTER_OPTIONS, formatDuration, isCustomValue } from './constants';

export function LongBreakSettings() {
  const [longBreakEnabled, setLongBreakEnabled, isLoading1] = useSetting<boolean>('long_break_enabled', true);
  const [longBreakDuration, setLongBreakDuration, isLoading2] = useSetting<number>('long_break_duration', 120);
  const [longBreakAfter, setLongBreakAfter, isLoading3] = useSetting<number>('long_break_after', 2);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const isLoading = isLoading1 || isLoading2 || isLoading3;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Long Breaks</span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes, 10);
    if (mins >= 1 && mins <= 30) {
      setLongBreakDuration(mins * 60);
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  const hasCustomDuration = isCustomValue(longBreakDuration, LONG_BREAK_OPTIONS);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="long_break_enabled" className="flex flex-col space-y-1">
          <span>Long Breaks</span>
        </Label>
        <Switch
          id="long_break_enabled"
          key="long_break_enabled"
          checked={longBreakEnabled}
          onCheckedChange={(checked) => {
            setLongBreakEnabled(checked);
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="long_break_duration"
            className="flex flex-col space-y-1"
          >
            <span className="font-normal leading-snug text-muted-foreground">
              Duration
            </span>
          </Label>
          {showCustomInput ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                placeholder="mins"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                className="w-16 h-10 px-3 rounded-md border border-input bg-background text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCustomSubmit}
                className="h-10 px-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="h-10 px-2 rounded-md bg-muted text-muted-foreground text-sm hover:bg-muted/80"
              >
                ✕
              </button>
            </div>
          ) : (
            <Select
              key="long_break_duration"
              value={String(longBreakDuration)}
              onValueChange={(val) => {
                if (val === 'custom') {
                  setShowCustomInput(true);
                } else {
                  setLongBreakDuration(Number(val));
                }
              }}
              disabled={!longBreakEnabled}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Duration">
                  {formatDuration(longBreakDuration)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LONG_BREAK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  {hasCustomDuration && (
                    <SelectItem key={longBreakDuration} value={String(longBreakDuration)}>
                      {formatDuration(longBreakDuration)} (custom)
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

        <div className="flex items-center gap-2">
          <Label htmlFor="long_break_after" className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              After sessions
            </span>
          </Label>
          <Select
            key="long_break_after"
            value={String(longBreakAfter)}
            onValueChange={(val) => {
              setLongBreakAfter(Number(val));
            }}
            disabled={!longBreakEnabled}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {LONG_BREAK_AFTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
