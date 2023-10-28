const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.userVerification = (req, res, next) => {

  console.error(req.header('Authorization'))

  let token;
  if(req.header('Authorization').includes(' '))
  {
    token = req.header('Authorization').split(' ')[1];
  }
  else
  {
    token = req.header('Authorization')
  }

  console.log("userVerification", token)
  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, "aucton", async (err, data) => {
    if (err) {
      console.log("error", err)
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        req.user = user; // Attach user information to the request object
        next(); // Continue to the next middleware or route handler
      } else {
        console.log("error", err)
        return res.json({ status: false });
      }
    }
  })
}

exports.verifyUser = async (token) => {
  console.log("user verified")
  // const token = token
  console.log("middleware token", token)
  if (!token) {
    return { status: false }
  }

  jwt.verify(token, "aucton", async (err, data) => {
    try
    {
      if (err) {
      return { status: false }
      } else {
        const user = await User.findById(data.id)
        const resobj = {
          status: true,
          user
        }
        console.log("middleware token", resobj)
        if (user) return await resobj

        else return await { status: false }
      }
    }
    catch(err)
    {
      return {error:err}
    }
  })
}