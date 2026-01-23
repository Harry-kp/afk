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

export function LongBreakSettings() {
  const [longBreakEnabled, setLongBreakEnabled, isLoading1] = useSetting<boolean>('long_break_enabled', true);
  const [longBreakDuration, setLongBreakDuration, isLoading2] = useSetting<number>('long_break_duration', 120);
  const [longBreakAfter, setLongBreakAfter, isLoading3] = useSetting<number>('long_break_after', 2);

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
          <Select
            key="long_break_duration"
            value={String(longBreakDuration)}
            onValueChange={(val) => {
              setLongBreakDuration(Number(val));
            }}
            disabled={!longBreakEnabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem key={60} value="60">
                  1 min
                </SelectItem>
                <SelectItem key={120} value="120">
                  2 min
                </SelectItem>
                <SelectItem key={300} value="300">
                  5 min
                </SelectItem>
                <SelectItem key={600} value="600">
                  10 min
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="long_break_after" className="flex flex-col space-y-1">
            <span className="font-normal leading-snug text-muted-foreground">
              Repeat after number of short breaks
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem key={2} value="2">
                  2
                </SelectItem>
                <SelectItem key={3} value="3">
                  3
                </SelectItem>
                <SelectItem key={4} value="4">
                  4
                </SelectItem>
                <SelectItem key={5} value="5">
                  5
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
