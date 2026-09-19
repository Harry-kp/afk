import { Label } from './components/ui/label';
import { DurationSetting } from './components/DurationSetting';
import { SHORT_BREAK_OPTIONS } from './constants';

export function ShortBreakSettings() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="break_duration" className="flex flex-col space-y-1">
          <span>Short Break Duration</span>
        </Label>
        <DurationSetting
          settingKey="break_duration"
          defaultValue={30}
          options={SHORT_BREAK_OPTIONS}
          unit="sec"
          min={5}
          max={300}
        />
      </div>
    </div>
  );
}
