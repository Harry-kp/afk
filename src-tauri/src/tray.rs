use crate::commands;
use crate::state::AppState;
use crate::utils::get_tray_time;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder},
    tray::TrayIconBuilder,
    AppHandle, Manager, Runtime,
};

const TRAY_ID: &str = "main-tray";

/// Create the system tray
pub fn create_tray<R: Runtime>(app: &tauri::App<R>) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle();
    
    // Build the tray menu (initial state: idle)
    let menu = build_tray_menu(handle, false, false, false)?;
    
    // Create tray with emoji title only - clicking shows menu (default behavior)
    let _tray = TrayIconBuilder::with_id(TRAY_ID)
        .title("👀")
        .menu(&menu)
        .show_menu_on_left_click(true) // Show menu on left click instead of custom action
        .tooltip("AFK")
        .on_menu_event(move |app, event| {
            handle_menu_event(app, event.id.as_ref());
        })
        .build(app)?;
    
    Ok(())
}

/// Build the tray menu based on app state
fn build_tray_menu<R: Runtime>(
    app: &AppHandle<R>,
    session_active: bool,
    session_paused: bool,
    is_on_break: bool,
) -> Result<tauri::menu::Menu<R>, Box<dyn std::error::Error>> {
    let menu = MenuBuilder::new(app);
    
    // ON BREAK: Show break-specific options only
    if is_on_break {
        let skip_item = MenuItemBuilder::with_id("skip_break", "Skip this break").build(app)?;
        let menu = menu.item(&skip_item);
        
        let snooze_item = MenuItemBuilder::with_id("snooze_break", "Snooze (5 minutes)").build(app)?;
        let menu = menu.item(&snooze_item);
        
        let separator = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator);
        
        let end_session = MenuItemBuilder::with_id("end_session", "End session").build(app)?;
        let menu = menu.item(&end_session);
        
        let separator2 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator2);
        
        let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
        let menu = menu.item(&quit);
        
        return Ok(menu.build()?);
    }
    
    // IDLE: No session active
    if !session_active && !session_paused {
        let start_item = MenuItemBuilder::with_id("start_session", "Start session").build(app)?;
        let menu = menu.item(&start_item);
        
        let separator = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator);
        
        let dashboard = MenuItemBuilder::with_id("dashboard", "Dashboard").build(app)?;
        let menu = menu.item(&dashboard);
        
        let separator2 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator2);
        
        let settings = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
        let menu = menu.item(&settings);
        
        let separator3 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator3);
        
        let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
        let menu = menu.item(&quit);
        
        return Ok(menu.build()?);
    }
    
    // PAUSED: Session is paused
    if session_paused {
        let resume_item = MenuItemBuilder::with_id("resume_session", "Resume session").build(app)?;
        let menu = menu.item(&resume_item);
        
        let separator = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator);
        
        let end_session = MenuItemBuilder::with_id("end_session", "End session").build(app)?;
        let menu = menu.item(&end_session);
        
        let separator2 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator2);
        
        let dashboard = MenuItemBuilder::with_id("dashboard", "Dashboard").build(app)?;
        let menu = menu.item(&dashboard);
        
        let separator3 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator3);
        
        let settings = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
        let menu = menu.item(&settings);
        
        let separator4 = PredefinedMenuItem::separator(app)?;
        let menu = menu.item(&separator4);
        
        let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
        let menu = menu.item(&quit);
        
        return Ok(menu.build()?);
    }
    
    // SESSION ACTIVE: Working, waiting for break
    let break_submenu = SubmenuBuilder::with_id(app, "break_menu", "Your break begins in ...")
        .item(&MenuItemBuilder::with_id("take_break_now", "Start this break now").build(app)?)
        .separator()
        .item(&MenuItemBuilder::with_id("add_1_min", "Add 1 minute").build(app)?)
        .item(&MenuItemBuilder::with_id("add_5_min", "Add 5 minutes").build(app)?)
        .separator()
        .item(&MenuItemBuilder::with_id("pause_session", "Pause session").build(app)?)
        .item(&MenuItemBuilder::with_id("skip_break", "Skip this break").build(app)?)
        .build()?;
    
    let menu = menu.item(&break_submenu);
    
    let separator = PredefinedMenuItem::separator(app)?;
    let menu = menu.item(&separator);
    
    let end_session = MenuItemBuilder::with_id("end_session", "End session").build(app)?;
    let menu = menu.item(&end_session);
    
    let separator2 = PredefinedMenuItem::separator(app)?;
    let menu = menu.item(&separator2);
    
    let dashboard = MenuItemBuilder::with_id("dashboard", "Dashboard").build(app)?;
    let menu = menu.item(&dashboard);
    
    let separator3 = PredefinedMenuItem::separator(app)?;
    let menu = menu.item(&separator3);
    
    let settings = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
    let menu = menu.item(&settings);
    
    let separator4 = PredefinedMenuItem::separator(app)?;
    let menu = menu.item(&separator4);
    
    let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
    let menu = menu.item(&quit);
    
    Ok(menu.build()?)
}

