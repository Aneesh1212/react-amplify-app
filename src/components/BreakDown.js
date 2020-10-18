import React from 'react';
import ReactDOM from 'react-dom'
import AWS from 'aws-sdk';
import NavBar from './NavBar'
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/navbar.css';
import '../css/customizationpage.css';
import '../js/auth.js'
import { multiplyNode, remove, opensetting } from '../js/customization.js'


class BreakDown extends React.Component {

  constructor(props){
    super(props);
}

  expand = () => {
    console.log(this);
    multiplyNode(document.getElementById('test1'), 2, true)
  }

  condense = () => {
    console.log(ReactDOM.findDOMNode(this).parentElement);
    //remove(ReactDOM.findDOMNode(this).parentElement)
  }

  openSettings = () => {
    //opensetting(this);
  }


  render(){
    return (
            <div id="test1" className="col-md-8 reportrequest col-md-offset-1">
              <label>Break down
                <select className="reportcustominput" id="target1"></select> ,
                <select className="reportcustominput" id="target2"></select> ,
                <select className="reportcustominput" id="target3"></select> by
                <select className="reportcustominput" id="situation1"></select>,
                <select className="reportcustominput" id="situation2"></select>,
                <select className="reportcustominput" id="situation3"></select>
              </label>
              <div style={{float: "right", alignContent:"center"}}>
                <button type="button" onClick={this.expand} className="btn btn-primary">+</button>
                <button id="xbutton" type="button" onClick={this.condense} className="btn btn-danger">x</button>

              </div>

              <br/>
              <label for="checkbox-toggle-1">Open Settings</label>
              <input className="" id="checkbox-toggle-1" type="checkbox" onClick={this.openSettings}/>

              <div class="toggle-content">
                <h5 id="t1"></h5>
                <input type="radio" id="bart1" name="barpie1test1" value="Bar Chart" />
                <label for="bart1">Bar Chart</label>
                <input type="radio" id="piet1" name="barpie1test1" value="Pie Chart" />
                <label for="piet1">Pie Chart</label><br/>
                <h5 id="t2"></h5>
                <input type="radio" id="bart2" name="barpie2test1" value="Bar Chart" />
                <label for="bart2">Bar Chart</label>
                <input type="radio" id="piet2" name="barpie2test1" value="Pie Chart" />
                <label for="piet2">Pie Chart</label><br/>
                <h5 id="t3"></h5>
                <input type="radio" id="bart3" name="barpie3test1" value="Bar Chart" />
                <label for="bart3">Bar Chart</label>
                <input type="radio" id="piet3" name="barpie3test1" value="Pie Chart" />
                <label for="piet3">Pie Chart</label><br/>
                <h5> <b>Relationship Charts</b> </h5>
                <input id="sankey12" class="reportcheckbox" type="checkbox" name="sankeys" defaultChecked/>
                <label><h5 id="sankey12text"> Relationship Charts </h5></label><br/>
                <input id="sankey23" class="reportcheckbox" type="checkbox" name="sankeys" defaultChecked/>
                <label><h5 id="sankey23text"> Relationship Charts </h5></label>
              </div>

            </div>
  );
  }
}

export default BreakDown;
