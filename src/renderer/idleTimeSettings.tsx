import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { useSetting } from './hooks/useSetting';

export function IdleTimeSettings() {
  const [resetTimerEnabled, setResetTimerEnabled, isLoading] = useSetting<boolean>('reset_timer_enabled', true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between space-x-2">
        <Label className="flex flex-col space-y-1">
          <span>Reset timer after 5 min of inactivity</span>
        </Label>
        <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="reset_timer_enabled" className="flex flex-col space-y-1">
        <span>Reset timer after 5 min of inactivity</span>
      </Label>
      <Switch
        id="reset_timer_enabled"
        key="reset_timer_enabled"
        checked={resetTimerEnabled}
        onCheckedChange={(checked) => {
          setResetTimerEnabled(checked);
        }}
      />
    </div>
  );
}
