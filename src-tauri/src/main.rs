// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod power_monitor;
mod state;
mod tray;
mod utils;

use state::AppState;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .manage(AppState::new())
        .setup(|app| {
            // Initialize the system tray
            tray::create_tray(app)?;
            
            // Initialize power monitor (lock/unlock detection)
            power_monitor::init(app.handle().clone());
            
            // Check if we should start timer automatically
            let state = app.state::<AppState>();
            if state.get_setting_bool("start_timer") {
                let app_handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    commands::start_session_internal(&app_handle, None, false).await;
                });
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_setting,
            commands::set_setting,
            commands::get_session_state,
            commands::start_session,
            commands::resume_session,
            commands::pause_session,
            commands::end_session,
            commands::end_break,
            commands::skip_break,
            commands::snooze_break,
            commands::take_break_now,
            commands::close_break_windows,
            commands::add_time,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let label = window.label();
                if label == "main" || label == "settings" || label == "dashboard" {
                    // Hide dock icon on macOS when settings window is closed
                    #[cfg(target_os = "macos")]
                    {
                        let app = window.app_handle();
                        let _ = app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                    }
                    window.hide().unwrap();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

