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

export function FocusSettings() {
  const [sessionDuration, setSessionDuration, isLoading] = useSetting<number>('session_duration', 1500);

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

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="necessary" className="flex flex-col">
          <span>Focus Duration</span>
        </Label>
        <Select
          value={String(sessionDuration)}
          onValueChange={(val) => {
            setSessionDuration(Number(val));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={900} value="900">
                15 mins
              </SelectItem>
              <SelectItem key={1200} value="1200">
                20 mins
              </SelectItem>
              <SelectItem key={1500} value="1500">
                25 mins
              </SelectItem>
              <SelectItem key={1800} value="1800">
                30 mins
              </SelectItem>
              <SelectItem key={2100} value="2100">
                35 mins
              </SelectItem>
              <SelectItem key={2400} value="2400">
                40 mins
              </SelectItem>
              <SelectItem key={2700} value="2700">
                45 mins
              </SelectItem>
              <SelectItem key={3000} value="3000">
                50 mins
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
