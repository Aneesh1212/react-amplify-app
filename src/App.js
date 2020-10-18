import React from 'react';
import logo from './logo.svg';
import AWS from 'aws-sdk';
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Account from "./pages/Account";
import Signin from "./pages/Signin";
import BrowseReport from './pages/BrowseReport';
import CreateReport from './pages/CreateReport'
import UploadData from './pages/UploadData';
import Scorecards from './pages/Scorecards';

class App extends React.Component {

  render(){
      return (
        <Router>
          <div className="App">
            <Route path="/" exact component={Signin}/>
            <Route path="/account" component={Account}/>
            <Route path="/browsereports" component={BrowseReport}/>
            <Route path="/createreport" component={CreateReport}/>
            <Route path="/uploaddata" component={UploadData}/>
            <Route path="/scorecards" component={Scorecards}/>



          </div>
        </Router>
    );
  }
}

export default App;
