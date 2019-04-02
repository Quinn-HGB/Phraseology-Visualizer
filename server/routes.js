var express = require("express"),
    routes = express.Router();
var dataController = require("./controllers/dataController");

routes.get("/", (req, res) => {
  return res.send("Hello, this is the API!");
});

routes.get("/getdata", dataController.sendData);

module.exports = routes;
