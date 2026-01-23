import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { useSetting } from './hooks/useSetting';

export function StartupSettings() {
  const [launchAtLogin, setLaunchAtLogin, isLoading1] = useSetting<boolean>('launch_at_login', true);
  const [startTimer, setStartTimer, isLoading2] = useSetting<boolean>('start_timer', false);

  const isLoading = isLoading1 || isLoading2;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Launch at login</span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Start timer automatically on launch</span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="launch_at_login" className="flex flex-col space-y-1">
          <span>Launch at login</span>
        </Label>
        <Switch
          id="launch_at_login"
          key="launch_at_login"
          checked={launchAtLogin}
          onCheckedChange={(checked) => {
            setLaunchAtLogin(checked);
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="start_timer" className="flex flex-col space-y-1">
          <span>Start timer automatically on launch</span>
        </Label>
        <Switch
          id="start_timer"
          key="start_timer"
          checked={startTimer}
          onCheckedChange={(checked) => {
            setStartTimer(checked);
          }}
        />
      </div>
    </div>
  );
}
