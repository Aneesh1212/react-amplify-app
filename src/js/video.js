// Athenticate user then run code with team name
authAndRun((team)=>{
  // Lists Objects at "titancommonstorage" bucket and at level `${team}/reports`
  listObjsAndRun(`${team}/reports`,"titancommonstorage",(data)=>{
    console.log(data)
    var keylst = [];
    for(var i = 0; i < data.Contents.length;i++){
      // Add logic here to make sure there mp4 files or the right thing
       keylst.push(data.Contents[i].Key);
    }

    // This will now get all the keys in keylst and store them in data
    iteratedObjGet("titancommonstorage",keylst,[],(data)=>{
      console.log(data);
      var mainholder = document.getElementById("videolist");
      var templabel; var tempradio;
      data.forEach((d,i)=>{
        tempradio = mainholder.appendChild(document.createElement('input'));
        tempradio.type = "radio";
        tempradio.id = i;
        tempradio.name = "videoselection";
        tempradio.value = i;
        templabel = mainholder.appendChild(document.createElement('label'));
        templabel.for = i;
        templabel.innerHTML = i;
        mainholder.appendChild(document.createElement('br'));


      });
      // CONNECT THESE RADIOS TO CHANGE THE VIDEO



    });
  });
});

var bucketContents = [];
var bucketName = "titan-stream";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:2e15a52d-418c-477a-bc31-c6310540df03";

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: bucketName }
});

s3.listObjects({ Bucket: "titan-stream" }, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        bucketContents = extract(data.Contents)

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', "videoFrame");
        iframe.setAttribute('videoName', bucketContents[0]);
        iframe.src = 'https://titan-stream.s3.amazonaws.com/' + bucketContents[0];
        iframe.setAttribute('height', '350');
        iframe.setAttribute('width', '90%');

        var d = document.getElementById("videoDiv");
        d.appendChild(iframe);

        var form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', '');

        var sel = document.createElement('select');
        sel.setAttribute('name', 'play');
        sel.setAttribute('id', 'videoSelect');

        var opt = null
        for (var i = 0; i < bucketContents.length; i++) {
            opt = document.createElement('option');
            opt.setAttribute('id', i + bucketContents[i]);
            opt.setAttribute('value', bucketContents[i]);
            opt.setAttribute('label', bucketContents[i]);
            sel.appendChild(opt);
            opt = null;
        }
        form.appendChild(sel);
        var b = document.getElementById('butt');
        b.appendChild(form);
    }
});

var a = document.getElementById("videoFrame")
console.log(a)
console.log(document.getElementById("videoDiv"))

function chooseVideo(selected) {
    console.log(selected);
    var frame = document.getElementById('videoFrame');
    frame.setAttribute('src', 'https://titan-stream.s3.amazonaws.com/' + selected);
    frame.setAttribute('videoName', selected);
}

function prevVideo(current) {

    if (bucketContents.length != 0) {

        var videoName = current.getAttribute('videoName');

        var ind = bucketContents.findIndex(function (s) { return s == videoName });
        if (ind - 1 < 0) {
            current.setAttribute('src', 'https://titan-stream.s3.amazonaws.com/' + bucketContents[bucketContents.length - 1]);
            current.setAttribute('videoName', bucketContents[bucketContents.length - 1]);
        }
        else {
            current.setAttribute('src', 'https://titan-stream.s3.amazonaws.com/' + bucketContents[ind - 1]);
            current.setAttribute('videoName', bucketContents[ind - 1]);
        }
    }
}

function nextVideo(current) {

    if (bucketContents.length != 0) {

        var videoName = current.getAttribute('videoName');

        var ind = bucketContents.findIndex(function (s) { return s == videoName });
        if (ind + 1 >= bucketContents.length) {
            current.setAttribute('src', 'https://titan-stream.s3.amazonaws.com/' + bucketContents[0]);
            current.setAttribute('videoName', bucketContents[0]);
        }
        else {
            current.setAttribute('src', 'https://titan-stream.s3.amazonaws.com/' + bucketContents[ind + 1]);
            current.setAttribute('videoName', bucketContents[ind + 1]);
        }
    }
}

function extract(objArr) {
    var arr = [];
    objArr.forEach(element => arr.push(element.Key));
    return arr;
}
