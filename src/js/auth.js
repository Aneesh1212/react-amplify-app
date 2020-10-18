import AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';


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


export function authAndReturnParams(callback){
    cognitoUser.getSession(function(err, session) {
    if (err) {	alert(err.message || JSON.stringify(err)); return;}
    // console.log('session validity: ' + session.isValid());

    var team = "team";
    // NOTE: getSession must be called to authenticate user before calling getUserAttributes
    cognitoUser.getUserAttributes(function(err, attributes) {
      if (err) {alert(err);}
      else {
        // console.log(attributes)
        if(JSON.parse(JSON.stringify(attributes[1])).Name === "custom:Team"){
          team = JSON.parse(JSON.stringify(attributes[1])).Value;
        }
        else {
          alert("No team name detected")
        }
        // console.log("======================",team);

        var loginUrl = 'cognito-idp.'+_config.cognito.region+'.amazonaws.com/'+_config.cognito.userPoolId
        AWS.config.region = _config.cognito.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: _config.identity.identityPoolId,
          Logins: {
            [`${loginUrl}`]: session
              .getIdToken()
              .getJwtToken(),
          }
        });
        //TODO error when multiple sign ins and outs (cookie issue?)
        AWS.config.credentials.refresh(error => {
          if (error) {console.error(error);	}
          else {
            // console.log(AWS.config.credentials)
            // console.log(AWS)
            var usermetadata = {};
            usermetadata["name"] = JSON.parse(JSON.stringify(attributes))[4].Value
            usermetadata["email"] = JSON.parse(JSON.stringify(attributes))[7].Value
            usermetadata["team"] = JSON.parse(JSON.stringify(attributes))[1].Value
            usermetadata["gender"] = JSON.parse(JSON.stringify(attributes))[3].Value
            usermetadata["city"] = JSON.parse(JSON.stringify(attributes))[5].Value
            usermetadata["age"] = JSON.parse(JSON.stringify(attributes))[6].Value



            //console.log(usermetadata)
            callback(usermetadata);

          }
        });
      }
    });
  });
}


export function authAndRun(callback){
    cognitoUser.getSession(function(err, session) {
    if (err) {	alert(err.message || JSON.stringify(err)); return;}
    // console.log('session validity: ' + session.isValid());

    var team = "team";
    // NOTE: getSession must be called to authenticate user before calling getUserAttributes
    cognitoUser.getUserAttributes(function(err, attributes) {
      if (err) {alert(err);}
      else {
        // console.log(attributes)
        if(JSON.parse(JSON.stringify(attributes[1])).Name === "custom:Team"){
          team = JSON.parse(JSON.stringify(attributes[1])).Value;
        }
        else {
          alert("No team name detected")
        }
        // console.log("======================",team);

        var loginUrl = 'cognito-idp.'+_config.cognito.region+'.amazonaws.com/'+_config.cognito.userPoolId
        AWS.config.region = _config.cognito.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: _config.identity.identityPoolId,
          Logins: {
            [`${loginUrl}`]: session
              .getIdToken()
              .getJwtToken(),
          }
        });
        //TODO error when multiple sign ins and outs (cookie issue?)
        AWS.config.credentials.refresh(error => {
          if (error) {console.error(error);	}
          else {
            // console.log(AWS.config.credentials)
            // console.log(AWS)
            callback(team);

          }
        });
      }
    });
  });
}

export function iteratedObjGet(bucket,keylst,agg,callback){
  if(keylst.length == 0){
    callback(agg);
  }
  else{
    getObjAndRun(bucket,keylst.pop(),(data)=>{
      // console.log("GET!")
      agg.push(data);
      iteratedObjGet(bucket,keylst,agg,callback);
    });
  }
}

export function getObjAndRun(bucket,key,callback){
  var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: bucket }
  });

  //getting objects
  var params = {
    Bucket: bucket,
    Key: key
  }
  s3.getObject(params,function(err,data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {


    var binArrayToJson = function(binArray) {
      var str = "";
      for (var i = 0; i < binArray.length; i++) {
          str += String.fromCharCode(parseInt(binArray[i]));
      }
      return str
     }
    var output = JSON.parse(binArrayToJson(data.Body));
    callback(output);
   }

  });
}

export function deleteObjectAndRun(bucket,key,callback){
  var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: bucket }
  });

  //getting objects
  var params = {
    Bucket: bucket,
    Key: key
  }
  s3.deleteObject(params,function(err,data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log("Deleted: "+key)
      callback();
    }

  });



}


export function listObjsAndRun(prefix,bucket,callback){
  var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: bucket }
  });


  var params ={
    // Delimiter: "/",
    // Prefix:directory
  }

  if(prefix != ""){
    params.Prefix = prefix;
  }


  s3.listObjectsV2(params, function(err, data) {
    if (err) console.log(err,err.stack);
    else {
      callback(data);
    }

  });
}

export function putObjAndRun(bucket,key,filebody,callback){
  var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: bucket }
  });

  var params = {
    Bucket: bucket,
    Key: key,
    Body: filebody
  }


  s3.putObject(params, function(err, data) {
    if (err) {
      console.log("error")
      console.log(err);
    } else {
      callback(data);
    }
  });
}

export function callLambdaAndRun(jsonObj,functionName,callback){
  var lambda = new AWS.Lambda(
              {credentials: AWS.config.credentials,
                   region : _config.cognito.region });


  var params = {
    FunctionName: functionName, /* required */
    Payload: JSON.stringify(jsonObj)
  }

  lambda.invoke(params, function(err, data) {
    console.log(params.Payload)
    if (err) console.log(err, err.stack); // an error occurred
    else {
      callback(data);
    }
  });

}



var userPool= new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Auth.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
//
//     var cognitoUser = userPool.getCurrentUser();
//     console.log(cognitoUser)
//     if (cognitoUser) {
//         console.log("user detected");
//         cognitoUser.getSession(function sessionCallback(err, session) {
//             if (err) {
//                 reject(err);
//             } else if (!session.isValid()) {
//                 resolve(null);
//             } else {
//                 resolve(session.getIdToken().getJwtToken());
//             }
//         });
//     } else {
//         console.log("user not detected");
//         resolve(null);
//     }
// });



var cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
  //document.getElementById('SIGNOUT').addEventListener("click",handleSignOut,false);

  function handleSignOut(){
    cognitoUser.signOut();
    window.location.href = '/index.html';
    return;
  }

	cognitoUser.getSession(function(err, session) {
		if (err) {
			alert(err.message || JSON.stringify(err));

      return;
		}
		//console.log('session validity: ' + session.isValid());


		// NOTE: getSession must be called to authenticate user before calling getUserAttributes
		// cognitoUser.getUserAttributes(function(err, attributes) {
		// 	if (err) {
		// 		alert(err);
		// 	} else {
		// 		//console.log(attributes)
		// 	}
		// });

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
    // console.log(AWS.config.credentials);

    AWS.config.credentials.refresh(error => {
			if (error) {
				// console.error(error);
			} else {
				// Instantiate aws sdk service objects now that the credentials have been updated.
				// example: var s3 = new AWS.S3();
        // console.log(AWS.config.credentials);
				console.log('Successfully logged!');
        //*alert("logged in user detected");

			}
		});

		// Instantiate aws sdk service objects now that the credentials have been updated.
		// example: var s3 = new AWS.S3();
	});
}
else{
  console.log("SIGN IN");
  alert("please sign in");
  window.location.href = '/index.html';
}
