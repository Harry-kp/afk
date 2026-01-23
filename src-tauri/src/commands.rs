use crate::state::AppState;
use crate::tray;
use crate::utils::{calculate_remaining_secs, now_iso, play_chime_for_event, ChimeEvent};
use chrono::{Duration, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::sync::Arc;
use tauri::{AppHandle, Manager, Runtime, State, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_notification::NotificationExt;

/// Session state for frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionStateResponse {
    pub is_active: bool,
    pub is_paused: bool,
    pub end_time: Option<String>,
    pub remaining_secs: i64,
    pub short_break_count: u64,
}

/// Get the current session state
#[tauri::command]
pub async fn get_session_state(state: State<'_, AppState>) -> Result<SessionStateResponse, String> {
    let session = state.get_session();
    let is_paused = session.paused;
    let is_active = session.end_time.is_some() && !is_paused;
    
    let remaining_secs = if let Some(ref end_time) = session.end_time {
        if is_paused {
            // Use stored remaining time when paused
            session.remaining_time
                .as_ref()
                .and_then(|r| r.parse::<i64>().ok())
                .map(|ms| ms / 1000)
                .unwrap_or(0)
        } else {
            calculate_remaining_secs(end_time)
        }
    } else {
        0
    };
    
    Ok(SessionStateResponse {
        is_active,
        is_paused,
        end_time: session.end_time,
        remaining_secs,
        short_break_count: state.get_short_break_count(),
    })
}

/// Get a setting value from the store
#[tauri::command]
pub async fn get_setting(key: String, state: State<'_, AppState>) -> Result<Value, String> {
    // First check in-memory cache
    if let Some(value) = state.get_setting(&key) {
        return Ok(value);
    }
    
    // Return null if not found
    Ok(Value::Null)
}

/// Set a setting value in the store
#[tauri::command]
pub async fn set_setting<R: Runtime>(
    app: AppHandle<R>,
    key: String,
    value: Value,
    state: State<'_, AppState>,
) -> Result<(), String> {
    // Handle special cases
    match key.as_str() {
        "session_duration" => {
            // Only add time if there's an active session
            let session = state.get_session();
            if session.end_time.is_some() && !session.paused {
                if let Some(new_duration) = value.as_u64() {
                    let prev_duration = state.get_setting_u64("session_duration");
                    let diff = new_duration as i64 - prev_duration as i64;
                    if diff > 0 {
                        // Add additional time to current session (no chime)
                        let _ = add_time(app.clone(), diff as u64).await;
                    }
                }
            }
        }
        "launch_at_login" => {
            if let Some(enabled) = value.as_bool() {
                // Handle autostart setting
                #[cfg(not(target_os = "linux"))]
                {
                    use tauri_plugin_autostart::ManagerExt;
                    let autostart = app.autolaunch();
                    if enabled {
                        let _ = autostart.enable();
                    } else {
                        let _ = autostart.disable();
                    }
                }
            }
        }
        _ => {}
    }
    
    // Update in-memory cache
    state.set_setting(&key, value);
    
    Ok(())
}

/// Start a new session (plays chime if enabled)
#[tauri::command]
pub async fn start_session<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    play_chime_for_event(&app, ChimeEvent::SessionStart);
    start_session_internal(&app, None, false).await;
    Ok(())
}

/// Resume a paused session (no chime)
#[tauri::command]
pub async fn resume_session<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<AppState>();
    let session = state.get_session();
    
    // Only resume if paused
    if !session.paused {
        return Ok(());
    }
    
    // Resume from remaining time (no chime)
    start_session_internal(&app, None, true).await;
    Ok(())
}

/// Add time to current session
#[tauri::command]
pub async fn add_time<R: Runtime>(app: AppHandle<R>, seconds: u64) -> Result<(), String> {
    let state = app.state::<AppState>();
    let session = state.get_session();
    
    // Only add time if session is active (not paused)
    if session.end_time.is_none() || session.paused {
        return Ok(());
    }
    
    if let Some(end_time) = &session.end_time {
        let remaining = calculate_remaining_secs(end_time);
        let new_duration_ms = ((remaining + seconds as i64) * 1000).max(0);
        
        let new_end_time = Utc::now() + Duration::milliseconds(new_duration_ms);
        state.update_session(|s| {
            s.end_time = Some(new_end_time.to_rfc3339());
        });
    }
    
    Ok(())
}

