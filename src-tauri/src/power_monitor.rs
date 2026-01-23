use crate::commands;
use crate::state::AppState;
use tauri::{AppHandle, Manager};

/// Initialize power monitor to detect lock/unlock events
pub fn init(app: AppHandle) {
    #[cfg(target_os = "macos")]
    init_macos(app);
    
    #[cfg(target_os = "windows")]
    init_windows(app);
    
    #[cfg(target_os = "linux")]
    init_linux(app);
}

/// macOS implementation using polling
#[cfg(target_os = "macos")]
fn init_macos(app: AppHandle) {
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
                let is_locked = stdout.contains("CGSSessionScreenIsLocked")
                    && stdout.contains("<true/>");
                
                if is_locked && !was_locked {
                    // Screen just locked - pause session
                    on_lock(&app);
                    was_locked = true;
                } else if !is_locked && was_locked {
                    // Screen just unlocked - resume session
                    on_unlock(&app);
                    was_locked = false;
                }
            }
        }
    });
}

/// Windows implementation
#[cfg(target_os = "windows")]
fn init_windows(app: AppHandle) {
    // Windows implementation would use WTSRegisterSessionNotification
    // For now, we'll use a simple polling approach
    std::thread::spawn(move || {
        let _ = app; // Suppress unused variable warning
        loop {
            std::thread::sleep(std::time::Duration::from_secs(30));
            // Check session state and handle accordingly
        }
    });
}

/// Linux implementation
#[cfg(target_os = "linux")]
fn init_linux(app: AppHandle) {
    // Linux implementation would use D-Bus to monitor logind
    std::thread::spawn(move || {
        let _ = app; // Suppress unused variable warning
        loop {
            std::thread::sleep(std::time::Duration::from_secs(30));
        }
    });
}

/// Called when screen is locked
#[allow(dead_code)]
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
#[allow(dead_code)]
fn on_unlock(app: &AppHandle) {
    let state = app.state::<AppState>();
    let session = state.get_session();
    
    // Only resume if session was paused
    if session.paused {
        // Calculate how long it was paused
        let paused_since_secs = if let Some(paused_at) = &session.paused_at {
            if let Ok(paused_time) = chrono::DateTime::parse_from_rfc3339(paused_at) {
                (chrono::Utc::now() - paused_time.with_timezone(&chrono::Utc)).num_seconds()
            } else {
                0
            }
        } else {
            0
        };
        
        // Clear paused_at
        state.update_session(|s| {
            s.paused_at = None;
        });
        
        let app_clone = app.clone();
        tauri::async_runtime::spawn(async move {
            // If paused for more than 5 minutes, reset the timer
            if paused_since_secs >= 5 * 60 {
                let state = app_clone.state::<AppState>();
                state.reset_short_break_count();
                // Start fresh session
                commands::start_session_internal(&app_clone, None, false).await;
            } else {
                // Resume from paused state
                commands::start_session_internal(&app_clone, None, true).await;
            }
        });
    }
}
