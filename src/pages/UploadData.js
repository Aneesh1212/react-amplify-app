import React from 'react';
import AWS from 'aws-sdk';
import NavBar from '../components/NavBar'
import DataFileSelector from '../components/DataFileSelector';
import DataDragAndDrop from '../components/DataDragAndDrop';
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/loadingbar.css';
import '../css/upload.css';
import '../css/navbar.css';
import '../css/dev.css';
import '../js/auth.js'
import { handleData, mainFunction } from '../js/csv_upload.js'

class UploadData extends React.Component {

  constructor(props){
    super(props);
}

  componentDidMount(){
    handleData()
    mainFunction()
  }

  render(){
    return (
      <div className="mainbackground" id = "mainDiv">
            <NavBar />
            <DataFileSelector />
            <DataDragAndDrop />
      </div>
  );
  }
}

export default UploadData;
