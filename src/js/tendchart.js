

async function generateScorecards(filename){

    var colorScale = d3.scaleLinear().domain([.5, 1]).range(["orange", "#15b347"]);


    console.log(window.screen.width)

    var maxwidth = window.screen.width;

    const data = await d3.json(filename);
    d3.select("#tendancychart")
      .append("svg")
      .attr("width",maxwidth-200)
      .attr("height",10000)
      .attr("id","chartbase");

    svg = d3.select(("#chartbase"));

    var sitcol = data["situations"];
    var tcol = data["target"];
    var values = data["target_vals"];
    var datapoints = data["tendencies"];

    var onedatapoint;
    var tempx = 10; var tempy = 10;

    for (var i = 0; i < datapoints.length; i++) {
      onedatapoint = {}
      onedatapoint["info"] = datapoints[i];

      onedatapoint["sitcol"] = sitcol;
      onedatapoint["target"] = tcol;
      onedatapoint["tvalues"] = values;




      if((datapoints[i]["PlayCount"])> 10){
        maketendchart(svg,tempx,tempy,"test"+i,onedatapoint)
      }
      if((tempx+450+400) < (maxwidth-200)){
      tempx = tempx + 450;}
      else{
        tempx = 10;
        tempy = tempy + 220;
      }



    }




    function maketendchart(canvas,x1,y1,id,chartdata) {

      var mainchartheight = 200;
      var mainchartwidth = 400;

      var max = 0;
      var max_item = "";
      var running_count = 0;
      var temp_title; var temp_count;
      var playcount = chartdata["info"]["PlayCount"];

      var values = chartdata["tvalues"];
      var tcol = chartdata["target"];
      var sitcol = chartdata["sitcol"];

      for (var i = 0; i < values.length; i++) {
        temp_title = tcol+"_"+values[i];
        temp_count = chartdata["info"][temp_title];
        running_count = running_count + temp_count;
        if(temp_count > max){
          max = temp_count;
          max_item = values[i]
        }
      }

      canvas.append("rect")
            .attr("x",x1)
            .attr("y",y1)
            .attr("width",mainchartwidth)
            .attr("height",mainchartheight)
            .attr("fill","#1c1c1c")
            .attr("id","chart1");
      canvas.append("rect")
            .attr("x",x1+(mainchartwidth/2))
            .attr("y",y1)
            .attr("width",mainchartwidth/2)
            .attr("height",200)
            .attr("fill","#424141");
      canvas.append("text")
            .attr("x",10+x1)
            .attr("y",40+y1)
            .attr("fill","white")
            .text("WHEN")
            .style("font-size",30)
            .style("font-weight","bold");
      canvas.append("rect")
            .attr("x",10+x1)
            .attr("y",44+y1)
            .attr("width",100)
            .attr("height",8)
            .attr("fill","white");

      var coltitle;var colvalue;
      var startx = 10+x1;var starty = 90+y1;
      for (var i = 0; i < sitcol.length; i++) {

        coltitle = sitcol[i];
        colvalue = chartdata["info"][sitcol[i]];
        if(colvalue != null){

        canvas.append("text")
              .attr("x",startx)
              .attr("y",starty)
              .attr("fill","white")
              .text(coltitle+" is ")
              .style("font-size",15)
              .style("font-weight","normal");

        texthw = renderedTextSize(coltitle+" is ","sans-serif",15);

        canvas.append("text")
              .attr("x",startx+texthw.width+5)
              .attr("y",starty)
              .attr("fill","gold")
              .text(colvalue)
              .style("font-size",15)
              .style("font-weight","bold");

        starty = starty + texthw.height + 20;}
      }


      texthw = renderedTextSize("Expect "+max_item,"sans-serif",30);
      canvas.append("text")
            .attr("x",((200-texthw.width)/2)+200+x1)
            .attr("y",40+y1)
            .text("Expect "+max_item)
            .style("font","san-serif")
            .style("font-size",30)
            .style("font-weight","bold")
            .attr("fill","white");

      texthw = renderedTextSize("For "+tcol,"sans-serif",12);
      canvas.append("text")
            .attr("x",((200-texthw.width)/2)+200+x1)
            .attr("y",60+y1)
            .text("For "+tcol)
            .style("font","san-serif")
            .style("font-size",12)
            .style("font-weight","normal")
            .attr("fill","white");

      var tend = (Math.round((max/running_count)*100))+"%";

      texthw = renderedTextSize(tend,"sans-serif",80);

      canvas.append("text")
            .attr("x",((200-texthw.width)/2)+200+x1)
            .attr("y",140+y1)
            .text(tend)
            .style("font","san-serif")
            .style("font-size",80)
            .style("font-weight","bold")
            .attr("fill",colorScale(max/running_count));



      texthw = renderedTextSize("Play Count: "+playcount,"sans-serif",20);
      canvas.append("text")
            .attr("x",((200-texthw.width)/2)+200+x1)
            .attr("y",190+y1)
            .text("Play Count: "+playcount)
            .style("font","san-serif")
            .style("font-size",20)
            .style("font-weight","normal")
            .attr("fill","lightgrey");




    }





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


generateScorecards("Sample Data/tend.json")
