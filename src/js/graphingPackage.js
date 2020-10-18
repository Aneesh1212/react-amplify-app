import * as d3 from "d3";
import * as Raphael from "raphael"
import {tieredSort} from './sortingPackage.js';
import logo from '../images/TitanLogoB.png'

const fixedHeight = 500
const fixedWidth = 1200
const margin = {top:0,bottom:0,left:0,right:0};
const height = fixedHeight - margin.top - margin.bottom;
const width = fixedWidth - margin.left - margin.right;

function convToRGB(i,hex){
  var obj = d3.hsl(hex);
  var rgb = obj.rgb();
  return {id:i,r:rgb.r,g:rgb.g,b:rgb.b};
}



d3.selection.prototype.moveToFront = function() {
   return this.each(function(){
     this.parentNode.appendChild(this);
   });
 };

d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
      }
  });
};

function colorPallete(canvas){

  //online color scheme
  // convToRGB("#00203FFF"),
  // convToRGB("#FC766AFF")
  var colors=[
              //Red below
              convToRGB(0,"#FC766AFF"),
              convToRGB(1,"#EEA47FFF"),
              convToRGB(2,"#D01C1FFF"),
              convToRGB(3,"#F93822FF"),
              convToRGB(4,"#DD4132FF"),
              convToRGB(5,"#990011FF"),
              convToRGB(6,"#000000FF"),
              //Blues below
              convToRGB(7,"#00203FFF"),
              convToRGB(8,"#5B84B1FF"),
              convToRGB(9,"#00A4CCFF"),
              convToRGB(10,"#0E7A0DFF"),
              convToRGB(11,"#97BC62FF"),
              convToRGB(12,"#9CC3D5FF"),
              convToRGB(13,"#333D79FF"),
              convToRGB(14,"#00539CFF"),
              convToRGB(15,"#4B878BFF"),
              convToRGB(16,"#000000FF"),
              //Trash below
              convToRGB(17,"#9E1030FF"),
              convToRGB(18,"#E94B3CFF"),
              convToRGB(19,"#D64161FF"),
              convToRGB(20,"#00539CFF"),
              convToRGB(21,"#0063B2FF"),
              convToRGB(22,"#00B1D2FF")
  ];

  canvas.selectAll(".line")
    .data(colors)
    .enter().append("path")
    .attr("d", function (d, i) {
        var level = Math.floor(i/10);
        i = i%10;
        var x = 300 + i*60;
        var y = 100 + level*60;
        //x = x%1000;
        return  " M " + x + " " + y +
                " H " + (x+50) +
                " V " + (y+50) +
                " H " + x

    })
    .attr("fill", function (d, i) {

      return 'rgba('+d.r+', ' + d.g + ', ' + d.b  + ',1)'
    })

}

var colors=[
            convToRGB(0,"#FC766AFF"),
            // convToRGB(7,"#00203FFF"),
            convToRGB(8,"#5B84B1FF"),
            convToRGB(2,"#D01C1FFF"),
            convToRGB(9,"#00A4CCFF"),
            convToRGB(10,"#0E7A0DFF"),
            convToRGB(4,"#DD4132FF"),
            convToRGB(11,"#97BC62FF"),
            convToRGB(1,"#EEA47FFF")
            // convToRGB(5,"#990011FF"),
            // convToRGB(12,"#9CC3D5FF"),
            // convToRGB(13,"#333D79FF"),
            // convToRGB(14,"#00539CFF"),
            // convToRGB(15,"#4B878BFF"),
]

function generateColorString(color,alpha){
  return 'rgba('+ color.r +', ' + color.g + ', ' + color.b + ','+alpha+')'
}

function getColor(index){
    return colors[index];
}

function getColorSize(){
  return colors.length;
}

function addPieChart(data,uniqueID,canvas,x1,y1,x2,y2,colorDex,metadata){

    canvas.append("text")
      .text(function(){
        switch(uniqueID){
          case 0:
            return metadata["col0"];
          case 1:
            return metadata["col1"];
          case 2:
            return metadata["col2"];
        }
      })
      .attr("class","bar-graph-title")
      .attr("transform","translate("+((x1+x2)/2)+","+(y1-10)+")")

    var outDex = (colorDex+data.length)%getColorSize();
    var gap = 10;
    x2-=gap;
    x1+=gap;
    var datatotal = data.reduce(((accum,data)=>accum+data.val),0);
    var cx = (x1+x2)/2;
    var strokeWidth = 5;
    var diameter = Math.min(x2-x1,y2-y1);
    var radius = diameter/2;
    var cy = y1+radius ;
    var currpointx = cx;
    var currpointy = cy - radius;
    var currtheta =  2*Math.PI * data[0].val/datatotal;
    var flag = "0";
    if(currtheta > Math.PI){
      flag = "1";
    }
    var nextpointx = cx + radius*Math.sin(currtheta);
    var nextpointy = cy - radius*Math.cos(currtheta);
    var colordex = colorDex;
    var color = getColor(colordex);
    colordex++;
    canvas.append("path")
      .attr("d", " M " + currpointx + " " + currpointy +
                 " A " + radius + " " + radius +" 0 "+flag+" "+1+ " " + nextpointx + " " + nextpointy +
                 " L " + (cx) + " " + (cy) + " Z")
      .attr("fill", generateColorString(color,1))
      .attr("stroke","#DDDDDD")
      .attr("class", "pie" + uniqueID)
      .attr("stroke-width",strokeWidth)
      .attr("val",data[0].val)
      .attr("cat",data[0].category)
      .attr("opacity",.9)
      .attr("rad",radius)
      .attr("cpx",currpointx)
      .attr("cpy",currpointy)
      .attr("flg",flag)
      .attr("npx",nextpointx)
      .attr("npy",nextpointy)
      .attr("centx",cx)
      .attr("centy",cy)
      .attr("theta",currtheta)
      .attr("thetaDelta",2*Math.PI * data[0].val/datatotal);
    for(var i = 1; i < data.length;i++){
      currpointx = nextpointx;
      currpointy = nextpointy;
      currtheta += 2*Math.PI * data[i].val/datatotal;
      flag = "0";
      if(data[i].val/datatotal > .5){
        flag = "1";
      }
      nextpointx = cx + radius*Math.sin(currtheta);
      nextpointy = cy - radius*Math.cos(currtheta);
      colordex = colordex%getColorSize()
      color = getColor(colordex);
      colordex++;
      canvas.append("path")
        .attr("d", " M " + currpointx + " " + currpointy +
                   " A " + radius + " " + radius +" 0 "+flag+" "+1+ " " + nextpointx + " " + nextpointy +
                   " L " + (cx) + " " + (cy) + " Z")
        .attr("fill", generateColorString(color,1))
        .attr("stroke","#DDDDDD")
        .attr("class", "pie" + uniqueID)
        .attr("stroke-width",strokeWidth)
        .attr("val",data[i].val)
        .attr("cat",data[i].category)
        .attr("opacity",.9)
        .attr("rad",radius)
        .attr("cpx",currpointx)
        .attr("cpy",currpointy)
        .attr("flg",flag)
        .attr("npx",nextpointx)
        .attr("npy",nextpointy)
        .attr("centx",cx)
        .attr("centy",cy)
        .attr("theta",currtheta)
        .attr("thetaDelta",2*Math.PI * data[i].val/datatotal);
    }
    var centerrad = radius/2;
    canvas.append("circle")
      .attr("r",centerrad)
      .attr("cx",cx)
      .attr("cy",cy)
      .attr("fill","#DDDDDD")
    var maxWidth =  (x2+gap)-(x1-gap);
    var lx = x1-gap;
    var ly = y1+diameter
    var line = 1;
    var linesize = 20;
    var pad = 2;
    var lineAccum = 0;
    var currItems = new Array();
    var lrect;
    var text;
    var textWidth;
    for(var i = 0; i < data.length;i++){
      colorDex = colorDex%getColorSize()
      color = getColor(colorDex);
      colorDex++;
      lrect = canvas.append("rect")
        .attr("x",lx+lineAccum+pad)
        .attr("y",ly+linesize*(line-1) + pad)
        .attr("width",linesize-2*pad)
        .attr("height",linesize-2*pad)
        .attr("fill",generateColorString(color,1));
      text = canvas.append("text")
                    .attr("text-anchor","start")
                    .attr("alignment-baseline","middle")
                    .attr("fill","black")
                    .attr("font-size","15px")
                    .text(data[i].category)
      textWidth = text.node().getBBox().width;
      if(linesize+textWidth + 2*pad> maxWidth){
        //TODO:handle content spillover
      }
      else if(lineAccum + linesize+textWidth+2*pad > maxWidth){
        //handle wrap
        for(var j = 0; j < currItems.length;j++){
           var xDelta = parseFloat(currItems[j].attr("x"));
           currItems[j].attr("x",xDelta+(maxWidth-lineAccum)/2);
        }
        currItems = new Array();
        line++;
        lineAccum=0;
        lrect.attr("x",lx+lineAccum+pad)
            .attr("y",ly+linesize*(line-1) + pad)
        text.attr("x",lx+lineAccum + linesize + pad)
            .attr("y",ly+linesize*(line-.5));
        lineAccum = linesize+2*pad+textWidth;
        currItems.push(text);
        currItems.push(lrect);

      }
      else{
        //handle normal text placement
        text.attr("x",lx+lineAccum + linesize + pad)
            .attr("y",ly+linesize*(line-.5));
        lineAccum += linesize+2*pad+textWidth;
        currItems.push(text);
        currItems.push(lrect);
      }
    }
    if(currItems.length > 0){
      for(var i = 0; i < currItems.length;i++){
         var xDelta = parseFloat(currItems[i].attr("x"));
         currItems[i].attr("x",xDelta+(maxWidth-lineAccum)/2);
      }
    }
    let rect = canvas.append("rect")
                     .attr("x",0)
                     .attr("y",0)
                     .attr("width",0)
                     .attr("height",0)
                     .attr("fill","rgba(255,255,255,1)");
    let rwidth = 130;
    let rheight = 30;
    let label = canvas.append("text")
                      .attr("x", 0)
                      .attr("y", 0)
                      .attr("fill", "black")
                      .text("")
    let label2 = canvas.append("text")
                       .attr("x", 0)
                       .attr("y", 0)
                       .attr("fill", "black")
                       .text("")
    var mgap = 3;
    var adjust = 0;

    canvas.selectAll(".pie" + uniqueID).each(function(d,i){
      d3.select(this).moveToBack();
    });

    canvas.selectAll(".pie" + uniqueID)
        .on("mouseover", function () {
          var arc = d3.select(this);
          var rads = parseFloat(arc.attr("rad")) + 10;//ludacris 1000;
          var centx = parseFloat(arc.attr("centx"));
          var centy = parseFloat(arc.attr("centy"));
          var theta2 = parseFloat(arc.attr("theta"))
          var theta1 = theta2 - parseFloat(arc.attr("thetaDelta"))
          var npx = centx + rads*Math.sin(theta2);
          var npy = centy - rads*Math.cos(theta2);
          var cpx = centx + rads*Math.sin(theta1);
          var cpy = centy - rads*Math.cos(theta1);

          arc.attr("opacity", 1)
              .transition().duration(200)
              .attr("d", " M " + cpx + " " + cpy +
                         " A " + rads + " " + rads +" 0 "+arc.attr("flg")+" "+1+ " " + npx + " " + npy +
                         " L " + (arc.attr("centx")) + " " + (arc.attr("centy")) + " Z");

          label.text("Count: " + d3.select(this).attr("val"))
                                                .attr("x", (d3.pointer(this)[0] + 5)-adjust)
                                                .attr("y", (d3.pointer(this)[1] - 5));
          label2.text("Name: " + d3.select(this).attr("cat"))
                                                .attr("x", (d3.pointer(this)[0] + 5)-adjust)
                                                .attr("y", (d3.pointer(this)[1] - 20));

          rwidth = Math.max(label2.node().getBBox().width + 5,
                            label.node().getBBox().width + 5);

          rect.attr("x",d3.pointer(this)[0]+mgap-adjust)
              .attr("y",d3.pointer(this)[1]-rheight-mgap)
              .attr("width",rwidth)
              .attr("height",rheight)
              .attr("fill","rgba(255,255,255,.9)");

          rect.moveToFront();
          label.moveToFront();
          label2.moveToFront();
        })
        .on("mouseout", function () {
          var arc = d3.select(this);
          arc.attr("opacity", 0.9).transition().duration(200)
             .attr("d", " M " + arc.attr("cpx") + " " + arc.attr("cpy") +
                       " A " + (arc.attr("rad")) + " " + (arc.attr("rad")) +" 0 "+arc.attr("flg")+" "+1+ " " + arc.attr("npx") + " " + arc.attr("npy") +
                       " L " + (arc.attr("centx")) + " " + (arc.attr("centy")) + " Z");
          label.text("");
          label2.text("");
          rect.attr("x",d3.pointer(this)[0])
              .attr("y",d3.pointer(this)[1]-rheight)
              .attr("width",0)
              .attr("height",0)
              .attr("fill","rgba(255,255,255,0)");
        })
        .on("mousemove", function () {
          if(d3.pointer(this)[0]+mgap + rwidth > fixedWidth){
            adjust = rwidth;}
          else{adjust = 0;}
          label2.attr("x", (d3.pointer(this)[0] + 5)-adjust)
                .attr("y", (d3.pointer(this)[1] - 20 ))
          label.attr("x", (d3.pointer(this)[0] + 5 )-adjust)
               .attr("y", (d3.pointer(this)[1] - 5 ))
          rect.attr("x",d3.pointer(this)[0]+mgap-adjust)
              .attr("y",d3.pointer(this)[1]-rheight-mgap)
              .attr("width",rwidth)
              .attr("height",rheight)
              .attr("fill","rgba(255,255,255,.9)")
        });
    return outDex;
}

