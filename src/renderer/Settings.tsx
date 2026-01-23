import {
  Monitor,
  EyeOff,
  Footprints,
  BellRing,
  LogIn,
  ArrowLeft,
  TimerReset,
  Volume2,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { StartupSettings } from './startupSettings';
import { FocusSettings } from './focusSettings';
import { IdleTimeSettings } from './idleTimeSettings';
import { ShortBreakSettings } from './shortBreakSettings';
import { PreBreakSettings } from './preBreakSettings';
import { LongBreakSettings } from './longBreakSettings';
import { ChimeSettings } from './chimeSettings';
import { track } from './lib/analytics';

const APP_VERSION = '1.0.0';
const LANDING_URL = 'https://afk-app.vercel.app';
const TWITTER_URL = 'https://twitter.com/Harry_kp_';
const GITHUB_URL = 'https://github.com/Harry-kp';

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
            </TabsContent>
            <TabsContent value="about">
              <div className="pt-8 text-center">
                <p className="text-4xl mb-2">👀</p>
                <h1 className="text-xl font-semibold text-white">Afk</h1>
                <p className="text-neutral-500 text-sm mt-1">v{APP_VERSION}</p>
                
                <div className="mt-8 flex justify-center gap-6 text-sm">
                  <a
                    href={TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={LANDING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    Website
                  </a>
                </div>

                <p className="text-neutral-600 text-xs mt-8">
                  by{' '}
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    Harry-kp
                  </a>
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
