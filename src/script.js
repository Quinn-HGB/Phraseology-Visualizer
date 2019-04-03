var sheetData = undefined;
var groupGlobal = undefined;
var xGlobal = undefined;
var yGlobal = undefined;


$(document).ready(function () {
  getData();
  $("#data").click(function () {
    getData();
  });
  $("#test").click(function () {
    convertCyclesToDays(sheetData.cycles);
    d3.selectAll("svg > *").remove();
    drawGraph(sheetData.cycles,"name","date","read");
  });
  $("#Read").click(function(){
    d3.selectAll("svg > *").remove();
    drawGraph(sheetData.cycles, "name", "date", "read");
  });
  $("#graph").click(function () {
    d3.selectAll("svg > *").remove();
    var groupForm = document.getElementById("group");
    var xForm = document.getElementById("x-axis");
    var yForm = document.getElementById("y-axis");
    var groupValue = groupForm.options[groupForm.selectedIndex].value;
    var xValue = xForm.options[xForm.selectedIndex].value;
    var yValue = yForm.options[yForm.selectedIndex].value;
    drawGraph(sheetData.cycles, groupValue, xValue, yValue);
  });

});


class Day {
  constructor(cycles) {
    this.date = new Date(cycles[0].date);
    this.time = this.date.getTime();
    this.read = cycles.map(cycle => cycle.read).reduce(getSum);
    this.norm = cycles.map(cycle => cycle.norm).reduce(getSum);
    this.correct = cycles.map(cycle => cycle.correct).reduce(getSum);
    this.suspense = cycles.map(cycle => cycle.suspense).reduce(getSum);
    this.easy = cycles.map(cycle => cycle.easy).reduce(getSum);
    this.med = cycles.map(cycle => cycle.med).reduce(getSum);
    this.com = cycles.map(cycle => cycle.com).reduce(getSum);
    this.easyTime = cycles.map(cycle => cycle.easyTime).reduce(getSum)/cycles.length;
    this.medTime = cycles.map(cycle => cycle.medTime).reduce(getSum)/cycles.length;
    this.comTime = cycles.map(cycle => cycle.comTime).reduce(getSum)/cycles.length;
  }
}

function getSum(total, num) {
  return total + num;
}

function convertCyclesToDays(cycles) {
  var test = restructureData(cycles, "date").map(o => new Day(o.values));
}

function restructureData(data, key) {
  var dataGroup = d3.nest()
    .key(function (d) {
      return d[key];
    })
    .entries(data);
  if (key === "date") {
    dataGroup = [{
      key: "Total",
      values: dataGroup.map(o => new Day(o.values))
    }]
  }
  console.log(dataGroup)
  return dataGroup;
}

function getTitle(label) {
  switch (label) {
    case "date": return "Date";
    case "cycles": return "Cycle";
    case "read": return "Emails Read";
    case "norm": return "Emails Normalized";
    case "easy": return "Easy Emails Normalized";
    case "med": return "Medium Emails Normalized";
    case "com": return "Complex Emails Normalized";
    case "easyTime": return "Average Time Easy Emails Normalized";
    case "medTime": return "Average Time Medium Emails Normalized";
    case "comTime": return "Average Time Complex Emails Normalized";
    case "suspense": return "Emails Suspensed";
    case "correct": return "Emails Correct";
    default: return "ERR: INCORRECT VAR GIVEN";
  }
}

function getData() {
  $.get("http://localhost:8000/api/getdata", function (data, err) {
    sheetData = data;
  });
}

