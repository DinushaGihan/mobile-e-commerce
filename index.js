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

function isProductInCart(cart, id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      return true;
    }
  }
  return false;
}

// function calculateTotal(cart, req) {
//   total = 0;
//   for (let i = 0; i < cart.length; i++) {
//     if (cart[i].sale - price) {
//       total = total + (cart[i] + sale_price * cart[i] * quantity);
//     } else {
//       total = total + (cart[i].price * cart[i], quantity);
//     }
//   }
//   req.session.total = total;
//   return total;
// }

function calculateTotal(cart, req) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].sale_price) {
      total = total + (cart[i].sale_price * cart[i].quantity);
    } else {
      total = total + (cart[i].price * cart[i].quantity);
    }
  }
  req.session.total = total;
  return total;
}

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
    image: image  
  };

  if (req.session.cart) {
    var cart = req.session.cart;

    if (!isProductInCart(cart, id)) {
      cart.push(product);
    }
  } else {
    req.session.cart = [product];
    var cart = req.session.cart;
  }

  //calculate total
  calculateTotal(cart, req);

  //return to cart page
  res.redirect("/cart");
});

app.get("/cart", function (req, res) {

  var cart=req.session.cart;
  var total=req.session.total;

  res.render('pages/cart',{cart:cart,total:total});
});

app.post('/remove_product',function(req,res){

  var id=req.body.id;
  var cart=req.sessionStore.cart;

  for(let i=0; i<cart.length; i++){
    if(cart[i].id == id){
      cart.splice(cart.indexOf(i),1);
    }
  }
  //recalculate

  calculateTotal(cart,req);
  res.redirect('/cart');
});

app.post('/edit_product_quantity',function(req,res){
  //get values from inputs
  var id = req.body.id;
  var quantity = req.body.quantity;
  var increase_btn = req.body.increase_product_quantity;
  var decrease_btn = req.body.decrease_product_quantity;

  var cart=req.session.cart;

  if(increase_btn){
    for(let i=0; i<cart.length; i++){
      if(cart[i].id == id){
        if(cart[i].quantity>0){

        }
      }
    }
  }

  if(decrease_btn){
    for(let i=0; i<cart.length; i++){
      if(cart[i].id == id){
        if(cart[i].quantity>1){
          cart[i].quantity=parseInt(cart[i].quantity)-1; 
        }
      }
    }
  }

  calculateTotal(cart,req);
  res.redirect('/cart')
})