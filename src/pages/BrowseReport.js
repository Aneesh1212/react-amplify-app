import React from 'react';
import NavBar from '../components/NavBar';
import {authAndRun, listObjsAndRun, callLambdaAndRun, iteratedObjGet} from '../js/auth';
import {getUrlParam} from '../js/generalfunctions';
import '../css/bootstrap.min.css';
import '../css/navbar.css';
import '../css/general.css';
import '../css/dev.css';
import '../css/browsereport.css';
import { browseReport } from '../js/browsereport.js'

class BrowseReport extends React.Component {

  constructor(props){
    super(props);
}

  componentDidMount(){
    browseReport();
  }

  render(){
    return (

      <div class ="container-fluid mainbackground">
        <NavBar />
        <br/>
        <div id="holder" class="row">
        </div>
      </div>
  );
  }
}

export default BrowseReport;