function drawGraph(data, key, xVar, yVar) {
    var dataGroup = restructureData(data, key);
    var xTitle = getTitle(xVar);
    var yTitle = getTitle(yVar);
    var vis = d3.select("#visualization"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    plot = d3.select("#plot")
    //console.log(plot);
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10),
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10),
    MARGINS = {
      top: 50,
      right: 100,
      bottom: 40,
      left: 60,
    },
    xScale = xVar === "date" ? d3.scaleTime().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d) {
      return d.time;
    }), d3.max(data, function (d) {
      return d.time;
    })]) : d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d, i) {
      return 0;
    }), d3.max(dataGroup, function (d, i) {
      return d.values.length;
    })]),
    yScale = key !== "date" ? d3.scaleLinear().range([HEIGHT - MARGINS.top, 10]).domain([d3.max([0, d3.min(data, function (d) {
      return d[yVar];
    }) - 10]), d3.max(data, function (d) {
      return d[yVar];
    })]) : d3.scaleLinear().range([HEIGHT - MARGINS.top, 10]).domain([d3.min(dataGroup[0].values, function (d) {
      return d[yVar]
    }), d3.max(dataGroup[0].values, function (d) {
      return d[yVar]
    })]),
    xAxis = d3.axisBottom()
    .scale(xScale),

    yAxis = d3.axisLeft()
    .scale(yScale),

    // zoom = d3.zoom()
    //   .scaleExtent([.5, 20])
    //   .extent([[0, 0], [WIDTH, HEIGHT]])
    //   .on("zoom", zoomed);

    // vis.append("rect")
    //   .attr("width", WIDTH)
    //   .attr("height", HEIGHT)
    //   .style("fill", "none")
    //   .style("pointer-events", "all")
    //   .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')')
    //   .call(zoom);

    //console.log(dataGroup);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var tipMouseover = function(d, i) {
      if (key != "date") {
        var id = "#value_" + d[key];
        var circ = d3.selectAll(id);
        for (var j = 0; j < circ._groups[0].length; j++) {
          if (circ._groups[0][j].style.opacity == 0) {
            return;
          }
        }
      }
      var timestamp = new Date(d.time);
      tooltip
        .html((key == "date" ? "" : d[key] + "<br/>") 
        + ((xVar === "date") ? "Date: <b>" + timestamp.toLocaleDateString("en-US") + "</b>": 
        "Cycle <b>" + i + "</b>") + ", <b>" + d[yVar] + 
        "</b>" + " " + yTitle)
        .style("left", (d3.mouse(this)[0] + 5) + "px")
        .style("top", (d3.mouse(this)[1] + 20) + "px")
        .style("background-color", "rgb(230, 230, 230)")
        .style("opacity", 1.2);
      //console.log('trigger');
    };

    var tipMouseout = function(d) {
        tooltip.html(""); //prevents faded tooltip text from blocking other points
        tooltip.style("opacity", 0); // don't care about position!
        //console.log('untrigger');
    };
    
    vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom - 10) + ")")
        .call(xAxis);

  vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  vis.append("text")
    .attr("transform",
      "translate(" + (WIDTH / 2) + " ," +
      (HEIGHT + MARGINS.top - 60) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(xTitle);

  vis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", MARGINS.left - 60)
    .attr("x", 0 - (HEIGHT / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(yTitle);

  var lineGen = d3.line()
    .x(function (d, i) {
      return xVar === "date" ? xScale(d.time) : xScale(i);
    })
    .y(function (d) {
      return yScale(d[yVar]);
    })
    .curve(d3.curveMonotoneX);

  var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");
  dataGroup.forEach(function (d, i) {
    var colored = colors[i];
    vis.append('svg:path')
      .attr('d', lineGen(d.values))
      .attr('stroke', colored)
      .attr('stroke-width', 2)
      .attr('id', 'line_' + d.key)
      .attr('fill', 'none');
    vis.selectAll("dot")
      .data(d.values)
    .enter().append("circle")
      .style("fill", colored)
      .attr('id', 'value_' + d.key)
      .style("opacity", 1)
      .attr("r", 5)
      .attr('id', 'value_' + d.key)
      .attr("cx", function (d, i) {
        return xVar === "date" ? xScale(d.time) : xScale(i);
      })
      .attr("cy", function (d) {
        return yScale(d[yVar]);
      })
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
    lSpace = HEIGHT / dataGroup.length;
    vis.append("text")
        .attr("x", WIDTH - 40)
        .attr("y", (lSpace / 2) + i * lSpace/5)
        .style("fill", "black")
        .attr("class", "legend")
        .text(d.key)
        .on('click', function () {
            var active = d.active ? false : true;
            var opacity = active ? 0 : 1;

            d3.select("#line_" + d.key).style("opacity", opacity);

            d.active = active;
            d3.selectAll("#value_" + d.key).style("opacity", opacity);
        });

    var circle = vis.append("circle")
      .style("fill", colored)
      .attr("cx", WIDTH - 55)
      .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
      .attr("r", 7)
      .on('click', function () {
        var active = d.active ? false : true;
        var opacity = active ? 0 : 1;

        d3.select("#value_" + d.key).style("opacity", opacity);

        d.active = active;
      });
  });
  // function zoomed() {
  //   var new_xScale = d3.event.transform.rescaleX(xScale);
  //   var new_yScale = d3.event.transform.rescaleY(yScale);  
  //   vis.append("svg:g")
  //     .call(xAxis.scale(new_xScale))
  //     .call(yAxis.scale(new_yScale))
  // }
}