/// Internal function to start session (used by both command and tray)
pub async fn start_session_internal<R: Runtime>(
    app: &AppHandle<R>, 
    custom_duration_secs: Option<u64>,
    is_resume: bool,
) {
    let state = app.state::<AppState>();
    
    // Cancel any existing timer
    state.cancel_timer();
    state.reset_timer_cancelled();
    
    // Calculate session duration
    let final_duration_ms: i64;
    let session = state.get_session();
    
    if is_resume {
        // Resume from stored remaining time
        if let Some(remaining) = &session.remaining_time {
            if let Ok(remaining_ms) = remaining.parse::<i64>() {
                final_duration_ms = remaining_ms;
            } else {
                final_duration_ms = (state.get_setting_u64("session_duration") * 1000) as i64;
            }
        } else {
            final_duration_ms = (state.get_setting_u64("session_duration") * 1000) as i64;
        }
    } else if let Some(custom_secs) = custom_duration_secs {
        // Custom duration (for snooze, etc.)
        final_duration_ms = (custom_secs * 1000) as i64;
    } else {
        // Default session duration
        final_duration_ms = (state.get_setting_u64("session_duration") * 1000) as i64;
    }
    
    // Set session end time
    let end_time = Utc::now() + Duration::milliseconds(final_duration_ms);
    let end_time_str = end_time.to_rfc3339();
    
    state.update_session(|s| {
        s.end_time = Some(end_time_str.clone());
        s.paused = false;
        s.remaining_time = None;
        s.paused_at = None;
        if !is_resume {
            s.start_time = Some(now_iso());
        }
    });
    
    // Update tray
    tray::update_tray_menu(app, true, false);
    
    // Start the timer task
    let app_handle = app.clone();
    let timer_cancelled = Arc::clone(&state.timer_cancelled);
    
    let handle = tauri::async_runtime::spawn(async move {
        loop {
            if *timer_cancelled.lock() {
                break;
            }
            
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            
            if *timer_cancelled.lock() {
                break;
            }
            
            let state = app_handle.state::<AppState>();
            let session = state.get_session();
            
            if let Some(end_time) = &session.end_time {
                let remaining_secs = calculate_remaining_secs(end_time);
                
                // Update tray title
                tray::update_tray_title(&app_handle, remaining_secs);
                
                // Check for pre-break notification
                let pre_break_enabled = state.get_setting_bool("pre_break_reminder_enabled");
                let pre_break_at = state.get_setting_u64("pre_break_reminder_at") as i64;
                
                if pre_break_enabled && remaining_secs == pre_break_at {
                    let mins = pre_break_at / 60;
                    let title = if mins >= 1 {
                        format!("Only {} min left", mins)
                    } else {
                        "Less than a minute left".to_string()
                    };
                    
                    // Play reminder chime (if enabled)
                    play_chime_for_event(&app_handle, ChimeEvent::Reminder);
                    
                    let _ = app_handle
                        .notification()
                        .builder()
                        .title(&title)
                        .body("Time to go AFK! 🍺")
                        .show();
                }
                
                // Check if break time
                if remaining_secs <= 0 {
                    // Time for a break!
                    tray::update_tray_menu(&app_handle, false, false);
                    tray::clear_tray_title(&app_handle);
                    
                    play_chime_for_event(&app_handle, ChimeEvent::BreakStart);
                    create_break_windows(&app_handle).await;
                    break;
                }
            } else {
                break;
            }
        }
    });
    
    *state.session_timer_handle.lock() = Some(handle);
}

/// Pause the current session
#[tauri::command]
pub async fn pause_session<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<AppState>();
    
    // Cancel the timer
    state.cancel_timer();
    
    // Save remaining time
    let session = state.get_session();
    if let Some(end_time) = &session.end_time {
        let remaining_ms = calculate_remaining_secs(end_time) * 1000;
        state.update_session(|s| {
            s.remaining_time = Some(remaining_ms.to_string());
            s.paused = true;
            s.paused_at = Some(now_iso());
        });
    }
    
    // Update tray
    tray::update_tray_menu(&app, false, true);
    tray::set_tray_title(&app, "Session paused");
    
    Ok(())
}

/// End the current session
#[tauri::command]
pub async fn end_session<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<AppState>();
    
    // Cancel the timer
    state.cancel_timer();
    
    // Reset session
    state.reset_session();
    
    // Update tray
    tray::update_tray_menu(&app, false, false);
    tray::clear_tray_title(&app);
    
    Ok(())
}

