var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var session = require("express-session");

mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_project",
});

var app = express(); //express can be used to create a local server

app.use(express.static("public")); //to send img,css,js to the user
app.set("view engine", "ejs"); //it says to express use ejs as view engine

app.listen(8080); //to select the port which app is running
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret" }));

app.get("/", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });

  con.query("SELECT * FROM products", (err, result) => {
    res.render("pages/index", { result: result });
  });
});

app.post("/add_to_cart", function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var sale_price = req.body.sale_price;
  var quantity = req.body.quantity;
  var image = req.body.image;
  var product = {
    id: id,
    name: name,
    price: price,
    sale_price: sale_price,
    quantity: quantity,
    image: image,
  };
});
