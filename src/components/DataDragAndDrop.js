import React from 'react';
import AWS from 'aws-sdk';
import NavBar from './NavBar'
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/navbar.css';
import '../css/customizationpage.css';
import '../js/auth.js'

class DataDragAndDrop extends React.Component {

  constructor(props){
    super(props);
}


  render(){
    return (
      <div id ="container">
        <div id="wrapper">
          <div id="lefthalf"></div>
          <div id="righthalf">
            <div id="headerContainer" className="row"></div>
          </div>
        </div>
      </div>
  );
  }
}

export default DataDragAndDrop;
