const { verifyUser } = require("../Middlewares/AuthMiddleware");
const Item = require("../Models/ItemModel");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");


exports.insertItem = async (req, res, next) => {
  try {
    const { user } = req.user;
    const { name, price } = req.body;

    const item = await Item.create({
      name,
      price,
      owner: req.user.email,
      auction: "",
    });

    res
      .status(201)
      .json({ message: "Item inserted successfully", success: true, item });
    next();
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error", success: false });
  }
};

exports.userVerification = async (token) => {
  if (!token) {
    return false;
  }

  jwt.verify(token, "aucton", async (err, data) => {
    if (err) {
      console.log("error", err);
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return true;
      } else {
        return false;
      }
    }
  });
};

exports.insertAnItem = async (parameitem) => {
  if (!this.userVerification(parameitem.token)) {
    return { message: "Unautherized", success: false };
  }
  try {
    const item = await Item.create({
      name: parameitem.name,
      price: parameitem.price,
      owner: parameitem.email,
      auction: "",
      img: parameitem.img,
      filename: parameitem.filename,
      filetype: parameitem.filetype,
      status: true,
    });

    return { message: "Item inserted successfully", success: true, item };
  } catch (err) {
    console.error(err);
    return { message: "Fail", success: false, error: err };
  }
};

exports.getAllItemsSocket = async () => {
  try {
    const items = await Item.find();
    return { message: "All items fetched", success: true, items };
  } catch (err) {
    return { message: "Fail", success: false, error: err };
  }
};

exports.updatePrice = async (id, newprice, token) => {
  if (!this.userVerification(token)) {
    return { message: "Unautherized", success: false };
  }

  try {
    const items = await Item.findByIdAndUpdate(
      id,
      { price: newprice },
      { new: true }
    ).exec();
    return { message: "All items fetched", success: true, updatedItem: items };
  } catch (err) {
    return { message: "Fail", success: false, error: err };
  }
};

exports.sellItem = async (id,token) => {

  if (!this.userVerification(token)) {
    return { message: "Unautherized", success: false };
  }

  try {
    console.log("sell item", id);
    const items = await Item.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    ).exec();
    return { message: "Item sold", success: true, updatedItem: items };
  } catch (err) {
    return { message: "Fail", success: false, error: err };
  }
};

exports.getMyProductsSocket = async (email, token) => {

  if (!this.userVerification(token)) {
    return { message: "Unautherized", success: false };
  }

  try {
    const items = await Item.find({ owner: email }).exec();
    return { message: "All items fetched", success: true, items };
  } catch (err) {
    return { message: "Fail", success: false, error: err };
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();
    res
      .status(201)
      .json({ message: "All items fetched", success: true, items });
    next();
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error", success: false });
  }
};
