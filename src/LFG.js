class person
{
    correct;
    norm;
    percent;
    size;
}

function drawLFG(data) {
    var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
      "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)");
    vis = d3.select("#visualization");
    MARGINS = {
        top: 50,
        right: 100,
        bottom: 40,
        left: 60,
    }
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10)-MARGINS.right-MARGINS.left
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10)-MARGINS.top-MARGINS.bottom



    let names = ["Quinn", "Evan", "Alan", "Jonah", "Emily", "Alishba"]
    let lfgData = {
        Quinn: {
            correct: 0,
            norm: 0,
            percent: 0
        },
        Evan:{
            correct: 0,
            norm: 0,
            percent: 0
        },
        Alan: {
            correct: 0,
            norm: 0,
            percent: 0
        },
        Jonah: {
            correct: 0,
            norm: 0,
            percent: 0
        },
        Emily: {
            correct: 0,
            norm: 0,
            percent: 0
        },
        Alishba: {
            correct: 0,
            norm: 0,
            percent: 0
        }
    };

    let total = 0;
    let size = 800;
    data.forEach(cycle => {
        lfgData[cycle.name]["correct"] += cycle.correct;
        lfgData[cycle.name]["norm"] += cycle.norm;
    });
    let max = 0;
    names.forEach(name => {
        lfgData[name]['percent'] = (lfgData[name]['correct'] / lfgData[name]['norm']) * 100;
        total += lfgData[name]['norm'];
        if (max < lfgData[name]['norm'])
            max = lfgData[name]['norm']
    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Quinn']['percent'], {
        width: (lfgData['Quinn']['norm'] / total) * size,
        height: (lfgData['Quinn']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ff0000",
        waveColor: "#ff0000",
        offsetX: 0,
        offsetY: 0

    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Evan']['percent'], {
        width: (lfgData['Evan']['norm'] / total) * size,
        height: (lfgData['Evan']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ff00ff",
        waveColor: "#ff00ff",
        offsetX: (max / total) * size,
        offsetY: 0
    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Alan']['percent'], {
        width: (lfgData['Alan']['norm'] / total) * size,
        height: (lfgData['Alan']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#00ffff",
        waveColor: "#00ffff",
        offsetX: (max / total) * size,
        offsetY: (max / total) * size
    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Jonah']['percent'], {
        width: (lfgData['Jonah']['norm'] / total) * size,
        height: (lfgData['Jonah']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ffaa00",
        waveColor: "#ffaa00",
        offsetX: (max / total) * size * 2,
        offsetY: 0
    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Emily']['percent'], {
        width: (lfgData['Emily']['norm'] / total) * size,
        height: (lfgData['Emily']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#00ff00",
        waveColor: "#00ff00",
        offsetX: (max / total) * size * 2,
        offsetY: (max / total) * size
    });
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Alishba']['percent'], {
        width: (max / total) * size,
        height: (max / total) * size,
        waveAnimate: false,
        circleColor: "#0000ff",
        waveColor: "#0000ff",
        offsetX: 0,
        offsetY: (max / total) * size
    });

    names.forEach((name, i) => {
        var colored = colors[i];
        lSpace = HEIGHT / names.length;
        vis.append("text")
            .attr("x", WIDTH + 45)
            .attr("y", (lSpace / 2) + i * lSpace/5)
            .style("fill", "black")
            .attr("class", "legend")
            .text(name)


        var circle = vis.append("circle")
          .style("fill", colored)
          .attr("cx", WIDTH + 40)
          .attr("cy", ((lSpace / 2) + i * lSpace/5) - 5)
          .attr("r", 7);
      });
}
