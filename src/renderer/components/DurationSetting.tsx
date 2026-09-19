import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useSetting } from '../hooks/useSetting';
import { formatDuration, isCustomValue, type TimingOption } from '../constants';
import { cn } from '../lib/utils';

interface DurationSettingProps {
  settingKey: string;
  defaultValue: number;
  options: TimingOption[];
  /** Unit of the custom input - values are always stored as seconds */
  unit: 'min' | 'sec';
  /** Custom input bounds, in `unit` */
  min: number;
  max: number;
  className?: string;
  disabled?: boolean;
}

/** Duration picker backed by a setting, with a "Custom..." escape hatch. */
export function DurationSetting({
  settingKey,
  defaultValue,
  options,
  unit,
  min,
  max,
  className = 'w-[180px]',
  disabled = false,
}: DurationSettingProps) {
  const [value, setValue, isLoading] = useSetting<number>(settingKey, defaultValue);
  const [custom, setCustom] = useState<string | null>(null);

  if (isLoading) {
    return <div className={cn(className, 'h-10 bg-muted animate-pulse rounded-md')} />;
  }

  if (custom !== null) {
    const submit = () => {
      const n = parseInt(custom, 10);
      if (n >= min && n <= max) {
        setValue(unit === 'min' ? n * 60 : n);
        setCustom(null);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          placeholder={unit === 'min' ? 'mins' : 'secs'}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="w-20 h-10 px-3 rounded-md border border-input bg-background text-sm"
          autoFocus
        />
        <button
          type="button"
          onClick={submit}
          className="h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
        >
          Set
        </button>
        <button
          type="button"
          onClick={() => setCustom(null)}
          className="h-10 px-3 rounded-md bg-muted text-muted-foreground text-sm hover:bg-muted/80"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <Select
      value={String(value)}
      onValueChange={(val) => (val === 'custom' ? setCustom('') : setValue(Number(val)))}
      disabled={disabled}
    >
      <SelectTrigger className={className} id={settingKey}>
        <SelectValue placeholder="Duration">{formatDuration(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
          {isCustomValue(value, options) && (
            <SelectItem key={value} value={String(value)}>
              {formatDuration(value)} (custom)
            </SelectItem>
          )}
          <SelectItem key="custom" value="custom" className="text-muted-foreground">
            Custom...
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
