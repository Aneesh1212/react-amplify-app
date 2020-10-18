

function updateSelectorDic(teamlst,id){
  var teamselect = document.getElementById(id);
  teamselect.innerHTML = "";
  for (var i = 0; i < teamlst.length; i++) {

    tempnode = document.createElement("option");
    tempnode.value = teamlst[i].link;                    //*******************
    textnode = document.createTextNode(teamlst[i].title); //********************
    tempnode.appendChild(textnode);
    teamselect.appendChild(tempnode);
  }

}

function loadReport(){

  var iframe = document.getElementById("preview");
  var reportlink = document.getElementById("reportname").value;
  iframe.src = reportlink;

}


authAndRun((team)=>{
  listObjsAndRun(`${team}/customreport`,"titancommonstorage",(data)=>{
    console.log(data);
    var keylst = [];
    for(var i = 0; i < data.Contents.length;i++){
       keylst.push(data.Contents[i].Key);
    }
    console.log(keylst)

    iteratedObjGet("titancommonstorage",keylst,[],(data)=>{
      console.log(data)
      updateSelectorDic(data,"reportname")
    });


  });
});
