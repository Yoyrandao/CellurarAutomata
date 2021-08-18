import p5 from 'p5';
import Sketch from 'react-p5';

import React, { useState } from 'react';

import { ConwayPixelManager } from './conwayPixelManager';

import {
  Button,
  ButtonToolbar,
  Divider,
  Drawer,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Slider
} from 'rsuite';
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

interface IConwayState {
  randomPercentage: number;
  bornCondition: number[];
  noKillCondition: number[];
  started: boolean;
  pixelManager: ConwayPixelManager;
}

const Conway: React.FC = (): JSX.Element => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [conwayState, setConwayState] = useState<IConwayState>({
    randomPercentage: RANDOM_PERCENTAGE_DEFAULT,
    bornCondition: MAKE_ALIVE_CONDITION_DEFAULT,
    noKillCondition: NO_KILL_CONDITION_DEFAULT,
    started: false,
    pixelManager: undefined as any
  });

  /**
   * Draws a status messages on a sketch.
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
   * Event handler that sets a state after regenerating pixel positions.
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
   * Sets a cell born condition. Value can be represent as comma-separated integers.
   * @param {string} value
   * @param {React.SyntheticEvent<HTMLElement, Event>} event
   */
  function setBornCondition(
    value: string,
    _: React.SyntheticEvent<HTMLElement, Event>
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
   * Sets a cell die condition. Value can be represent as comma-separated integers.
   * @param {string} value
   * @param {React.SyntheticEvent<HTMLElement, Event>} event
   */
  function setNoKillCondition(
    value: string,
    _: React.SyntheticEvent<HTMLElement, Event>
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
   * Sets a dots, which represent a cells.
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
   * Setups new p5 sketch object.
   * @param {p5} p5
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
   * Draws pixels on each frame of sketch.
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
  };

  return (
    <div className="conway">
      <div className="info-button">
        <IconButton
          size="lg"
          appearance="primary"
          icon={<Icon icon="info" />}
          onClick={() => setShowInfo(true)}
        />
      </div>

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

      <Drawer show={showInfo} onHide={() => setShowInfo(false)}>
        <Drawer.Header>
          <Drawer.Title>Conway's Game of Life</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p className="info">
            The Game of Life is a cellular automaton devised by the British
            mathematician John Horton Conway in 1970. It is a zero-player game,
            meaning that its evolution is determined by its initial state,
            requiring no further input.
          </p>
          <div className="info_demo-gif">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif" />
          </div>

          <div className="info_demo-link">
            <p className="info_demo-link_text">
              More about this in{' '}
              <a
                target="_blank"
                href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life"
              >
                Wikipedia
              </a>
              .
            </p>
          </div>

          <Divider />

          <p className="info">
            You should place some of the initial cells to see this demo working.
            It can be made by clicking in the sketch zone or pressing the{' '}
            <b>Randomize</b> button upon.
          </p>

          <p className="info">
            Press <b>Start</b> when all needed cells are filled.
          </p>
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export { Conway };
