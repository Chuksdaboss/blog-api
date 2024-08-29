const mongoose = require ("mongoose");
const Post = require("../Post/Post");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "first Name is required"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "last Name is required"],
            trim: true
        },
        
        profilePhoto: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        postCount: {
            type: Number,
            default: 0 
        },
        isBlocked:{
            type: Boolean,
            default: false,
        },
        isAdmin:{
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["Admin", "Guest", "Editor"],
        },
        viewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        ],
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        ],
        following:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        ],
        active: {
            type: Boolean,
            default: true,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        comments: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Comment",
            },
          ],
        blocked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        plan: [
            {
                type: String,
                enum: ["Free","Premium", "Pro"],
                default:"Bronze",
            },
        ],
        userAward: {
            type: String,
            enum:["Bronze","Silver","Gold"],
            default:"Bronze",
        }
        
    },   
        
    
    {
        timestamps: true,
    }
);

userSchema.pre("findOne", async function (next) {
    const userId = this._conditions._id;
    const posts = await Post.find({ user: userId });
    const lastPost = posts[posts.length - 1];
    const lastPostDate = new Date(lastPost?.createdAt);
    const lastPostDateStr = lastPostDate.toDateString();
    userSchema.virtual("lastPostDate").get(function () {
        return lastPostDateStr;
    });
    
    const currentDate = new Date();
    const diff = currentDate - lastPostDate;
    const diffInDays = diff / (1000 * 3600 * 24);
    
    if (diffInDays > 30) {
        userSchema.virtual("isInactive").get(function () {
            return true;
        });
        await user.findByIdAndUpdate(
            userId,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
    } else {
        userSchema.virtual("isInactive").get(function () {
            return false;
        });
        await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
    }
    const daysAgo = Math.floor(diffInDays);
    userSchema.virtual("lastActive").get(function () {
        if (daysAgo <= 0) {
            return "Today";
        }
        if (daysAgo === 1) {
            return "Yesterday";
        }
        if (daysAgo > 1) {
            return `${daysAgo} days ago`
        }
    });
    const numberOfPosts = posts.length;
    if (numberOfPosts < 10) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: "Bronze",
            },
            {
                new: true,
            }
        );
    }
    if (numberOfPosts > 10) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: "Silver",
            },
            {
                new: true,
            }
        );
    }
    if (numberOfPosts > 20) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: "Gold",
            },
            {
                new: true,
            }
        );
    }
    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;

