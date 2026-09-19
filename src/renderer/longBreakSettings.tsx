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
import { DurationSetting } from './components/DurationSetting';
import { useSetting } from './hooks/useSetting';
import { LONG_BREAK_OPTIONS, LONG_BREAK_AFTER_OPTIONS } from './constants';

export function LongBreakSettings() {
  const [longBreakEnabled, setLongBreakEnabled, isLoading1] = useSetting<boolean>('long_break_enabled', true);
  const [longBreakAfter, setLongBreakAfter, isLoading2] = useSetting<number>('long_break_after', 2);

  const isLoading = isLoading1 || isLoading2;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="long_break_enabled" className="flex flex-col space-y-1">
          <span>Long Breaks</span>
        </Label>
        {isLoading ? (
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        ) : (
          <Switch
            id="long_break_enabled"
            checked={longBreakEnabled}
            onCheckedChange={setLongBreakEnabled}
          />
        )}
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="long_break_duration" className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              Duration
            </span>
          </Label>
          <DurationSetting
            settingKey="long_break_duration"
            defaultValue={120}
            options={LONG_BREAK_OPTIONS}
            unit="min"
            min={1}
            max={30}
            className="w-[140px]"
            disabled={!longBreakEnabled}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="long_break_after" className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              After sessions
            </span>
          </Label>
          {isLoading ? (
            <div className="w-[140px] h-10 bg-muted animate-pulse rounded-md" />
          ) : (
            <Select
              value={String(longBreakAfter)}
              onValueChange={(val) => setLongBreakAfter(Number(val))}
              disabled={!longBreakEnabled}
            >
              <SelectTrigger className="w-[140px]" id="long_break_after">
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
          )}
        </div>
      </div>
    </div>
  );
}
