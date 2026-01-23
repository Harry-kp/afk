import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { Volume2, VolumeX } from 'lucide-react';
import { useSetting } from './hooks/useSetting';

export function ChimeSettings() {
  const [chimeEnabled, setChimeEnabled, isLoading1] = useSetting<boolean>('chime_enabled', false);
  const [onSessionStart, setOnSessionStart, isLoading2] = useSetting<boolean>('chime_on_session_start', true);
  const [onBreakStart, setOnBreakStart, isLoading3] = useSetting<boolean>('chime_on_break_start', true);
  const [onBreakEnd, setOnBreakEnd, isLoading4] = useSetting<boolean>('chime_on_break_end', true);
  const [onReminder, setOnReminder, isLoading5] = useSetting<boolean>('chime_on_reminder', false);

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label className="flex flex-col space-y-1">
            <span>Enable chime sounds</span>
          </Label>
          <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Master toggle */}
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="chime_enabled" className="flex flex-col space-y-1">
          <span className="flex items-center gap-2">
            {chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Enable chime sounds
          </span>
          <span className="font-normal leading-snug text-muted-foreground text-xs">
            Play audio cues for session events
          </span>
        </Label>
        <Switch
          id="chime_enabled"
          checked={chimeEnabled}
          onCheckedChange={setChimeEnabled}
        />
      </div>

      {/* Sub-options (only visible when master is ON) */}
      {chimeEnabled && (
        <div className="pl-4 border-l-2 border-muted grid gap-3">
          <p className="text-xs text-muted-foreground">Play chime when:</p>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="chime_on_session_start" className="text-sm font-normal">
              Session starts
            </Label>
            <Switch
              id="chime_on_session_start"
              checked={onSessionStart}
              onCheckedChange={setOnSessionStart}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="chime_on_break_start" className="text-sm font-normal">
              Break begins
            </Label>
            <Switch
              id="chime_on_break_start"
              checked={onBreakStart}
              onCheckedChange={setOnBreakStart}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="chime_on_break_end" className="text-sm font-normal">
              Break ends
            </Label>
            <Switch
              id="chime_on_break_end"
              checked={onBreakEnd}
              onCheckedChange={setOnBreakEnd}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="chime_on_reminder" className="text-sm font-normal">
              Pre-break reminder
            </Label>
            <Switch
              id="chime_on_reminder"
              checked={onReminder}
              onCheckedChange={setOnReminder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
