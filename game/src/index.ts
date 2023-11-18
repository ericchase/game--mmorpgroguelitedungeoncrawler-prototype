import { query } from './lib/browser/query.js';

const tilesize = 32;

const root: HTMLDivElement = query('#root', HTMLDivElement);

const tiles: HTMLImageElement[] = [];

resizeRoot();

window.addEventListener('resize', resizeRoot);

function resizeRoot() {
  const height = Math.floor(window.innerHeight / tilesize) * tilesize;
  const width = Math.floor(window.innerWidth / tilesize) * tilesize;

  root.style.setProperty('height', height + 'px');
  root.style.setProperty('width', width + 'px');

  const tileCount = (height * width) / (32 * 32);
  while (tiles.length < tileCount) {
    const img = document.createElement('img');
    img.src = './assets/ezfu3qsf.bmp';
    img.height = tilesize;
    img.width = tilesize;
    tiles.push(img);
    let source = 'grass';
    let rotation = 0;
    img.addEventListener('mousedown', function () {
      console.log(img.src);
      if (source == 'grass') {
        source = 'dirt';
        img.src = './assets/4d5bbuxo.bmp';
      } else {
        rotation += 90;
        img.style.setProperty('transform', 'rotate(' + rotation + 'deg)');
      }
    });
    img.addEventListener('drag', preventDefault);
    img.addEventListener('dragstart', preventDefault);
    img.addEventListener('contextmenu', preventDefault);
  }
  for (let i = root.childElementCount; i < tileCount; ++i) {
    root.append(tiles[i]);
  }
  while (tileCount < root.childElementCount) {
    root.lastChild.remove();
  }
}

function preventDefault(ev: Event) {
  ev.preventDefault();
}
