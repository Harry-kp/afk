use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tauri::async_runtime::JoinHandle;

/// Session state matching the original electron-store schema
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Session {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub remaining_time: Option<String>,
    #[serde(default)]
    pub paused: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub paused_at: Option<String>,
}

/// Default configuration values matching the original constants.js
pub mod defaults {
    pub const DEFAULT_INTERVAL_DURATION: u64 = 1500; // 25 minutes in seconds
    pub const DEFAULT_BREAK_DURATION: u64 = 30; // 30 seconds
    pub const BREAK_NOTIFICATION_AT: u64 = 60; // 1 minute before break
    pub const DEFAULT_LONG_BREAK_DURATION: u64 = 120; // 2 minutes
    pub const DEFAULT_LONG_BREAK_AFTER: u64 = 2; // After 2 short breaks
}

/// Application state managed by Tauri
pub struct AppState {
    /// Current session data
    pub session: Mutex<Session>,
    /// Handle to the running session timer task
    pub session_timer_handle: Mutex<Option<JoinHandle<()>>>,
    /// Flag to signal timer cancellation
    pub timer_cancelled: Arc<Mutex<bool>>,
    /// Settings cache (will be synced with tauri-plugin-store)
    pub settings: Mutex<HashMap<String, serde_json::Value>>,
    /// Short break count for long break calculation
    pub short_break_count: Mutex<u64>,
}

impl AppState {
    pub fn new() -> Self {
        let mut settings = HashMap::new();
        
        // Initialize with default values
        settings.insert("launch_at_login".to_string(), serde_json::json!(true));
        settings.insert("start_timer".to_string(), serde_json::json!(false));
        settings.insert("session_duration".to_string(), serde_json::json!(defaults::DEFAULT_INTERVAL_DURATION));
        settings.insert("break_duration".to_string(), serde_json::json!(defaults::DEFAULT_BREAK_DURATION));
        settings.insert("pre_break_reminder_enabled".to_string(), serde_json::json!(true));
        settings.insert("pre_break_reminder_at".to_string(), serde_json::json!(defaults::BREAK_NOTIFICATION_AT));
        settings.insert("reset_timer_enabled".to_string(), serde_json::json!(true));
        settings.insert("toolbar_timer_style".to_string(), serde_json::json!("remaining"));
        settings.insert("long_break_enabled".to_string(), serde_json::json!(true));
        settings.insert("long_break_duration".to_string(), serde_json::json!(defaults::DEFAULT_LONG_BREAK_DURATION));
        settings.insert("long_break_after".to_string(), serde_json::json!(defaults::DEFAULT_LONG_BREAK_AFTER));
        settings.insert("short_break_count".to_string(), serde_json::json!(0u64));
        
        // Chime settings (OFF by default - non-intrusive)
        settings.insert("chime_enabled".to_string(), serde_json::json!(false));
        settings.insert("chime_on_session_start".to_string(), serde_json::json!(true));
        settings.insert("chime_on_break_start".to_string(), serde_json::json!(true));
        settings.insert("chime_on_break_end".to_string(), serde_json::json!(true));
        settings.insert("chime_on_reminder".to_string(), serde_json::json!(false));
        
        Self {
            session: Mutex::new(Session::default()),
            session_timer_handle: Mutex::new(None),
            timer_cancelled: Arc::new(Mutex::new(false)),
            settings: Mutex::new(settings),
            short_break_count: Mutex::new(0),
        }
    }
    
    /// Get a setting value
    pub fn get_setting(&self, key: &str) -> Option<serde_json::Value> {
        self.settings.lock().get(key).cloned()
    }
    
    /// Set a setting value
    pub fn set_setting(&self, key: &str, value: serde_json::Value) {
        self.settings.lock().insert(key.to_string(), value);
    }
    
    /// Get a setting as boolean
    pub fn get_setting_bool(&self, key: &str) -> bool {
        self.settings
            .lock()
            .get(key)
            .and_then(|v| v.as_bool())
            .unwrap_or(false)
    }
    
    /// Get a setting as u64
    pub fn get_setting_u64(&self, key: &str) -> u64 {
        self.settings
            .lock()
            .get(key)
            .and_then(|v| v.as_u64())
            .unwrap_or(0)
    }
    
    /// Get a setting as string
    pub fn get_setting_string(&self, key: &str) -> String {
        self.settings
            .lock()
            .get(key)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string()
    }
    
    /// Get current session
    pub fn get_session(&self) -> Session {
        self.session.lock().clone()
    }
    
    /// Update session
    pub fn update_session<F>(&self, f: F)
    where
        F: FnOnce(&mut Session),
    {
        let mut session = self.session.lock();
        f(&mut session);
    }
    
    /// Reset session
    pub fn reset_session(&self) {
        let mut session = self.session.lock();
        *session = Session::default();
    }
    
    /// Check if session is active (has end_time and not paused)
    pub fn is_session_active(&self) -> bool {
        let session = self.session.lock();
        session.end_time.is_some() && !session.paused
    }
    
    /// Get short break count
    pub fn get_short_break_count(&self) -> u64 {
        *self.short_break_count.lock()
    }
    
    /// Increment short break count
    pub fn increment_short_break_count(&self) {
        let mut count = self.short_break_count.lock();
        *count += 1;
    }
    
    /// Reset short break count
    pub fn reset_short_break_count(&self) {
        *self.short_break_count.lock() = 0;
    }
    
    /// Cancel the current timer
    pub fn cancel_timer(&self) {
        *self.timer_cancelled.lock() = true;
        if let Some(handle) = self.session_timer_handle.lock().take() {
            handle.abort();
        }
    }
    
    /// Reset timer cancellation flag
    pub fn reset_timer_cancelled(&self) {
        *self.timer_cancelled.lock() = false;
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
