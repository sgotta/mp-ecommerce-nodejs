var express = require("express");
var exphbs = require("express-handlebars");
const bodyParse = require("body-parser");

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
});

var app = express();

app.use(
  bodyParse.urlencoded({
    extended: true,
  })
);

app.use(bodyParse.json());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.post("/procesar-pago", function (req, res) {
  let picture_url = req.body.img.replace(
    "./",
    "https://sgotta-mp-commerce-nodejs.herokuapp.com/"
  );

  // Crea un objeto de preferencia
  let preference = {
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_63274575@testuser.com",
      date_created: "",
      phone: {
        area_code: "11",
        number: 22223333,
      },
      identification: {
        type: "",
        number: "",
      },
      address: {
        street_name: "False",
        street_number: 123,
        zip_code: "1111",
      },
    },
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "amex",
        },
      ],
      excluded_payment_types: [
        {
          id: "atm",
        },
      ],
      installments: 6,
    },
    items: [
      {
        id: "1234",
        picture_url: picture_url,
        title: req.body.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        quantity: 1,
        unit_price: parseFloat(req.body.price),
      },
    ],
    external_reference: "simon.gotta@gmail.com",
    back_urls: {
      success: `https://sgotta-mp-commerce-nodejs.herokuapp.com/success`,
      failure: "https://sgotta-mp-commerce-nodejs.herokuapp.com/failure",
      pending: "https://sgotta-mp-commerce-nodejs.herokuapp.com/pending",
    },
    auto_return: "approved",
    notification_url:
      "https://sgotta-mp-commerce-nodejs.herokuapp.com/notifications",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      global.init_point = response.body.init_point;
      res.redirect(global.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/success", function (req, res) {
  res.render("success", req.query);
});

app.get("/failure", function (req, res) {
  res.render("failure", req.query);
});

app.get("/pending", function (req, res) {
  res.render("pending", req.query);
});

app.post("/notifications", function (req, res) {
  console.log(req.body);
  res.status(200).send("OK");
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
