import React from 'react';
import logo from './logo.svg';
import AWS from 'aws-sdk';
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Account from "./Account";
import Signin from "./Signin";
import NavBar from './NavBar';
import BrowseReport from './BrowseReport'

class App extends React.Component {

  render(){
      return (
        <Router>
          <div className="App">
            <Route path="/" exact component={Signin}/>
            <Route path="/account" component={Account}/>
            <Route path="/browsereports" component={BrowseReport}/>

          </div>
        </Router>
    );
  }
}

export default App;
