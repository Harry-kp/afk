use crate::commands;
use crate::state::AppState;
use tauri::{AppHandle, Manager};

/// Watch for screen lock/unlock to pause and resume the session.
/// macOS only - other platforms just run without it.
#[cfg(not(target_os = "macos"))]
pub fn init(_app: AppHandle) {}

#[cfg(target_os = "macos")]
pub fn init(app: AppHandle) {
    std::thread::spawn(move || {
        let mut was_locked = false;

        loop {
            std::thread::sleep(std::time::Duration::from_secs(5));

            // Check screen saver/lock state using ioreg
            let output = std::process::Command::new("ioreg")
                .args(["-n", "Root", "-d1", "-a"])
                .output();

            if let Ok(output) = output {
                let stdout = String::from_utf8_lossy(&output.stdout);
                let is_locked =
                    stdout.contains("CGSSessionScreenIsLocked") && stdout.contains("<true/>");

                if is_locked && !was_locked {
                    on_lock(&app);
                    was_locked = true;
                } else if !is_locked && was_locked {
                    on_unlock(&app);
                    was_locked = false;
                }
            }
        }
    });
}

/// Called when screen is locked
#[cfg(target_os = "macos")]
fn on_lock(app: &AppHandle) {
    let state = app.state::<AppState>();

    // Only pause if session is active
    if state.is_session_active() {
        let app_clone = app.clone();
        tauri::async_runtime::spawn(async move {
            let _ = commands::pause_session(app_clone).await;
        });
    }
}

/// Called when screen is unlocked
#[cfg(target_os = "macos")]
fn on_unlock(app: &AppHandle) {
    let state = app.state::<AppState>();
    let session = state.get_session();

    // Only resume if session was paused
    if !session.paused {
        return;
    }

    // How long it sat paused
    let paused_since_secs = session
        .paused_at
        .as_deref()
        .and_then(|at| chrono::DateTime::parse_from_rfc3339(at).ok())
        .map(|at| (chrono::Utc::now() - at.with_timezone(&chrono::Utc)).num_seconds())
        .unwrap_or(0);

    state.update_session(|s| {
        s.paused_at = None;
    });

    let app_clone = app.clone();
    tauri::async_runtime::spawn(async move {
        // Paused for more than 5 minutes - start over instead of resuming
        if paused_since_secs >= 5 * 60 {
            app_clone.state::<AppState>().reset_short_break_count();
            commands::start_session_internal(&app_clone, None, false).await;
        } else {
            commands::start_session_internal(&app_clone, None, true).await;
        }
    });
}
