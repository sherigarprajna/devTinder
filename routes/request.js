const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewers/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const fetchedUser = req.user;

    res.send(
      fetchedUser.firstName +
        " " +
        fetchedUser.lastName +
        " sent you a connection request"
    );
  } catch (error) {
    res.status(400).send("Error while fetching the users: " + error.message);
  }
});

module.exports = requestRouter;