function addLoadingBars(canvas) {
  canvas.append("line")
    .attr("class", "loading-bar1")
    .attr("id", "bar1")
    .attr("x1", (width / 2 - 15))
    .attr("y1", (height / 2) - 17)
    .attr("x2", (width / 2 - 15))
    .attr("y2", (height / 2) + 17)
    .attr("stroke-width", 2)
    .attr("stroke", "blue")
  canvas.append("line")
    .attr("class", "loading-bar2")
    .attr("id", "bar2")
    .attr("x1", (width / 2 - 5))
    .attr("y1", (height / 2) - 17)
    .attr("x2", (width / 2 - 5))
    .attr("y2", (height / 2) + 17)
    .attr("stroke-width", 2)
    .attr("stroke", "green")
  canvas.append("line")
    .attr("class", "loading-bar3")
    .attr("id", "bar3")
    .attr("x1", (width / 2 + 5))
    .attr("y1", (height / 2) - 17)
    .attr("x2", (width / 2 + 5))
    .attr("y2", (height / 2) + 17)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
  canvas.append("line")
    .attr("class", "loading-bar4")
    .attr("id", "bar4")
    .attr("x1", (width / 2 + 15))
    .attr("y1", (height / 2) - 17)
    .attr("x2", (width / 2 + 15))
    .attr("y2", (height / 2) + 17)
    .attr("stroke-width", 2)
    .attr("stroke", "orange")
}

function removeLoadingBars(canvas) {
  canvas.select("line.loading-bar1").remove();
  canvas.select("line.loading-bar2").remove();
  canvas.select("line.loading-bar3").remove();
  canvas.select("line.loading-bar4").remove();
}

