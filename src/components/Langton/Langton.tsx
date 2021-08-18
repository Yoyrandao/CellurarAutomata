import React, { useState } from 'react';

import p5 from 'p5';
import Sketch from 'react-p5';
import { Button, ButtonToolbar } from 'rsuite';

import { CANVAS_HEIGHT, CANVAS_WIDTH, X_SCALE, Y_SCALE } from './globals';
import { LangtonPixelManager } from './langtonPixelManager';

import './style.css';

interface ILangtonState {
  turn: number;
  started: boolean;
  pixelManager: LangtonPixelManager;
}

const Langton: React.FC = (): JSX.Element => {
  const [langtonState, setLangtonState] = useState<ILangtonState>({
    turn: 0,
    started: false,
    pixelManager: undefined as any
  });

  /**
   *
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
   * Setups new p5 sketch object
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
   * Draws pixels on each frame of sketch
   * @param {p5.Element} p5
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
  );
};

export { Langton };
