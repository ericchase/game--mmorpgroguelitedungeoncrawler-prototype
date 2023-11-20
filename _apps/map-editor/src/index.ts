import { TilePalette } from './lib/TilePalette.js';
import { fromDragTransfer, fromFileList } from './lib/browser/FileList.js';
import { preventDefault } from './lib/browser/events.js';
import { query } from './lib/browser/query.js';
import { $exists } from './lib/lib.js';

const tilesize = 32;

const canvas: HTMLCanvasElement = query('#main-canvas', HTMLCanvasElement);
const bUpload: HTMLButtonElement = query('#upload-images-button', HTMLButtonElement);
const iUpload: HTMLInputElement = query('#upload-images-input', HTMLInputElement);
const dTilePalette: HTMLDivElement = query('#tile-palette', HTMLDivElement);

const tilePalette = new TilePalette(dTilePalette);

document.body.addEventListener('drop', async function (ev) {
  ev.preventDefault();
  if ($exists(ev.dataTransfer)) {
    tilePalette.addTiles(await fromDragTransfer(ev.dataTransfer));
  }
  console.log(tilePalette);
});
document.body.addEventListener('dragover', preventDefault);

iUpload.addEventListener('change', function (ev) {
  if ($exists(iUpload.files)) {
    tilePalette.addTiles(fromFileList(iUpload.files));
  }
  console.log(tilePalette);
});

interface ComponentAutosizeInput extends HTMLElement {
  getText: () => string;
  setText: (text: string) => void;
  resize: () => void;
}

function resizeCanvas(tilesize: number, rows: number, columns: number) {
  canvas.width = tilesize * rows;
  canvas.height = tilesize * columns;
}

const inTileSize = document.querySelector('#tile-size') as ComponentAutosizeInput;
const inGridColumns = document.querySelector('#grid-columns') as ComponentAutosizeInput;
const inGridRows = document.querySelector('#grid-rows') as ComponentAutosizeInput;

function resize() {
  inTileSize.resize();
  inGridColumns.resize();
  inGridRows.resize();
  resizeCanvas(
    Number.parseInt(inTileSize.getText()), //
    Number.parseInt(inGridColumns.getText()),
    Number.parseInt(inGridRows.getText()),
  );
}

inTileSize.setText('32');
inGridColumns.setText('10');
inGridRows.setText('5');
resize();

const dSettings: HTMLDivElement = query('#settings', HTMLDivElement);
dSettings.addEventListener('change', resize);
