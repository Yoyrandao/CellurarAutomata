import React from 'react';
import { BrowserRouter as AppRouter, Route, Link } from 'react-router-dom';

import { Dropdown, Nav, Navbar } from 'rsuite';

import { Conway, Langton, Main } from '../components';

import './style.css';
import 'rsuite/dist/styles/rsuite-default.css';

const Router = () => {
  return (
    <AppRouter>
      <Navbar className="navigation">
        <Navbar.Header>
          <span className="navigation__title__content">Cellular Automata</span>
        </Navbar.Header>
        <Navbar.Body>
          <Nav>
            <Nav.Item eventKey="1">
              <Link
                style={{ fontSize: '1.2em', color: 'white' }}
                className="navigation__body__text"
                to="/"
              >
                Home
              </Link>
            </Nav.Item>
            <Dropdown
              className="navigation__dropbox"
              size="lg"
              title="Demos"
              eventKey="2"
            >
              <Dropdown.Item eventKey="2-1">
                <Link style={{ fontSize: '1.2em' }} to="/conway">
                  Conway's Game of Life
                </Link>
              </Dropdown.Item>
              <Dropdown.Item eventKey="2-2">
                <Link style={{ fontSize: '1.2em' }} to="/langton">
                  Langton's Ant
                </Link>
              </Dropdown.Item>
            </Dropdown>
          </Nav>
        </Navbar.Body>
      </Navbar>

      <Route exact path="/langton" component={Langton} />
      <Route exact path="/conway" component={Conway} />
      <Route exact path="/" component={Main} />
    </AppRouter>
  );
};

export { Router };
