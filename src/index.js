import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from './pages/MainPage';
import CanvasPage from './pages/CanvasPage';
import TestPage from './pages/TestPage';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={MainPage}></Route>
      <Route exact path='/storyboard' component={CanvasPage}></Route>
      <Route exact path='/test' component={TestPage}></Route>
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
