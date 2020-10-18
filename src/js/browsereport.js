import {authAndRun, authAndReturnParams, deleteObjectAndRun, listObjsAndRun, iteratedObjGet, callLambdaAndRun} from './auth.js'
import { getUrlParam } from './generalfunctions.js'

function openreport(reportid) {
  window.open("/scorecards?reportid="+reportid)
}

function editreport(reportid) {
  window.open("customization.html?reportid="+reportid)
}

function deletereport(reportid) {
  authAndReturnParams((data)=>{
    console.log(data)
    var teamname = data.team;
    var tempprefix = teamname+"/reports/"+reportid+"/"
    var config_target = tempprefix+"report_"+teamname+"_"+reportid+".json";
    var data_target = tempprefix+"data_"+teamname+"_"+reportid+".json";

    console.log(config_target)
    console.log(data_target)
    deleteObjectAndRun("titancommonstorage",config_target,(data)=>{
      console.log("configyeeted")

    });
    deleteObjectAndRun("titancommonstorage",data_target,(data)=>{
      console.log("datayeeted")
    });


  });
  document.getElementById(reportid).remove()
}




// function populatepage(tempuserid) {
//
//     // Using USERID call teamid
//     var teamid = fakeapi[tempuserid];
//
//     // Using teamid call reports list
//     var reports = fakeapi[teamid];
//
//     var firstblankone = document.getElementById("blank");
//     var tempcopy;
//
//
//     for (var i = 0; i < reports.length; i++) {
//       tempcopy = firstblankone.cloneNode(true);
//       tempcopy = setupcard(tempcopy,reports[i]);
//       mainholder.appendChild(tempcopy);
//     }
//     firstblankone.remove();
// }




// var userid = getUrlParam("userid","empty")


// var reportslist = [
//     {"reportid":"0001",
//      "targetteam" : "Penn",
//      "games" : ["Penn vs Harvard","Penn vs Cornell","Penn vs Princeton","Penn vs Yale"]},
//     {"reportid":"0002",
//     "targetteam" : "FSU",
//     "games" : ["FSU vs UM","FSU vs UF","FSU vs UCF"]},
//     {"reportid":"0003",
//     "targetteam" : "Alabama",
//     "games" : ["Alabama vs Texas"]}];

// var fakeapi = {"1111":"MASTER","MASTER":reportslist};



