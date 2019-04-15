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
    var chartType = document.getElementById("chartType");
    var groupValue = groupForm.options[groupForm.selectedIndex].value;
    var xValue = xForm.options[xForm.selectedIndex].value;
    var yValue = yForm.options[yForm.selectedIndex].value;
    var chartValue = chartType.options[chartType.selectedIndex].value;
    drawGraph(sheetData.cycles, groupValue, xValue, yValue, chartValue);
  });
  $(document).ready(function() {
    
     $('#x-axis').change(function () {
       switch ($('#x-axis option:selected').text()) {
        case "Date":
        case "Cycle":
          var selected = $('#chartType option[value=bar]').prop('selected', true);
          selected.prop("disabled", true);
          $('#chartType option[value=default]').prop('selected', true);
        case "Cluster":
          var selected = $('#chartType option[value=line]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#chartType option[value=scatter]').prop('selected', true);
          selected.prop("disabled", true);
          // start here
          var selected = $('#y-axis option[value=easy]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=med]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=com]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=easyPercentage]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=medPercentage]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=comPercentage]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=easyTime]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=medTime]').prop('selected', true);
          selected.prop("disabled", true);
          var selected = $('#y-axis option[value=comTime]').prop('selected', true);
          selected.prop("disabled", true);
          $('option[value=default]').prop('selected', true);
          
        default:
          $('#chartType').show();
       }
      });
    $('#y-axis').change(function () {
       switch ($('#y-axis option:selected').text()) {

        default:
          $('#chartType').show();
       }
      });
  });
});

class DayAverage{
  constructor(cycles) {
    this.date = new Date(cycles[0].date);
    this.time = this.date.getTime();
    this.read = Math.round(cycles.map(cycle => cycle.read).reduce(getSum)/cycles.length*100)/100;
    this.norm = Math.round(cycles.map(cycle => cycle.norm).reduce(getSum)/cycles.length*100)/100;
    this.correct = Math.round(cycles.map(cycle => cycle.correct).reduce(getSum)/cycles.length*100)/100;
    this.suspense = Math.round(cycles.map(cycle => cycle.suspense).reduce(getSum)/cycles.length*100)/100;
    this.easy = Math.round(cycles.map(cycle => cycle.easy).reduce(getSum)/cycles.length*100)/100;
    this.med = Math.round(cycles.map(cycle => cycle.med).reduce(getSum)/cycles.length*100)/100;
    this.com = Math.round(cycles.map(cycle => cycle.com).reduce(getSum)/cycles.length*100)/100;
    this.easyTime = Math.round(cycles.map(cycle => cycle.easyTime).reduce(getSum)/cycles.length*100)/100;
    this.medTime = Math.round(cycles.map(cycle => cycle.medTime).reduce(getSum)/cycles.length*100)/100;
    this.comTime = Math.round(cycles.map(cycle => cycle.comTime).reduce(getSum)/cycles.length*100)/100;
    this.correctRate = Math.round(this.correct/this.norm*10000)/100;
    this.easyPercentage = Math.round(this.easy/this.norm*10000)/100;
    this.medPercentage = Math.round(this.med/this.norm*10000)/100;
    this.comPercentage = Math.round(this.com/this.norm*10000)/100;
  }
}


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
    this.easyTime = cycles.map(cycle => cycle.easyTime).reduce(getSum);
    this.medTime = cycles.map(cycle => cycle.medTime).reduce(getSum);
    this.comTime = cycles.map(cycle => cycle.comTime).reduce(getSum);
    this.correctRate = Math.round(this.correct/this.norm*10000)/100;
    this.easyPercentage = Math.round(this.easy/this.norm*10000)/100;
    this.medPercentage = Math.round(this.med/this.norm*10000)/100;
    this.comPercentage = Math.round(this.com/this.norm*10000)/100;
  }
}

function getSum(total, num) {
  return total + num;
}

function convertCyclesToDays(cycles) {
  var test = restructureData(cycles, "date").map(o => new Day(o.values));
}

