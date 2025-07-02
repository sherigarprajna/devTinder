const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewers/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const fetchedUser = req.user;
    res.send("User profile fetched successfully: " + fetchedUser);
  } catch (error) {
    res.status(400).send("Error while fetching the users: " + error.message);
  }
});

module.exports = profileRouter;
