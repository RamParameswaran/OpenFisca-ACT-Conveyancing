import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './index.css';

import App from './components/App';
import Simulate from './components/Simulate';

import { AppBar, Tabs, Tab } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppBar position="static">
        <Tabs aria-label="simple tabs example">
          <Tab
            label="Stamp Duty Calculator"
            onClick={(e) => {
              window.location.assign('/');
            }}
          />
          <Tab
            label="Stamp Duty Simulator"
            onClick={(e) => {
              window.location.assign('/simulate');
            }}
          />
        </Tabs>
      </AppBar>

      <Switch>
        <Route path="/simulate">
          <Simulate />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
