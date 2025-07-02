const express = require("express");
const app = express();
const dbconnect = require("../config/database");
const User = require("../models/user");
const validation = require("../utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewers/auth");

app.use(express.json());
app.use(cookieParser());

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
  try {
    //Validating the user data
    validation(req);

    const { password, firstName, lastName, emailId, skills } = req.body;

    //Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword: ", hashedPassword);

    if (req.body?.skills.length > 5) {
      return res.status(400).send("Skills should not exceed 5 items");
    }
    const user = User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      skills,
    });
    await user.save();
    res.send("User inserted");
  } catch (error) {
    res.status(400).send("Error while saving the user: " + error.message);
  }
});

//login user
app.post("/login", async (req, res) => {
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
      res.status(200).send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error while logging in: " + error.message);
  }
});

// //get users
// app.get("/user", async (req, res) => {
//   const users = await User.find({ emailId: req.body.emailID });
//   try {
//     if (!users || users.length === 0) {
//       res.status(404).send("No users found with the provided emailID");
//     } else {
//       res.status(200).send(" users found with the same emailID");
//     }
//   } catch (error) {
//     res.status(400).send("Error while fetching the users", +error.message);
//   }
// });

// //get all users
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     console.log("users: ", users);
//     if (!users || users.length === 0) {
//       res.status(404).send("No users found");
//     } else {
//       res.status(200).send(" users found");
//     }
//   } catch (error) {
//     res.status(400).send("Error while fetching the users", +error.message);
//   }
// });

// //delete user
// app.delete("/user", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.body.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).send("User deleted successfully");
//   } catch (error) {
//     res.status(400).send("Error while deleting the user", +error.message);
//   }
// });

// //update user
// app.put("/user/:userId", async (req, res) => {
//   try {
//     const id = req.params.userId;
//     const ALLOWED_UPDATES = [
//       "age",
//       "gender",
//       "about",
//       "photoUrl",
//       "skills",
//       "id",
//     ];
//     const updates = Object.keys(req.body).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );

//     if (!updates) {
//       return res.status(400).send("Invalid updates");
//     }
//     if (req.body?.skills.length > 5) {
//       return res.status(400).send("Skills should not exceed 5 items");
//     }
//     const user = await User.findByIdAndUpdate(id, req.body, {
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).send("User updated successfully");
//   } catch (error) {
//     res.status(400).send("Error while updating the user" + error.message);
//   }
// });

app.get("/profile", userAuth, async (req, res) => {
  try {
    const fetchedUser = req.user;
    res.send("User profile fetched successfully: " + fetchedUser);
  } catch (error) {
    res.status(400).send("Error while fetching the users: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
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
