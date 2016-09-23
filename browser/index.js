import React from 'react'
import { render } from 'react-dom'
import App from './App';
import './index.sass'

console.log('browser.js loaded :D')

render(
  <App />,
  document.querySelector('main')
);
