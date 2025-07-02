const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewers/auth");
const { validationDataForEdit } = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const fetchedUser = req.user;
    res.send("User profile fetched successfully: " + fetchedUser);
  } catch (error) {
    res.status(400).send("Error while fetching the users: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validationDataForEdit(req))
      return res.status(400).send("Invalid data for profile edit");

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
        message: `${loggedInUser.firstName}, you have edited successfully`,
        data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error while editing the profile: " + error.message);
  }
});

module.exports = profileRouter;
