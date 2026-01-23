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
              <div className="pt-6 max-w-lg mx-auto font-mono">
                {/* Terminal-style header */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                  {/* Terminal title bar */}
                  <div className="bg-neutral-800 px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-neutral-500 text-xs ml-2">~/afk</span>
                  </div>
                  
                  {/* Terminal content */}
                  <div className="p-4 text-sm">
                    <p className="text-green-400">$ cat README.md</p>
                    <div className="mt-3 text-neutral-300">
                      <p className="text-2xl mb-1">👀 <span className="text-white font-bold">Afk</span></p>
                      <p className="text-neutral-500 text-xs mb-4">v{APP_VERSION} • Built with Rust + React</p>
                      <p className="text-neutral-400 mb-4">
                        A minimal break reminder.<br />
                        No bloat. No ads. No BS.
                      </p>
                    </div>
                    
                    <p className="text-green-400 mt-4">$ whoami</p>
                    <p className="text-neutral-300 mt-1">
                      <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                        onClick={() => track('link_github')}
                      >
                        @Harry-kp
                      </a>
                      <span className="text-neutral-500"> — solo dev, shipping stuff</span>
                    </p>

                    <p className="text-green-400 mt-4">$ echo $LINKS</p>
                    <div className="mt-1 flex gap-4">
                      <a
                        href={LANDING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                        onClick={() => track('link_website')}
                      >
                        [web]
                      </a>
                      <a
                        href={TWITTER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                        onClick={() => track('link_twitter')}
                      >
                        [twitter]
                      </a>
                    </div>

                    <p className="text-green-400 mt-4">$ ./share.sh</p>
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => {
                          track('share_twitter');
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent('👀 Afk - a minimal break reminder for devs who forget to blink.')}&url=${encodeURIComponent(LANDING_URL)}`,
                            '_blank'
                          );
                        }}
                        className="text-neutral-400 hover:text-white text-xs border border-neutral-700 px-2 py-1 rounded hover:border-neutral-500 transition-colors"
                      >
                        tweet
                      </button>
                      <button
                        onClick={() => {
                          track('share_copy_link');
                          navigator.clipboard.writeText(LANDING_URL);
                        }}
                        className="text-neutral-400 hover:text-white text-xs border border-neutral-700 px-2 py-1 rounded hover:border-neutral-500 transition-colors"
                      >
                        copy link
                      </button>
                    </div>

                    <p className="text-neutral-600 mt-6 text-xs">
                      <span className="text-green-400">$</span> <span className="animate-pulse">_</span>
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <p className="text-neutral-600 text-xs text-center mt-4">
                  shipped with caffeine & questionable sleep schedules
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
