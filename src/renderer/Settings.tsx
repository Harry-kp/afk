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
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
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
                {/* App Logo & Name */}
                <h1 className="text-3xl font-bold text-white mb-2">Afk</h1>
                <p className="text-neutral-400 mb-1">Version {APP_VERSION}</p>
                <p className="text-neutral-500 text-sm mb-8">Step away from your keyboard</p>
                
                {/* Tagline */}
                <div className="bg-neutral-800/50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <p className="text-neutral-300 italic">
                    &ldquo;Your eyes deserve a break. So do you.&rdquo;
                  </p>
                </div>

                {/* Share Section */}
                <div className="mb-8">
                  <p className="text-neutral-400 text-sm mb-4">Love Afk? Share it with friends!</p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        track('share_twitter');
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent('👀 Taking better care of my eyes with Afk - a beautiful break reminder app for developers. Check it out!')}&url=${encodeURIComponent(LANDING_URL)}`,
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
                        navigator.clipboard.writeText(LANDING_URL);
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
                    href={LANDING_URL}
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
                    href={TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                    onClick={() => track('link_twitter')}
                  >
                    <Twitter className="w-4 h-4" />
                    @Harry_kp_
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Made with love */}
                <div className="text-neutral-500 text-sm flex items-center justify-center gap-1">
                  Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    Harry-kp
                  </a>
                </div>
                <p className="text-neutral-600 text-xs mt-2">
                  © 2024-2026 All rights reserved
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
