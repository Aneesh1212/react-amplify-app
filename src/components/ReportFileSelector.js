import React from 'react';
import AWS from 'aws-sdk';
import NavBar from './NavBar'
import titanlogob from '../images/TitanLogoB.png';
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/navbar.css';
import '../css/customizationpage.css';
import '../js/auth.js'
import { aneesh, moveToBrowseReport } from '../js/customization.js';
class ReportFileSelector extends React.Component {

  constructor(props){
    super(props);
}

  componentDidMount(){
    aneesh()
  }


  render(){
    return (
      <div style={{height: "300px", padding: "20px", float:"right", paddingTop: "0px"}} class="col-md-3">
        <div id="FILEDISPLAY" class="data-holder">
          <h3> <img src={titanlogob} width="30px"/> FILE SELECTION </h3>
          <hr/>

        </div>

        <div class="othersettings">
          <div class="subpill">
            <label style={{color: "white"}}>Title Of Report&nbsp;</label><input id="reportitle" type="text"/>

            <h4>
                Offense
                <label class="switch">
                  <input id="offdef" type="checkbox"/>
                  <span class="slider"></span>
                </label>
                Defense
              </h4>
            <br/>
            <h4> I want to scout </h4>
              <select id="teamselect" class="reportcustominput">
               // <option value="NYG">New York Giants</option>
               //  <option value="PHI">Eagles</option>
               //  <option value="DAL">Cowboys</option>
               //  <option value="WAS">Redskins</option>
               //
               //
               //  <option value="URI">URI - O</option>
               //  <option value="Brown">Brown - O</option>
               //  <option value="USD">USD - O</option>
               //  <option value="Harvard">Harvard - D</option>
               //  <option value="BM">BM</option>
               //  <option value="RC">RC</option>
               //  <option value="RE">RE</option>
               //  <option value="TT">TT</option>
               //  <option value="TW">TW</option>
               //  <option value="Ridge">Ridge</option>


              </select>

          </div>
          <input style={{border: "solid white 2px"}} class="roundbutton submitcustom" value="Create Report" type="submit" list="" name="submitcustom" onClick={moveToBrowseReport} />


        </div>

      </div>
  );
  }
}

export default ReportFileSelector;
