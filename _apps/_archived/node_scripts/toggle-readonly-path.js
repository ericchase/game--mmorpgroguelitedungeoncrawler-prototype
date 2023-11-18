import fs from 'node:fs/promises';

async function readJSONFile(path = '') {
  if (typeof path !== 'string' || !path) {
    return Promise.reject('Parameter "path" must be non-empty string.');
  }
  try {
    return JSON.parse(await fs.readFile(path, { encoding: 'utf8' }));
  } catch (err) {
    return Promise.reject(err);
  }
}

async function writeJSONFile(path = '', obj = '') {
  if (typeof path !== 'string' || !path) {
    return Promise.reject('Parameter "path" must be non-empty string.');
  }
  if (typeof obj !== 'object') {
    return Promise.reject('Parameter "obj" must be an object.');
  }
  try {
    return await fs.writeFile(path, JSON.stringify(obj), { encoding: 'utf8' });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function toggleReadOnly(path = '', settings_path = './.vscode/settings.json') {
  if (typeof path !== 'string' || !path) {
    return Promise.reject('Parameter "file_path" must be non-empty string.');
  }
  if (typeof settings_path !== 'string' || !settings_path) {
    return Promise.reject('Parameter "settings_path" must be non-empty string.');
  }
  try {
    const settings = await readJSONFile(settings_path);
    const readonlyExclude = settings['files.readonlyExclude'] ?? {};
    if (readonlyExclude[path] === true) {
      delete readonlyExclude[path];
    } else {
      readonlyExclude[path] = true;
    }
    await writeJSONFile(settings_path, settings);
  } catch (err) {
    return Promise.reject(err);
  }
}

await toggleReadOnly(process.argv[2], process.argv[3]);
