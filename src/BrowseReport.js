import React from 'react';
import logo from './logo.svg';
import './css/bootstrap.min.css';
import './css/navbar.css';
import './css/general.css';
import './css/dev.css';


class BrowseReport extends React.Component {

  constructor(props){
    super(props);
}

  componentDidMount(){
    const script = document.createElement("script");
    script.src = "./auth.js";
    script.async = false;
    document.body.appendChild(script);
  }


  openreport(reportid) {
    window.open("scorecards.html?reportid="+reportid)
  }

  editreport(reportid) {
    window.open("customization.html?reportid="+reportid)
  }

 deletereport(reportid) {
    document.body.script.authAndReturnParams((data)=>{
      console.log(data)
      var teamname = data.team;
      var tempprefix = teamname+"/reports/"+reportid+"/"
      var config_target = tempprefix+"report_"+teamname+"_"+reportid+".json";
      var data_target = tempprefix+"data_"+teamname+"_"+reportid+".json";

      console.log(config_target)
      console.log(data_target)
      document.body.scriptdeleteObjectAndRun("titancommonstorage",config_target,(data)=>{
        console.log("configyeeted")

      });
      document.body.scriptdeleteObjectAndRun("titancommonstorage",data_target,(data)=>{
        console.log("datayeeted")
      });


    });
    document.getElementById(reportid).remove()
  }

  authAndRun(team){
      document.body.script.listObjsAndRun(`${team}/reports`,"titancommonstorage",(data)=>{
      console.log(data);
      var keylst = [];
      for(var i = 0; i < data.Contents.length;i++){
         var tokenarr = data.Contents[i].Key.split("/");
         if(tokenarr[tokenarr.length-1] != "" &&
           tokenarr[3].split("_")[0] == "report")
          keylst.push(data.Contents[i].Key);
      }
      var mainholder = document.getElementById("holder");
        document.body.script.iteratedObjGet("titancommonstorage",keylst,[],(data)=>{
        data.forEach((d,i)=>{
          if(d.metadata){
            if(d.metadata.reportid ==   document.body.script.getUrlParam("reportid","empty")){
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
              openButton.addEventListener('click',(event)=>{this.openreport(d.metadata.reportid)},false);
              buttonDiv.appendChild(openButton);

              buttonDiv.appendChild(document.createElement("br"))

              var editButton = document.createElement("button");
              editButton.innerHTML = "Edit"
              editButton.type = "button";
              editButton.className = "btn btn-warning";
              editButton.addEventListener('click',(event)=>{this.editreport(d.metadata.reportid)},false);

              var removeButton = document.createElement("button");
              removeButton.innerHTML = "Remove"
              removeButton.type = "button";
              removeButton.className = "btn btn-danger";
              removeButton.addEventListener('click',(event)=>{this.deletereport(d.metadata.reportid)},false);

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
                document.body.script.listObjsAndRun(dir,"titancommonstorage",(data)=>{
                // console.log(data.Contents);
                if(data.Contents.some((obj)=>{return obj.Key === keyCheck})){
                  if(  document.body.script.getUrlParam("updatereport","empty") != "empty"){
                    //If new data needed to be made
                    alert("Please do not refresh the page, your report request is proccessing. When the report is ready it will appear black, if not it will stay orange");
                      document.body.script.callLambdaAndRun(d,"generate_scorecards",(result)=>{
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
                    document.body.script.callLambdaAndRun(d,"generate_scorecards",(result)=>{
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
              openButton.addEventListener('click',(event)=>{this.openreport(d.metadata.reportid)},false);
              buttonDiv.appendChild(openButton);

              buttonDiv.appendChild(document.createElement("br"))

              var editButton = document.createElement("button");
              editButton.innerHTML = "Edit"
              editButton.type = "button";
              editButton.className = "btn btn-warning";
              editButton.addEventListener('click',(event)=>{this.editreport(d.metadata.reportid)},false);

              var removeButton = document.createElement("button");
              removeButton.innerHTML = "Remove"
              removeButton.type = "button";
              removeButton.className = "btn btn-danger";
              removeButton.addEventListener('click',(event)=>{this.deletereport(d.metadata.reportid)},false);

              buttonDiv.appendChild(editButton);
              buttonDiv.appendChild(document.createElement("br"))
              buttonDiv.appendChild(removeButton);
            }



          }
        });
      });
    });
  };


  render(){
    return (

      <div class ="container-fluid mainbackground">
        <br/>
        <div id="holder" class="row">
        </div>
      </div>
  );
  }
}

export default BrowseReport;
