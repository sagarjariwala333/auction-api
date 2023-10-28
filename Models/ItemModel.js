const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
  },
  price: {
    type: String,
    required: [true, "Your password is required"],
  },
  owner: {
    type: String,
    required: [true, "Owner is required"],
  },
  auction: {
    type: String
  },
  img: {
    type: String
  },
  filename: {
    type: String
  },
  filetype: {
    type: String
  },
  status: {
    type: Boolean
  }
});


module.exports = mongoose.model("Item", itemSchema);