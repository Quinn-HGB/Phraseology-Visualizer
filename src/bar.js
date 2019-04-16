function drawBar(data, key, xVar, yVar) {

    var isAverage = key==="average"? true:false,
      key = key==="average" ? "date": key,
      dataGroup = restructureData(data, key,isAverage);
      dataGroup.forEach(function(d, i) {
        var largestTime = 0;
        for (var j = 0; j < d.values.length; j++) {
          if (d.values[j].time > largestTime) {
            largestTime = d.values[j].time;
          }
        }
        for (var k in d.values) {
          if (d.values[k].time < largestTime) {
            delete d.values[k];
          }
        }
        d.values = d.values.slice(d.values.length - 1);
        var first;
        var second;
        var third;
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
        var temp = new Array(3);
        var index = 0;
        for (var key in d.values[0]) {
          temp[index] = d.values[0][key];
          index++;
        }
        d.values = temp;
      });
      console.log(dataGroup);
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
        .domain([0, 60]),
      xAxis = d3.axisBottom(xScale0),

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

    console.log(dataGroup);

    var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // var colored = colors[i];
    // console.log(d.values);
    // vis.selectAll('bar')
    //   .data(d.values)
    // .enter().append('g')
    //   .style("fill", colored)
    //   .attr("transform", function(d, i) {return "translate(" + xScale1(i) + ",0)"; })
    // .selectAll("g")
    //   .data(d.values)
    // .enter().append("rect")
    //   .attr("width", xScale1.bandwidth())
    //   .attr('class', 'value_' + d.key)
    //   .style("opacity", 1)
    //   .attr("x", function (d, i) {
    //     console.log(i);
    //     return xScale0(i);
    //   })
    //   .attr("height", function (d) {
    //     return HEIGHT - MARGINS.bottom - 10 - yScale(d[yVar]);
    //   })
    //   .attr("y", function (d) {
    //     return yScale(d[yVar]);
    //   })
    vis.selectAll('bar')
      .data(dataGroup)
    .enter().append('g')
      .style("fill", function(d, i) { return z(i); })
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

      // .on("mouseover", tipMouseover)
      // .on("mousemove", tipMousemove)
      // .on("mouseout", tipMouseout);
    lSpace = HEIGHT / dataGroup.length;
    vis.append("text")
        .attr("x", WIDTH - 40)
        .attr("y", (lSpace / 2) + i * lSpace/5)
        .style("fill", "black")
        .attr("class", "legend")
        .text(d.key)
        // .on('click', function () {
        //     var active = d.active ? false : true;
        //     var opacity = active ? 0 : 1;
        //     if (!opacity) {
        //       console.log($(".value_" + d.key));
        //       $(".value_" + d.key).remove();
        //     } else {
        //       vis.selectAll("rectangle")
        //         .data(d.values)
        //       .enter().append("rect")
        //         .style("fill", colored)
        //         .attr('class', 'value_' + d.key)
        //         .style("opacity", 1)
        //         .attr("x", function (d, i) {
        //           return xScale0(i);
        //         })
        //         .attr("height", function (d) {
        //           return HEIGHT - MARGINS.bottom - 10 - yScale(d[yVar]);
        //         })
        //         .attr("width", 30)
        //         .attr("y", function (d) {
        //           return yScale(d[yVar]);
        //         })
        //         .on("mouseover", tipMouseover)
        //         .on("mousemove", tipMousemove)
        //         .on("mouseout", tipMouseout);
        //       }

        //     d.active = active;
        // });

    var circle = vis.append("circle")
      .style("fill", colored)
      .attr("cx", WIDTH - 55)
      .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
      .attr("r", 7);

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
