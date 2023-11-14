import fs from 'node:fs/promises';

async function getDirectoryTree(path = '.') {
  if (typeof path !== 'string' || !path) {
    return Promise.reject('Parameter "path" must be non-empty string.');
  }
  try {
    return await fs.readdir(path, { recursive: true });
  } catch (err) {
    return Promise.reject(err);
  }
}

console.log((await getDirectoryTree(process.argv[2])).join('\n'));