/// End the break and start a new session
#[tauri::command]
pub async fn end_break<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    // Close break windows first
    close_break_windows_internal(&app);
    
    // Start new session (chime for break end)
    play_chime_for_event(&app, ChimeEvent::BreakEnd);
    start_session_internal(&app, None, false).await;
    
    Ok(())
}

/// Skip the current break and start new session
#[tauri::command]
pub async fn skip_break<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<AppState>();
    let session_duration = state.get_setting_u64("session_duration");
    
    // Start new session first (no chime for skip)
    start_session_internal(&app, Some(session_duration), false).await;
    
    // Then close break windows
    close_break_windows_internal(&app);
    
    Ok(())
}

/// Snooze the break for 5 minutes
#[tauri::command]
pub async fn snooze_break<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    // Close break windows
    close_break_windows_internal(&app);
    
    // Start a 5-minute session (no chime)
    start_session_internal(&app, Some(300), false).await;
    
    Ok(())
}

/// Take a break immediately
#[tauri::command]
pub async fn take_break_now<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<AppState>();
    
    // Cancel the timer
    state.cancel_timer();
    
    // Update tray
    tray::update_tray_menu(&app, false, false);
    tray::clear_tray_title(&app);
    
    // Play chime (break starting) and create break window
    play_chime_for_event(&app, ChimeEvent::BreakStart);
    create_break_windows(&app).await;
    
    Ok(())
}

/// Close all break windows (internal helper)
fn close_break_windows_internal<R: Runtime>(app: &AppHandle<R>) {
    for (label, window) in app.webview_windows() {
        if label.starts_with("break") {
            let _ = window.close();
        }
    }
}

/// Close all break windows (command)
#[tauri::command]
pub async fn close_break_windows<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    close_break_windows_internal(&app);
    Ok(())
}

/// Create break windows on all displays
pub async fn create_break_windows<R: Runtime>(app: &AppHandle<R>) {
    let state = app.state::<AppState>();
    
    // Determine if this is a long break
    let long_break_enabled = state.get_setting_bool("long_break_enabled");
    let long_break_after = state.get_setting_u64("long_break_after");
    let short_break_count = state.get_short_break_count();
    
    // Long break triggers when count reaches threshold
    let is_long_break = long_break_enabled && short_break_count + 1 >= long_break_after;
    
    if is_long_break {
        // Reset counter after long break
        state.reset_short_break_count();
    } else {
        // Increment counter for short breaks
        state.increment_short_break_count();
    }
    
    // Reset session state (break is starting)
    state.reset_session();
    
    // Show "On break" in tray instead of timer
    tray::set_tray_title(app, "On break");
    
    // Get all monitors
    let monitors = app.available_monitors().unwrap_or_default();
    
    let break_type = if is_long_break { "long-break" } else { "break" };
    let url = format!("index.html?{}", break_type);
    
    for (i, monitor) in monitors.iter().enumerate() {
        let label = format!("break_{}", i);
        let position = monitor.position();
        let size = monitor.size();
        
        let window = WebviewWindowBuilder::new(
            app,
            &label,
            WebviewUrl::App(url.clone().into()),
        )
        .title("break")
        .inner_size(size.width as f64, size.height as f64)
        .position(position.x as f64, position.y as f64)
        .fullscreen(true)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .focused(true);
        
        if let Ok(window) = window.build() {
            let _ = window.show();
        }
    }
}

/// Show the settings/dashboard window
pub fn show_settings_window<R: Runtime>(app: &AppHandle<R>, open_dashboard: bool) {
    // Use "main" window for dashboard, create "settings" only if needed
    let label = if open_dashboard { "main" } else { "settings" };
    
    // Check if window already exists
    if let Some(window) = app.get_webview_window(label) {
        // Show dock icon on macOS
        #[cfg(target_os = "macos")]
        {
            let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
        }
        
        let _ = window.show();
        let _ = window.set_focus();
        return;
    }
    
    // For settings, we might need to create a new window
    if !open_dashboard {
        let url = "index.html?settings";
        let window = WebviewWindowBuilder::new(
            app,
            "settings",
            WebviewUrl::App(url.into()),
        )
        .title("Settings")
        .inner_size(1024.0, 728.0)
        .resizable(false)
        .center();
        
        if let Ok(window) = window.build() {
            // Show dock icon on macOS
            #[cfg(target_os = "macos")]
            {
                let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
            }
            
            let _ = window.show();
        }
    }
}
