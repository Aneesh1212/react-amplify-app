



function addUserInfo(metadata){

  var node;
  var tempnode;

  var mainholder = document.getElementById("accountinfo");


  for (var key in metadata) {

    tempnode = document.createElement("div");
    tempnode.className = "subunit"

    title = document.createElement("h3");
    value = document.createElement("h4");
    title.innerHTML= key;
    value.innerHTML= metadata[key];
    tempnode.appendChild(title)
    tempnode.appendChild(value)

    mainholder.appendChild(tempnode)

  }


}
