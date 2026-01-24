use crate::state::AppState;
use chrono::{DateTime, Utc};
use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

/// Chime event types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ChimeEvent {
    SessionStart,
    BreakStart,
    BreakEnd,
    Reminder,
}

impl ChimeEvent {
    /// Get the setting key for this event
    fn setting_key(&self) -> &'static str {
        match self {
            ChimeEvent::SessionStart => "chime_on_session_start",
            ChimeEvent::BreakStart => "chime_on_break_start",
            ChimeEvent::BreakEnd => "chime_on_break_end",
            ChimeEvent::Reminder => "chime_on_reminder",
        }
    }
}

/// Format duration for tray display (compact: "24m" or "45s")
/// Shows minutes if >= 1 minute, seconds only when < 1 minute
pub fn get_tray_time(duration_in_seconds: i64) -> String {
    if duration_in_seconds < 0 {
        return "0s".to_string();
    }
    
    let minutes = duration_in_seconds / 60;
    let seconds = duration_in_seconds % 60;
    
    if minutes >= 1 {
        format!("{}m", minutes)
    } else {
        format!("{}s", seconds)
    }
}

/// Parse an ISO 8601 date string to DateTime<Utc>
pub fn parse_iso_date(date_str: &str) -> Option<DateTime<Utc>> {
    DateTime::parse_from_rfc3339(date_str)
        .ok()
        .map(|dt| dt.with_timezone(&Utc))
}

/// Get current time as ISO 8601 string
pub fn now_iso() -> String {
    Utc::now().to_rfc3339()
}

/// Calculate remaining time in milliseconds from end_time
pub fn calculate_remaining_ms(end_time: &str) -> i64 {
    if let Some(end) = parse_iso_date(end_time) {
        let now = Utc::now();
        (end - now).num_milliseconds()
    } else {
        0
    }
}

/// Calculate remaining time in seconds from end_time
pub fn calculate_remaining_secs(end_time: &str) -> i64 {
    calculate_remaining_ms(end_time) / 1000
}

/// Play chime for a specific event (checks settings)
pub fn play_chime_for_event<R: Runtime>(app: &AppHandle<R>, event: ChimeEvent) {
    let state = app.state::<AppState>();
    
    // Check master toggle
    if !state.get_setting_bool("chime_enabled") {
        return;
    }
    
    // Check event-specific toggle
    if !state.get_setting_bool(event.setting_key()) {
        return;
    }
    
    // Play at full volume (user can control system volume)
    play_chime(app);
}

/// Play chime sound
fn play_chime<R: Runtime>(app: &AppHandle<R>) {
    let resource_path = get_resource_path(app, "chime.mp3");
    
    if let Some(path) = resource_path {
        std::thread::spawn(move || {
            if let Ok((_stream, stream_handle)) = OutputStream::try_default() {
                if let Ok(file) = File::open(&path) {
                    let buf_reader = BufReader::new(file);
                    if let Ok(source) = Decoder::new(buf_reader) {
                        if let Ok(sink) = Sink::try_new(&stream_handle) {
                            sink.append(source);
                            sink.sleep_until_end();
                        }
                    }
                }
            }
        });
    }
}

/// Get the path to a resource file
pub fn get_resource_path<R: Runtime>(app: &AppHandle<R>, filename: &str) -> Option<PathBuf> {
    app.path()
        .resource_dir()
        .ok()
        .map(|dir| dir.join("resources").join(filename))
}