function addBarGraph(data, uniqueID, canvas, x1, y1, x2, y2,colorDex,metadata) {
  var transition_delay = 500;
  if(data.length > 14){
    transition_delay = 4200/data.length;
  }

  x1 = x1+5;
  x2 = x2-5;
  var outDex = (colorDex+data.length)%getColorSize();
  var minCount = data[0].val;
  var totalCount = 0;
  var accumHeight = y2-y1-1;
  for (var i = 0; i < data.length - 1; i++) {
    for (var j = 0; j < data.length - 1; j++) {
      if (data[j].category < data[j + 1].category) {
        //swap!
        var temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }

  for (i = 0; i < data.length; i++) {
      if(data[i].val < minCount){
          minCount = data[i].val;
      }
      totalCount+=data[i].val;
  }

  var acceptableHeight = 15;
  var barHeight = ((y2-y1)*(minCount/totalCount));
  var barHeights = {};
  for(var i = 0; i < data.length; i++){
    var height = ((y2-y1)*(data[i].val/totalCount))
    if(barHeight < acceptableHeight){
      if(height < acceptableHeight){
        barHeights[i] = barHeight;
      }
      else{
        barHeights[i] = acceptableHeight;
      }
    }
    else{
      barHeights[i] = barHeight;
    }

  }
  var vert_scale = (y2 - y1) / totalCount;

  const margin = { top: 0, bottom: 0, left: 0, right: 0 };

  var max = d3.max(data.map(d => d.val));
  var min = d3.min(data.map(d => d.val));

  var y = d3.scaleBand().rangeRound([y2 - y1, 0]).padding(0);
  var x = d3.scaleLinear().rangeRound([0, x2 - x1]);
  y.domain(data.map(d => d.category));
  x.domain([0, max]);


  var tix = Math.min(max,10);
  //add the x axisto the graph
  canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (margin.left + x1) + "," + (y2 + margin.top + 10) + ")")
        .call(d3.axisBottom(x).ticks(tix).tickFormat(d3.format("d")));

  canvas.selectAll(".bar" + uniqueID)
    .data(data)
    .enter().append("rect")
    .attr("transform", "translate(" + (margin.left + x1) + "," + (margin.top + y1) + ")")
    .attr("class", "bar" + uniqueID + " hover"+uniqueID)
    .attr("opacity", 0.9)
    .attr("fill", function(d, i){
        colorDex = colorDex%getColorSize();
        var color = getColor((colorDex+data.length-1)%getColorSize());
        colorDex--;
        return generateColorString(color,1)
      })
    .attr("x", 0)
    .attr("y", function(d,i){
        var temp = accumHeight - ((barHeight*d.val/minCount)/2)-barHeights[i]/2;
        accumHeight = accumHeight - (barHeight*d.val/minCount);
        return temp;
    })
    .attr("height", function(d,i){
        return barHeights[i];
    })
    .attr("count",d => d.val)
    .transition()
    .duration(1000)
    .delay(function (d, i) {
      return data.length*transition_delay - i * transition_delay;
    })
    .attr("name", d => d.category)
    .attr("width", d => x(d.val))


    var accumHeight = y2-y1;
    var temp = 0;
    for(let i = 0; i < data.length; i++){
      if(barHeights[i] >= acceptableHeight)
        var bText = canvas.append("text")
          .text(data[i].category)
          .attr("class","bar-graph-text hover"+uniqueID)
          .attr("fill","black")
          .attr("count",data[i].val)
          .attr("name",data[i].category)
          .style("cursor","default")
          .style("font-size",15)
          .style("font-weight","bold")
          .attr("stroke-width",1)
        temp = accumHeight - ((barHeight*data[i].val/minCount)/2)-barHeight/2
        accumHeight = accumHeight - (barHeight*data[i].val/minCount)
        if(barHeights[i] >= acceptableHeight){
          bText.attr("x",x2)
          bText.attr("y",(y1+temp)+barHeight/2+5)
        }
    }
    canvas.append("text")
          .text("Count")
          .attr("class","bar-graph-text2")
          .attr("transform","translate("+((x1+x2)/2)+","+(y2+40)+")")
    var yHeight = "";
    var xHeight = "";
    canvas.append("text")
          .text(function(){
              switch(uniqueID){
                case 0:
                  return metadata["col0"];
                case 1:
                  return metadata["col1"];
                case 2:
                  return metadata["col2"];
              }
          })
          .attr("class","bar-graph-title")
          .attr("transform","translate("+((x1+x2)/2)+","+(y1-10)+")")

      let rect = canvas.append("rect").attr("x",0)
                                      .attr("y",0)
                                      .attr("width",0)
                                      .attr("height",0)
                                      .attr("fill","rgba(255,255,255,1)")
      let rwidth = 130;
      let rheight = 30;
      let label = canvas.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("fill", "black")
                        .text("")
      let label2 = canvas.append("text")
                         .attr("x", 0)
                         .attr("y", 0)
                         .attr("fill", "black")
                         .text("")
      var mgap = 3;
      var adjust = 0;
      canvas.selectAll(".bar" + uniqueID)//TODO: make hover over text to (change class from bar to hover and fix bugs)
          .on("mouseover", function () {
            d3.select(this).attr("opacity", 1);

            label.text("Count: " + d3.select(this).attr("count"))
                                                  .attr("x", (d3.pointer(this)[0] + 5+x1)-adjust)
                                                  .attr("y", (d3.pointer(this)[1] - 5+y1));
            label2.text("Name: " + d3.select(this).attr("name"))
                                                  .attr("x", (d3.pointer(this)[0] + 5+x1)-adjust)
                                                  .attr("y", (d3.pointer(this)[1] - 20+y1));
            rwidth = Math.max(label2.node().getBBox().width + 5,
                              label.node().getBBox().width + 5);
            rect.attr("x",d3.pointer(this)[0]+x1+mgap - adjust)
                .attr("y",d3.pointer(this)[1]-rheight+y1-mgap)
                .attr("width",rwidth)
                .attr("height",rheight)
                .attr("fill","rgba(255,255,255,.9)");

            rect.moveToFront();
            label.moveToFront();
            label2.moveToFront();
          })
          .on("mouseout", function () {
            d3.select(this).attr("opacity", 0.9);
            label.text("")
            label2.text("")
            rect.attr("x",d3.pointer(this)[0]+x1)
                .attr("y",d3.pointer(this)[1]-rheight+y1)
                .attr("width",0)
                .attr("height",0)
                .attr("fill","rgba(255,255,255,0)")
          })
          .on("mousemove", function () {
            if(d3.pointer(this)[0]+mgap + rwidth +x1> fixedWidth){
              adjust = rwidth;
            }
            else{
              adjust = 0;
            }
            label2.attr("x", (d3.pointer(this)[0] + 5 + x1)-adjust).attr("y", (d3.pointer(this)[1] - 20 + y1))
            label.attr("x", (d3.pointer(this)[0] + 5 + x1)-adjust).attr("y", (d3.pointer(this)[1] - 5 + y1))
            rect.attr("x",d3.pointer(this)[0]+x1+mgap-adjust)
                .attr("y",d3.pointer(this)[1]-rheight+y1-mgap)
                .attr("width",rwidth)
                .attr("height",rheight)
                .attr("fill","rgba(255,255,255,.9)")
          });
    return outDex;

};

function addSankey(uniqueID,data, canvas, pad,x1, y1, x2, y2,barflag,colorDex1,colorDex2) {

  var transition_delay = 300;
  if(data.length > 14){
    transition_delay = 4200/data.length;
  }
  function toString(x, y) {
    return "" + x + " " + y + "";
  }

  function convToRGB(hex){
    var obj = d3.hsl(hex);
    var rgb = obj.rgb();
    return {r:rgb.r,g:rgb.g,b:rgb.b};
  }

  var inTotals = {};
  var outTotals = {};
  var total = 0;

  var val = data[0].in;
  for (var i = 0; i < data.length; i++) {
    if (data[i].in != val) {
      val = data[i].in;
      colorDex1++;
      colorDex1 = colorDex1 % getColorSize();
    }
    data[i].color = getColor(colorDex1);
    //intotal population
    if(data[i].in in inTotals){
      inTotals[data[i].in] += data[i].count;
    }
    else{
      inTotals[data[i].in] = data[i].count;
    }
    //outtotal population
    if(data[i].out in outTotals){
      outTotals[data[i].out] += data[i].count;
    }
    else{
      outTotals[data[i].out] = data[i].count;
    }

    data[i].start = total;
    data[i].id = i;
    total += data[i].count;
  }

  //sort in order to be able to easily set end locations
  //sort will be on the out collumn first, since the in collumn is already ordered
  //it is exepcted that the it will remain ordered after a bubble sort, within
  //each bin
  for (var i = 0; i < data.length - 1; i++) {
    for (var j = 0; j < data.length - 1; j++) {
      if (data[j].out > data[j + 1].out) {
        //swap!
        var temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }
  //end order calculation
  var sum = 0;
  for (var i = 0; i < data.length; i++) {
    //populates datas intotals
    data[i].intotal = inTotals[data[i].in];
    data[i].outtotal = outTotals[data[i].out];
    //populates end calculation
    data[i].end = sum;
    sum += data[i].count;
  }
  var vert_scale = (y2 - y1) / total;


  var gap = 10;

  //==second set of bars=================================================================
  var first = data[0].out;
  var vertstroke = 1;//in pixels
  var start = data[0].end;
  var end = data[0].count + start;
  var color = getColor(colorDex2);
  data[0].end_color = color;
  if(barflag){
    for (var i = 1; i < data.length; i++) {
      if (data[i].out != first) {
        canvas.append("path")
          .attr("class","sankeyrect"+uniqueID)
          .attr("count",data[i-1].outtotal)
          .attr("val",data[i-1].out)
          .attr("d", " M " + toString(x2 , y1 + (start * vert_scale) -vertstroke) +
                     " H " + (x2 - 20) +
                     " V " + (y1 + (end * vert_scale) + vertstroke) +
                     " H " + x2)
          .attr("fill", "rgb(" + color.r + "," + color.g + "," + color.b + ")")
        colorDex2 = (colorDex2 + 1) % getColorSize();
        first = data[i].out;
        start = data[i].end;
        end = data[i].count + start;
        color = getColor(colorDex2);
        data[i].end_color = color;
      }
      else {
        data[i].end_color = color;
        end = data[i].end + data[i].count;
      }
    }
    end = data[data.length - 1].end + data[data.length - 1].count;
    data[data.length - 1].end_color = color;
    canvas.append("path")
      .attr("class","sankeyrect"+uniqueID)
      .attr("count",data[data.length-1].outtotal)
      .attr("val",data[data.length-1].out)
      .attr("d", " M " + toString(x2, y1 + start * vert_scale -vertstroke) +
        " H " + (x2 - 20) +
        " V " + (y1 + end * vert_scale + vertstroke) +
        " H " + (x2))
      .attr("fill", "rgb(" + color.r + "," + color.g + "," + color.b + ")");
  }
  //=========================================================================

  //reorder for aesthetic
  for (var i = 0; i < data.length - 1; i++) {
    for (var j = 0; j < data.length - 1; j++) {
      if (data[j].id > data[j + 1].id) {
        //swap!
        var temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }

  //=====First set of bars=====================================================================
  var first = data[0].in;
  var start = data[0].start;
  var end = data[0].count + start;
  var color = data[0].color;
  if(barflag){
    for (var i = 0; i < data.length; i++) {
      if (data[i].in != first) {
        first = data[i].in;
        color = data[i].color;
      }
      canvas.append("path")
        .attr("class","sankeyrect"+uniqueID)
        .attr("count",data[i].intotal)
        .attr("val",data[i].in)
        .attr("d", " M " + toString(x1, y1 + data[i].start * vert_scale - vertstroke) +
          " H " + (x1 + 20) +
          " V " + (y1 + data[i].start*vert_scale + data[i].count * vert_scale + vertstroke) +
          " H " + x1)
        .attr("fill", "rgb(" + color.r + "," + color.g + "," + color.b + ")");

    }
  }
  //============================================================================


  x1 += (20 + gap);
  canvas.selectAll(".sankeyline"+uniqueID)
    .data(data)
    .enter().append("path")
    .attr("class", "sankeyline"+uniqueID)
    .attr("d", function (d, i) {
      var mid = ((x2-(20+gap)) - x1) / 2;
      return (" M " + toString(x1, y1 + d.start * vert_scale + pad) +
        " C " + toString(x1 + mid, y1 + d.start * vert_scale + pad) + " " + toString(x1 + mid, y1 + d.end * vert_scale + pad) + " " + toString(x2-(gap+20), y1 + d.end * vert_scale + pad) +
        " L " + toString(x2-(gap+20), y1 + d.end * vert_scale + d.count * vert_scale - pad) +
        " C " + toString(x1 + mid, y1 + d.end * vert_scale + d.count * vert_scale - pad) + " " + toString(x1 + mid, y1 + d.start * vert_scale + d.count * vert_scale - pad) + " " + toString(x1, y1 + d.start * vert_scale + d.count * vert_scale - pad) +
        " Z ");

    })
    .attr("fill", function (d, i) {
      var col = d.color;
      var ecol = d.end_color;
      canvas.insert("defs").html("<linearGradient id='"+uniqueID+"grad" + i + "' x1='0%' y1='0%' x2='100%' y2='0%'>" +
        "<stop offset='0%' style='stop-color:rgb(" + col.r + "," + col.g + "," + col.b + ");stop-opacity:1' />" +
        "<stop offset='100%' style='stop-color:rgb(" + col.r + "," + col.g + "," + col.b + ");stop-opacity:1' />" +
        "</linearGradient>");
      return "url(#"+uniqueID+"grad" + i + ")"//'rgba('+col.r+', ' + col.g + ', ' + col.b  + ',.5)'
    })
    .attr("opacity", 0.0) //KEVIN ADDED THIS HERE FOR MOUSEOVER EFFECT
    .attr("count", function (d, i) { return d.count }) //KEVIN ADDED THIS ATTRIBUTE TO BE ABLE TO PRINT ON MOUSE HOVER
    .transition()
    .duration(1000)
    .delay(function (d, i) {
      return i * transition_delay;
    })
    .attr("opacity",0.5)



    let rect = canvas.append("rect").attr("x",0)
                                    .attr("y",0)
                                    .attr("width",0)
                                    .attr("height",0)
                                    .attr("fill","rgba(255,255,255,1)")
    let rwidth = 130;
    let rheight = 30;
    var adjust = 0;
    var mgap = 3;
    let label = canvas.append("text")
                      .attr("x", 0)
                      .attr("y", 0)
                      .attr("fill", "black")
                      .text("")
    let label2 = canvas.append("text")
                       .attr("x", 0)
                       .attr("y", 0)
                       .attr("fill", "black")
                       .text("")
    canvas.selectAll(".sankeyline"+uniqueID)
        .on("mouseover", function () {
          d3.select(this)
            .attr("opacity", 1)
          label.text("Count: " + d3.select(this).attr("count"))
                                                .attr("x", (d3.pointer(this)[0] + 5+x1-adjust))
                                                .attr("y", (d3.pointer(this)[1] - 20+y1));
          rwidth = label.node().getBBox().width + 5;
          rect.attr("x",d3.pointer(this)[0]+x1+mgap-adjust)
              .attr("y",d3.pointer(this)[1]-.5*rheight+y1-mgap)
              .attr("width",rwidth)
              .attr("height",rheight/2)
              .attr("fill","rgba(255,255,255,.9)")
          rect.moveToFront();
          label.moveToFront();
          label2.moveToFront();
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("opacity", 0.5)
          label.text("")
          rect.attr("x",d3.pointer(this)[0]+x1)
              .attr("y",d3.pointer(this)[1]+y1)
              .attr("width",0)
              .attr("height",0)
              .attr("fill","rgba(255,255,255,0)")
        })
        .on("mousemove", function () {
          if(d3.pointer(this)[0]+mgap + rwidth > fixedWidth-5){
            adjust = rwidth;
          }
          else{
            adjust = 0;
          }
          label.attr("x", (d3.pointer(this)[0] + 5)-adjust).attr("y", (d3.pointer(this)[1] - 5 ))
          rect.attr("x",d3.pointer(this)[0]+mgap-adjust)
              .attr("y",d3.pointer(this)[1]-.5*rheight-mgap)
              .attr("width",rwidth)
              .attr("height",rheight/2)
              .attr("fill","rgba(255,255,255,.9)")
        });


        canvas.selectAll(".sankeyrect"+uniqueID)
            .on("mouseover", function () {
              label.text("Count: " + d3.select(this).attr("count"))
                                                    .attr("x", (d3.pointer(this)[0] + 5+x1)-adjust)
                                                    .attr("y", (d3.pointer(this)[1] - 5+y1));
              label2.text("Name: "+ d3.select(this).attr("val"))
                                                   .attr("x", (d3.pointer(this)[0] + 5+x1)-adjust)
                                                   .attr("y", (d3.pointer(this)[1] - 20+y1));
              rwidth = Math.max(label2.node().getBBox().width + 5,label.node().getBBox().width + 5);
              rect.attr("x",d3.pointer(this)[0]+x1+mgap-adjust)
                  .attr("y",d3.pointer(this)[1]-rheight+y1-mgap)
                  .attr("width",rwidth)
                  .attr("height",rheight)
                  .attr("fill","rgba(255,255,255,.9)")
              rect.moveToFront();
              label.moveToFront();
              label2.moveToFront();
            })
            .on("mouseout", function () {
              label.text("")
              label2.text("")
              rect.attr("x",d3.pointer(this)[0])
                  .attr("y",d3.pointer(this)[1]-rheight)
                  .attr("width",0)
                  .attr("height",0)
                  .attr("fill","rgba(255,255,255,0)")
            })
            .on("mousemove", function () {
              if(d3.pointer(this)[0]+mgap + rwidth > fixedWidth){
                adjust = rwidth;
              }
              else{
                adjust = 0;
              }
              label2.attr("x", (d3.pointer(this)[0] + 5)-adjust).attr("y", (d3.pointer(this)[1] - 20))
              label.attr("x", (d3.pointer(this)[0] + 5)-adjust).attr("y", (d3.pointer(this)[1] - 5))
              rect.attr("x",d3.pointer(this)[0]+mgap-adjust)
                  .attr("y",d3.pointer(this)[1]-rheight-mgap)
                  .attr("width",rwidth)
                  .attr("height",rheight)
                  .attr("fill","rgba(255,255,255,.9)")
            });
}

function addHeatChart(data,canvas,x1,y1,x2,y2){
  var xunit = (x2-x1)/3;
  var yunit = (y2-y1)/5;
  canvas.insert("defs").html(
    "<pattern id='grass' width='100%' height='100%'>" +
      "<image xlink:href='./Images/grasstexture-low-res.jpg' width='"+(x2-x1)+"'/>" +
    "</pattern>");

  canvas.insert("defs").html(
    "<filter id='gaus' x='-40%' y='-40%' width='300%' height ='300%'>" +
      "<feGaussianBlur in='SourceGraphic' stdDeviation='5' />" +
    "</filter>");

    canvas.append("rect")
      .attr("x",x1)
      .attr("y",y1)
      .attr("width",xunit*3)
      .attr("height",yunit*5)
      .attr("fill","url(#grass)")
      .attr("filter","url(#gaus)")

    var tWidth = 12;
    var width = x2-x1;
    if(width > 320){
      tWidth = 18;
    }
    else if(width>250){
      tWidth = 16;
    }
    else if(width>200){
      tWidth = 15;
    }
    else if(width>180){
      tWidth = 14;
    }

    var dataTotal = 0;
    for(var ix = 0; ix < 3; ix++){
      for(var iy = 0; iy < data.length;iy++){
        dataTotal += data[iy][ix];
      }
    }
    var col;
    var textAnchor;
    for(var ix = 0; ix < 3; ix++){
      for(var iy = 0; iy < data.length;iy++){
        col = convToRGB(0,"#00539CFF");


        canvas.append("rect")
          .attr("x",x1+ix*xunit)
          .attr("y",y1+iy*yunit)
          .attr("width",xunit)
          .attr("height",yunit)
          .attr("fill","rgba("+col.r+","+col.g+","+col.b+","+(4*data[iy][ix]/dataTotal) +")")
          .attr("stroke","white")
          .attr("stroke-width","5px");

        textAnchor = {
          x: x1+(ix+.5)*xunit,
          y: y1+(iy+.5)*yunit
        }

        canvas.append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline","middle")
          .attr("x", textAnchor.x)
          .attr("y", textAnchor.y)
          .attr("fill", "white")
          .attr("letter-spacing",.2)
          .text(Math.round(((data[iy][ix]/dataTotal)+Number.EPSILON)*1000)/10 + "%")
          .attr("font-size", tWidth + "px");
      }
    }

    var othick = .3;
    var gap = 10;
    var textAnchor = {
      x: x1 - gap,
      y: y2
    };

    canvas.append("text")
        .attr("text-anchor","end")
        .attr("alignment-baseline","middle")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("-5");

    textAnchor.y -= yunit;

    canvas.append("text")
        .attr("text-anchor","end")
        .attr("alignment-baseline","middle")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("0");

    canvas.append("path")
      .attr("d"," M " + "" + (x1-(gap/2)) + " " + textAnchor.y + " H " + (x2 + (gap/2)))
      .attr("stroke","yellow")
      .attr("stroke-width","5px");

    textAnchor.y -= yunit;

    canvas.append("text")
        .attr("text-anchor","end")
        .attr("alignment-baseline","middle")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("5");

    textAnchor.y -= yunit;

    canvas.append("text")
        .attr("text-anchor","end")
        .attr("alignment-baseline","middle")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("10");

    textAnchor.y -= yunit;

    canvas.append("text")
        .attr("text-anchor","end")
        .attr("alignment-baseline","middle")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("15+");

    textAnchor = {
      x: x1 + (xunit/2),
      y: y1 - gap
    }

    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("L");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("M");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("R");

}

function addRunGapChart(data,canvas,x1,y1,x2,y2){
  var xunit = (x2-x1)/5;
  canvas.insert("defs").html(
    "<pattern id='grass' width='100%' height='100%'>" +
      "<image xlink:href='./Images/grasstexture-low-res.jpg' width='"+(x2-x1)+"'/>" +
    "</pattern>");

  canvas.insert("defs").html(
    "<filter id='gaus' x='-40%' y='-40%' width='300%' height ='300%'>" +
      "<feGaussianBlur in='SourceGraphic' stdDeviation='5' />" +
    "</filter>");
    canvas.append("rect")
      .attr("x",x1)
      .attr("y",y1)
      .attr("width",xunit*5)
      .attr("height",y2-y1)
      .attr("fill","url(#grass)")
      .attr("filter","url(#gaus)")

    var tWidth = 8;
    var width = x2-x1;
    if(width > 320){
      tWidth = 16;
    }
    else if(width>250){
      tWidth = 14;
    }
    else if(width>220){
      tWidth = 12;
    }
    else if(width>180){
      tWidth = 10;
    }

    var dataTotal = 0;
    for(var ix = 0; ix < 5; ix++){
      dataTotal += data[ix];
    }

    var col;
    var textAnchor;
    for(var ix = 0; ix < 5; ix++){
      col = convToRGB(0,"#00539CFF");

      canvas.append("rect")
        .attr("x",x1+ix*xunit)
        .attr("y",y1)
        .attr("width",xunit)
        .attr("height",y2-y1)
        .attr("fill","rgba("+col.r+","+col.g+","+col.b+","+(1.5*data[ix]/dataTotal) +")")
        .attr("stroke","white")
        .attr("stroke-width","5px");

      textAnchor = {
        x: x1+(ix+.5)*xunit,
        y: (y2+y1)/2
      }

      canvas.append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline","middle")
        .attr("x", textAnchor.x)
        .attr("y", textAnchor.y)
        .attr("fill", "white")
        .attr("letter-spacing",.2)
        .text(Math.round(((data[ix]/dataTotal)+Number.EPSILON)*1000)/10 + "%")
        .attr("font-size", tWidth + "px");

    }

    var othick = .3;
    var gap = 10;

    var textAnchor = {
      x: x1 + (xunit/2),
      y: y1 - gap
    }

    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("LO");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("LI");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("M");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("RI");

    textAnchor.x += xunit;
    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("x",textAnchor.x)
        .attr("y",textAnchor.y)
        .attr("fill","Black")
        .attr("font-size",tWidth+"px")
        .text("RO");

}

function addFieldChart(data, metadata,canvas, x1, y1, x2) {

  let p1 = { x: x1, y: y1 };
  let p2 = { x: x2, y: y1 };
  let pm = { x: (x1+x2)/2, y: y1-(x2-x1) };
  let p = .25;
  function toString(x, y) {
    return "" + x + " " + y + "";
  }

  canvas.append("path")
    .attr("d", " M " + toString(p1.x, p1.y) +
      " L " + toString(pm.x, pm.y) +
      " L " + toString(p2.x, p2.y) +
      " Z ")
    .attr("fill", "rgba(255,255,255,0)");

  function newPoint(iP, fP, p) {

    var x = (1.0 - p) * iP.x + p * fP.x;
    var y = (1.0 - p) * iP.y + p * fP.y;
    return { x: x, y: y };
  }

  canvas.append("path")
    .attr("d", " M " + toString(p1.x, p1.y) +
      " L " + toString(newPoint(p1, pm, p).x, newPoint(p1, pm, p).y) +
      " L " + toString(newPoint(p2, pm, p).x, newPoint(p2, pm, p).y) +
      " L " + toString(p2.x, p2.y) +
      " Z ")
    .attr("fill", "white");

  var gapProp = .05;
  var step = (p2.x - p1.x) / 12;

//=======add outer edges======
  var tp1 = { x: p1.x + (1 - 1) * step , y: p1.y };
  var tp2 = { x: p1.x + (1) * step, y: p1.y };
  var width = newPoint(tp1,tp2,gapProp).x-tp1.x;
  var tp12 = {x:tp1.x-width,y:tp1.y}
  var tp13 = newPoint(tp12,pm,p);
  var tp14 = newPoint(tp1,pm,p)


  var p3= tp13;

  canvas.append("path")
    .attr("d"," M " +toString(tp1.x,tp1.y) +
              " L " +toString(tp12.x,tp12.y) +
              " L " +toString(tp13.x,tp13.y) +
              " L " +toString(tp14.x,tp14.y) +
              " Z ")
    .attr("fill","White")

  var tp3 = { x: p1.x + (12 - 1) * step , y: p1.y };
  var tp4 = { x: p1.x + (12) * step, y: p1.y };
  var width = newPoint(tp3,tp4,gapProp).x-tp3.x;
  var tp42 = {x:tp4.x+width,y:tp4.y}
  var tp43 = newPoint(tp42,pm,p);
  var tp44 = newPoint(tp4,pm,p);
  var p4=tp43;
  canvas.append("path")
    .attr("d"," M " +toString(tp4.x,tp4.y) +
              " L " +toString(tp42.x,tp42.y) +
              " L " +toString(tp43.x,tp43.y) +
              " L " +toString(tp44.x,tp44.y) +
              " Z ")
    .attr("fill","white")

    var temp = newPoint(p3,p4,.2);
    p4 = newPoint(p4,p3,.2);
    p3 = temp;
    canvas.append("path")
    .attr("d", " M " + toString(p3.x, p3.y-2) +
      " L " + toString(p3.x, p3.y-75) +
      " L " + toString(p4.x, p4.y-75) +
      " L " + toString(p4.x, p4.y-2) +
      " Z ")
    .attr("fill", "White")
    .attr("stroke","Black");

    //Metadata display
    var lTextAnchor = newPoint(p3,p4,.2);
    lTextAnchor.y -= 50;
    canvas.append("text")
      .attr("text-anchor", "middle")
      .attr("x", lTextAnchor.x)
      .attr("y", lTextAnchor.y)
      .attr("fill", "Black")
      .attr("letter-spacing",.2)
      .text(metadata.team1)
      .attr("font-size", 18 + "px")




    canvas.append("path")
    .attr("d", " M " + toString(lTextAnchor.x, lTextAnchor.y-15) +
               " L " + toString(lTextAnchor.x+5, lTextAnchor.y-19) +
               " L " + toString(lTextAnchor.x-5, lTextAnchor.y-19) +
               " Z ")
    .attr("fill", "Red")
    .attr("stroke","Black");



    var rTextAnchor = newPoint(p4,p3,.2);
    rTextAnchor.y -= 50;
    canvas.append("text")
      .attr("text-anchor", "middle")
      .attr("x", rTextAnchor.x)
      .attr("y", rTextAnchor.y)
      .attr("fill", "Black")
      .attr("letter-spacing",.2)
      .text(metadata.team2)
      .attr("font-size", 18 + "px")

      var mTextAnchor = newPoint(p4,p3,.5);
      mTextAnchor.y -= 50;
      canvas.append("text")
        .attr("text-anchor", "middle")
        .attr("x", mTextAnchor.x)
        .attr("y", mTextAnchor.y)
        .attr("fill", "Black")
        .attr("letter-spacing",.2)
        .text(metadata.score)
        .attr("font-size", 16 + "px")

      mTextAnchor.y += 12;
      canvas.append("text")
        .attr("text-anchor", "middle")
        .attr("x", mTextAnchor.x)
        .attr("y", mTextAnchor.y)
        .attr("fill", "Black")
        .attr("letter-spacing",.2)
        .text(metadata.gameClock)
        .attr("font-size", 10 + "px")

        let totalyards = data[data.length-1].end - data[0].start;
        mTextAnchor.y += 18;
        canvas.append("text")
          .attr("text-anchor", "middle")
          .attr("x", mTextAnchor.x)
          .attr("y", mTextAnchor.y)
          .attr("fill", "Black")
          .attr("letter-spacing",.2)
          .text(metadata.outcome + " => " + totalyards)
          .attr("font-size", 15 + "px")

    //legend
      canvas.append("rect")
        .attr("x",p1.x + 96)
        .attr("y",p1.y + 6)
        .attr("width",148)
        .attr("height",24)
        .attr("fill","white")
      canvas.append("rect")
        .attr("x",p1.x + 100)
        .attr("y",p1.y + 10)
        .attr("width",15)
        .attr("height",15)
        .attr("fill","red")
      canvas.append("text")
        .attr("x",p1.x + 120)
        .attr("y",p1.y + 25)
        .attr("fill","black")
        .attr("font-size","20px")
        .text("Run")
      canvas.append("rect")
        .attr("x",p1.x + 175)
        .attr("y",p1.y + 10)
        .attr("width",15)
        .attr("height",15)
        .attr("fill","blue")
      canvas.append("text")
        .attr("x",p1.x + 195)
        .attr("y",p1.y + 25)
        .attr("fill","black")
        .attr("font-size","20px")
        .text("Pass")

  //============================


  for (var i = 1; i <= 12; i++) {
    var color = "green" //can use a filter and feImage to create field background
    if (i == 1 || i == 12) {
      color = "grey";
    }


    var cp1 = { x: p1.x + (i - 1) * step, y: p1.y };
    var cp4 = { x: p1.x + (i) * step, y: p1.y };
    var cp2 = newPoint(cp1, pm, p);
    var cp3 = newPoint(cp4, pm, p);
    var tp1 = newPoint(cp1,cp4,gapProp);
    cp4 = newPoint(cp1,cp4,1-gapProp);
    cp1 = tp1;
    tp1 = newPoint(cp2,cp3,gapProp);
    cp3 = newPoint(cp2,cp3,1-gapProp);
    cp2 = tp1;

    tp1 = newPoint(cp1,cp2,gapProp/2);
    cp2 = newPoint(cp1,cp2,1-gapProp/2);
    cp1 = tp1;
    tp1 = newPoint(cp4,cp3,gapProp/2);
    cp3 = newPoint(cp4,cp3,1-gapProp/2);
    cp4 = tp1;
    canvas.append("path")
      .attr("d"," M " +toString(cp1.x,cp1.y) +
                " L " +toString(cp2.x,cp2.y) +
                " L " +toString(cp3.x,cp3.y) +
                " L " +toString(cp4.x,cp4.y) +
                " Z ")
      .attr("fill",color)
  }
  var count = data.length+1;
  var padProp = .1
  var base = newPoint(p1, pm, p).y ;
  var bottom = p1.y ;
  var stepsize = (bottom - base) / count;

  var zeroYDS = newPoint(p1, p2, 1 / 12);
  var frankyYDS = newPoint(p1, p2, 11 / 12);
  var halfYDS = newPoint(zeroYDS,frankyYDS,.5);
  for (var i = 0; i < count-1; i++) {

    var color = "blue";
    if (data[i].type == "run") {
      color = "red";
    }
    var b1 = newPoint(zeroYDS, frankyYDS, data[i].start / 100);
    var b2 = newPoint(zeroYDS, frankyYDS, data[i].end / 100);
    var tp1 = newPoint(b1, pm, (p - p * ((i + 1) / count)));
    var tp2 = newPoint(b1, pm, (p - p * ((i) / count)));
    var tp3 = newPoint(b2, pm, (p - p * ((i) / count)));
    var tp4 = newPoint(b2, pm, (p - p * ((i + 1) / count)));
    tp2 = newPoint(tp1,tp2,1-padProp);
    tp3 = newPoint(tp4,tp3,1-padProp);
    canvas.insert("defs").html(
      "<filter id='f1' x='0' y='0' width='200%' height ='200%'>" +
        "<feOffset result='offOut' in='SourceAlpha' dx='2' dy='2'/>" +
        "<feGaussianBlur result='blurOut' in='offOut' stdDeviation='2'/>"+
        "<feBlend in='SourceGraphic' in2='blurOut' mode='normal'/>" +
      "</filter>");

    var dx = (halfYDS.x-((tp3.x+tp2.x)/2))/((halfYDS.x-zeroYDS.x)/4);
    dx = 1*Math.round(dx);
    canvas.insert("defs").html(
      "<filter id='f2"+i+"' x='-40%' y='-40%' width='300%' height ='300%'>" +
        "<feDropShadow dx='"+dx+"' dy='2' stdDeviation='1'/>" +
      "</filter>");
    canvas.append("path")
      .attr("d", " M " + toString(tp1.x, tp1.y) +
        " L " + toString(tp2.x, tp2.y) +
        " L " + toString(tp3.x, tp3.y) +
        " L " + toString(tp4.x, tp4.y) +
        " Z ")
      .attr("fill", color)
      .attr("filter","url(#f2"+i+")");
    var pix = 1
    var lProp = pix/(Math.abs(tp4.x-tp1.x));
    temp = newPoint(tp2,tp1,1+padProp);
    tp2 = newPoint(tp1,tp2,1+padProp);
    tp1 = temp;
    temp = newPoint(tp3,tp4,1+padProp);
    tp3 = newPoint(tp4,tp3,1+padProp);
    tp4=temp;
    tp3 = newPoint(tp2,tp3,lProp);
    tp4 = newPoint(tp1,tp4,lProp);

    canvas.append("path")
      .attr("d", " M " + toString(tp1.x, tp1.y) +
        " L " + toString(tp2.x, tp2.y) +
        " L " + toString(tp3.x, tp3.y) +
        " L " + toString(tp4.x, tp4.y) +
        " Z ")
      .attr("fill", "white")



  }



}

function addHeader(svg, data,metadata) {

  var radius = 50;

  svg.append("image")
        .attr("x", radius / 2 - 15)
        .attr("y", radius / 2 - 15)
        .attr("href", logo)
        .attr("height", radius * 2)
        .attr("width", radius * 2)
        .attr("class","logos")
  svg.append("text")
     .text("TITAN ANALYTICS")
     .attr("x", 10)
     .attr("y", 130)
     .attr("fill", "#00203FFF")
     .attr("text-anchor", "left")
     .style("font", "bold 15px sans-serif")
     .style("font-weight", "bold")


  var canvas = svg;
  var t = 10;
  var h = 47;
  var w = 100;
  var separation = 6;
  var rad = radius;

  var shapes_top = [];
  var shapes_bottom = [];
  let bottom = t + rad * 2;
  let xcur = rad * 2 + 20;

  var columntitles = [metadata["sit0"],metadata["sit1"],metadata["sit2"],metadata["col0"], metadata["col1"], metadata["col2"]]
  var titles = [metadata[metadata["sit0"]], metadata[metadata["sit1"]], metadata[metadata["sit2"]], "", "", ""];




  for (var i = 0; i < 6; i++) {
    if (i == 0) {
      shapes_top.push(canvas.append("path")
        .attr("d", "M " + (rad + 42) + " " + t + " A " + rad + " " + rad + " 0 0 1 " + xcur + " " + (h + t) + " L " + (xcur + w) + " " + (h + t) + " L " + (xcur + w - 20) + " " + t + " z")
        .attr("fill", "#fc766a")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "maroon")
        .attr("stroke-width", 1)
        .attr("id", "parallel" + i))
      canvas.append("text")
        .attr("x", xcur + separation)
        .attr("y", ((h + t + t) / 2)+15)
        .attr("fill", "#00203F")
        .style("font", "bold sans-serif")
        .style("font-weight", "bold")
        .text(titles[i])
        .attr("text-anchor", "left")
      canvas.append("text")
        .attr("x", xcur + separation)
        .attr("y", ((h + t + t) / 2))
        .attr("fill", "#00203F")
        .style("font", "bold sans-serif")
        .style("font-weight", "normal")
        .text(columntitles[i])
        .attr("text-anchor", "left")
    }
    else {
      if(i > 2) {
      shapes_top.push(canvas.append("path")
        .attr("d", "M " + (xcur - 20) + " " + t + " L " + xcur + " " + (h + t) + " L " + (xcur + w) + " " + (h + t) + " L " + (xcur + w - 20) + " " + t + " z")
        .attr("fill", "#58d0db")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("id", "parallel" + i))
      }

      if(i <= 2) {
        shapes_top.push(canvas.append("path")
          .attr("d", "M " + (xcur - 20) + " " + t + " L " + xcur + " " + (h + t) + " L " + (xcur + w) + " " + (h + t) + " L " + (xcur + w - 20) + " " + t + " z")
          .attr("fill", "#FC766A")
          .attr("fill-opacity", 0.6)
          .attr("stroke", "maroon")
          .attr("stroke-width", 1)
          .attr("id", "parallel" + i))

      }
      canvas.append("text")
        .attr("x", xcur + separation)
        .attr("y", ((h + t + t) / 2)+15)
        .attr("fill", "#00203F")
        .style("font", "bold sans-serif")
        .style("font-weight", "bold")
        .text(titles[i])
        .attr("text-anchor", "left")
      canvas.append("text")
        .attr("x", xcur + separation)
        .attr("y", ((h + t + t) / 2))
        .attr("fill", "#00203F")
        .style("font", "bold sans-serif")
        .style("font-weight", "normal")
        .text(columntitles[i])
        .attr("text-anchor", "left")
    }
    xcur = xcur + w + separation;

  }
  xcur = rad * 2 + 20;
  //Bottom 3 parallels
  // for (i; i < 9; i++) {
  //   if (i == 6) {
  //     shapes_bottom.push(canvas.append("path")
  //       .attr("d", "M " + (rad + 42) + " " + bottom + " A " + rad + " " + rad + " 0 0 0 " + xcur + " " + (h + t + separation) + " L " + (xcur + w) + " " + (h + t + separation) + " L " + (xcur + w - 20) + " " + bottom + " z")
  //       .attr("fill", "#FC766AFF")
  //       .attr("fill-opacity", 0.6)
  //       .attr("stroke", "maroon")
  //       .attr("stroke-width", 1)
  //       .attr("id", "parallel" + i))
  //     canvas.append("text")
  //       .attr("x", xcur + separation)
  //       .attr("y", (bottom + (t + h + separation)) / 2)
  //       .attr("fill", "#00203FFF")
  //       .text(1)
  //       .attr("text-anchor", "left")
  //   }
  //   else {
  //     shapes_bottom.push(canvas.append("path")
  //       .attr("d", "M " + (xcur - 20) + " " + bottom + " L " + xcur + " " + (h + t + separation) + " L " + (xcur + w) + " " + (h + t + separation) + " L " + (xcur + w - 20) + " " + bottom + " z")
  //       .attr("fill", "#FC766AFF")
  //       .attr("fill-opacity", 0.6)
  //       .attr("stroke", "maroon")
  //       .attr("stroke-width", 1)
  //       .attr("id", "parallel" + i))
  //     canvas.append("text")
  //       .attr("x", xcur + separation)
  //       .attr("y", (bottom + (t + h + separation)) / 2)
  //       .attr("fill", "#00203FFF")
  //       .text(1)
  //       .attr("text-anchor", "left")
  //   }
  //   xcur = xcur + w + separation;
  // }


  // var tabledataform = [["","Pass","Run","Total"]]
  // var templist;
  // for (var key in data) {
  //   templist = []
  //   templist.push(key)
  //   for (var subkey in data[key]) {
  //       console.log(subkey)
  //       templist.push((data[key][subkey]))
  //   }
  //   tabledataform.push(templist)
  // }
  //
  // console.log(tabledataform)

  // console.log(data)

  var sample_data2 = [["","Pass","Run","Total"],
    ["Play Count",data["Play Count"]["P"],data["Play Count"]["R"],data["Play Count"]["total"]],
    ["Total Yards",data["Total Yards"]["P"],data["Total Yards"]["R"],data["Total Yards"]["total"]],
    ["Average Yards",roundnumber(data["Average Yards"]["P"],2),roundnumber(data["Average Yards"]["R"],2),roundnumber(data["Average Yards"]["total"],2)],
    ["TD Count",data["TD Count"]["P"],data["TD Count"]["R"],data["TD Count"]["total"]]];


  addJeanTable(sample_data2,svg,800,10,1180,150);

  var startsubx = 450;
  var startsuby = 80;
  var deltay = 18;
  // console.log(metadata)

  if(metadata.tendacy.length > 0){
    canvas.append("rect")
      .attr("x",445)
      .attr("y",63)
      .attr("width",300)
      .attr("height",(Math.min(metadata.tendacy.length,6)*deltay)+10)
      .attr("fill","lightgrey")
      .attr("stroke","#1c1c1c")
      .attr("stroke-width","2px");

    for (var i = 0; i < Math.min(metadata.tendacy.length,6); i++) {




      canvas.append("text")
        .attr("x", startsubx)
        .attr("y", startsuby+(deltay*i))
        .attr("fill", "#00203FFF")
        .style("font", "normal sans-serif")
        .style("font-size",15)
        .style("font-weight", "normal")
        .text(metadata.tendacy[i].category.split(" is ")[0]+" is")

      var texthw = renderedTextSize(metadata.tendacy[i].category.split(" is ")[0]+" is","sans-serif",15);

      canvas.append("text")
        .attr("x", startsubx+texthw.width+5)
        .attr("y", startsuby+(deltay*i))
        .attr("fill", "#00203FFF")
        .style("font", "normal sans-serif")
        .style("font-size",15)
        .style("font-weight", "bold")
        .text(metadata.tendacy[i].category.split(" is ")[1])


      texthw = renderedTextSize(metadata.tendacy[i].category.split(" is ")[0]+" is "+metadata.tendacy[i].category.split(" is ")[1],"sans-serif",15);
      var colorScale = d3.scaleLinear().domain([50, 100]).range(["red", "#15b347"]);

      canvas.append("text")
        .attr("x", startsubx+texthw.width+10)
        .attr("y", startsuby+(deltay*i))
        .attr("fill", colorScale(Math.round(metadata.tendacy[i].tend*100)))
        .style("font", "bold sans-serif")
        .style("font-weight", "bold")
        .style("font-size",15)
        .text(Math.round(metadata.tendacy[i].tend*100)+"%")


    }


  }






}

function addJeanTable(data,canvas,x1,y1,x2,y2){



  var yunit = (y2-y1)/5;
  var xunit2 = (x2-x1)*(2/5);
  var xunit = ((x2-x1)*(3/5))/3;


  var tWidth = 12;
  var width = x2-x1;
  if(width > 320){
    tWidth = 15;
  }
  else if(width>250){
    tWidth = 16;
  }
  else if(width>200){
    tWidth = 15;
  }
  else if(width>180){
    tWidth = 14;
  }


  for(var ix = 0; ix < 4; ix++){
    for(var iy = 0; iy < data.length;iy++){
      var col = convToRGB(0,"#00539CFF");

      if(ix == 0){

        if(iy > 0){
          var elem = canvas.append("rect")
            .attr("x",x1+ix*xunit)
            .attr("y",y1+iy*yunit)
            .attr("width",xunit2)
            .attr("height",yunit)
            .attr("fill","lightgrey")
            .attr("stroke","#1c1c1c")
            .attr("stroke-width","2px");


          var textAnchor = {
            x: x1+(ix+.5)*xunit2,
            y: y1+(iy+.5)*yunit
          }

          canvas.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline","middle")
            .attr("x", textAnchor.x)
            .attr("y", textAnchor.y)
            .attr("fill", "#1c1c1c")
            .attr("letter-spacing",.2)
            .text(data[iy][ix])
            .style("font-weight", "bold")
            .attr("font-size", tWidth + "px");
        }


      }
      else {

        if(iy == 0){

          var colheadcolors = ["deepskyblue","crimson","limegreen"]

          canvas.append("rect")
            .attr("x",x1+xunit2+((ix-1)*xunit))
            .attr("y",y1+iy*yunit)
            .attr("width",xunit)
            .attr("height",yunit)
            .attr("fill",colheadcolors[ix-1])
            .attr("stroke","#1c1c1c")
            .attr("stroke-width","2px");

          var textAnchor = {
            x: x1+(xunit2*.5)+((ix+.5)*xunit),
            y: y1+(iy+.5)*yunit
          }

          canvas.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline","middle")
            .attr("x", textAnchor.x)
            .attr("y", textAnchor.y)
            .attr("fill", "#1c1c1c")
            .attr("letter-spacing",.2)
            .text(data[iy][ix])
            .style("font-weight", "bold")
            .attr("font-size", tWidth + "px");
        }
        else {canvas.append("rect")
          .attr("x",x1+xunit2+((ix-1)*xunit))
          .attr("y",y1+iy*yunit)
          .attr("width",xunit)
          .attr("height",yunit)
          .attr("fill","white")
          .attr("stroke","#1c1c1c")
          .attr("stroke-width","2px");

        var textAnchor = {
          x: x1+(xunit2*.5)+((ix+.5)*xunit),
          y: y1+(iy+.5)*yunit
        }

        canvas.append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline","middle")
          .attr("x", textAnchor.x)
          .attr("y", textAnchor.y)
          .attr("fill", "#1c1c1c")
          .attr("letter-spacing",.2)
          .text(data[iy][ix])
          .attr("font-size", tWidth + "px");}



      }

    }
  }
}

function findmaxtend(data,targetcolumns){
    //TODO: if NumPlays is broken, switch below lower case
    //TODO: What if sankeys are turned off
    var numofplays = data.NumPlays * -1;
    // console.log(data)
    var tempvalue; var tempvalstr;
    var maxtend = 0;var temptend;
    var maxstr;
    var maxdic = [];
    // console.log(data)
    for (var i = 0; i < data.datasets.length; i++) {
        for (var k = 0; k < data.datasets[i].length; k++) {

            var listofkeys = Object.keys(data.datasets[i][k])
            if(listofkeys.includes("count")){
              //IF SANKEY
              tempvalue = data.datasets[i][k].count;
              tempvalstr = targetcolumns[i-3]+"/"+targetcolumns[i-2]+" is "+data.datasets[i][k].in+"/"+data.datasets[i][k].out;

            }
            if(listofkeys.includes("val")){
              //IF BAR CHART
              tempvalue = data.datasets[i][k].val;
              tempvalstr = targetcolumns[i]+" is "+data.datasets[i][k].category;

            }

            temptend = tempvalue / (numofplays*-1);
            if(temptend > maxtend){
              maxstr = tempvalstr;
              maxtend = temptend;
            }
            if(temptend > .65){

              maxdic.push({"category":tempvalstr,"tend":temptend,"count":tempvalue})
            }

        }
     }

    return maxdic


}

function cleandata(data){

  for (var i = 0; i < data.length; i++) {

    for (var key in data[i].splits) {
      for (var subkey in data[i].splits[key]) {

        data[i].splits[key][subkey] = Number(data[i].splits[key][subkey])

      }

    }


    for (var k = 0; k < data[i].datasets.length; k++) {
      for (var j = 0; j < data[i].datasets[k].length; j++) {

        if(data[i].datasets[k][j].val === undefined){
          data[i].datasets[k][j].count = Number(data[i].datasets[k][j].count)
        }
        if(data[i].datasets[k][j].count === undefined){
          data[i].datasets[k][j].val = Number(data[i].datasets[k][j].val)
        }

      }
    }
  }



  return data;

}

export async function generateScorecards(data,configjson, filter){


       // data = cleandata(data);


       var svg;
       var sep;
       var numCharts = 5;
       var startDex1;
       var startDex2;
       var currX = 10;

       d3.select("#mainDiv").selectAll('.scorecardContainer').remove();

       // if(!(d3.select("#sankey1").property("checked"))){
       //     numCharts = numCharts-1
       // }
       // if(!(d3.select("#sankey2").property("checked"))){
       //     numCharts = numCharts-1
       // }
       // if((d3.select("#graph1").text()=='None')){
       //     numCharts = numCharts-1
       // }
       // if((d3.select("#graph2").text()=='None')){
       //     numCharts = numCharts-1
       // }
       // if((d3.select("#graph3").text()=='None')){
       //     numCharts = numCharts-1
       // }

       sep = (fixedWidth-30)/numCharts;
       var configselection = configjson[0];
       var barchartcount;
       var sankeychartcount = 0;


       for(var j = 0; j < Object.keys(configjson).length-1; j++){
            data[j] = cleandata(data[j]);
            var sortedData = tieredSort(data[j],filter);
            configselection = configjson[j];
            for(let i = sortedData.length-1; i >= 0; i--){

              //configselection = configjson[sortedData[i].scid]



              // Call new metadata in json of which config to refrence
               sankeychartcount = 0;

               barchartcount = configselection["Targetcolumns"].length;
               for (var k = 0; k < configselection["Sankey"].length; k++) {
                 if(configselection["Sankey"][k] == "Yes"){sankeychartcount++;}
               }
               sep = (fixedWidth-30)/(sankeychartcount+barchartcount);

               var metadata = {"col0":sortedData[i]["col0"],
                               "col1":sortedData[i]["col1"],
                               "col2":sortedData[i]["col2"],
                               "sit0":sortedData[i]["sit0"],
                               "sit1":sortedData[i]["sit1"],
                               "sit2":sortedData[i]["sit2"]};

                var startDex1 = 0;
                currX = 10;
                d3.select("#mainDiv").append("div")
                    .attr("class","row wrapper-div drop scorecardContainer")
                    .style("height",fixedHeight)
                    .style("width",fixedWidth)
                    .style("margin-top","100px")
                    .attr("id","div" + i +"_"+j)
                d3.select("#div"+i+"_"+j).append("svg")
                    .attr("width",fixedWidth)
                    .attr("height",fixedHeight)
                    .attr("class","scorecard centered-basic")
                   // .style("animation-delay",i*.2+"s")
                    .attr("id","scoreCard"+i+"_"+j)

                svg = d3.select(("#scoreCard"+i+"_"+j));

                var sctargetcols = [sortedData[i]["col0"],sortedData[i]["col1"],sortedData[i]["col2"]]


                var besttend = findmaxtend(sortedData[i],sctargetcols);
                // console.log(besttend)

                var dexlist = [0];
                var tempdex;
                for (var k = 0; k < configselection["Charts"].length; k++) {
                   if(configselection["Charts"][k] == "Bar Chart"){

                     dexlist.push(addBarGraph(sortedData[i].datasets[k],
                                              k,
                                              svg,
                                              currX,
                                              svg.attr("height")*0.40,
                                              (currX+sep),
                                              svg.attr("height")*0.90,
                                              dexlist[dexlist.length-1],
                                              metadata));
                     currX = currX+sep;
                   }
                   if(configselection["Charts"][k] == "Pie Chart"){
                     dexlist.push(addPieChart(sortedData[i].datasets[k],
                                              k,
                                              svg,
                                              currX,
                                              svg.attr("height")*0.40,
                                              (currX+sep),
                                              svg.attr("height")*0.90,
                                              dexlist[dexlist.length-1],
                                              metadata) );
                     currX = currX+sep;
                   }
                   if(configselection["Sankey"][k] == "Yes"){
                     addSankey(""+i+"_"+(k+1),
                               sortedData[i].datasets[k+configselection["Charts"].length],
                               svg,
                               2,
                               currX ,
                               svg.attr("height")*0.40,
                               (currX+sep),
                               svg.attr("height")*0.90,
                               true,
                               dexlist[k],
                               dexlist[k+1]);
                     currX = currX+sep
                   }
                }


                // if((d3.select("#graph1").text()=='Bar Graph') || (d3.select("#graph1").text()=='Graph 1')){
                //     //startDex1 = addPieChart(data.scorecards[i].datasets[0],0,svg,currX,svg.attr("height")*0.40,(currX+sep), svg.attr("height")*0.90,0);
                //     startDex1 = addBarGraph(sortedData[i].datasets[0], 0, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,0,metadata);
                //     currX = currX+sep;
                // }
                // else if(d3.select("#graph1").text()=='Pie Chart'){
                //   startDex1 = addPieChart(sortedData[i].datasets[0], 0, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,0,metadata);
                //   currX = currX+sep;
                // }
                // if(d3.select("#sankey1").property("checked")){
                //     addSankey(""+i+"_"+1, sortedData[i].datasets[3], svg, 2, currX , svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,true,0,startDex1);
                //     currX = currX+sep
                // }
                // if((d3.select("#graph2").text()=='Bar Graph') || (d3.select("#graph2").text()=='Graph 2')){//if(!(d3.select("#graph2").text()=='None')){
                //     startDex2 = addBarGraph(sortedData[i].datasets[1], 1, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,startDex1,metadata);
                //     currX = currX+sep
                // }
                // else if(d3.select("#graph2").text()=='Pie Chart'){
                //   startDex2 = addPieChart(sortedData[i].datasets[1], 1, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,startDex1,metadata);
                //   currX = currX+sep;
                // }
                // if(d3.select("#sankey2").property("checked")){
                //     addSankey(""+i+"_"+2, sortedData[i].datasets[4], svg, 2, currX , svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,true,startDex1,startDex2);
                //     currX = currX+sep
                // }
                // if((d3.select("#graph3").text()=='Bar Graph') || (d3.select("#graph3").text()=='Graph 3')){//if(!(d3.select("#graph3").text()=='None')){
                //     addBarGraph(sortedData[i].datasets[2], 2, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,startDex2,metadata);
                //
                // }
                // else if(d3.select("#graph3").text()=='Pie Chart'){
                //   addPieChart(sortedData[i].datasets[2], 2, svg, currX, svg.attr("height")*0.40, (currX+sep), svg.attr("height")*0.90,startDex2,metadata);
                // }


                var st0 = sortedData[i]["sit0"];
                var st1 = sortedData[i]["sit1"];
                var st2 = sortedData[i]["sit2"];

                metadata[st0] = sortedData[i][sortedData[i]["sit0"]]
                metadata[st1] = sortedData[i][sortedData[i]["sit1"]]
                metadata[st2] = sortedData[i][sortedData[i]["sit2"]]
                metadata["tendacy"] = besttend;


                addHeader(svg, sortedData[i].splits,metadata);
            }
       }

}

function emptyScoreCards(svg){
    d3.select("#mainDiv").selectAll('.scorecardContainer').remove();
}

function roundnumber(number,place){
      var divis = place * 10;
      var newnum = number * divis;
      return Math.round(newnum)/divis;

}

function renderedTextSize(string, font, fontSize) {
    var paper = Raphael(0, 0, 0, 0)
    paper.canvas.style.visibility = 'hidden'
    var el = paper.text(0, 0, string)
    el.attr('font-family', font)
    el.attr('font-size', fontSize)
    var bBox = el.getBBox()
    paper.remove()
    return {
        width: bBox.width,
        height: bBox.height
    }
}
