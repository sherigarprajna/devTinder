const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewers/auth");
const connectRequest = require("../models/connectRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connectRequestRecived = await connectRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName emailId skills photoUrl");

    // const connectRequestData = connectRequestRecived.map(
    //   (request) => request.fromUserId
    // );
    // console.log("connectRequestData: ", connectRequestData);

    res.json({
      message: `Received requests for ${loggedInUser.firstName}`,
      data: connectRequestRecived,
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
      .populate("fromUserId", "firstName lastName emailId skills photoUrl")
      .populate("toUserId", "firstName lastName emailId skills photoUrl");

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
