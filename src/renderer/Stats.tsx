import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  Eye,
  TrendingUp,
  Calendar,
  Zap,
  Award,
  Target,
  Coffee,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import type { StatsResponse } from './lib/tauri-bridge';

// ============================================================================
// Utility Functions
// ============================================================================

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

function formatTimeVerbose(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

function getWeekdayShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '🔥';
  if (streak >= 7) return '⚡';
  if (streak >= 3) return '✨';
  return '🌱';
}

function getMotivationalMessage(stats: StatsResponse): string {
  const todayFocus = stats.today.total_focus_secs;
  const streak = stats.streak.current;
  
  if (todayFocus === 0) {
    return "Ready to start? Your eyes will thank you.";
  }
  if (todayFocus < 1800) { // < 30 min
    return "Great start! Keep the momentum going.";
  }
  if (todayFocus < 7200) { // < 2 hours
    return "Solid focus session. You're doing great!";
  }
  if (streak >= 7) {
    return `${streak} day streak! Your consistency is paying off.`;
  }
  return "Impressive focus today. Remember to rest your eyes!";
}

// ============================================================================
// Animated Number Component
// ============================================================================

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

// ============================================================================
// Mini Bar Chart Component
// ============================================================================

function WeeklyChart({ data }: { data: { date: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end justify-between gap-1 h-20 pt-2">
      {data.map((day, i) => {
        const height = (day.value / maxValue) * 100;
        const isToday = i === data.length - 1;
        
        return (
          <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 4)}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
              className={`w-full rounded-t-sm ${
                isToday 
                  ? 'bg-gradient-to-t from-amber-500 to-amber-400' 
                  : day.value > 0 
                    ? 'bg-gradient-to-t from-zinc-600 to-zinc-500'
                    : 'bg-zinc-800'
              }`}
              style={{ minHeight: '4px' }}
            />
            <span className={`text-[10px] ${isToday ? 'text-amber-400 font-medium' : 'text-zinc-500'}`}>
              {getWeekdayShort(day.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Stat Card Components
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: boolean;
  delay?: number;
}

function StatCard({ title, value, subtitle, icon, accent, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`rounded-xl p-4 ${
        accent 
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30' 
          : 'bg-zinc-900/50 border border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-medium ${accent ? 'text-amber-400' : 'text-zinc-400'}`}>
          {title}
        </span>
        <span className={accent ? 'text-amber-400' : 'text-zinc-500'}>
          {icon}
        </span>
      </div>
      <div className={`text-2xl font-bold ${accent ? 'text-white' : 'text-zinc-100'}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-zinc-500 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Main Stats Component
// ============================================================================

interface StatsProps {
  onBack: () => void;
}

export default function Stats({ onBack }: StatsProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const data = await window.electron.stats.getStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 p-8">
        <Eye className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-400 text-center">No data yet. Start a focus session to track your progress!</p>
        <button 
          onClick={onBack}
          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const weeklyChartData = stats.weekly_trend.map(day => ({
    date: day.date,
    value: day.total_focus_secs,
  }));

  const completionRate = stats.today.sessions_started > 0
    ? Math.round((stats.today.sessions_completed / stats.today.sessions_started) * 100)
    : 0;

  const breakRate = (stats.today.breaks_taken + stats.today.breaks_skipped) > 0
    ? Math.round((stats.today.breaks_taken / (stats.today.breaks_taken + stats.today.breaks_skipped)) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h1 className="text-lg font-semibold">Focus Stats</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-zinc-400 text-sm">{getMotivationalMessage(stats)}</p>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 rounded-2xl p-6 mb-6 border border-amber-500/20"
        >
          <div className="text-center">
            <div className="text-xs text-amber-400/80 font-medium mb-1">TODAY'S FOCUS</div>
            <div className="text-5xl font-bold text-white mb-2">
              {formatTime(stats.today.total_focus_secs)}
            </div>
            <div className="text-zinc-400 text-sm">
              {stats.today.sessions_completed} session{stats.today.sessions_completed !== 1 ? 's' : ''} completed
            </div>
          </div>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                {getStreakEmoji(stats.streak.current)}
                <AnimatedNumber value={stats.streak.current} />
              </div>
              <div className="text-xs text-zinc-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <AnimatedNumber value={stats.today.breaks_taken} />
              </div>
              <div className="text-xs text-zinc-500">Breaks Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <AnimatedNumber value={breakRate} suffix="%" />
              </div>
              <div className="text-xs text-zinc-500">Break Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 rounded-xl p-4 mb-6 border border-zinc-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-300">This Week</span>
            <span className="text-xs text-zinc-500">
              {formatTime(stats.week.total_focus_secs)} total
            </span>
          </div>
          <WeeklyChart data={weeklyChartData} />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            title="Longest Session"
            value={stats.today.longest_session_secs > 0 ? formatTime(stats.today.longest_session_secs) : '—'}
            subtitle="Today"
            icon={<Zap className="w-4 h-4" />}
            delay={3}
          />
          <StatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle={`${stats.today.sessions_completed}/${stats.today.sessions_started} sessions`}
            icon={<Target className="w-4 h-4" />}
            delay={4}
          />
          <StatCard
            title="Best Day"
            value={stats.week.most_productive_day 
              ? getWeekdayShort(stats.week.most_productive_day)
              : '—'}
            subtitle={stats.week.most_productive_day_secs > 0 
              ? formatTime(stats.week.most_productive_day_secs)
              : 'No data yet'}
            icon={<Award className="w-4 h-4" />}
            delay={5}
          />
          <StatCard
            title="Weekly Average"
            value={stats.week.avg_daily_focus_secs > 0 
              ? formatTime(stats.week.avg_daily_focus_secs)
              : '—'}
            subtitle="Per active day"
            icon={<TrendingUp className="w-4 h-4" />}
            delay={6}
          />
        </div>

        {/* Streak Card */}
        {stats.streak.current >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-xl p-4 mb-6 border border-amber-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getStreakEmoji(stats.streak.current)}</div>
              <div>
                <div className="text-xl font-bold text-white">
                  {stats.streak.current} Day Streak!
                </div>
                <div className="text-sm text-amber-200/70">
                  {stats.streak.current >= stats.streak.longest 
                    ? "This is your best streak ever!"
                    : `Personal best: ${stats.streak.longest} days`}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/30 rounded-xl p-4 border border-zinc-800/50"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-4">All Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-bold text-zinc-200">
                {formatTimeVerbose(stats.all_time.total_focus_secs)}
              </div>
              <div className="text-xs text-zinc-500">Total Focus Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-200">
                {stats.all_time.total_sessions}
              </div>
              <div className="text-xs text-zinc-500">Sessions</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-200">
                {stats.all_time.total_breaks}
              </div>
              <div className="text-xs text-zinc-500">Breaks Taken</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-200">
                {stats.all_time.avg_session_secs > 0 
                  ? formatTime(stats.all_time.avg_session_secs)
                  : '—'}
              </div>
              <div className="text-xs text-zinc-500">Avg Session</div>
            </div>
          </div>
          {stats.all_time.started_at && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="text-xs text-zinc-500">
                Tracking since {new Date(stats.all_time.started_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Insights */}
        {stats.today.breaks_skipped > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-zinc-300">
                  You skipped {stats.today.breaks_skipped} break{stats.today.breaks_skipped !== 1 ? 's' : ''} today
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Try to take all your breaks — your eyes will thank you!
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Keyboard Shortcuts Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <div className="text-xs text-zinc-600">
            Pro tip: Use ⌘⇧B to take a break, ⌘⇧P to pause/resume
          </div>
        </motion.div>
      </main>
    </div>
  );
}

