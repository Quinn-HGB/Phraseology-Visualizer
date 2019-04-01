
var sheetData = undefined;

$(document).ready(function() {
  $("#data").click(function() {
    $.get("http://localhost:8000/api/getdata", function(data, err){
      sheetData = data;
      return console.log(data);
    });
  });
  $("#test").click(function(){
    console.log(sheetData);
  });
  $("#graph").click(function(){
    drawGraph();
  });
});

class Day{
  constructor(cycles){
      this.name = cycles[0].name;
      this.date = getDate(cycles[0].dateTime);
      this.read = cycles.map(cycle => cycle.read).reduce(getSum);
      this.norm = cycles.map(cycle => cycle.norm).reduce(getSum);
      this.correct = cycles.map(cycle => cycle.correct).reduce(getSum);
      this.suspense = cycles.map(cycle => cycle.suspense).reduce(getSum);
      this.easy = cycles.map(cycle => cycle.easy).reduce(getSum);
      this.med = cycles.map(cycle => cycle.med).reduce(getSum);
      this.com = cycles.map(cycle => cycle.com).reduce(getSum);
  }
}
function drawGraph() {
  d3.json(sheetData.cycles, function(error, data) {
    if (error) throw error;

    var dataGroup = d3.nest()
        .key(function(d) {
            return d.name;
        })
        .entries(data);

    var vis = d3.select("#visualisation"),
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    WIDTH = (w.innerWidth || e.clientWidth || g.clientWidth)*(9/10),
    HEIGHT = w.innerHeight|| e.clientHeight|| g.clientHeight,
    MARGINS = {
        top: 50,
        right: 70,
        bottom: 40,
        left: 60
    },
    xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function(d) {
        return d.date;
    }), d3.max(data, function(d) {
        return d.date;
    })]),
    yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(d) {
        return d.norm;
    }), d3.max(data, function(d) {
        return d.norm;
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
        .text("Date");

    vis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", MARGINS.left - 60)
        .attr("x",0 - (HEIGHT/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Emails Normalized");

    var lineGen = d3.line()
        .x(function(d) {
        return xScale(d.date);
        })
        .y(function(d) {
        return yScale(d.norm);
        })
        .curve(d3.curveCardinal);

    var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");
    dataGroup.forEach(function(d, i) {
        var colored = colors[i];
        vis.append('svg:path')
            .attr('d', lineGen(d.values))
            .attr('stroke', colored)
            .attr('stroke-width', 2)
            .attr('id', 'line_'+d.key)
            .attr('fill', 'none');
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
            });
        var circle = vis.append("circle")
            .style("fill", colored)
            .attr("cx", WIDTH - 55)
            .attr("cy", ((lSpace / 2) + i * lSpace) - 5)
            .attr("r", 7);
    });
  });
}