export function browseReport(){
  authAndRun((team)=>{
    listObjsAndRun(`${team}/reports`,"titancommonstorage",(data)=>{
      console.log(data);
      var keylst = [];
      for(var i = 0; i < data.Contents.length;i++){
         var tokenarr = data.Contents[i].Key.split("/");
         if(tokenarr[tokenarr.length-1] != "" &&
           tokenarr[3].split("_")[0] == "report")
          keylst.push(data.Contents[i].Key);
      }
      var mainholder = document.getElementById("holder");
      iteratedObjGet("titancommonstorage",keylst,[],(data)=>{
        data.forEach((d,i)=>{
          if(d.metadata){
            if(d.metadata.reportid == getUrlParam("reportid","empty")){
              console.log(d.metadata.reportid);
              var card = mainholder.appendChild(document.createElement('div'));
              card.className = "report-card-holder col-md-2";
              card.id = d.metadata.reportid;
              var reportlst = card.appendChild(document.createElement('div'));
              reportlst.className = "report-card"
              var h5 = reportlst.appendChild(document.createElement('h5'));
              h5.style.margin = "0px";
              var h6 = reportlst.appendChild(document.createElement('h6'));
              h6.style.marginTop = "0px";
              var icon = h6.appendChild(document.createElement('i'));
              icon.innerHTML = "Games Included";
              var gamelst = reportlst.appendChild(document.createElement('ul'));
              gamelst.className = "gameslist";
              let boldtext = document.createElement('b');
              let othertext = document.createElement('o');
              boldtext.innerHTML = d.metadata["target_team"];
              h5.appendChild(boldtext);
              othertext.textContent  = " Scouting Report -"+d.metadata.reportid;
              h5.appendChild(othertext);

              for(var j = 0; j < d.metadata.files.length; j++){
                var listitem = document.createElement("li");
                listitem.innerHTML = d.metadata.files[j].split("/")[1];
                gamelst.appendChild(listitem);
              }

              var buttonDiv = document.createElement("div");
              buttonDiv.id = "buttons";
              buttonDiv.className = "buttonholder";
              buttonDiv.align = "right";
              reportlst.appendChild(buttonDiv);
              var openButton = document.createElement("button");
              openButton.innerHTML = "Open"
              openButton.style.marginBottom = "5px";
              openButton.type = "button";
              openButton.className = "btn btn-primary";
              openButton.addEventListener('click',(event)=>{openreport(d.metadata.reportid)},false);
              buttonDiv.appendChild(openButton);

              buttonDiv.appendChild(document.createElement("br"))

              var editButton = document.createElement("button");
              editButton.innerHTML = "Edit"
              editButton.type = "button";
              editButton.className = "btn btn-warning";
              editButton.addEventListener('click',(event)=>{editreport(d.metadata.reportid)},false);

              var removeButton = document.createElement("button");
              removeButton.innerHTML = "Remove"
              removeButton.type = "button";
              removeButton.className = "btn btn-danger";
              removeButton.addEventListener('click',(event)=>{deletereport(d.metadata.reportid)},false);

              buttonDiv.appendChild(editButton);
              buttonDiv.appendChild(document.createElement("br"))
              buttonDiv.appendChild(removeButton);


              reportlst.style.backgroundColor = "rgb(100,50,50)";
              editButton.disabled = true;
              openButton.disabled = true;

              //when disabled:



  // BigRed/reports/HarvardDefense/data_BigRed_HarvardDefense.json
              // console.log(d)//this is final mapping
              // console.log("AWS REQUEST TYPE 1 HERE")
              var reportid = d.metadata.reportid;
              var keyCheck = `${team}/reports/${reportid}/data_${team}_${reportid}.json`;
              var dir = `${team}/reports/${reportid}`;
              // console.log(keyCheck)
              listObjsAndRun(dir,"titancommonstorage",(data)=>{
                // console.log(data.Contents);
                if(data.Contents.some((obj)=>{return obj.Key === keyCheck})){
                  if(getUrlParam("updatereport","empty") != "empty"){
                    //If new data needed to be made
                    alert("Please do not refresh the page, your report request is proccessing. When the report is ready it will appear black, if not it will stay orange");
                    callLambdaAndRun(d,"generate_scorecards",(result)=>{
                      console.log(result);
                      if(result.FunctionError === "Unhandled"){
                        reportlst.style.backgroundColor = "rgb(150,50,50)";
                      }
                      else{
                        reportlst.style.backgroundColor = "#1c1c1c";
                        editButton.disabled = false;
                        openButton.disabled = false;
                      }
                    });


                  }
                  else{
                    console.log("data detected");
                    //report already exists
                    reportlst.style.backgroundColor = "#1c1c1c";
                    editButton.disabled = false;
                    openButton.disabled = false;
                  }
                }
                else{
                  console.log("data not detected");
                  callLambdaAndRun(d,"generate_scorecards",(result)=>{
                    console.log(result);
                    if(result.FunctionError === "Unhandled"){
                      reportlst.style.backgroundColor = "rgb(150,50,50)";
                    }
                    else{
                      reportlst.style.backgroundColor = "#1c1c1c";
                      editButton.disabled = false;
                      openButton.disabled = false;
                    }
                  });
                  // var result = JSON.parse(data.Payload)
                  // window.location.replace("scorecards.html?reportid="+message["metadata"]["reportid"]);
                }
              });
              //awsrequest(finalmapping,reportid,1);




            }
            else{

              var card = mainholder.appendChild(document.createElement('div'));
              card.id = d.metadata.reportid;
              card.className = "report-card-holder col-md-2";
              var reportlst = card.appendChild(document.createElement('div'));
              reportlst.className = "report-card";
              var h5 = reportlst.appendChild(document.createElement('h5'));
              h5.style.margin = "0px";
              var h6 = reportlst.appendChild(document.createElement('h6'));
              h6.style.marginTop = "0px";
              var icon = h6.appendChild(document.createElement('i'));
              icon.innerHTML = "Games Included";
              var gamelst = reportlst.appendChild(document.createElement('ul'));
              gamelst.className = "gameslist";
              let boldtext = document.createElement('b');
              let othertext = document.createElement('o');
              boldtext.innerHTML = d.metadata["target_team"];
              h5.appendChild(boldtext);
              othertext.textContent  = " Scouting Report -"+d.metadata.reportid;
              h5.appendChild(othertext);

              for(var j = 0; j < d.metadata.files.length; j++){
                var listitem = document.createElement("li");
                listitem.innerHTML = d.metadata.files[j].split("/")[1];
                gamelst.appendChild(listitem);
              }

              var buttonDiv = document.createElement("div");
              buttonDiv.id = "buttons";
              buttonDiv.className = "buttonholder";
              buttonDiv.align = "right";
              reportlst.appendChild(buttonDiv);

              var openButton = document.createElement("button");
              openButton.innerHTML = "Open"
              openButton.style.marginBottom = "5px";
              openButton.type = "button";
              openButton.className = "btn btn-primary";
              openButton.addEventListener('click',(event)=>{openreport(d.metadata.reportid)},false);
              buttonDiv.appendChild(openButton);

              buttonDiv.appendChild(document.createElement("br"))

              var editButton = document.createElement("button");
              editButton.innerHTML = "Edit"
              editButton.type = "button";
              editButton.className = "btn btn-warning";
              editButton.addEventListener('click',(event)=>{editreport(d.metadata.reportid)},false);

              var removeButton = document.createElement("button");
              removeButton.innerHTML = "Remove"
              removeButton.type = "button";
              removeButton.className = "btn btn-danger";
              removeButton.addEventListener('click',(event)=>{deletereport(d.metadata.reportid)},false);

              buttonDiv.appendChild(editButton);
              buttonDiv.appendChild(document.createElement("br"))
              buttonDiv.appendChild(removeButton);
            }



          }
        });
      });
    });
  });
}
