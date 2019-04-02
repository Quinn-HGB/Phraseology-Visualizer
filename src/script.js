
var sheetData = undefined;
var groupGlobal = undefined;
var xGlobal = undefined;
var yGlobal = undefined;


$(document).ready(function() {
    getData();
  $("#data").click(function(){
      getData();
  });
  $("#test").click(function(){
    convertCyclesToDays(sheetData.cycles);
    d3.selectAll("svg > *").remove();
    drawGraph(sheetData.cycles,"name","date","read");
  });
  $("#graph").click(function(){
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


class Day{
  constructor(cycles){
      this.date = cycles[0].date;
      this.read = cycles.map(cycle => cycle.read).reduce(getSum).toString();
      this.norm = cycles.map(cycle => cycle.norm).reduce(getSum).toString();
      this.correct = cycles.map(cycle => cycle.correct).reduce(getSum).toString();
      this.suspense = cycles.map(cycle => cycle.suspense).reduce(getSum).toString();
      this.easy = cycles.map(cycle => cycle.easy).reduce(getSum).toString();
      this.med = cycles.map(cycle => cycle.med).reduce(getSum).toString();
      this.com = cycles.map(cycle => cycle.com).reduce(getSum).toString();
  }
}

function getSum(total, num){
    return total+num;
}
function convertCyclesToDays(cycles){
    var test = restructureData(cycles,"date").map(o=>new Day(o.values));
}

function restructureData(data, key){
    var dataGroup = d3.nest()
        .key(function(d) {
            return d[key];
        })
        .entries(data);
    return dataGroup;
}

function getTitle(label){
    switch(label){
        case "date": return "Date";
        case "cycles": return "Cycle";
        case "read": return "Emails Read";
        case "norm": return "Emails Normalized";
        case "easy": return "Easy Emails Normalized";
        case "med": return "Medium Emails Normalized";
        case "com": return "Complex Emails Normalized";
        case "suspense": return "Emails Suspensed";
        case "correct": return "Emails Correct";
        default: return "ERR: INCORRECT VAR GIVEN";
    }
}

function getData(){
    $.get("http://localhost:8000/api/getdata", function(data, err){
      sheetData = data;
      return console.log(data);
    });
}

function drawGraph(data, key, xVar, yVar) {
    var dataGroup = restructureData(data,key);
    var xTitle = getTitle(xVar);
    var yTitle = getTitle(yVar);
    var vis = d3.select("#visualization"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    WIDTH = (1600 || e.clientWidth || g.clientWidth)*(9/10),
    HEIGHT = 1100 || e.clientHeight|| g.clientHeight,
    MARGINS = {
        top: 50,
        bottom: 40,
        left: 60,
        right: 60,
    },
    xScale = d3.scaleLinear().range([MARGINS.left, WIDTH]).domain([d3.min(dataGroup, function(d,i) {
        return 0;
    }), d3.max(data, function(d,i) {
        return dataGroup[2].values.length;
    })]),
    yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, 10]).domain([0, d3.max(data, function(d) {
        return d[yVar];
    })]),
    xAxis = d3.axisBottom()
        .scale(xScale),

    yAxis = d3.axisLeft()
        .scale(yScale);

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom - 10) + ")")
        .call(xAxis);
        
    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    vis.append("text")             
        .attr("transform",
            "translate(" + (WIDTH/2) + " ," + 
            (HEIGHT + MARGINS.top - 50) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(xTitle);

    vis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", MARGINS.left - 60)
        .attr("x",0 - (HEIGHT/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(yTitle);

    var lineGen = d3.line()
        .x(function(d, i) {
            //console.log(xScale(d.date));
        return xScale(i);
        })
        .y(function(d) {
            //console.log(yScale(d.norm));
        return yScale(d[yVar]);
        })
        .curve(d3.curveMonotoneX);

    var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");
    dataGroup.forEach(function(d, i) {
        var colored = colors[i];
        //console.log(d);
        //console.log(i);
        vis.append('svg:path')
            .attr('d', lineGen(d.values))
            .attr('stroke', colored)
            .attr('stroke-width', 2)
            .attr('id', 'line_'+d.key)
            .attr('fill', 'none');
        vis.selectAll("dot")
            .data(d.values)
        .enter().append("circle")
            .style("fill", colored)
            .attr('id', 'value_'+d.key)
            .attr("r", 5)
            .attr('id', 'value_' +d.key)
            .attr("cx", function(d, i) { return xScale(i); })
            .attr("cy", function(d) { return yScale(d[yVar]); });
            //console.log(xScale(i));
        lSpace = HEIGHT/dataGroup.length;
        vis.append("text")
            .attr("x", WIDTH - 40)
            .attr("y", (lSpace / 2) + i * lSpace)
            .style("fill", "black")
            .attr("class", "legend")
            .text(d.key)
            .on('click', function() {
                var active = d.active ? false : true;
                var opacity = active ? 0 : 1;
            
                d3.select("#line_" + d.key).style("opacity", opacity);
            
                d.active = active;
                d3.selectAll("#value_" + d.key).style("opacity", opacity);
                
            });
        var circle = vis.append("circle")
            .style("fill", colored)
            .attr("cx", WIDTH - 55)
            .attr("cy", ((lSpace / 2) + i * lSpace) - 5)
            .attr("r", 7)
            .on('click', function() {
                var active = d.active ? false : true;
                var opacity = active ? 0 : 1;
            
                d3.select("#value_" + d.key).style("opacity", opacity);
            
                d.active = active;
            });
    });
}
