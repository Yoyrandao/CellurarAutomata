import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";
import p5 from "p5";

function isOutOfBounds(x: number, y: number) {
  if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
    return false;
  }

  return true;
}

class PixelManager {
  pixels: number[][];
  p5: p5;

  constructor(p5: p5) {
    this.pixels = [];
    this.p5 = p5;

    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      this.pixels.push([]);
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        this.pixels[i].push(0);
      }
    }
  }

  makeAlive(x: number, y: number) {
    if (isOutOfBounds(x, y)) {
      return;
    }

    this.pixels[y][x] = 1;
  }

  kill(x: number, y: number) {
    if (isOutOfBounds(x, y)) {
      return;
    }

    this.pixels[y][x] = 0;
  }

  getState(x: number, y: number) {
    if (isOutOfBounds(x, y)) {
      return;
    }

    return this.pixels[y][x];
  }

  clear() {
    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        this.pixels[i][j] = 0;
      }
    }
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
      [x + 1, y + 1],
    ];
    let count = 0;

    searches = searches.filter(
      (x) =>
        x[0] >= 0 && x[0] < CANVAS_WIDTH && x[1] >= 0 && x[1] < CANVAS_HEIGHT
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

    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      map.push([]);
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        map[i].push(this.getNeighbours(i, j));
      }
    }

    return map;
  }

  draw() {
    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        this.p5.stroke(this.pixels[j][i] == 1 ? 0 : 255);
        this.p5.point(i, j);
      }
    }
  }
}

export { PixelManager };
