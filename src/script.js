var sheetData = undefined;
var groupGlobal = undefined;
var xGlobal = undefined;
var yGlobal = undefined;


$(document).ready(function () {
  getData();
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
});
$(document).ready(function() {
  $('#controls').change(function () {
    $('option').prop("disabled", false);
    switch ($('#x-axis option:selected').text()) {
      case "Cluster":
        $('#chartType option[value=line]').prop("disabled", true);
        $('#chartType option[value=scatter]').prop("disabled", true);
        $('#y-axis option[value=easy]').prop("disabled", true);
        $('#y-axis option[value=med]').prop("disabled", true);
        $('#y-axis option[value=com]').prop("disabled", true);
        $('#y-axis option[value=easyPercentage]').prop("disabled", true);
        $('#y-axis option[value=medPercentage]').prop("disabled", true);
        $('#y-axis option[value=comPercentage]').prop("disabled", true);
        $('#y-axis option[value=easyTime]').prop("disabled", true);
        $('#y-axis option[value=medTime]').prop("disabled", true);
        $('#y-axis option[value=comTime]').prop("disabled", true);
        $('#y-axis option[value=norm]').prop("disabled", true);
        $('#y-axis option[value=read]').prop("disabled", true);
        $('#y-axis option[value=correct]').prop("disabled", true);
        $('#y-axis option[value=suspense]').prop("disabled", true);
        $('#y-axis option[value=correctRate]').prop("disabled", true);
        break;
      case "Date":
      case "Cycle":
        $('#chartType option[value=bar]').prop("disabled", true);
        $('option[value=diff]').prop("disabled", true);
        $('option[value=diffPercent]').prop("disabled", true);
        $('option[value=diffAverage]').prop("disabled", true);
        break;
      default:
        console.log("something's wrong");
        break;
      }
    switch ($('#y-axis option:selected').text()) {
      case "Easy Medium Complex":
      case "Easy Medium Complex Percent":
      case "Easy Medium Complex Avg Time":
          $("#chartType option").prop("disabled", true);
          $("#chartType option[value=bar]").prop("disabled", false);
      break;
      case "Select Y-Axis Data":
          $("#x-axis option").prop("disabled", false);

      default:
          $('option').show();
      }
      switch($('#chartType option:selected').text()) {
         case "Line":
         case "Scatter":
         $('option[value=cluster]').prop("disabled", true);
         $('option[value=diff]').prop("disabled", true);
         $('option[value=diffPercent]').prop("disabled", true);
         $('option[value=diffAverage]').prop("disabled", true);
         break;
         case "Bar":
         $('option[value=cycles]').prop("disabled", true);
         $('option[value=date]').prop("disabled", true);
         $('#y-axis option[value=norm]').prop("disabled", true);
         $('#y-axis option[value=read]').prop("disabled", true);
         $('#y-axis option[value=correct]').prop("disabled", true);
         $('#y-axis option[value=suspense]').prop("disabled", true);
         $('#y-axis option[value=correctRate]').prop("disabled", true);
         $('#y-axis option[value=easy]').prop("disabled", true);
         $('#y-axis option[value=med]').prop("disabled", true);
         $('#y-axis option[value=com]').prop("disabled", true);
         $('#y-axis option[value=easyPercentage]').prop("disabled", true);
         $('#y-axis option[value=medPercentage]').prop("disabled", true);
         $('#y-axis option[value=comPercentage]').prop("disabled", true);
         $('#y-axis option[value=easyTime]').prop("disabled", true);
         $('#y-axis option[value=medTime]').prop("disabled", true);
         $('#y-axis option[value=comTime]').prop("disabled", true);
      }

  });
});


function restructureData(data, key, isAverage) {
  var dataGroup = d3.nest()
    .key(function (d) {
      return d[key];
    })
    .entries(data);
  if (key === "date") {
    if (isAverage) {
      dataGroup = [{
        key: "Average",
        values: dataGroup.map(o => new DayAverage(o.values))
      }]
    } else {
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
    case "cluster": return "Name";
    case "read": return "Emails Read";
    case "norm": return "Emails Normalized"
    case "diff": return "Emails Normalized";
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
    case "diffPercentage": return "Percent";
    case "diffAverage": return "Seconds Taken Per Email";
    default: return "ERR: INCORRECT VAR GIVEN";
  }
}

function getData() {
  $.get("http://localhost:8000/api/getdata", function (data, err) {
    sheetData = data;
  });
}

function drawGraph(data, groupValue, xValue, yValue, chartValue) {
  switch (chartValue) {
    case "line":
      drawLine(data, groupValue, xValue, yValue)
      break;
    case "scatter":
      drawScatter(data, groupValue, xValue, yValue)
      break;
    case "bar":
      drawBar(data, groupValue, xValue, yValue);
      break;
    case "lfg":
      initLFG(data);
      break;
  }
}