function restructureData(data, key, isAverage) {
  var dataGroup = d3.nest()
    .key(function (d) {
      return d[key];
    })
    .entries(data);
  if (key === "date") {
    if(isAverage){
      dataGroup = [{
        key: "Average",
        values: dataGroup.map(o => new DayAverage(o.values))
      }]
    } else{
      dataGroup = [{
        key: "Total",
        values: dataGroup.map(o => new Day(o.values))
      }]
    }
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
    case "easyTime": return "Time (s) Easy Emails Normalized";
    case "medTime": return "Time (s) Medium Emails Normalized";
    case "comTime": return "Time (s) Complex Emails Normalized";
    case "suspense": return "Emails Suspensed";
    case "correct": return "Emails Correct";
    case "correctRate": return "Percent Correct";
    case "easyPercentage": return "Percent Easy";
    case "medPercentage": return "Percent Medium";
    case "comPercentage": return "Percent Complex";
    default: return "ERR: INCORRECT VAR GIVEN";
  }
}

function getData() {
  $.get("http://localhost:8000/api/getdata", function (data, err) {
    sheetData = data;
  });
}

function drawGraph(data, groupValue, xValue, yValue, chartValue) {
  switch(chartValue) {
    case "line": 
    drawLine(data, groupValue, xValue, yValue)
    break;
    case "scatter": 
    drawScatter(data, groupValue, xValue, yValue)
    break;
    case "bar":
    drawBar(data, groupValue, xValue, yValue);
    break;
  }
}

