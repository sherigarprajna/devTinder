const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password" + value);
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using devTinder",
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid URL" + value);
        }
      },
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
userSchema.methods.getJwt = function () {
  const user = this;
  console.log("user:============================= ", user);
  return jwt.sign({ _id: user._id }, "secretkeydevtinder$2323", {
    expiresIn: "7d",
  });
};

userSchema.methods.validatePAssword = async function (userEnteredPassword) {
  const user = this;
  const hashedDbPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    userEnteredPassword,
    hashedDbPassword
  );
  console.log("password:============================= ", isPasswordValid);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
