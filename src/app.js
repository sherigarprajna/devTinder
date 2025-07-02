const express = require("express");
const app = express();
const dbconnect = require("../config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
