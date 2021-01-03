import React from "react";
import Sketch from "react-p5";
import p5 from "p5";

import PixelManager from "./pixelManager";

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAKE_ALIVE_CONDITION_DEFAULT,
  NO_KILL_CONDITION_DEFAULT,
  RANDOM_PERCENTAGE,
  X_SCALE,
  Y_SCALE,
} from "./globals";

import "./style.css";

const Conway = () => {
  let slider: p5.Element;
  let bornInput: p5.Element;
  let aliveInput: p5.Element;

  let bornCondition = MAKE_ALIVE_CONDITION_DEFAULT;
  let noKillCondition = NO_KILL_CONDITION_DEFAULT;

  let started = false;

  let pixelManager: PixelManager;

  /**
   * @param {p5.Element} element
   * @param {Array} pos
   * @param {Array} event
   */
  function setupUiButton(
    element: p5.Element,
    pos: number[],
    size: number[],
    event: boolean | ((...args: any[]) => any)
  ) {
    element.position(...pos);
    element.mousePressed(event);
    element.size(size[0], size[1]);

    element.style("font-size", "21px");
    element.style("margin-top", "-5px");
  }

  /**
   * @param {p5.Element} element
   * @param {Array} pos
   * @param {Array} event
   */
  function setupUiInputs(
    element: any,
    pos: number[],
    size: number[],
    event: boolean | ((...args: any[]) => any)
  ) {
    element.position(...pos);
    element.input(event);
    element.size(...size);

    element.style("font-size", "21px");
  }

  /**
   * @param {p5} p5
   */
  function drawStatus(p5: p5) {
    p5.stroke(0);
    p5.strokeWeight(0.5);
    p5.fill(0, 255, 0);
    p5.textSize(1.5);
    p5.text(`random count: ${+slider.value() * 100}%`, 1, 2);

    p5.text(`Borns when ${bornCondition.join(",")} cells around`, 1, 4);
    p5.text(
      `Dies when amount of cells around not in ${noKillCondition.join(",")}`,
      1,
      6
    );
  }

  function changeGameStatus() {
    started = !started;
  }

  function randomize() {
    pixelManager.clear();
    for (let i = 0; i < +slider.value() * CANVAS_WIDTH * CANVAS_HEIGHT; i++) {
      pixelManager.makeAlive(
        Math.floor(Math.random() * CANVAS_WIDTH),
        Math.floor(Math.random() * CANVAS_HEIGHT)
      );
    }
  }

  function setBornCondition() {
    bornCondition = bornInput
      .value()
      .toString()
      .split(",")
      .map((x) => +x);
  }

  function setNoKillCondition() {
    noKillCondition = aliveInput
      .value()
      .toString()
      .split(",")
      .map((x) => +x);
  }

  /**
   * @param {p5.Element} p5
   */
  function handleInput(p5: p5) {
    if (p5.mouseIsPressed === true) {
      pixelManager.makeAlive(
        Math.floor(p5.mouseX / X_SCALE),
        Math.floor(p5.mouseY / Y_SCALE)
      );
    }
  }

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(CANVAS_WIDTH * X_SCALE, CANVAS_HEIGHT * Y_SCALE).parent(
      canvasParentRef
    );
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

    bornInput = p5.createInput(MAKE_ALIVE_CONDITION_DEFAULT.join(","));
    aliveInput = p5.createInput(NO_KILL_CONDITION_DEFAULT.join(","));

    setupUiInputs(bornInput, [400, 10], [80, 20], setBornCondition);
    setupUiInputs(aliveInput, [500, 10], [80, 20], setNoKillCondition);
  };

  const draw = (p5: p5) => {
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

  return <Sketch setup={setup} draw={draw} />;
};

export { Conway };
