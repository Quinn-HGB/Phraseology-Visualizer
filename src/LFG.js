



var names = ["Quinn", "Jonah", "Emily", "Alan", "Alishba", "Evan"]
var lfgData = {}
var total;
//{correct: 0, norm: 0, percent: 0}


function initLFG(data) {

    names.forEach(name => {
        lfgData[name] = { correct: 0, norm: 0, percent: 0, count: 0, easy: 0, medium: 0, com: 0, easyC: 0, mediumC: 0, comC: 0, options: {} }
    })

    total = 0;
    let size = 800;
    data.forEach(cycle => {

        lfgData[cycle.name]["correct"] += cycle.correctRate;
        lfgData[cycle.name]["norm"] += cycle.norm;
        lfgData[cycle.name]["easyC"] += cycle.easyCorrect;
        lfgData[cycle.name]["mediumC"] += cycle.medCorrect;
        lfgData[cycle.name]["comC"] += cycle.comCorrect;
        lfgData[cycle.name]["easy"] += cycle.easy;
        lfgData[cycle.name]["medium"] += cycle.med;
        lfgData[cycle.name]["com"] += cycle.com;
        lfgData[cycle.name]["name"] = cycle.name;
        lfgData[cycle.name]["count"]++

    });
    let max = 0;
    names.forEach(name => {
        lfgData[name]["correct"] /= lfgData[name]["count"]
        lfgData[name]['percent'] = lfgData[name]['correct'];
        total += lfgData[name]['norm'];
        if (max < lfgData[name]['norm'])
            max = lfgData[name]['norm']
    });

    lfgData['Quinn']['options'] = {
        width: (lfgData['Quinn']['norm'] / total) * size,
        height: (lfgData['Quinn']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ff0000",
        waveColor: "#7EC0EE",
        offsetX: 0,
        offsetY: 0,
        name: 'Quinn'
    };
    lfgData['Evan']['options'] = {
        width: (lfgData['Evan']['norm'] / total) * size,
        height: (lfgData['Evan']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ff00ff",
        waveColor: "#7EC0EE",
        offsetX: (max / total) * size,
        offsetY: 0,
        name: 'Evan'
    };
    lfgData['Alan']['options'] = {
        width: (lfgData['Alan']['norm'] / total) * size,
        height: (lfgData['Alan']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#00ffff",
        waveColor: "#7EC0EE",
        offsetX: (max / total) * size,
        offsetY: (max / total) * size,
        name: 'Alan'
    };
    lfgData['Jonah']['options'] = {
        width: (lfgData['Jonah']['norm'] / total) * size,
        height: (lfgData['Jonah']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#ffaa00",
        waveColor: "#7EC0EE",
        offsetX: (max / total) * size * 2,
        offsetY: 0,
        name: 'Jonah'
    };
    lfgData['Emily']['options'] = {
        width: (lfgData['Emily']['norm'] / total) * size,
        height: (lfgData['Emily']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#00ff00",
        waveColor: "#7EC0EE",
        offsetX: (max / total) * size * 2,
        offsetY: (max / total) * size,
        name: 'Emily',
    };
    lfgData['Alishba']['options'] = {
        width: (lfgData['Alishba']['norm'] / total) * size,
        height: (lfgData['Alishba']['norm'] / total) * size,
        waveAnimate: true,
        circleColor: "#0000ff",
        waveColor: "#7EC0EE",
        offsetX: 0,
        offsetY: (max / total) * size,
        name: 'Alishba'
    };
    __drawLFG()
}

function __drawLFG() {
    d3.selectAll("svg > *").remove();
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Quinn']['percent'], lfgData['Quinn']['options']);
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Evan']['percent'], lfgData['Evan']['options']);
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Alan']['percent'], lfgData['Alan']['options']);
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Jonah']['percent'], lfgData['Jonah']['options']);
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Emily']['percent'], lfgData['Emily']['options']);
    d3.select("#visualization").call(d3.liquidfillgauge, lfgData['Alishba']['percent'], lfgData['Alishba']['options']);



    var colors = new Array("hsl(0, 100%, 50%", "hsl(40, 100%, 50%)", "hsl(120, 100%, 50%)",
        "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)", "#00ff00", "#ffff00", "#ff0000", "#7EC0EE");
    vis = d3.select("#visualization");
    MARGINS = {
        top: 50,
        right: 100,
        bottom: 40,
        left: 60,
    }
    WIDTH = (plot.clientWidth || e.clientWidth || w.innerWidth || g.clientWidth) * (8 / 10) - MARGINS.right - MARGINS.left
    HEIGHT = (plot.clientHeight || e.clientHeight || w.innerHeight || g.clientHeight) * (8 / 10) - MARGINS.top - MARGINS.bottom

    var types = ["easy", "medium", "complex", "total"]
    var legend = []
    names.forEach(name => legend.push(name));
    types.forEach(type => legend.push(type));
    legend.forEach((name, i) => {
        var colored = colors[i];
        lSpace = HEIGHT / names.length + 20;
        vis.append("text")
            .attr("x", WIDTH + 50)
            .attr("y", (lSpace / 2) + i * lSpace / 4)
            .style("fill", "black")
            .attr("class", "legend")
            .text(name)



        if (i < 6) {
            var circle = vis.append("circle")
                .style("fill", colored)
                .attr("cx", WIDTH + 40)
                .attr("cy", ((lSpace / 2) + i * lSpace / 4) - 5)
                .attr("r", 8);
            var circle = vis.append("circle")
                .style("fill", "#ffffff")
                .attr("cx", WIDTH + 40)
                .attr("cy", ((lSpace / 2) + i * lSpace / 4) - 5)
                .attr("r", 4);
        }
        else {
            var circle = vis.append("circle")
                .style("fill", "#ffffff")
                .attr("cx", WIDTH + 40)
                .attr("cy", ((lSpace / 2) + i * lSpace / 4) - 5)
                .attr("r", 8);
            var circle = vis.append("circle")
                .style("fill", colored)
                .attr("cx", WIDTH + 40)
                .attr("cy", ((lSpace / 2) + i * lSpace / 4) - 5)
                .attr("r", 4);
        }
    });
}

function cycleColor(name) {

    names.forEach(_name => {
        if (name !== _name) {
            lfgData[_name]['options']['waveRise'] = false;
            lfgData[_name]['options']['valueCountUp'] = false;
        }
        else {
            lfgData[_name]['options']['waveRise'] = true;
            lfgData[_name]['options']['valueCountUp'] = true;
        }
    })
    if (lfgData[name]['options']["waveColor"] === "#7EC0EE") {
        lfgData[name]['options']["waveColor"] = "#00ff00" // easy
        lfgData[name]["percent"] = (lfgData[name]['easyC'] / lfgData[name]['easy']) * 100
    }

    else if (lfgData[name]['options']["waveColor"] === "#00ff00") {
        lfgData[name]['options']["waveColor"] = "#ffff00" // medium
        lfgData[name]["percent"] = (lfgData[name]['mediumC'] / lfgData[name]['medium']) * 100
    }
    else if (lfgData[name]['options']["waveColor"] === "#ffff00") {
        lfgData[name]['options']["waveColor"] = "#ff0000" // com
        lfgData[name]["percent"] = (lfgData[name]['comC'] / lfgData[name]['com']) * 100
    }
    else if (lfgData[name]['options']["waveColor"] === "#ff0000") {
        lfgData[name]['options']["waveColor"] = "#7EC0EE" // tot
        lfgData[name]["percent"] = lfgData[name]['correct']
    }
    __drawLFG()
}
