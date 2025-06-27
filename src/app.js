const express = require("express");
const app = express();
const dbconnect = require("../config/database");
const User = require("../models/user");

app.use(express.json());

dbconnect()
  .then(() => {
    console.log("DB Connection Established Successfully");
    app.listen(3000, () => {
      console.log("Server is Running successfully..");
    });
  })
  .catch((error) => {
    console.error("Error while Connecting DB", error);
  });

//sign up user
app.post("/signUp", async (req, res) => {
  //Creating the instance of the user model
  const user = await User(req.body);
  try {
    user.save();
    res.send("User inserted");
  } catch (error) {
    res.status(400).send("Error while saving the user", +error.message);
  }
});

//get users
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailID });
    console.log('users: ', users);
    if (!users || users.length === 0) {
      res.status(404).send("No users found with the provided emailID");
    } else {
      res.status(200).send(" users found with the same emailID");
    }
  } catch (error) {
    res.status(400).send("Error while fetching the users", +error.message);
  }
});

//get users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log('users: ', users);
    if (!users || users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.status(200).send(" users found");
    }
  } catch (error) {
    res.status(400).send("Error while fetching the users", +error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error while deleting the user", +error.message);
  }
});

app.put("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, req.body);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error while updating the user", +error.message);
  }
});