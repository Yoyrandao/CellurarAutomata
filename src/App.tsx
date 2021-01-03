import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Conway, Main } from "./components";

const AppRouter = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/conway">Conway's Game of Life</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" component={Main} />
        <Route path="/conway" component={Conway} />
      </div>
    </Router>
  );
}

const App = () => {
  return <div>
    <AppRouter />
  </div>
};

export { App };
