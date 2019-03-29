
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