/// Handle menu item clicks
fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, id: &str) {
    let app_clone = app.clone();
    
    match id {
        "start_session" => {
            tauri::async_runtime::spawn(async move {
                commands::start_session_internal(&app_clone, None, false).await;
            });
        }
        "resume_session" => {
            tauri::async_runtime::spawn(async move {
                commands::start_session_internal(&app_clone, None, true).await;
            });
        }
        "pause_session" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::pause_session(app_clone).await;
            });
        }
        "end_session" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::end_session(app_clone).await;
            });
        }
        "take_break_now" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::take_break_now(app_clone).await;
            });
        }
        "skip_break" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::skip_break(app_clone).await;
            });
        }
        "snooze_break" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::snooze_break(app_clone).await;
            });
        }
        "add_1_min" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::add_time(app_clone, 60).await;
            });
        }
        "add_5_min" => {
            tauri::async_runtime::spawn(async move {
                let _ = commands::add_time(app_clone, 300).await;
            });
        }
        "dashboard" => {
            commands::show_settings_window(app, true);
        }
        "settings" => {
            commands::show_settings_window(app, false);
        }
        "quit" => {
            // Reset session and clear break state before quitting
            let state = app.state::<AppState>();
            state.reset_session();
            state.set_on_break(false);
            app.exit(0);
        }
        _ => {}
    }
}

/// Update the tray menu based on session state
pub fn update_tray_menu<R: Runtime>(
    app: &AppHandle<R>, 
    session_active: bool, 
    session_paused: bool,
    is_on_break: bool,
) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        if let Ok(menu) = build_tray_menu(app, session_active, session_paused, is_on_break) {
            let _ = tray.set_menu(Some(menu));
        }
    }
}

/// Update the tray title with remaining time
pub fn update_tray_title<R: Runtime>(app: &AppHandle<R>, remaining_secs: i64) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let state = app.state::<AppState>();
        let show_elapsed = state.get_setting_string("toolbar_timer_style") == "elapsed";
        
        let time_string = if show_elapsed {
            // Calculate elapsed time
            let session = state.get_session();
            if let Some(start_time) = &session.start_time {
                if let Ok(start) = chrono::DateTime::parse_from_rfc3339(start_time) {
                    let elapsed = (chrono::Utc::now() - start.with_timezone(&chrono::Utc)).num_seconds();
                    format!("{} elapsed", get_tray_time(elapsed))
                } else {
                    format!("{} left", get_tray_time(remaining_secs))
                }
            } else {
                format!("{} left", get_tray_time(remaining_secs))
            }
        } else {
            format!("{} left", get_tray_time(remaining_secs))
        };
        
        let _ = tray.set_title(Some(&time_string));
    }
}

/// Set a custom tray title
pub fn set_tray_title<R: Runtime>(app: &AppHandle<R>, title: &str) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        // Prepend emoji to the title
        let full_title = format!("👀 {}", title);
        let _ = tray.set_title(Some(&full_title));
    }
}

/// Clear the tray title (reset to just emoji)
pub fn clear_tray_title<R: Runtime>(app: &AppHandle<R>) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let _ = tray.set_title(Some("👀"));
    }
}

