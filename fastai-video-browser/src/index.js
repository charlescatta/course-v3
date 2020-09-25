/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import 'tailwindcss/dist/base.min.css'
import './main.css';

import App from './App';


// This will make handling mobile layout much easier
// See: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
(() => {
  const updateVHCSSVar = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener('resize', updateVHCSSVar);
  updateVHCSSVar();
})();

ReactDOM.render(<App />, document.getElementById('root'));
