const elPrompt = document.querySelector('#prompt');
const elMain = document.querySelector('main');

async function dropHandler(ev) {
  ev.preventDefault();
  const fileSystemEntryList = get_FileSystemEntries_from_DataTransferItems(ev?.dataTransfer?.items);
  try {
    const fileList = await get_Files_from_FileSystemEntries(fileSystemEntryList);
    if (fileList.length === 0) {
      if (ev?.dataTransfer?.files) fileList.push(...ev.dataTransfer.files);
      if (ev?.target?.files) fileList.push(...ev.target.files);
    }
    if (fileList.length > 0) {
      elPrompt.remove();
      elMain.replaceChildren();
      showImages(fileList);
    }
  } catch (err) {
    // oh well
  }
}
function dragOverHandler(ev) {
  ev.preventDefault();
}

/**
 * @param {File[]} fileList
 * @return void
 */
function showImages(fileList) {
  for (const file of fileList) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.onerror = function () {
      div.remove();
    };
    img.src = URL.createObjectURL(file);
    div.append(img);
    elMain.append(div);
  }
}

/**
 * @param {DataTransferItemList} dataTransferItemList
 * @return {FileSystemEntry[]}
 */
function get_FileSystemEntries_from_DataTransferItems(dataTransferItemList) {
  if (dataTransferItemList?.length > 0) {
    /** @type {FileSystemEntry[]} */
    const fileSystemEntryList = [];
    for (const dataTransferItem of dataTransferItemList) {
      if (dataTransferItem.kind === 'file' && dataTransferItem.webkitGetAsEntry) {
        const fileSystemEntry = dataTransferItem.webkitGetAsEntry();
        if (fileSystemEntry != null) {
          fileSystemEntryList.push(fileSystemEntry);
        }
      }
    }
    return fileSystemEntryList;
  }
  return [];
}

/**
 * @param {FileSystemEntry[]} fileSystemEntryList
 * @return {Promise<File[]>}
 */
async function get_Files_from_FileSystemEntries(fileSystemEntryList) {
  const fileEntryJobs = [];

  let count = 0;
  while (fileSystemEntryList?.length > 0) {
    /** @type {FileSystemDirectoryEntry[]} */
    const directoryEntryList = [];
    /** @type {FileSystemFileEntry[]} */
    const fileEntryList = [];

    for (const fileSystemEntry of fileSystemEntryList) {
      if (fileSystemEntry.isDirectory) directoryEntryList.push(fileSystemEntry);
      if (fileSystemEntry.isFile) fileEntryList.push(fileSystemEntry);
    }

    fileSystemEntryList = [];
    try {
      const promiseSettledResults = await Promise.allSettled(directoryEntryList.map(get_FileSystemEntries_from_DirectoryEntry));
      for (const { status, value: newEntryList } of promiseSettledResults) {
        if (status === 'fulfilled') fileSystemEntryList.push(...newEntryList);
      }
    } catch (err) {
      // oh well
    }

    for (const fileEntry of fileEntryList) {
      fileEntryJobs.push(
        new Promise((resolve, reject) => {
          fileEntry.file(
            (file) => resolve(file),
            (err) => reject(err),
          );
        }),
      );
    }

    if (count++ > 5) break;
  }

  /** @type {File[]} */
  const fileList = [];
  try {
    const promiseSettledResults = await Promise.allSettled(fileEntryJobs);
    for (const { status, value: file } of promiseSettledResults) {
      if (status === 'fulfilled') fileList.push(file);
    }
  } catch (err) {
    // oh well
  }
  return fileList;
}

/**
 * @param {FileSystemDirectoryEntry} directoryEntry
 * @return {Promise<FileSystemEntry[]>}
 */
async function get_FileSystemEntries_from_DirectoryEntry(directoryEntry) {
  const directoryReader = directoryEntry.createReader();
  /** @type {FileSystemEntry[]} */
  const fileSystemEntryList = [];
  let done = false;
  while (done === false) {
    await new Promise((resolve, reject) => {
      directoryReader.readEntries(
        (entries) => {
          if (entries.length === 0) done = true;
          else fileSystemEntryList.push(...entries);
          resolve();
        },
        (err) => {
          done = true;
          reject();
        },
      );
    });
  }
  return fileSystemEntryList;
}
