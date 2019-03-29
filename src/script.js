
$(document).ready(function() {
  $("#data").click(function() {
    $.get("http://localhost:8000/api/getdata", function(data, err){
      return console.log(data);
    });
  });
});