import p5 from "p5";
import P5 from "p5";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  Y_SCALE,
  X_SCALE,
  RANDOM_PERCENTAGE,
  MAKE_ALIVE_CONDITION_DEFAULT,
  NO_KILL_CONDITION_DEFAULT,
} from "./globals";
import PixelManager from "./pixelManager";

let slider = undefined;
let bornCondition = MAKE_ALIVE_CONDITION_DEFAULT;
let noKillCondition = NO_KILL_CONDITION_DEFAULT;

let pixelManager = undefined;

let started = false;

// INTERFACE

/**
 * @param {p5.Element} element
 * @param {Array} pos
 * @param {Array} size
 * @param {Function} event
 */
function setupUiButton(element, pos, size, event) {
  element.position(...pos);
  element.mousePressed(event);
  element.size(...size);

  element.style("font-size", "21px");
  element.style("margin-top", "-5px");
}

/**
 * @param {p5.Element} element
 * @param {Array} pos
 * @param {Array} event
 */
function setupUiInputs(element, pos, size, event) {
  element.position(...pos);
  element.input(event);
  element.size(...size);

  element.style("font-size", "21px");
}

/**
 * @param {p5.Element} p5
 */
function drawStatus(p5) {
  p5.stroke(0);
  p5.strokeWeight(0.5);
  p5.fill(0, 255, 0);
  p5.textSize(1.5);
  p5.text(`random count: ${slider.value() * 100}%`, 1, 2);

  p5.text(`Borns when ${bornCondition.join(",")} cells around`, 1, 4);
  p5.text(
    `Dies when amount of cells around not in ${noKillCondition.join(",")}`,
    1,
    6
  );
}

// GAME

function changeGameStatus() {
  started = !started;
}

function randomize() {
  pixelManager.clear();
  for (let i = 0; i < slider.value() * CANVAS_WIDTH * CANVAS_HEIGHT; i++) {
    pixelManager.makeAlive(
      Math.floor(Math.random() * CANVAS_WIDTH),
      Math.floor(Math.random() * CANVAS_HEIGHT)
    );
  }
}

function setBornCondition() {
  bornCondition = this.value()
    .split(",")
    .map((x) => +x);
}

function setNoKillCondition() {
  noKillCondition = this.value()
    .split(",")
    .map((x) => +x);
}

/**
 * @param {p5.Element} p5
 */
function handleInput(p5) {
  if (p5.mouseIsPressed === true) {
    pixelManager.makeAlive(
      Math.floor(p5.mouseX / X_SCALE),
      Math.floor(p5.mouseY / Y_SCALE)
    );
  }
}

let draw = (p5) => {
  p5.setup = () => {
    p5.createCanvas(CANVAS_WIDTH * X_SCALE, CANVAS_HEIGHT * Y_SCALE);
    p5.frameRate(10);
    p5.background(255);

    pixelManager = new PixelManager(p5);

    setupUiButton(
      p5.createButton("Start/Stop"),
      [10, 10],
      [110, 40],
      changeGameStatus
    );
    setupUiButton(
      p5.createButton("Randomize"),
      [130, 10],
      [120, 40],
      randomize
    );

    slider = p5.createSlider(0, 1, RANDOM_PERCENTAGE, 0.05);
    slider.position(260, 10);

    setupUiInputs(
      p5.createInput(MAKE_ALIVE_CONDITION_DEFAULT.join(",")),
      [400, 10],
      [80, 20],
      setBornCondition
    );
    setupUiInputs(
      p5.createInput(NO_KILL_CONDITION_DEFAULT.join(",")),
      [500, 10],
      [80, 20],
      setNoKillCondition
    );
  };

  p5.draw = () => {
    p5.frameRate(10);
    p5.scale(X_SCALE, Y_SCALE);

    if (!started) {
      p5.frameRate(60);
      handleInput(p5);

      pixelManager.draw();
      drawStatus(p5);

      p5.stroke(128, 128, 128);
      p5.point(
        Math.floor(p5.mouseX / X_SCALE),
        Math.floor(p5.mouseY / Y_SCALE)
      );

      return;
    }

    handleInput(p5);
    p5.clear();

    let map = pixelManager.generateNeighboursMap();
    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        let state = pixelManager.getState(i, j);

        if (state == 0 && bornCondition.includes(map[i][j])) {
          pixelManager.makeAlive(i, j);
        }

        if (state == 1 && !noKillCondition.includes(map[i][j])) {
          pixelManager.kill(i, j);
        }
      }
    }

    pixelManager.draw();
    drawStatus(p5);

    p5.stroke(128, 128, 128);
    p5.point(Math.floor(p5.mouseX / X_SCALE), Math.floor(p5.mouseY / Y_SCALE));
  };
};

new P5(draw);
