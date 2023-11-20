import { Tile } from './Tile.js';
import { $use } from './lib.js';

export class TilePalette {
  tileSet: Map<string, Tile> = new Map();

  constructor(public element: HTMLElement) {
    this.element = element;
  }

  addTile(this: TilePalette, file: File) {
    this.addTiles([file]);
  }
  addTiles(this: TilePalette, files: File[]) {
    for (const file of files) {
      const img = document.createElement('img');
      img.onerror = () => {
        img.onerror = null;
        img.onload = null;
        this.removeTile(file.name);
      };
      img.onload = () => {
        img.onerror = null;
        img.onload = null;
        console.log(file.name, 'loaded');
      };
      img.src = URL.createObjectURL(file);
      $use(new Tile(img, file), (tile) => {
        this.tileSet.set(file.name, tile);
        this.element.append(tile.element);
      });
    }
  }

  removeTile(this: TilePalette, name: string) {
    $use(this.tileSet.get(name), (tile) => {
      this.tileSet.delete(name);
      tile.element.remove();
    });
  }
}
