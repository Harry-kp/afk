use chrono::{Duration, Local, NaiveDate};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

/// Daily aggregated statistics
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DailyStats {
    pub date: String,
    pub total_focus_secs: u64,
    pub breaks_taken: u32,
    pub breaks_skipped: u32,
}

/// Statistics response for frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatsResponse {
    pub today: DailyStats,
    pub week: WeeklyStats,
    pub streak: StreakInfo,
    pub all_time: AllTimeStats,
    pub weekly_trend: Vec<DailyStats>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WeeklyStats {
    pub total_focus_secs: u64,
    pub breaks_taken: u32,
    pub avg_daily_focus_secs: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct StreakInfo {
    pub current: u32,
    pub longest: u32,
    pub last_active_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AllTimeStats {
    pub total_focus_secs: u64,
    pub total_breaks: u32,
}

/// Statistics storage and management
pub struct StatsManager {
    daily_stats: Mutex<HashMap<String, DailyStats>>,
    streak: Mutex<StreakInfo>,
    stats_path: Mutex<Option<PathBuf>>,
    /// Unsaved focus seconds (accumulated since last save)
    unsaved_focus_secs: Mutex<u64>,
}

impl StatsManager {
    pub fn new() -> Self {
        Self {
            daily_stats: Mutex::new(HashMap::new()),
            streak: Mutex::new(StreakInfo::default()),
            stats_path: Mutex::new(None),
            unsaved_focus_secs: Mutex::new(0),
        }
    }

    pub fn init(&self, app_data_dir: PathBuf) {
        let stats_file = app_data_dir.join("stats.json");
        *self.stats_path.lock() = Some(stats_file);
        self.load();
    }

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
                    // Prune old data (keep last 90 days)
                    let cutoff = (Local::now() - Duration::days(90)).format("%Y-%m-%d").to_string();
                    let pruned: HashMap<String, DailyStats> = stored.daily
                        .into_iter()
                        .filter(|(date, _)| date >= &cutoff)
                        .collect();
                    
                    *self.daily_stats.lock() = pruned;
                    *self.streak.lock() = stored.streak;
                }
            }
            Err(e) => eprintln!("Failed to read stats file: {}", e),
        }
    }

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

    /// Called every second during focus time
    pub fn tick_focus(&self) {
        *self.unsaved_focus_secs.lock() += 1;
    }

    /// Flush unsaved focus time to daily stats and save to disk
    pub fn flush_focus(&self) {
        let unsaved = {
            let mut unsaved = self.unsaved_focus_secs.lock();
            let val = *unsaved;
            *unsaved = 0;
            val
        };

        if unsaved == 0 {
            return;
        }

        let today = Local::now().format("%Y-%m-%d").to_string();
        
        {
            let mut daily = self.daily_stats.lock();
            let stats = daily.entry(today.clone()).or_insert_with(|| DailyStats {
                date: today.clone(),
                ..Default::default()
            });
            stats.total_focus_secs += unsaved;
        }

        self.update_streak(&today);
        self.save();
    }

    /// Called when a break is completed
    pub fn break_completed(&self) {
        // First flush any unsaved focus time
        self.flush_focus();

        let today = Local::now().format("%Y-%m-%d").to_string();
        
        {
            let mut daily = self.daily_stats.lock();
            let stats = daily.entry(today.clone()).or_insert_with(|| DailyStats {
                date: today.clone(),
                ..Default::default()
            });
            stats.breaks_taken += 1;
        }

        self.save();
    }

    /// Called when a break is skipped
    pub fn break_skipped(&self) {
        // First flush any unsaved focus time
        self.flush_focus();

        let today = Local::now().format("%Y-%m-%d").to_string();
        
        {
            let mut daily = self.daily_stats.lock();
            let stats = daily.entry(today.clone()).or_insert_with(|| DailyStats {
                date: today.clone(),
                ..Default::default()
            });
            stats.breaks_skipped += 1;
        }

        self.save();
    }

    fn update_streak(&self, today: &str) {
        let mut streak = self.streak.lock();

        let today_date = match NaiveDate::parse_from_str(today, "%Y-%m-%d") {
            Ok(d) => d,
            Err(_) => return,
        };

        if let Some(ref last) = streak.last_active_date {
            if last == today {
                return;
            }

            if let Ok(last_date) = NaiveDate::parse_from_str(last, "%Y-%m-%d") {
                let diff = today_date.signed_duration_since(last_date).num_days();
                
                if diff == 1 {
                    streak.current += 1;
                } else if diff > 1 {
                    streak.current = 1;
                }
            }
        } else {
            streak.current = 1;
        }

        if streak.current > streak.longest {
            streak.longest = streak.current;
        }

        streak.last_active_date = Some(today.to_string());
    }

    pub fn get_stats(&self) -> StatsResponse {
        let daily = self.daily_stats.lock();
        let streak = self.streak.lock();
        let unsaved = *self.unsaved_focus_secs.lock();

        let now = Local::now();
        let today_str = now.format("%Y-%m-%d").to_string();

        // Today's stats (include unsaved focus time)
        let mut today = daily.get(&today_str).cloned().unwrap_or_else(|| DailyStats {
            date: today_str.clone(),
            ..Default::default()
        });
        today.total_focus_secs += unsaved;

        // Weekly stats
        let mut week = WeeklyStats::default();
        let mut weekly_trend: Vec<DailyStats> = Vec::new();

        for i in 0..7 {
            let date = (now - Duration::days(i)).format("%Y-%m-%d").to_string();
            if let Some(day_stats) = daily.get(&date) {
                let mut stats = day_stats.clone();
                // Add unsaved time to today
                if i == 0 {
                    stats.total_focus_secs += unsaved;
                }
                week.total_focus_secs += stats.total_focus_secs;
                week.breaks_taken += stats.breaks_taken;
                weekly_trend.push(stats);
            } else {
                weekly_trend.push(DailyStats {
                    date: date.clone(),
                    ..Default::default()
                });
            }
        }

        weekly_trend.reverse();

        let active_days = weekly_trend.iter().filter(|d| d.total_focus_secs > 0).count();
        if active_days > 0 {
            week.avg_daily_focus_secs = week.total_focus_secs / active_days as u64;
        }

        // All-time stats
        let mut all_time = AllTimeStats::default();
        for stats in daily.values() {
            all_time.total_focus_secs += stats.total_focus_secs;
            all_time.total_breaks += stats.breaks_taken + stats.breaks_skipped;
        }
        all_time.total_focus_secs += unsaved;

        StatsResponse {
            today,
            week,
            streak: streak.clone(),
            all_time,
            weekly_trend,
        }
    }

    pub fn get_today_focus_secs(&self) -> u64 {
        let today_str = Local::now().format("%Y-%m-%d").to_string();
        
        let daily = self.daily_stats.lock();
        let saved = daily.get(&today_str).map(|s| s.total_focus_secs).unwrap_or(0);
        let unsaved = *self.unsaved_focus_secs.lock();
        
        saved + unsaved
    }

    pub fn clear_all(&self) {
        *self.daily_stats.lock() = HashMap::new();
        *self.streak.lock() = StreakInfo::default();
        *self.unsaved_focus_secs.lock() = 0;
        self.save();
    }
}

impl Default for StatsManager {
    fn default() -> Self {
        Self::new()
    }
}
