import React from 'react'
import { render } from 'react-dom'
import './index.sass'
import App from './App';

console.log('browser.js loaded :D')

render(
  <App />,
  document.querySelector('main')
);
