// Last element in each array is being changed into an incorrect type, due to pointers

function drawBar(data, key, xVar, yVar) {
    var first;
    var second;
    var third;
    var legend = new Array("Easy", "Medium", "Complex");
    var isAverage = key==="average"? true:false,
      key = key==="average" ? "date": key,
      dataGroup = restructureData(data, key, isAverage);
      console.log(dataGroup);
      dataGroup.forEach(function(d, i) {
        var temp = d.values.slice();
        var largestTime = 0;
        for (var j = 0; j < d.values.length; j++) {
          if (d.values[j].time > largestTime) {
            largestTime = d.values[j].time;
          }
        }
        for (var k in d.values) {
          if (d.values[k].time < largestTime) {
            for (var i = 0; i < temp.length; i++) {
              if (temp[i].time == d.values[k].time) {
                temp.splice(i, 1);
              }
            }
          }
        }
        d.values = temp;
        switch(yVar) {
          case "diff":
            first = "easy";
            second = "med";
            third = "com";
            break;
          case "diffPercent":
            first = "easyPercentage";
            second = "medPercentage";
            third = "comPercentage";
            break;
          case "diffAverage":
            first = "easyTime";
            second = "medTime";
            third = "comTime";
            break;
          default:
            console.log('ERROR: INVALID BAR INPUT');
            break;
        }
        for (var key in d.values[0]) {
          if (key != first && key != second && key != third) {
            delete d.values[0][key];
          }
        }
        var tmp = new Array(3);
        var index = 0;
        for (var key in d.values[0]) {
          tmp[index] = d.values[0][key];
          index++;
        }
        d.values = tmp;
      });
      var xTitle = getTitle(xVar),
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
      xScale0 = d3.scaleBand()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain(d3.range(dataGroup.length)),
      xScale1 = d3.scaleBand()
        .domain(d3.range(3))
        .range([0, xScale0.bandwidth() - 5]),
      yScale = d3.scaleLinear()
        .range([HEIGHT - MARGINS.top, 10])
        .domain([0, d3.max(dataGroup, function(d) {
          return Math.max.apply(Math, d.values);
        })]),
      xAxis = d3.axisBottom(xScale0).tickFormat(d => dataGroup[d].key),
      yAxis = d3.axisLeft()
      .scale(yScale),
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

    var z = d3.scaleOrdinal()
      .range(["#138113", "#F9E800", "#FC0000"]);

    for (var i = 0; i < legend.length; i++) {
      lSpace = HEIGHT / dataGroup.length;
      vis.append("text")
        .attr("x", WIDTH - 40)
        .attr("y", (lSpace / 2) + i * lSpace/3)
        .style("fill", "black")
        .attr("class", "legend")
        .text(legend[i]);
      vis.append("circle")
        .style("fill", z(i))
        .attr("cx", WIDTH - 55)
        .attr("cy", ((lSpace / 2) + i * lSpace/3) - 5)
        .attr("r", 7);
    }

    vis.selectAll('bar')
      .data(dataGroup)
    .enter().append('g')
      .attr("transform", function(d, i) {
        console.log(d);
        console.log(i);
        return "translate(" + xScale0(i) + ",0)";
      })
    .selectAll('g')
      .data(function(d) {
        return d.values;
      })
    .enter().append('rect')
      .style("opacity", 1)
      .style("fill", function(d, i) { return z(i); })
      .attr("width", xScale1.bandwidth)
      .attr("x", function (d, i) {
        console.log(i);
        return xScale1(i);
      })
      .attr("height", function (d, i) {
        console.log(d);
        return HEIGHT - MARGINS.bottom - 10 - yScale(d);
      })
      .attr("y", function (d) {
        return yScale(d);
      })
      .on("mouseover", tipMouseover)
      .on("mousemove", tipMousemove)
      .on("mouseout", tipMouseout);

    function tipMouseover(d, i) {
      tooltip
        .html("<b>" + Math.round(d) +
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
