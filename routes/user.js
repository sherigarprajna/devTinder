const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewers/auth");
const connectRequest = require("../models/connectRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connectRequestRecived = await connectRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName emailId skills");

    const connectRequestData = connectRequestRecived.map(
      (request) => request.fromUserId
    );

    res.json({
      message: `Received requests for ${loggedInUser.firstName}`,
      data: connectRequestData,
    });
  } catch (error) {
    res
      .status(400)
      .send("Error while fetching received requests: " + error.message);
  }
});

userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connectRequestRecived = await connectRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", "firstName lastName emailId skills")
      .populate("toUserId", "firstName lastName emailId skills");

    const connectRequestData = connectRequestRecived.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({
      data: connectRequestData,
    });
  } catch (error) {
    res
      .status(400)
      .send("Error while fetching received requests: " + error.message);
  }
});

module.exports = userRouter;
