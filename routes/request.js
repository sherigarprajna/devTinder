const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewers/auth");
const User = require("../models/user");
const ConnectRequest = require("../models/connectRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fetchedUser = req.user;
      const status = req.params.status;
      const fromUserId = fetchedUser._id;
      const toUserId = req.params.toUserId;

      const approvedStatus = ["ignored", "interested"];
      if (!approvedStatus.includes(status)) {
        return res.status(400).send("Invalid status provided");
      }

      const ifToUserExists = await User.findOne({ _id: toUserId });
      console.log("ifToUserExists: ", ifToUserExists);
      if (!ifToUserExists) {
        return res.status(404).send("User not found");
      }

      const existingConnectRequest = await ConnectRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectRequest) {
        return res
          .status(400)
          .send("Connect request already exists between these users");
      }

      const connectRequest = new ConnectRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectRequest.save();

      res.json({
        message: `${fetchedUser.firstName} has sent request to ${ifToUserExists.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send("Error while fetching the users: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const fetchedUser = req.user;
      const { status, requestId } = req.params;
      const validStatuses = ["accepted", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const connectRequest = await ConnectRequest.findById({
        _id: requestId,
        toUserId: fetchedUser._id, // Ensure the request belongs to the logged-in user
        status: "interested", // Only allow review if the status is 'interested'
      });
      if (!connectRequest) {
        return res.status(404).send("Request not found");
      }

      connectRequest.status = status;
      const data = await connectRequest.save();

      res.json({
        message: `Request has been ${status}`,
        data,
      });
    } catch (error) {
      res
        .status(400)
        .send("Error while reviewing the request: " + error.message);
    }
  }
);

module.exports = requestRouter;
