var Auth = window.auth || {};
(function scopeWrapper($) {
    var signinUrl = '/index.html';
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }



    /*
     *  Event Handlers
     */
    document.getElementById('VERIFICATIONSUBMIT').addEventListener("click",handleVerify,false);


    function handleVerify(event) {
        var email = $('#VERIFICATIONEMAIL').val();
        var code = $('#VERFICATIONCODE').val();
        event.preventDefault();
        var userData = {
           Username: email.toLowerCase(),
	         Email: email.toLowerCase()  ,
	         Pool: userPool,
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        function verifySuccess(result) {
            alert('Verification successful. You will now be redirected to the login page.');
            window.location.href = signinUrl;
        }

        function verifyError(err) {
            console.log("ERR MIGHT NEED TO GET NEW CODE")

            // cognitoUser.resendConfirmationCode(function(err, result) {
            // if (err) {
            //   alert(err.message || JSON.stringify(err));
            //   return;
            // }
            // console.log('call result: ' + result);
            // });
            alert(err);
        }
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (!err) {
                verifySuccess(result);
            } else {
                verifyError(err);
            }
            console.log('call result: ' + result);
        });



    }
}(jQuery));
