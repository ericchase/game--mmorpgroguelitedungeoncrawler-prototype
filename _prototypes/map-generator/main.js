import { XORShift128 } from 'random-seedable';
import { createNoise2D } from 'simplex-noise';

export const BIOMES = {
  NONE: 'NONE',
  LAND: 'LAND',
  WATER: 'WATER',
};

export class WorldGenerator {
  generateChunk(x, y) {
    const humidityGenerator = this.createNoiseGenerator(11);

    let arr2d = [];
    for (let i = 0; i < 100; i++) {
      let horizontal = [];
      for (let j = 0; j < 100; j++) {
        const humidity = humidityGenerator((y * 100 + i) * 0.05, (x * 100 + j) * 0.05);
        let biome = BIOMES.NONE;
        if (humidity > 0.5) biome = BIOMES.WATER;
        else biome = BIOMES.LAND;

        horizontal.push({
          biome,
          humidity,
        });
      }
      arr2d.push(horizontal);
    }

    return arr2d;
  }

  createNoiseGenerator(offset) {
    const randomGenerator = new XORShift128(this.seed + offset);
    const noise = createNoise2D(randomGenerator.float.bind(randomGenerator));

    return function (x, y) {
      return (noise(x, y) + 1) / 2;
    };
  }

  constructor(seed) {
    this.seed = seed;
  }
}

const wg = new WorldGenerator(1238162398126);
const arr2d = wg.generateChunk(0, 0);
console.log(wg);

const out = arr2d
  .map((chunk) => {
    return chunk
      .map(({ biome }) => {
        switch (biome) {
          case BIOMES.LAND:
            return '■';
          case BIOMES.WATER:
            return '□';
          case BIOMES.NONE:
            return ' ';
        }
      })
      .join('');
  })
  .join('\n');

console.log(out);
