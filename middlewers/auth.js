const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decodedObj = await jwt.verify(token, "secretkey");

    if (!decodedObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
