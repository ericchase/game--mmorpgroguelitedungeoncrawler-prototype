/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
 *
 * @export
 * @param {DataTransferItem} item
 * @returns {(FileSystemEntry | null)}
 */
export function getAsEntry(item: DataTransferItem): FileSystemEntry | null {
  if ('getAsEntry' in item && typeof item.getAsEntry === 'function') {
    return item.getAsEntry();
  }
  if ('webkitGetAsEntry' in item && typeof item.webkitGetAsEntry === 'function') {
    return item.webkitGetAsEntry();
  }
  return null;
}
