use crate::commands;
use crate::state::AppState;
use crate::utils::get_tray_time;
use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
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
    TrayIconBuilder::with_id(TRAY_ID)
        .title("👀")
        .menu(&menu)
        .show_menu_on_left_click(true)
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

    // ON BREAK: break-specific options only
    if is_on_break {
        return Ok(menu
            .text("skip_break", "Skip this break")
            .text("snooze_break", "Snooze (5 minutes)")
            .separator()
            .text("end_session", "End session")
            .separator()
            .text("quit", "Quit")
            .build()?);
    }

    // The top of the menu depends on whether a session is running
    let menu = if session_paused {
        menu.text("resume_session", "Resume session")
            .separator()
            .text("end_session", "End session")
    } else if session_active {
        let break_menu = SubmenuBuilder::with_id(app, "break_menu", "Your break begins in ...")
            .text("take_break_now", "Start this break now")
            .separator()
            .text("add_1_min", "Add 1 minute")
            .text("add_5_min", "Add 5 minutes")
            .separator()
            .text("pause_session", "Pause session")
            .text("skip_break", "Skip this break")
            .build()?;

        menu.item(&break_menu)
            .separator()
            .text("end_session", "End session")
    } else {
        menu.text("start_session", "Start session")
    };

    Ok(menu
        .separator()
        .text("dashboard", "Dashboard")
        .separator()
        .text("settings", "Settings")
        .separator()
        .text("quit", "Quit")
        .build()?)
}

/// Handle menu item clicks
fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, id: &str) {
    // Dashboard/settings/quit act on the app handle directly; the rest are async
    match id {
        "dashboard" => return commands::show_settings_window(app, true),
        "settings" => return commands::show_settings_window(app, false),
        "quit" => {
            // Reset session and clear break state before quitting
            let state = app.state::<AppState>();
            state.reset_session();
            state.set_on_break(false);
            return app.exit(0);
        }
        _ => {}
    }

    let app = app.clone();
    let id = id.to_string();
    tauri::async_runtime::spawn(async move {
        match id.as_str() {
            "start_session" => commands::start_session_internal(&app, None, false).await,
            "resume_session" => commands::start_session_internal(&app, None, true).await,
            "pause_session" => drop(commands::pause_session(app).await),
            "end_session" => drop(commands::end_session(app).await),
            "take_break_now" => drop(commands::take_break_now(app).await),
            "skip_break" => drop(commands::skip_break(app).await),
            "snooze_break" => drop(commands::snooze_break(app).await),
            "add_1_min" => drop(commands::add_time(app, 60).await),
            "add_5_min" => drop(commands::add_time(app, 300).await),
            _ => {}
        }
    });
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

/// Update the tray title with remaining (or elapsed) time
pub fn update_tray_title<R: Runtime>(app: &AppHandle<R>, remaining_secs: i64) {
    let Some(tray) = app.tray_by_id(TRAY_ID) else {
        return;
    };
    let state = app.state::<AppState>();

    let elapsed_secs = if state.get_setting_string("toolbar_timer_style") == "elapsed" {
        state
            .get_session()
            .start_time
            .as_deref()
            .and_then(|start| chrono::DateTime::parse_from_rfc3339(start).ok())
            .map(|start| (chrono::Utc::now() - start.with_timezone(&chrono::Utc)).num_seconds())
    } else {
        None
    };

    let title = match elapsed_secs {
        Some(secs) => format!("{} elapsed", get_tray_time(secs)),
        None => format!("{} left", get_tray_time(remaining_secs)),
    };

    let _ = tray.set_title(Some(&title));
}

/// Set a custom tray title
pub fn set_tray_title<R: Runtime>(app: &AppHandle<R>, title: &str) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let _ = tray.set_title(Some(&format!("👀 {}", title)));
    }
}

/// Clear the tray title (reset to just emoji)
pub fn clear_tray_title<R: Runtime>(app: &AppHandle<R>) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let _ = tray.set_title(Some("👀"));
    }
}
