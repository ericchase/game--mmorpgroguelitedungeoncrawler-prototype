import { invoke } from '@tauri-apps/api/tauri';

const buttonRefresh: HTMLButtonElement | null = document.querySelector('#refresh-directory-tree');
const divDirectoryTree: HTMLDivElement | null = document.querySelector('#directory-tree');

buttonRefresh?.addEventListener('click', async function () {
  const response: string = await invoke('get_directory_tree', {});
  const htmlTree = response.replace(/\n/g, '<br>');
  if (divDirectoryTree) {
    divDirectoryTree.innerHTML = htmlTree;
  }
});
