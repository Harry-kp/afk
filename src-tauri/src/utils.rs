use crate::state::AppState;
use chrono::Utc;
use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
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

    if minutes >= 1 {
        format!("{}m", minutes)
    } else {
        format!("{}s", duration_in_seconds % 60)
    }
}

/// Get current time as ISO 8601 string
pub fn now_iso() -> String {
    Utc::now().to_rfc3339()
}

/// Seconds remaining until `end_time` (RFC 3339). 0 if it cannot be parsed.
pub fn calculate_remaining_secs(end_time: &str) -> i64 {
    chrono::DateTime::parse_from_rfc3339(end_time)
        .map(|end| (end.with_timezone(&Utc) - Utc::now()).num_milliseconds() / 1000)
        .unwrap_or(0)
}

/// Play chime for a specific event (checks settings)
pub fn play_chime_for_event<R: Runtime>(app: &AppHandle<R>, event: ChimeEvent) {
    let state = app.state::<AppState>();

    // Both the master toggle and the per-event toggle must be on
    if !state.get_setting_bool("chime_enabled") || !state.get_setting_bool(event.setting_key()) {
        return;
    }

    // Play at full volume (user can control system volume)
    play_chime(app);
}

/// Play chime sound
fn play_chime<R: Runtime>(app: &AppHandle<R>) {
    let Ok(resource_dir) = app.path().resource_dir() else {
        return;
    };
    let path = resource_dir.join("resources").join("chime.mp3");

    std::thread::spawn(move || {
        if let Ok((_stream, stream_handle)) = OutputStream::try_default() {
            if let Ok(file) = File::open(&path) {
                if let Ok(source) = Decoder::new(BufReader::new(file)) {
                    if let Ok(sink) = Sink::try_new(&stream_handle) {
                        sink.append(source);
                        sink.sleep_until_end();
                    }
                }
            }
        }
    });
}
