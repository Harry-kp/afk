use tauri::{App, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

use crate::commands;
use crate::state::AppState;

/// Register global keyboard shortcuts
pub fn register_shortcuts(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    
    // Register shortcuts using the global shortcut plugin
    app.handle().plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |_app, shortcut, event| {
                if event.state() != ShortcutState::Pressed {
                    return;
                }
                
                let app_handle = _app.clone();
                let shortcut_str = shortcut.to_string();
                
                // Handle different shortcuts
                tauri::async_runtime::spawn(async move {
                    handle_shortcut(&app_handle, &shortcut_str).await;
                });
            })
            .build()
    )?;
    
    // Register the shortcuts
    // Cmd+Shift+B - Take break now
    if let Ok(shortcut) = "CommandOrControl+Shift+B".parse::<Shortcut>() {
        let _ = app.global_shortcut().register(shortcut);
    }
    
    // Cmd+Shift+P - Pause/Resume
    if let Ok(shortcut) = "CommandOrControl+Shift+P".parse::<Shortcut>() {
        let _ = app.global_shortcut().register(shortcut);
    }
    
    // Cmd+Shift+S - Skip break
    if let Ok(shortcut) = "CommandOrControl+Shift+S".parse::<Shortcut>() {
        let _ = app.global_shortcut().register(shortcut);
    }
    
    // Cmd+Shift+N - Start new session
    if let Ok(shortcut) = "CommandOrControl+Shift+N".parse::<Shortcut>() {
        let _ = app.global_shortcut().register(shortcut);
    }
    
    println!("Global shortcuts registered");
    
    Ok(())
}

/// Handle a triggered shortcut
async fn handle_shortcut<R: tauri::Runtime>(app: &tauri::AppHandle<R>, shortcut: &str) {
    let state = app.state::<AppState>();
    
    match shortcut {
        s if s.contains("Shift+B") || s.contains("Shift+b") => {
            // Take break now
            if state.is_session_active() {
                let _ = commands::take_break_now(app.clone()).await;
            }
        }
        s if s.contains("Shift+P") || s.contains("Shift+p") => {
            // Pause/Resume toggle
            let session = state.get_session();
            if session.paused {
                let _ = commands::resume_session(app.clone()).await;
            } else if session.end_time.is_some() {
                let _ = commands::pause_session(app.clone()).await;
            }
        }
        s if s.contains("Shift+S") || s.contains("Shift+s") => {
            // Skip break (if on break) or skip upcoming break
            if state.is_on_break() {
                let _ = commands::skip_break(app.clone()).await;
            }
        }
        s if s.contains("Shift+N") || s.contains("Shift+n") => {
            // Start new session
            if !state.is_session_active() && !state.is_on_break() {
                let _ = commands::start_session(app.clone()).await;
            }
        }
        _ => {}
    }
}

