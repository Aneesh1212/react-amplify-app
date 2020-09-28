import React from 'react';
import logo from './logo.svg';
import './css/navbar.css';


class NavBar extends React.Component {

  constructor(props){
    super(props);
}


  render(){
    return (
      <nav className="navbar navbar-inverse navbar-static-top example6">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar6">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand text-hide" href="index.html">Titan Analytics</a>
          </div>
          <div id="navbar6" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li className=""><a href="index.html">Home</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Data <span className="caret"></span></a>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="upload.html">Upload Data</a></li>
                  <li><a href="#">Manage Data</a></li>
                  <li className="divider"></li>
                  <li className="dropdown-header">Data Help</li>
                  <li><a href="#">Instruction Guide</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </li>
              <li className="dropdown active">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Reports <span className="caret"></span></a>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="reportbrowse.html">Browse Reports</a></li>

                  <li><a href="customization.html">Create Report</a></li>
                  <li className="divider"></li>
                  <li className="dropdown-header">Report Help</li>
                  <li><a href="#">Instruction Guide</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </li>
              <li><a href="account.html">Account</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a id="SIGNOUT" href="#">Sign Out</a></li>
            </ul>
          </div>
        </div>
      </nav>
  );
  }
}

export default NavBar;
