import fs from 'node:fs/promises';

fs.copyFile('./src-tauri/target/release/checkout-gui.exe', '../checkout-gui.exe');
