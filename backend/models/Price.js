const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  commodity: String,
  product_en: String,
  product_ur: String,
  province: String,
  min: String,
  max: String,
  avg: String,
  date: { type: Date, default: Date.now } // for daily record
});

module.exports = mongoose.model("Price", priceSchema);
