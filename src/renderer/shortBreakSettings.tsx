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

export function ShortBreakSettings() {
  const [breakDuration, setBreakDuration, isLoading] = useSetting<number>('break_duration', 30);

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

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="necessary" className="flex flex-col space-y-1">
          <span>Short Break Duration</span>
        </Label>
        <Select
          value={String(breakDuration)}
          onValueChange={(val) => {
            setBreakDuration(Number(val));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={20} value="20">
                20 secs
              </SelectItem>
              <SelectItem key={25} value="25">
                25 secs
              </SelectItem>
              <SelectItem key={30} value="30">
                30 secs
              </SelectItem>
              <SelectItem key={35} value="35">
                35 secs
              </SelectItem>
              <SelectItem key={45} value="45">
                45 secs
              </SelectItem>
              <SelectItem key={50} value="50">
                50 secs
              </SelectItem>
              <SelectItem key={55} value="55">
                55 secs
              </SelectItem>
              <SelectItem key={60} value="60">
                1 min
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
