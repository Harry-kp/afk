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

export function PreBreakSettings() {
  const [preBreakReminderEnabled, setPreBreakReminderEnabled, isLoading1] = useSetting<boolean>('pre_break_reminder_enabled', true);
  const [preBreakReminderAt, setPreBreakReminderAt, isLoading2] = useSetting<number>('pre_break_reminder_at', 60);

  const isLoading = isLoading1 || isLoading2;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Pre Break reminders</span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              Show reminder before
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
          <span>Pre Break reminders</span>
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
            Show reminder before
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
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={30} value="30">
                30 secs
              </SelectItem>
              <SelectItem key={60} value="60">
                1 min
              </SelectItem>
              <SelectItem key={120} value="120">
                2 min
              </SelectItem>
              <SelectItem key={300} value="300">
                5 min
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