function drawLine(data, key, xVar, yVar) {
  
  var isAverage = key==="average"? true:false,
    key = key==="average" ? "date": key,
    dataGroup = restructureData(data, key,isAverage),
    xTitle = getTitle(xVar),
    yTitle = getTitle(yVar),
    vis = d3.select("#visualization"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    plot = d3.select("#plot"),
    MARGINS = {
      top: 50,
      right: 100,
      bottom: 40,
      left: 60,
    },
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10)-MARGINS.right-MARGINS.left,
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10)-MARGINS.top-MARGINS.bottom,
    xScale = xVar === "date"? d3.scaleTime().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d) {
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
    //console.log(dataGroup);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
      .attr('class', 'value_' + d.key)
      .style("opacity", 1)
      .attr("r", 5)
      .attr("cx", function (d, i) {
        return xVar === "date" ? xScale(d.time) : xScale(i);
      })
      .attr("cy", function (d) {
        return yScale(d[yVar]);
      })
      .on("mouseover", tipMouseover)
      .on("mousemove", tipMousemove)
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
            if (!opacity) {
              console.log($(".value_" + d.key));
              $(".value_" + d.key).remove();
            } else {
              vis.selectAll("dot")
                .data(d.values)
              .enter().append("circle")
                .style("fill", colored)
                .attr('id', 'value_' + d.key)
                .style("opacity", 1)
                .attr("r", 5)
                .attr('class', 'value_' + d.key)
                .attr("cx", function (d, i) {
                  return xVar === "date" ? xScale(d.time) : xScale(i);
                })
                .attr("cy", function (d) {
                  return yScale(d[yVar]);
                })
                .on("mouseover", tipMouseover)
                .on("mousemove", tipMousemove)
                .on("mouseout", tipMouseout);
              }
            d3.selectAll("#line_" + d.key)
              .style("opacity", opacity);
            d.active = active;
        });

    var circle = vis.append("circle")
      .style("fill", colored)
      .attr("cx", WIDTH - 55)
      .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
      .attr("r", 7);
  });
  
  function tipMouseover(d, i) {
    if (key != "date") {
      var id = "#value_" + d[key];
      var circ = d3.selectAll(id);
      for (var j = 0; j < circ._groups[0].length; j++) {
        if (circ._groups[0][j].style.opacity == 0) {
          return;
        }
      }
    }
    timestamp = new Date(d.time);
    console.log(d[yVar]);
    tooltip
      .html((key == "date" ? "" : d[key] + "<br/>") 
      + ((xVar === "date") ? "Date: <b>" + timestamp.toLocaleDateString("en-US") + "</b>": 
      "Cycle <b>" + i + "</b>") + ", <b>" + Math.round(d[yVar]) + 
      "</b>" + " " + yTitle)
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px")
      .style("background-color", "rgb(230, 230, 230)")
      .transition()
        .duration(300)
        .style("opacity", 1);
    //console.log('trigger');
  };
  
  function tipMousemove() {
    tooltip
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px");
  };
  
  function tipMouseout(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0); 
      //prevents faded tooltip text from blocking other points
      //console.log('untrigger');
  };
}
function drawScatter(data, key, xVar, yVar) {
  
  var isAverage = key==="average"? true:false,
    key = key==="average" ? "date": key,
    dataGroup = restructureData(data, key,isAverage),
    xTitle = getTitle(xVar),
    yTitle = getTitle(yVar),
    vis = d3.select("#visualization"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    plot = d3.select("#plot"),
    MARGINS = {
      top: 50,
      right: 100,
      bottom: 40,
      left: 60,
    },
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10)-MARGINS.right-MARGINS.left,
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10)-MARGINS.top-MARGINS.bottom,
    xScale = xVar === "date"? d3.scaleTime().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d) {
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
    //console.log(dataGroup);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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


  var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");

  dataGroup.forEach(function (d, i) {
    var colored = colors[i];

    vis.selectAll("dot")
      .data(d.values)
    .enter().append("circle")
      .style("fill", colored)
      .attr('class', 'value_' + d.key)
      .style("opacity", 1)
      .attr("r", 5)
      .attr("cx", function (d, i) {
        return xVar === "date" ? xScale(d.time) : xScale(i);
      })
      .attr("cy", function (d) {
        return yScale(d[yVar]);
      })
      .on("mouseover", tipMouseover)
      .on("mousemove", tipMousemove)
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
            if (!opacity) {
              console.log($(".value_" + d.key));
              $(".value_" + d.key).remove();
            } else {
              vis.selectAll("dot")
                .data(d.values)
              .enter().append("circle")
                .style("fill", colored)
                .attr('id', 'value_' + d.key)
                .style("opacity", 1)
                .attr("r", 5)
                .attr('class', 'value_' + d.key)
                .attr("cx", function (d, i) {
                  return xVar === "date" ? xScale(d.time) : xScale(i);
                })
                .attr("cy", function (d) {
                  return yScale(d[yVar]);
                })
                .on("mouseover", tipMouseover)
                .on("mousemove", tipMousemove)
                .on("mouseout", tipMouseout);
              }

            d.active = active;
        });

    var circle = vis.append("circle")
      .style("fill", colored)
      .attr("cx", WIDTH - 55)
      .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
      .attr("r", 7);
  });
  
  function tipMouseover(d, i) {
    if (key != "date") {
      var id = "#value_" + d[key];
      var circ = d3.selectAll(id);
      for (var j = 0; j < circ._groups[0].length; j++) {
        if (circ._groups[0][j].style.opacity == 0) {
          return;
        }
      }
    }
    timestamp = new Date(d.time);
    console.log(d[yVar]);
    tooltip
      .html((key == "date" ? "" : d[key] + "<br/>") 
      + ((xVar === "date") ? "Date: <b>" + timestamp.toLocaleDateString("en-US") + "</b>": 
      "Cycle <b>" + i + "</b>") + ", <b>" + Math.round(d[yVar]) + 
      "</b>" + " " + yTitle)
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px")
      .style("background-color", "rgb(230, 230, 230)")
      .transition()
        .duration(300)
        .style("opacity", 1);
    //console.log('trigger');
  };
  
  function tipMousemove() {
    tooltip
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px");
  };
  
  function tipMouseout(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0); 
      //prevents faded tooltip text from blocking other points
      //console.log('untrigger');
  };
}

