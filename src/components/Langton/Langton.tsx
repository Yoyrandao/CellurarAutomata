import React, { useState } from 'react';

import p5 from 'p5';
import Sketch from 'react-p5';
import {
  Button,
  ButtonToolbar,
  Divider,
  Drawer,
  Icon,
  IconButton
} from 'rsuite';

import { CANVAS_HEIGHT, CANVAS_WIDTH, X_SCALE, Y_SCALE } from './globals';
import { LangtonPixelManager } from './langtonPixelManager';

import './style.css';

interface ILangtonState {
  turn: number;
  started: boolean;
  pixelManager: LangtonPixelManager;
}

const Langton: React.FC = (): JSX.Element => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [langtonState, setLangtonState] = useState<ILangtonState>({
    turn: 0,
    started: false,
    pixelManager: undefined as any
  });

  /**
   * Sets a red dot, represents an ant.
   * @param {p5} p5
   */
  const handleInput = (p5: p5) => {
    if (p5.mouseIsPressed) {
      langtonState.pixelManager.setAnt(
        Math.floor(p5.mouseX / X_SCALE),
        Math.floor(p5.mouseY / Y_SCALE)
      );
    }
  };

  const changeGameStatus = () => {
    setLangtonState((prevState) => {
      return {
        ...prevState,
        started: !prevState.started
      };
    });
  };

  /**
   * Setups new p5 sketch object.
   * @param {p5} p5
   * @param {Element} canvasParentRef
   */
  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(CANVAS_WIDTH * X_SCALE, CANVAS_HEIGHT * Y_SCALE).parent(
      canvasParentRef
    );
    p5.frameRate(60);
    p5.background(255);

    setLangtonState((prevState) => {
      return {
        ...prevState,
        pixelManager: new LangtonPixelManager(p5)
      };
    });
  };

  /**
   * Draws pixels on each frame of sketch.
   * @param {p5} p5
   */
  const draw = (p5: p5) => {
    p5.frameRate(60);
    p5.scale(X_SCALE, Y_SCALE);

    if (!langtonState.started) {
      langtonState.pixelManager.draw();
      handleInput(p5);

      p5.stroke(240, 0, 0);
      p5.point(
        Math.floor(p5.mouseX / X_SCALE),
        Math.floor(p5.mouseY / Y_SCALE)
      );

      return;
    }

    p5.clear();

    langtonState.pixelManager.nextStep();
    langtonState.pixelManager.draw();

    setLangtonState((prevState) => {
      return {
        ...prevState,
        turn: prevState.turn + 1
      };
    });
  };

  return (
    <div className="langton">
      <div className="info-button">
        <IconButton
          size="lg"
          appearance="primary"
          icon={<Icon icon="info" />}
          onClick={() => setShowInfo(true)}
        />
      </div>

      <div className="langton-demo">
        <div className="langton-demo__configuration-panel">
          <ButtonToolbar>
            <Button size="lg" appearance="primary" onClick={changeGameStatus}>
              {langtonState.started ? 'Stop' : 'Start'}
            </Button>
          </ButtonToolbar>
          <p className="langton-demo__configuration-panel__turn">
            Turn: {langtonState.turn}
          </p>
        </div>

        <Sketch setup={setup} draw={draw} />
      </div>

      <Drawer show={showInfo} onHide={() => setShowInfo(false)}>
        <Drawer.Header>
          <Drawer.Title>Conway's Game of Life</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p className="info">
            Langton's ant is a two-dimensional universal Turing machine with a
            very simple set of rules but complex emergent behavior. It was
            invented by Chris Langton in 1986 and runs on a square lattice of
            black and white cells.
          </p>
          <div className="info_demo-gif">
            <img src="https://i.imgur.com/O0EPfUy.gif" />
          </div>

          <div className="info_demo-link">
            <p className="info_demo-link_text">
              More about this in{' '}
              <a
                target="_blank"
                href="https://en.wikipedia.org/wiki/Langton's_ant"
              >
                Wikipedia
              </a>
              .
            </p>
          </div>

          <Divider />

          <p className="info">
            You should place red dot which represent an ant in this game. When
            it's placed click the <b>Start</b> button.
          </p>
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export { Langton };
