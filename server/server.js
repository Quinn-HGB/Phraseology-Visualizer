var express = require("express");
var cors = require("cors");
var port = process.env.PORT || 8000;

var app = express();
app.use(cors());

app.get("/", function(req, res) {
  return res.send("Hello! the API is at http:localhost:" + port + "/api");
});
var routes = require("./routes");
app.use("/api", routes);

app.listen(port);
console.log("http://localhost:" + port);
