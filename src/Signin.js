import React from 'react';
import logo from './logo.svg';
import './css/login.css';
import { Redirect } from "react-router-dom";
import Link from 'react';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import $ from 'jquery';
import AWS from 'aws-sdk';
import _config from './cognito-config.js';


class Signin extends React.Component {

  setupAuthentication(){

    var _config = {
        cognito: {
            userPoolId: 'us-east-1_hHapvIq8p', // e.g. us-east-2_uXboG5pAb
            userPoolClientId: '28rkqeiek9g486pg50es91qglj', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
            region: 'us-east-1' // e.g. us-east-2
        },
        api: {
            invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
        },
        identity: {
          identityPoolId:'us-east-1:263e0b16-49d2-48be-b366-98108bd911d1'
        }
    };


    var Auth = window.auth || {};
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        // $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


    // if (typeof AWSCognito !== 'undefined') {
    //     AWSCognito.config.region = _config.cognito.region;
    // }

    //Check if user is already logged inspect
    var cognitoUser = userPool.getCurrentUser();
    console.log(cognitoUser)
    if (cognitoUser != null) {

      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));

          return;
        }
        console.log('session validity: ' + session.isValid());

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            alert(err);
          } else {
            console.log(attributes)
          }
        });
        var loginUrl = 'cognito-idp.'+_config.cognito.region+'.amazonaws.com/'+_config.cognito.userPoolId
        AWS.config.region = _config.cognito.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: _config.identity.identityPoolId, // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            [`${loginUrl}`]: session
                                    .getIdToken()
                                    .getJwtToken(),
          }
        });
        console.log(AWS.config.credentials);

        AWS.config.credentials.refresh(error => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log(AWS.config.credentials);
            console.log('Successfully logged!');
            alert("logged in user detected");

          }
        });

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
      });
    }

    //user is not logged in if here


    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Email: email.toLowerCase(),
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }


    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email.toLowerCase(),
            Email: email.toLowerCase(),
            Pool: userPool
        });
    }

    document.getElementById('SIGNINSUBMIT').addEventListener("click",handleSignin,false);

    function handleSignin(event) {
        console.log("HI");
        var email = $('#SIGNINUSERNAME').val();
        var password = $('#SIGNINPASSWORD').val();
        event.preventDefault();
        signin(email.toLowerCase(), password,
            (result) => {
                var accessToken = result.getAccessToken().getJwtToken();
                console.log(accessToken);
                alert("sign in success!");
                console.log('Successfully Logged In');
                window.location.href = '/account';
            },
            (err) => {
                console.log("login failed");
                console.log(err);
                alert(err.message);
              }
            );
          }
    }

  componentDidMount() {
    window.addEventListener('load', this.setupAuthentication);
  }

  render(){

    return (
      <div className="container-fluid">
        <div className="row">
          <div id="navbarlogo" className="col-md-2">
          </div>
        </div>

        <div className="login-box font2">


        <h2>Login</h2>
          <form>
            <div className="user-box">
              <input id="SIGNINUSERNAME" type="text" name="" required=""/>
              <label>Username</label>
            </div>
            <div className="user-box">
              <input id="SIGNINPASSWORD" type="password" name="" required=""/>
              <label>Password</label>
            </div>
            <div className="center" align="center">
              <a id = "SIGNINSUBMIT">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
              </a>
            </div>
          </form>
        </div>



      </div>
    );
  }
}

export default Signin;
