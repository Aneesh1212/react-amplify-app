import React from 'react';
import NavBar from '../components/NavBar';
import {authAndRun, listObjsAndRun, getObjAndRun, callLambdaAndRun, iteratedObjGet} from '../js/auth';
import {getUrlParam} from '../js/generalfunctions';
import '../css/bootstrap.min.css';
import '../css/navbar.css';
import '../css/general.css';
import '../css/dev.css';
import '../css/scorecards.css';

import { generateScorecards } from '../js/graphingPackage.js';

class Scorecards extends React.Component {

  constructor(props){
    super(props);
}

  componentDidMount(){

    var reportid = getUrlParam("reportid","empty");
    if(reportid == "empty"){
      console.log("Please select scorecards from browse report page");
    }
    else{
      authAndRun((team)=>{
        var key = `${team}/reports/${reportid}/report_${team}_${reportid}.json`;
        getObjAndRun("titancommonstorage",key,(config)=>{
          key = `${team}/reports/${reportid}/data_${team}_${reportid}.json`;
          getObjAndRun("titancommonstorage",key,(report)=>{
            console.log(report)
            console.log(config)
            console.log(team)
            //TODO iterate over multiple reports rather than just present the first

            generateScorecards(report,config,["numplays"]);
          });
        });
      });
    }
  }

  render(){
    return (

      <div className = "container-fluid mainbackground" id = "backgroundDiv">
        <NavBar/>
        <div className = "container-fluid" id = "mainDiv">
        </div>
      </div>

  );
  }
}

export default Scorecards;