function drawBar(data, key, xVar, yVar) {
  
  var isAverage = key==="average"? true:false,
    key = key==="average" ? "date": key,
    dataGroup = restructureData(data, key,isAverage),
    xTitle = getTitle(xVar),
    yTitle = getTitle(yVar),
    vis = d3.select("#visualization"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    plot = d3.select("#plot"),
    MARGINS = {
      top: 50,
      right: 100,
      bottom: 40,
      left: 60,
    },
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10)-MARGINS.right-MARGINS.left,
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10)-MARGINS.top-MARGINS.bottom,
    xScale = xVar === "date" ? d3.scaleTime()
      .range([MARGINS.left, WIDTH - MARGINS.right])
      .domain([d3.min(data, function (d) {
        return d.time;
      }), d3.max(data, function (d) {
        return d.time;
      })]) : d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d, i) {
        return 0;
      }), d3.max(dataGroup, function (d, i) {
        return d.values.length;
      })]),
    yScale = key !== "date" ? d3.scaleLinear()
      .range([HEIGHT - MARGINS.top, 10])
      .domain([d3.max([0, d3.min(data, function (d) {
        return d[yVar];
      }) - 10]), d3.max(data, function (d) {
        return d[yVar];
      })]) : d3.scaleLinear()
      .range([HEIGHT - MARGINS.top, 10])
      .domain([d3.min(dataGroup[0].values, function (d) {
      return d[yVar]
    }), d3.max(dataGroup[0].values, function (d) {
      return d[yVar]
    })]),
    xAxis = d3.axisBottom()
    .scale(xScale),

    yAxis = d3.axisLeft()
    .scale(yScale),
    //console.log(dataGroup);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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


  var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");

  dataGroup.forEach(function (d, i) {
    var colored = colors[i];

    vis.selectAll("rectangle")
      .data(d.values)
    .enter().append("rect")
      .style("fill", colored)
      .attr('class', 'value_' + d.key)
      .style("opacity", 1)
      .attr("x", function (d, i) {
        return xVar === "date" ? xScale(d.time) : xScale(i);
      })
      .attr("height", function (d) {
        return HEIGHT - MARGINS.bottom - 10 - yScale(d[yVar]);
      })
      .attr("width", 30)
      .attr("y", function (d) {
        return yScale(d[yVar]);
      })
      .on("mouseover", tipMouseover)
      .on("mousemove", tipMousemove)
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
            if (!opacity) {
              console.log($(".value_" + d.key));
              $(".value_" + d.key).remove();
            } else {
              vis.selectAll("rectangle")
                .data(d.values)
              .enter().append("rect")
                .style("fill", colored)
                .attr('class', 'value_' + d.key)
                .style("opacity", 1)
                .attr("x", function (d, i) {
                  return xVar === "date" ? xScale(d.time) : xScale(i);
                })
                .attr("height", function (d) {
                  return HEIGHT - MARGINS.bottom - 10 - yScale(d[yVar]);
                })
                .attr("width", 30)
                .attr("y", function (d) {
                  return yScale(d[yVar]);
                })
                .on("mouseover", tipMouseover)
                .on("mousemove", tipMousemove)
                .on("mouseout", tipMouseout);
              }

            d.active = active;
        });

    var circle = vis.append("circle")
      .style("fill", colored)
      .attr("cx", WIDTH - 55)
      .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
      .attr("r", 7);
  });
  
  function tipMouseover(d, i) {
    if (key != "date") {
      var id = "#value_" + d[key];
      var circ = d3.selectAll(id);
      for (var j = 0; j < circ._groups[0].length; j++) {
        if (circ._groups[0][j].style.opacity == 0) {
          return;
        }
      }
    }
    timestamp = new Date(d.time);
    console.log(d[yVar]);
    tooltip
      .html((key == "date" ? "" : d[key] + "<br/>") 
      + ((xVar === "date") ? "Date: <b>" + timestamp.toLocaleDateString("en-US") + "</b>": 
      "Cycle <b>" + i + "</b>") + ", <b>" + Math.round(d[yVar]) + 
      "</b>" + " " + yTitle)
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px")
      .style("background-color", "rgb(230, 230, 230)")
      .transition()
        .duration(300)
        .style("opacity", 1);
    //console.log('trigger');
  };
  
  function tipMousemove() {
    tooltip
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 45) + "px");
  };
  
  function tipMouseout(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0); 
      //prevents faded tooltip text from blocking other points
      //console.log('untrigger');
  };
}
