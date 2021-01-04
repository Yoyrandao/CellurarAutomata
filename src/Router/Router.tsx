import React from "react";

import { HashRouter as AppRouter, Route, Link } from "react-router-dom";
import { Conway, Main } from "../components";

import { Dropdown, Nav, Navbar } from "rsuite";

import "rsuite/dist/styles/rsuite-default.css";
import "./style.css";

const Router = () => {
  return (
    <AppRouter>
      <Navbar className="navigation">
        <Navbar.Header>
          <span className="navigation__title__content">
            Cellular Automata demos
          </span>
        </Navbar.Header>
        <Navbar.Body>
          <Nav>
            <Nav.Item eventKey="1">
              <Link
                style={{ fontSize: "1.2em", color: "white" }}
                className="navigation__body__text"
                to="/a"
              >
                Home
              </Link>
            </Nav.Item>
            <Dropdown className="navigation__dropbox" size="lg" title="Demos" eventKey="2">
              <Dropdown.Item eventKey="2-1">
                <Link style={{ fontSize: "1.2em" }} to="/conway">
                  Conway's Game of Life
                </Link>
              </Dropdown.Item>
            </Dropdown>
          </Nav>
        </Navbar.Body>
      </Navbar>

      <Route path="/conway" component={Conway} />
      <Route path="/a" component={Main} />
    </AppRouter>
  );
};

export { Router };
