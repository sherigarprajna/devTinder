const mongoose = require("mongoose");

const connectRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    status: {
        type: String,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        },
    },
},{
    timestamps: true,
})

connectRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectRequestSchema.pre("save", async function (next) {
    const connectRequest = this;
    if(connectRequest.fromUserId.equals(connectRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself");
    }
    next();
});
module.exports = mongoose.model("ConnectRequest", connectRequestSchema);