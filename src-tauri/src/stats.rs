use chrono::{DateTime, Datelike, Duration, Local, NaiveDate, Timelike, Utc};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

/// A completed focus session record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionRecord {
    pub date: String,           // ISO date (YYYY-MM-DD)
    pub started_at: String,     // ISO timestamp
    pub ended_at: String,       // ISO timestamp  
    pub duration_secs: u64,     // Actual focus time in seconds
    pub breaks_taken: u32,      // Number of breaks completed
    pub breaks_skipped: u32,    // Number of breaks skipped
    pub completed: bool,        // Did session end naturally (not manually ended)
}

/// Daily aggregated statistics
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DailyStats {
    pub date: String,
    pub total_focus_secs: u64,
    pub sessions_completed: u32,
    pub sessions_started: u32,
    pub breaks_taken: u32,
    pub breaks_skipped: u32,
    pub longest_session_secs: u64,
    pub first_session_at: Option<String>,
    pub last_session_at: Option<String>,
}

/// Statistics response for frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatsResponse {
    pub today: DailyStats,
    pub week: WeeklyStats,
    pub streak: StreakInfo,
    pub all_time: AllTimeStats,
    pub hourly_distribution: Vec<HourlyBucket>,
    pub weekly_trend: Vec<DailyStats>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WeeklyStats {
    pub total_focus_secs: u64,
    pub sessions_completed: u32,
    pub breaks_taken: u32,
    pub avg_daily_focus_secs: u64,
    pub most_productive_day: Option<String>,
    pub most_productive_day_secs: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct StreakInfo {
    pub current: u32,           // Current consecutive days with at least 1 session
    pub longest: u32,           // All-time longest streak
    pub last_active_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AllTimeStats {
    pub total_focus_secs: u64,
    pub total_sessions: u32,
    pub total_breaks: u32,
    pub avg_session_secs: u64,
    pub started_at: Option<String>,  // First ever session date
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct HourlyBucket {
    pub hour: u32,              // 0-23
    pub focus_secs: u64,
    pub sessions: u32,
}

/// Statistics storage and management
pub struct StatsManager {
    /// Daily stats indexed by date (YYYY-MM-DD)
    daily_stats: Mutex<HashMap<String, DailyStats>>,
    /// Streak information
    streak: Mutex<StreakInfo>,
    /// Path to stats file
    stats_path: Mutex<Option<PathBuf>>,
    /// Current session tracking (for accumulating focus time)
    current_session_start: Mutex<Option<DateTime<Utc>>>,
    current_session_focus_secs: Mutex<u64>,
    current_breaks_taken: Mutex<u32>,
    current_breaks_skipped: Mutex<u32>,
}

impl StatsManager {
    pub fn new() -> Self {
        Self {
            daily_stats: Mutex::new(HashMap::new()),
            streak: Mutex::new(StreakInfo::default()),
            stats_path: Mutex::new(None),
            current_session_start: Mutex::new(None),
            current_session_focus_secs: Mutex::new(0),
            current_breaks_taken: Mutex::new(0),
            current_breaks_skipped: Mutex::new(0),
        }
    }

    /// Initialize stats persistence
    pub fn init(&self, app_data_dir: PathBuf) {
        let stats_file = app_data_dir.join("stats.json");
        *self.stats_path.lock() = Some(stats_file);
        self.load();
    }

    /// Load stats from disk
    fn load(&self) {
        let path = self.stats_path.lock().clone();
        let Some(path) = path else { return };

        if !path.exists() {
            return;
        }

        match fs::read_to_string(&path) {
            Ok(contents) => {
                #[derive(Deserialize)]
                struct StoredStats {
                    daily: HashMap<String, DailyStats>,
                    streak: StreakInfo,
                }

                if let Ok(stored) = serde_json::from_str::<StoredStats>(&contents) {
                    // Prune old data (keep last 90 days only)
                    let cutoff = (Local::now() - Duration::days(90)).format("%Y-%m-%d").to_string();
                    let pruned: HashMap<String, DailyStats> = stored.daily
                        .into_iter()
                        .filter(|(date, _)| date >= &cutoff)
                        .collect();
                    
                    *self.daily_stats.lock() = pruned;
                    *self.streak.lock() = stored.streak;
                    println!("Stats loaded from: {} ({} days)", path.display(), self.daily_stats.lock().len());
                }
            }
            Err(e) => eprintln!("Failed to read stats file: {}", e),
        }
    }

    /// Save stats to disk
    fn save(&self) {
        let path = self.stats_path.lock().clone();
        let Some(path) = path else { return };

        #[derive(Serialize)]
        struct StoredStats<'a> {
            daily: &'a HashMap<String, DailyStats>,
            streak: &'a StreakInfo,
        }

        let daily = self.daily_stats.lock();
        let streak = self.streak.lock();

        let stored = StoredStats {
            daily: &*daily,
            streak: &*streak,
        };

        if let Ok(json) = serde_json::to_string_pretty(&stored) {
            if let Err(e) = fs::write(&path, json) {
                eprintln!("Failed to write stats file: {}", e);
            }
        }
    }

    /// Called when a focus session starts
    pub fn session_started(&self) {
        *self.current_session_start.lock() = Some(Utc::now());
        *self.current_session_focus_secs.lock() = 0;
        *self.current_breaks_taken.lock() = 0;
        *self.current_breaks_skipped.lock() = 0;
    }

    /// Called when focus time is accumulated (every second during active session)
    pub fn tick_focus(&self) {
        let mut secs = self.current_session_focus_secs.lock();
        *secs += 1;
    }

    /// Called when a break is completed
    pub fn break_completed(&self) {
        let mut breaks = self.current_breaks_taken.lock();
        *breaks += 1;
    }

    /// Called when a break is skipped
    pub fn break_skipped(&self) {
        let mut skipped = self.current_breaks_skipped.lock();
        *skipped += 1;
    }

    /// Called when a session ends (naturally or manually)
    pub fn session_ended(&self, completed_naturally: bool) {
        let start = self.current_session_start.lock().take();
        let focus_secs = *self.current_session_focus_secs.lock();
        let breaks_taken = *self.current_breaks_taken.lock();
        let breaks_skipped = *self.current_breaks_skipped.lock();

        // Only record if we had meaningful focus time (at least 60 seconds)
        if focus_secs < 60 {
            return;
        }

        let now = Local::now();
        let today = now.format("%Y-%m-%d").to_string();
        let _hour = now.hour();

        // Update daily stats
        let mut daily = self.daily_stats.lock();
        let stats = daily.entry(today.clone()).or_insert_with(|| DailyStats {
            date: today.clone(),
            ..Default::default()
        });

        stats.total_focus_secs += focus_secs;
        stats.sessions_started += 1;
        if completed_naturally {
            stats.sessions_completed += 1;
        }
        stats.breaks_taken += breaks_taken;
        stats.breaks_skipped += breaks_skipped;

        if focus_secs > stats.longest_session_secs {
            stats.longest_session_secs = focus_secs;
        }

        let timestamp = now.to_rfc3339();
        if stats.first_session_at.is_none() {
            stats.first_session_at = Some(timestamp.clone());
        }
        stats.last_session_at = Some(timestamp);

        drop(daily);

        // Update streak
        self.update_streak(&today);

        // Persist
        self.save();

        // Reset current session tracking
        *self.current_session_focus_secs.lock() = 0;
        *self.current_breaks_taken.lock() = 0;
        *self.current_breaks_skipped.lock() = 0;
    }

    /// Update streak based on activity
    fn update_streak(&self, today: &str) {
        let mut streak = self.streak.lock();
        let _daily = self.daily_stats.lock();

        // Parse today's date
        let today_date = match NaiveDate::parse_from_str(today, "%Y-%m-%d") {
            Ok(d) => d,
            Err(_) => return,
        };

        // Check if last active was yesterday or today
        if let Some(ref last) = streak.last_active_date {
            if last == today {
                // Same day, no change
                return;
            }

            if let Ok(last_date) = NaiveDate::parse_from_str(last, "%Y-%m-%d") {
                let diff = today_date.signed_duration_since(last_date).num_days();
                
                if diff == 1 {
                    // Consecutive day - increment streak
                    streak.current += 1;
                } else if diff > 1 {
                    // Streak broken - reset
                    streak.current = 1;
                }
            }
        } else {
            // First ever session
            streak.current = 1;
        }

        // Update longest if needed
        if streak.current > streak.longest {
            streak.longest = streak.current;
        }

        streak.last_active_date = Some(today.to_string());
    }

    /// Get complete stats response for frontend
    pub fn get_stats(&self) -> StatsResponse {
        let daily = self.daily_stats.lock();
        let streak = self.streak.lock();

        let now = Local::now();
        let today_str = now.format("%Y-%m-%d").to_string();

        // Today's stats
        let today = daily.get(&today_str).cloned().unwrap_or_else(|| DailyStats {
            date: today_str.clone(),
            ..Default::default()
        });

        // Weekly stats (last 7 days)
        let mut week = WeeklyStats::default();
        let mut weekly_trend: Vec<DailyStats> = Vec::new();
        let mut hourly_buckets: HashMap<u32, HourlyBucket> = HashMap::new();

        // Initialize hourly buckets
        for h in 0..24 {
            hourly_buckets.insert(h, HourlyBucket { hour: h, focus_secs: 0, sessions: 0 });
        }

        for i in 0..7 {
            let date = (now - Duration::days(i)).format("%Y-%m-%d").to_string();
            if let Some(day_stats) = daily.get(&date) {
                week.total_focus_secs += day_stats.total_focus_secs;
                week.sessions_completed += day_stats.sessions_completed;
                week.breaks_taken += day_stats.breaks_taken;

                if day_stats.total_focus_secs > week.most_productive_day_secs {
                    week.most_productive_day_secs = day_stats.total_focus_secs;
                    week.most_productive_day = Some(date.clone());
                }

                weekly_trend.push(day_stats.clone());
            } else {
                weekly_trend.push(DailyStats {
                    date: date.clone(),
                    ..Default::default()
                });
            }
        }

        // Reverse so it's oldest to newest
        weekly_trend.reverse();

        // Calculate average
        let active_days = weekly_trend.iter().filter(|d| d.total_focus_secs > 0).count();
        if active_days > 0 {
            week.avg_daily_focus_secs = week.total_focus_secs / active_days as u64;
        }

        // All-time stats
        let mut all_time = AllTimeStats::default();
        let mut earliest_date: Option<String> = None;

        for (date, stats) in daily.iter() {
            all_time.total_focus_secs += stats.total_focus_secs;
            all_time.total_sessions += stats.sessions_started;
            all_time.total_breaks += stats.breaks_taken;

            if earliest_date.is_none() || date < earliest_date.as_ref().unwrap() {
                earliest_date = Some(date.clone());
            }
        }

        if all_time.total_sessions > 0 {
            all_time.avg_session_secs = all_time.total_focus_secs / all_time.total_sessions as u64;
        }
        all_time.started_at = earliest_date;

        // Estimate hourly distribution from today's data (simplified)
        // In a real implementation, we'd track hour-by-hour data
        let hourly_distribution: Vec<HourlyBucket> = (0..24)
            .map(|h| hourly_buckets.get(&h).cloned().unwrap_or_default())
            .collect();

        StatsResponse {
            today,
            week,
            streak: streak.clone(),
            all_time,
            hourly_distribution,
            weekly_trend,
        }
    }

    /// Get today's focus time in seconds (for live display)
    pub fn get_today_focus_secs(&self) -> u64 {
        let now = Local::now();
        let today_str = now.format("%Y-%m-%d").to_string();
        
        let daily = self.daily_stats.lock();
        let saved = daily.get(&today_str).map(|s| s.total_focus_secs).unwrap_or(0);
        let current = *self.current_session_focus_secs.lock();
        
        saved + current
    }

    /// Clear all statistics
    pub fn clear_all(&self) {
        *self.daily_stats.lock() = HashMap::new();
        *self.streak.lock() = StreakInfo::default();
        self.save();
    }
}

impl Default for StatsManager {
    fn default() -> Self {
        Self::new()
    }
}

