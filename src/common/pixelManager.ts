import p5 from 'p5';

class PixelManager {
  p5: p5;
  pixels: number[][];

  width: number;
  height: number;

  constructor(p5: p5, width: number, height: number) {
    this.p5 = p5;
    this.pixels = [];

    this.width = width;
    this.height = height;

    for (let i = 0; i < this.height; i++) {
      this.pixels.push([]);
      for (let j = 0; j < this.width; j++) {
        this.pixels[i].push(0);
      }
    }
  }

  setPoint(x: number, y: number) {
    if (this.isOutOfBounds(x, y)) {
      return;
    }

    this.pixels[y][x] = 1;
  }

  erase(x: number, y: number) {
    if (this.isOutOfBounds(x, y)) {
      return;
    }

    this.pixels[y][x] = 0;
  }

  getState(x: number, y: number) {
    if (this.isOutOfBounds(x, y)) {
      return;
    }

    return this.pixels[y][x];
  }

  clear() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.pixels[i][j] = 0;
      }
    }
  }

  draw() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.p5.stroke(this.pixels[i][j] == 1 ? 0 : 255);
        this.p5.point(i, j);
      }
    }
  }

  isOutOfBounds(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return false;
    }

    return true;
  }
}

export { PixelManager };
