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
