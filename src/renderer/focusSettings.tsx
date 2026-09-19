import { Label } from './components/ui/label';
import { DurationSetting } from './components/DurationSetting';
import { SESSION_DURATION_OPTIONS } from './constants';

export function FocusSettings() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="session_duration" className="flex flex-col">
          <span>Focus Duration</span>
        </Label>
        <DurationSetting
          settingKey="session_duration"
          defaultValue={1500}
          options={SESSION_DURATION_OPTIONS}
          unit="min"
          min={1}
          max={120}
        />
      </div>
    </div>
  );
}
