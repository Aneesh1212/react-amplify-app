import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Signin from './Signin';
import NavBar from './NavBar';
import Account from './Account';
import BrowseReport from './BrowseReport';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Signin />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
