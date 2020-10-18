import React from 'react';
import AWS from 'aws-sdk';
import NavBar from './NavBar'
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/loadingbar.css';
import '../css/upload.css';
import '../css/navbar.css';
import '../css/dev.css';
import '../js/auth.js'

class DataFileSelector extends React.Component {

  constructor(props){
    super(props);
}


  render(){
    return (
      <section  className="row">
        <br/>
        <button style={{marginLeft: "35vw", padding: "20px", visibility: "hidden"}} className="btn default submitButton"  id="clearAll">Clear All</button>
        <button style={{marginLeft: "60vw", padding: "20px"}} className="btn default submitButton" id="submitButton">Submit</button>

        <div style={{backgroundColor: "white", padding: "10px", color: "#1c1c1c"}} className="shadow col-xs-3 col-xs-offset-1" align="left">
          <fieldset>
            <input  type="file" name="File Upload" id="txtFileUpload" accept=".csv" />
          </fieldset>
          <h5>Upload your data using this button</h5>
          <h5>Then match your own columns by dragging each column on the right and matching it with one on the left</h5>
          <input id="hudldata" type="radio" value="hudl" name="datatype" defaultChecked/><label> &nbsp;Hudl Data</label>
          <input type="text" id="omap" placeholder="O Team Name" /> &nbsp;<input type="text" id="omap" placeholder="D Team Name" />

          <br/>

          <input id="cstmdata" type="radio" value="custom" name="datatype"/><label> &nbsp;Custom Data  </label><br/>

        </div>
        <br/>
      </section>
  );
  }
}

export default DataFileSelector;
