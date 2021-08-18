import React, { useState } from 'react';
import Sketch from 'react-p5';
import p5 from 'p5';

import { ConwayPixelManager } from './conwayPixelManager';

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAKE_ALIVE_CONDITION_DEFAULT,
  NO_KILL_CONDITION_DEFAULT,
  RANDOM_PERCENTAGE_DEFAULT,
  X_SCALE,
  Y_SCALE
} from './globals';

import './style.css';
import { Button, ButtonToolbar, Input, InputGroup, Slider } from 'rsuite';

interface IConwayState {
  randomPercentage: number;
  bornCondition: number[];
  noKillCondition: number[];
  started: boolean;
  pixelManager: ConwayPixelManager;
}

const Conway: React.FC = (): JSX.Element => {
  const [conwayState, setConwayState] = useState<IConwayState>({
    randomPercentage: RANDOM_PERCENTAGE_DEFAULT,
    bornCondition: MAKE_ALIVE_CONDITION_DEFAULT,
    noKillCondition: NO_KILL_CONDITION_DEFAULT,
    started: false,
    pixelManager: undefined as any
  });

  /**
   *
   * @param {p5} p5
   */
  function drawStatus(p5: p5) {
    p5.stroke(0);
    p5.strokeWeight(0.5);
    p5.fill(0, 255, 0);
    p5.textSize(1.5);
    p5.text(`random count: ${conwayState.randomPercentage}%`, 1, 2);

    p5.text(
      `Borns when ${conwayState.bornCondition.join(',')} cells around`,
      1,
      4
    );
    p5.text(
      `Dies when amount of cells around not in ${conwayState.noKillCondition.join(
        ','
      )}`,
      1,
      6
    );
  }

  function changeGameStatus() {
    setConwayState((prevState) => {
      return {
        ...prevState,
        started: !prevState.started
      };
    });
  }

  function randomize() {
    conwayState.pixelManager.clear();
    for (
      let i = 0;
      i < (conwayState.randomPercentage / 100) * CANVAS_WIDTH * CANVAS_HEIGHT;
      i++
    ) {
      conwayState.pixelManager.makeAlive(
        Math.floor(Math.random() * CANVAS_WIDTH),
        Math.floor(Math.random() * CANVAS_HEIGHT)
      );
    }
  }

  /**
   *
   * @param value
   */
  function onRandomChange(value: number) {
    setConwayState((prevState) => {
      return {
        ...prevState,
        randomPercentage: value
      };
    });
  }

  /**
   *
   * @param {string} value
   * @param {React.SyntheticEvent<HTMLElement, Event>} event
   */
  function setBornCondition(
    value: string,
    event: React.SyntheticEvent<HTMLElement, Event>
  ) {
    setConwayState((prevState) => {
      return {
        ...prevState,
        bornCondition: value
          .toString()
          .split(',')
          .map((x) => +x)
      };
    });
  }

  /**
   *
   * @param {string} value
   * @param {React.SyntheticEvent<HTMLElement, Event>} event
   */
  function setNoKillCondition(
    value: string,
    event: React.SyntheticEvent<HTMLElement, Event>
  ) {
    setConwayState((prevState) => {
      return {
        ...prevState,
        noKillCondition: value
          .toString()
          .split(',')
          .map((x) => +x)
      };
    });
  }

  /**
   *
   * @param {p5.Element} p5
   */
  function handleInput(p5: p5) {
    if (p5.mouseIsPressed === true) {
      conwayState.pixelManager.makeAlive(
        Math.floor(p5.mouseX / X_SCALE),
        Math.floor(p5.mouseY / Y_SCALE)
      );
    }
  }

  /**
   * Setups new p5 sketch object
   * @param {p5.Element} p5
   * @param {Element} canvasParentRef
   */
  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(CANVAS_WIDTH * X_SCALE, CANVAS_HEIGHT * Y_SCALE).parent(
      canvasParentRef
    );
    p5.frameRate(10);
    p5.background(255);

    setConwayState((prevState) => {
      return {
        ...prevState,
        pixelManager: new ConwayPixelManager(p5)
      };
    });
  };

  /**
   *
   * @param {p5} p5
   */
  const draw = (p5: p5) => {
    p5.frameRate(10);
    p5.scale(X_SCALE, Y_SCALE);

    if (!conwayState.started) {
      p5.frameRate(60);
      handleInput(p5);

      conwayState.pixelManager.draw();
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

    let map = conwayState.pixelManager.generateNeighboursMap();
    for (let i = 0; i < CANVAS_HEIGHT; i++) {
      for (let j = 0; j < CANVAS_WIDTH; j++) {
        let state = conwayState.pixelManager.getState(i, j);

        if (state == 0 && conwayState.bornCondition.includes(map[i][j])) {
          conwayState.pixelManager.makeAlive(i, j);
        }

        if (state == 1 && !conwayState.noKillCondition.includes(map[i][j])) {
          conwayState.pixelManager.kill(i, j);
        }
      }
    }

    conwayState.pixelManager.draw();
    drawStatus(p5);

    p5.stroke(128, 128, 128);
    p5.point(Math.floor(p5.mouseX / X_SCALE), Math.floor(p5.mouseY / Y_SCALE));
  };

  return (
    <div className="conway-demo">
      <div className="conway-demo__configuration-panel">
        <ButtonToolbar className="conway-demo__configuration-panel__toolbar">
          <Button size="lg" appearance="primary" onClick={changeGameStatus}>
            {conwayState.started ? 'Stop' : 'Start'}
          </Button>
          <Button size="lg" appearance="primary" onClick={randomize}>
            Randomize
          </Button>
        </ButtonToolbar>
        <div className="conway-demo__configuration-panel__slider">
          <span className="conway-demo__configuration-panel__slider__label">
            Random cells %
          </span>
          <Slider
            className="conway-demo__configuration-panel__slider__value"
            defaultValue={RANDOM_PERCENTAGE_DEFAULT}
            onChange={onRandomChange}
            min={5}
            max={100}
            step={5}
          />
        </div>
        <InputGroup className="conway-demo__configuration-panel__input__born-condition">
          <InputGroup.Addon>Born condition</InputGroup.Addon>
          <Input
            value={conwayState.bornCondition.join(',')}
            onChange={setBornCondition}
          />
        </InputGroup>
        <InputGroup className="conway-demo__configuration-panel__input__survive-condition">
          <InputGroup.Addon>Survive condition</InputGroup.Addon>
          <Input
            value={conwayState.noKillCondition.join(',')}
            onChange={setNoKillCondition}
          />
        </InputGroup>
      </div>

      <Sketch setup={setup} draw={draw} />
    </div>
  );
};

export { Conway };
