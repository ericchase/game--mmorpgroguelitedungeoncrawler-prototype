// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn get_directory_tree(path: Option<&str>) -> String {
    let args = match path {
        Some(_) => vec!["node_scripts/get-directory-tree.js", path.unwrap()],
        None => vec!["node_scripts/get-directory-tree.js"],
    };

    let output = if cfg!(windows) {
        Command::new("node")
            .args(args)
            .creation_flags(0x08000000)
            .output()
            .expect("failed to execute process")
    } else {
        Command::new("node")
            .args(args)
            .output()
            .expect("failed to execute process")
    };

    let stdout = String::from_utf8(output.stdout).unwrap_or("".to_string());

    // let stderr = String::from_utf8(output.stderr).unwrap_or("".to_string());
    // println!("stdout: {}", stdout);
    // println!("stderr: {}", stderr);

    stdout
}

// #[tauri::command]
// fn toggle_readonly_path(path: &str, settings_path: &str) -> () {}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_directory_tree])
        // .invoke_handler(tauri::generate_handler![toggle_readonly_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
