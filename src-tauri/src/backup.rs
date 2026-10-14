use std::{fs, io::Read};
use tauri_plugin_dialog::DialogExt;

pub const MAX_BACKUP_BYTES: usize = 5 * 1024 * 1024;

pub fn validate_backup_size(content: &str) -> Result<(), String> {
    if content.len() > MAX_BACKUP_BYTES {
        return Err("Backup exceeds the 5 MB limit.".into());
    }
    Ok(())
}

#[tauri::command]
pub async fn export_settings_file(app: tauri::AppHandle, content: String) -> Result<bool, String> {
    validate_backup_size(&content)?;
    tauri::async_runtime::spawn_blocking(move || {
        let selected = app
            .dialog()
            .file()
            .add_filter("JSON backup", &["json"])
            .set_file_name("updainium-settings.json")
            .blocking_save_file();
        let Some(selected) = selected else {
            return Ok(false);
        };
        let path = selected.into_path().map_err(|error| error.to_string())?;
        fs::write(path, content).map_err(|error| error.to_string())?;
        Ok(true)
    })
    .await
    .map_err(|error| error.to_string())?
}

#[tauri::command]
pub async fn import_settings_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let selected = app
            .dialog()
            .file()
            .add_filter("JSON backup", &["json"])
            .blocking_pick_file();
        let Some(selected) = selected else {
            return Ok(None);
        };
        let path = selected.into_path().map_err(|error| error.to_string())?;
        let file = fs::File::open(path).map_err(|error| error.to_string())?;
        let mut content = String::new();
        file.take((MAX_BACKUP_BYTES + 1) as u64)
            .read_to_string(&mut content)
            .map_err(|error| error.to_string())?;
        validate_backup_size(&content)?;
        Ok(Some(content))
    })
    .await
    .map_err(|error| error.to_string())?
}
