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
import { PRE_BREAK_REMINDER_OPTIONS, formatDuration } from './constants';

export function PreBreakSettings() {
  const [preBreakReminderEnabled, setPreBreakReminderEnabled, isLoading1] = useSetting<boolean>('pre_break_reminder_enabled', true);
  const [preBreakReminderAt, setPreBreakReminderAt, isLoading2] = useSetting<number>('pre_break_reminder_at', 60);

  const isLoading = isLoading1 || isLoading2;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Break notifications</span>
            <span className="font-normal leading-snug text-muted-foreground text-xs">
              System notification before break
            </span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              Notify me before
            </span>
          </Label>
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label
          htmlFor="pre_break_reminder_enabled"
          className="flex flex-col space-y-1"
        >
          <span>Break notifications</span>
          <span className="font-normal leading-snug text-muted-foreground text-xs">
            System notification before break
          </span>
        </Label>
        <Switch
          id="pre_break_reminder_enabled"
          key="pre_break_reminder_enabled"
          checked={preBreakReminderEnabled}
          onCheckedChange={(checked) => {
            setPreBreakReminderEnabled(checked);
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label
          htmlFor="pre_break_reminder_at"
          className="flex flex-col space-y-1"
        >
          <span className="font-normal leading-snug text-muted-foreground">
            Notify me before
          </span>
        </Label>
        <Select
          key="pre_break_reminder_at"
          value={String(preBreakReminderAt)}
          onValueChange={(val) => {
            setPreBreakReminderAt(Number(val));
          }}
          disabled={!preBreakReminderEnabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration">
              {formatDuration(preBreakReminderAt)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRE_BREAK_REMINDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
