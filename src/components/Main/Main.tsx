import React from 'react';
import './style.css';

const Main = () => {
  return (
    <>
      <div className="home">
        <h1 className="home__caption">What is it?</h1>
        <br />
        <p className="text-centered lg">
          It's a collection of simulations of the cellular automaton algorithms.
        </p>
        <br />
        <p className="text-centered md">
          <b>Watch, emulate, explore.</b>
        </p>
      </div>
      <div className="video-playback-background">
        <video src="https://i.imgur.com/fGSHRrn.mp4" autoPlay muted loop>
          Your browser does not support video tag.
        </video>
      </div>
    </>
  );
};

export { Main };
