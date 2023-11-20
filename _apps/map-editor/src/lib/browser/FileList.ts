import { $exists } from '../lib.js';

export async function fromDragTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const fileSystemEntryList = get_FileSystemEntries_from_DataTransferItems(dataTransfer.items);
  const fileList = await get_Files_from_FileSystemEntries(fileSystemEntryList);
  return fileList.length > 0 ? fileList : [...dataTransfer.files];
}

export function fromFileList(fileList: FileList): File[] {
  return [...fileList];
}

// helper functions

import { getAsEntry } from '../external-api-guards/browser.js';

function get_FileSystemEntries_from_DataTransferItems(dataTransferItemList: DataTransferItemList): FileSystemEntry[] {
  return [...dataTransferItemList]
    .filter((item) => item.kind === 'file')
    .map(getAsEntry)
    .filter($exists);
}

async function get_Files_from_FileSystemEntries(fileSystemEntryList: FileSystemEntry[]): Promise<File[]> {
  const fileEntryJobs: Promise<File>[] = [];

  while (fileSystemEntryList.length > 0) {
    const directoryEntryList: FileSystemDirectoryEntry[] = [];
    const fileEntryList: FileSystemFileEntry[] = [];

    for (const fileSystemEntry of fileSystemEntryList) {
      if (fileSystemEntry.isDirectory) directoryEntryList.push(fileSystemEntry as FileSystemDirectoryEntry);
      if (fileSystemEntry.isFile) fileEntryList.push(fileSystemEntry as FileSystemFileEntry);
    }

    fileSystemEntryList = [];
    try {
      const promiseSettledResults = await Promise.allSettled(directoryEntryList.map(get_FileSystemEntries_from_DirectoryEntry));
      for (const result of promiseSettledResults) {
        if (result.status === 'fulfilled') {
          fileSystemEntryList.push(...result.value);
        }
      }
    } catch (ignore) {}

    for (const fileEntry of fileEntryList) {
      fileEntryJobs.push(
        new Promise<File>((resolve, reject) => {
          fileEntry.file(
            (file) => resolve(file),
            (err) => reject(err),
          );
        }),
      );
    }
  }

  const fileList: File[] = [];

  try {
    const promiseSettledResults = await Promise.allSettled(fileEntryJobs);
    for (const result of promiseSettledResults) {
      if (result.status === 'fulfilled') {
        fileList.push(result.value);
      }
    }
  } catch (ignore) {}

  return fileList;
}

async function get_FileSystemEntries_from_DirectoryEntry(directoryEntry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const fileSystemEntryList: FileSystemEntry[] = [];

  const directoryReader = directoryEntry.createReader();
  let done = false;
  while (done === false) {
    await new Promise<void>((resolve, reject) => {
      directoryReader.readEntries(
        (entries) => {
          if (entries.length === 0) done = true;
          else fileSystemEntryList.push(...entries);
          return resolve();
        },
        () => {
          done = true;
          return reject();
        },
      );
    });
  }

  return fileSystemEntryList;
}
