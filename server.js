const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
var bodyParser = require("body-parser");

const productRoutes = require("./routes/productRoutes");
const accountRoutes = require("./routes/accountRoutes");

const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use("/api/products", productRoutes);
app.use("/api/account", accountRoutes);
app.listen(PORT, () => console.log(`listening at ${PORT} `));
