import React from 'react';
import AWS from 'aws-sdk';
import NavBar from '../components/NavBar'
import ReportFileSelector from '../components/ReportFileSelector'
import BreakDown from '../components/BreakDown'
import '../css/cloudflare.css';
import '../css/bootstrap.min.css';
import '../css/general.css';
import '../css/navbar.css';
import '../css/customizationpage.css';




class CreateReport extends React.Component {

  constructor(props){
    super(props);
}
  //
  // componentDidMount(){
  //   const script = document.createElement("script");
  //   script.src = "../js/customization.js";
  //   script.async = true;
  //   this.div.appendChild(script);
  // }



  render(){
    return (
      <div className="mainbackground" id = "mainDiv" ref={el => (this.div = el)}>
        <div className="container">
            <NavBar />
            <ReportFileSelector />
            <BreakDown />
        </div>
      </div>
  );
  }
}

export default CreateReport;
