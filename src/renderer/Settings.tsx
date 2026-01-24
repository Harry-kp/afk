import { useState, useEffect } from 'react';
import {
  Monitor,
  EyeOff,
  Footprints,
  BellRing,
  LogIn,
  ArrowLeft,
  TimerReset,
  Volume2,
  Heart,
  Twitter,
  Globe,
  Share2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  FileJson,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { StartupSettings } from './startupSettings';
import { FocusSettings } from './focusSettings';
import { IdleTimeSettings } from './idleTimeSettings';
import { ShortBreakSettings } from './shortBreakSettings';
import { PreBreakSettings } from './preBreakSettings';
import { LongBreakSettings } from './longBreakSettings';
import { ChimeSettings } from './chimeSettings';
import { track } from './lib/analytics';
import { AUTHORS, APP_INFO } from './constants/authors';

function ConfigPathSettings() {
  const [configPath, setConfigPath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.electron.app.getConfigPath().then(setConfigPath);
  }, []);

  const copyConfigPath = () => {
    if (configPath) {
      navigator.clipboard.writeText(configPath);
      setCopied(true);
      track('config_path_copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-2 w-full">
      <Label className="flex flex-col space-y-1">
        <span>Config location</span>
        <span className="font-normal leading-snug text-muted-foreground text-xs font-mono truncate max-w-[300px]">
          {configPath || 'Loading...'}
        </span>
      </Label>
      <button
        type="button"
        onClick={copyConfigPath}
        disabled={!configPath}
        className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
        title="Copy path"
      >
        {copied ? (
          <Check className="w-4 h-4" style={{ color: '#eab308' }} />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

function ResetSettings() {
  const handleReset = async () => {
    await window.electron.app.resetSettings();
    track('settings_reset');
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-between space-x-2 w-full">
      <Label className="flex flex-col space-y-1">
        <span>Reset settings</span>
        <span className="font-normal leading-snug text-muted-foreground text-xs">
          Double-click to reset
        </span>
      </Label>
      <button
        type="button"
        onDoubleClick={handleReset}
        className="p-2 hover:bg-muted rounded-md transition-all group"
        title="Double-click to reset"
      >
        <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500 group-active:text-red-500 group-active:rotate-180 transition-all duration-300" />
      </button>
    </div>
  );
}

function Settings({
  setShowSettings,
}: {
  setShowSettings: (arg0: boolean) => void;
}) {
  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col px-40">
        <main className="flex flex-1 flex-col p-4 lg:p-6">
          <Tabs defaultValue="general">
            <ArrowLeft
              width={20}
              height={20}
              className="cursor-pointer fixed mt-2"
              onClick={() => setShowSettings(false)}
            />
            <TabsList className="justify-center">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="pt-4" />
              <div className="flex items-start gap-x-8 [&>div]:w-full">
                <Monitor className="self-center" width={20} height={20} />
                <FocusSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center gap-x-8 [&>div]:w-full">
                <EyeOff className="self-center" width={20} height={20} />
                <ShortBreakSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center justify-center gap-x-8 [&>div]:w-full">
                <Footprints className="self-center" width={20} height={20} />
                <LongBreakSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center justify-center gap-x-8 [&>div]:w-full">
                <BellRing className="self-center" width={20} height={20} />
                <PreBreakSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center justify-center gap-x-8 [&>div]:w-full">
                <TimerReset className="self-center" width={20} height={20} />
                <IdleTimeSettings />
              </div>
            </TabsContent>
            <TabsContent value="system">
              <div className="pt-4" />
              <div className="flex items-center justify-center gap-x-8 [&>div]:w-full">
                <LogIn width={20} height={20} />
                <StartupSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-start gap-x-8 [&>div]:w-full">
                <Volume2 width={20} height={20} className="mt-1" />
                <ChimeSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center gap-x-8 [&>div]:w-full">
                <FileJson width={20} height={20} />
                <ConfigPathSettings />
              </div>
              <div className="pt-4" />
              <Separator className="my-4" />
              <div className="pt-4" />
              <div className="flex items-center gap-x-8 [&>div]:w-full">
                <RotateCcw width={20} height={20} />
                <ResetSettings />
              </div>
            </TabsContent>
            <TabsContent value="about">
              <div className="pt-8 text-center">
                {/* App Logo & Name */}
                <h1 className="text-3xl font-bold text-white mb-2">{APP_INFO.name}</h1>
                <p className="text-neutral-400 mb-1">Version {APP_INFO.version}</p>
                <p className="text-neutral-500 text-sm mb-8">{APP_INFO.tagline}</p>
                
                {/* Tagline */}
                <div className="bg-neutral-800/50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <p className="text-neutral-300 italic">
                    &ldquo;Your eyes deserve a break. So do you.&rdquo;
                  </p>
                </div>

                {/* Share Section */}
                <div className="mb-8">
                  <p className="text-neutral-400 text-sm mb-4">Love AFK? Share it with friends!</p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        track('share_twitter');
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent('👀 Taking better care of my eyes with AFK - a beautiful break reminder app for developers. Check it out!')}&url=${encodeURIComponent(APP_INFO.website)}`,
                          '_blank'
                        );
                      }}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Tweet
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        track('share_copy_link');
                        navigator.clipboard.writeText(APP_INFO.website);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                <Separator className="my-6 max-w-md mx-auto" />

                {/* Links */}
                <div className="flex justify-center gap-6 mb-8">
                  <a
                    href={APP_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                    onClick={() => track('link_website')}
                  >
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={AUTHORS.chaitanya.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                    onClick={() => track('link_twitter_chaitanya')}
                  >
                    <Twitter className="w-4 h-4" />
                    {AUTHORS.chaitanya.twitterHandle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={AUTHORS.harry.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                    onClick={() => track('link_twitter_harry')}
                  >
                    <Twitter className="w-4 h-4" />
                    {AUTHORS.harry.twitterHandle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Made with love */}
                <div className="text-neutral-500 text-sm flex items-center justify-center gap-1 flex-wrap">
                  Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by
                  <a
                    href={AUTHORS.chaitanya.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {AUTHORS.chaitanya.displayName}
                  </a>
                  &
                  <a
                    href={AUTHORS.harry.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {AUTHORS.harry.displayName}
                  </a>
                </div>
                <p className="text-neutral-600 text-xs mt-2">
                  {APP_INFO.copyright}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Settings;
