import p5 from 'p5';
import { PixelManager } from '../../common/pixelManager';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './globals';

enum Direction {
  up = 0,
  right = 1,
  down = 2,
  left = 3
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class LangtonPixelManager extends PixelManager {
  direction: Direction;
  antPosition: Position | undefined;

  private directionMax: number = 4;

  constructor(p5: p5) {
    super(p5, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.antPosition = undefined;
    this.direction = Direction.up;
  }

  setAnt(x: number, y: number) {
    if (this.isOutOfBounds(x, y)) {
      return;
    }

    this.antPosition = {
      x,
      y
    };
  }

  nextStep() {
    if (!this.antPosition) {
      return;
    }

    const pointX = this.antPosition?.x;
    const pointY = this.antPosition?.y;

    if (this.getState(pointY, pointX) === 0) {
      this.setPoint(pointY, pointX);
      this.turnClockwise();
      this.move();

      return;
    }

    this.erase(pointY, pointX);
    this.turnCounterClockwise();
    this.move();
  }

  draw() {
    super.draw();

    if (this.antPosition) {
      this.p5.stroke(255, 0, 0);
      this.p5.point(this.antPosition.x, this.antPosition.y);
    }
  }

  private turnClockwise() {
    this.direction = ((this.direction + 1) % this.directionMax) as Direction;
  }

  private turnCounterClockwise() {
    this.direction = ((this.directionMax + (this.direction - 1)) %
      this.directionMax) as Direction;
  }

  private move() {
    if (!this.antPosition) {
      return;
    }

    if (this.direction === Direction.up) {
      this.antPosition.y += -1;
    } else if (this.direction === Direction.down) {
      this.antPosition.y += 1;
    } else if (this.direction === Direction.left) {
      this.antPosition.x += -1;
    } else {
      this.antPosition.x += 1;
    }
  }
}

export { LangtonPixelManager };
