import { CANVAS_HEIGHT, CANVAS_WIDTH } from './globals';
import p5 from 'p5';
import { PixelManager } from '../../common/pixelManager';

class ConwayPixelManager extends PixelManager {
  constructor(p5: p5) {
    super(p5, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  makeAlive(x: number, y: number) {
    this.setPoint(x, y);
  }

  kill(x: number, y: number) {
    this.erase(x, y);
  }

  getNeighbours(x: number, y: number) {
    let searches = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1]
    ];
    let count = 0;

    searches = searches.filter(
      (x) => x[0] >= 0 && x[0] < this.width && x[1] >= 0 && x[1] < this.height
    );

    for (let search of searches) {
      if (this.getState(search[0], search[1]) == 1) {
        count++;
      }
    }

    return count;
  }

  generateNeighboursMap() {
    let map: number[][] = [];

    for (let i = 0; i < this.height; i++) {
      map.push([]);
      for (let j = 0; j < this.width; j++) {
        map[i].push(this.getNeighbours(i, j));
      }
    }

    return map;
  }

  draw() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.p5.stroke(this.pixels[j][i] == 1 ? 0 : 255);
        this.p5.point(i, j);
      }
    }
  }
}

export { ConwayPixelManager };
