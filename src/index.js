import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from './pages/MainPage';
import CanvasPage from './pages/CanvasPage';
import TestPage from './pages/TestPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render((
  <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<MainPage/>}></Route>
      <Route exact path='/storyboard' element={<CanvasPage/>}></Route>
      <Route exact path='/test' element={<TestPage/>}></Route>
    </Routes>
  </BrowserRouter>
), document.getElementById('root'));
