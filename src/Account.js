import React from 'react';
import logo from './logo.svg';
import AWS from 'aws-sdk';
import NavBar from './NavBar'
import './css/bootstrap.min.css';
import './css/general.css';
import './css/navbar.css';
import './css/account.css';
import {authAndReturnParams} from './auth'


class Account extends React.Component {

  constructor(props){
    super(props);
}


  addUserInfo(metadata){

    var node;
    var tempnode;

    var mainholder = document.getElementById("accountinfo");

    for (var key in metadata) {

      tempnode = document.createElement("div");
      tempnode.className = "subunit"

      var title = document.createElement("h3");
      var value = document.createElement("h4");
      title.innerHTML= key;
      value.innerHTML= metadata[key];
      tempnode.appendChild(title)
      tempnode.appendChild(value)

      mainholder.appendChild(tempnode)
    }
  }

  componentDidMount(){
    authAndReturnParams(this.addUserInfo);
  }


  render(){
    return (
      <div className="mainbackground" id = "mainDiv">
        <div className="container">
            <NavBar />
            <div id="accountinfo" className="accountinfo col-md-6 col-md-offset-3">
            </div>

        </div>
      </div>
  );
  }
}

export default Account;
