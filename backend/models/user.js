import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,

        email: {
            type: String,
            unique: true,
        },

        password: String,

        githubId: String,

        githubUsername: String,

        githubAvatar: String,

        accessToken: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);