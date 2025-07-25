const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {signUpDataValidation} = require("../utils/validations");
const bcrypt = require("bcrypt");

//sign up user
authRouter.post("/signUp", async (req, res) => {
  //Creating the instance of the user model
  try {
    //Validating the user data
    signUpDataValidation(req);

    const { password, firstName, lastName, emailId, skills, photoUrl } = req.body;

    //Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword: ", hashedPassword);

    // if (req.body?.skills.length > 5) {
    //   return res.status(400).send("Skills should not exceed 5 items");
    // }
    const user = User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });

    const savedUser = await user.save();
    const token = user.getJwt();
    res.cookie("token", token);

    // Remove password field before sending response
    const userObj = savedUser.toObject();
    delete userObj.password;

    res.json({message: "User inserted", data: userObj});
  } catch (error) {
    res.status(400).send("Error while saving the user: " + error.message);
  }
});

//login user
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    console.log("user: ", user);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePAssword(password);
    console.log("isPasswordValid: ", isPasswordValid);

    if (isPasswordValid) {
      const token = user.getJwt();
      console.log("token: ", token);
      res.cookie("token", token);
      res.status(200).send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error while logging in: " + error.message);
  }
});

//logout user
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
