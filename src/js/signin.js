var Auth = window.auth || {};
(function scopeWrapper($) {
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


      window.location.href = '/customization.html';


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
        var email = $('#SIGNINUSERNAME').val();
        var password = $('#SIGNINPASSWORD').val();
        event.preventDefault();
        signin(email.toLowerCase(), password,
            (result) => {
                var accessToken = result.getAccessToken().getJwtToken();
                console.log(accessToken);
                alert("sign in success!");
                console.log('Successfully Logged In');
                window.location.href = '/customization.html';
            },
            (err) => {
                alert(err);
            }
        );
    }


}(jQuery));
