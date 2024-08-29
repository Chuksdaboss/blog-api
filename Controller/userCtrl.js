const User = require("../Model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const appErr = require("../Utils/appErr");
const Post = require("../Model/Post/Post");
const categoryRouter = require("../Route/categoryRoutes");
const Comment = require("../Model/Comment/Comment");
// const Category = require("../Model/Category/Category");





//Register
const register = async (req,res,next) =>{
const { firstName, lastName, profilePhoto, email, password, isAdmin } = req.body;


    try {
        const userFound = await User.findOne({ email });
        if(userFound){
            return next(new Error("User already exist"));
            
       }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin
        });
        res.json({
            status: "success",
            data: user,
        });
} catch (error) {
    next(appErr(error.message));
  }
};

//Login
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return next(appErr("Invalid credentials", 400));
        };
        const isPasswordMatched = await bcrypt.compare(
            password,
            userFound.password
        );
        if (!isPasswordMatched) {
            return next(appErr("Invalid credentials", 400));
        }

        res.json({
            status: "success",
            data: {
                firstName: userFound.firstName,
                email: userFound.email,
                token: generateToken(userFound._id)
            },
        });
    }catch (error) {
       next(appErr(error.message));
    }




} 
//hash password

//All Users
const allUsers = async (req,res,next) =>{
    try{
        res.json({
            status: "success",
            data: "All User"
        })
    } catch (error) {
        next(appErr(error.message));
    }
};

//SingleUser
const singleUser = async (req,res) =>{
    const user = await User.findById(req.userAuth);
    try{
        res.json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(appErr(error.message));
    }
} 


//UpdateUser
const updateUser = async (req,res) =>{
    try{
        res.json({
            status: "success",
            data: "Update User"
        })
    } catch (error) {
        res.json(error.message)
    }
}


// const deleteUser = async (req,res) =>{
//     try{
//         res.json({
//             status: "success",
//             data: "Delete User"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// };
const profilePhotoUploadCtrl = async (req,res,next) => {
    try {
        //1. find the user to be update
        const userToUpdate = await User.findById(req.userAuth);
        //2. check if user found
        if(!userToUpdate) {
            return next(appErr("User not found"))
        };
        //check if user is blocked
        if (!userToUpdate) {
            return next(appErr("Action not allowed, your account is blocked", 403));
        }
        //check if a user is updating their photo
        if (req.file) {
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto: req.file.path,
                    },
                },                
                {
                    new: true,
                }
            );
            res.json({
                status: "success",
                data: "Profile photo updated successfully",
            });
        }
    } catch (error) {
        next(appErr(error.message, 500));
    }
};
const whoViewedMyProfileCtrl = async (req, res,next) => {
    try{
        const user = await user.findById(req.userAuth);
        if(user && userWhoViewed) {
            const isUserAlreadyViewed = user.veiwers.find(
                (veiwer) => veiwer.toString() === userWhoViewed._id.toJSON()
            );
            if (isUserAlreadyViewed) {
                return next(appErr("You already veiwed this profile"));
            } else {
                user.veiwers.push(userWhoViewed._id);
                await user.save();
                res.json({
                    status: "success",
                    msg: "You have succesfully viewed this profile",
                    data: user.veiwers,
                });
            }
        }
    } catch (error) {
        next(error.message,500);
    }
};
const followingCtrl = async(req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const userWhoFollowed = await User.findById(req.userAuth);

        if (userToFollow && userWhoFollowed){
            const isUserAlreadyFollowed = userWhoFollowed.following.find(
                (follower) => follower.toString() === userWhoFollowed._id.toString()   
            );
            if (isUserAlreadyFollowed) {
                return next(appErr("You already followed this user"));
            } else {
                userToFollow.followers.push(userWhoFollowed._id);
                userWhoFollowed.following.push(userToFollow._id);
                await userWhoFollowed.save();
                await userToFollow.save();


                res.json({
                    status: "success",
                    message: "You have successfully followed this user",
                    followers: userToFollow.followers,
                    following: userWhoFollowed.following,
                });
            }
        }
    } catch (error){
        next(appErr(error.message));
    }
};
const unFollowCtrl = async (req,res,next) => {
    try{
        const userToBeUnfollowed = await User.findById(req.params.id);
        const userWhoFollowed = await User.findById(req.userAuth);
        if (userToBeUnfollowed && userWhoUnfollowed){
            const isUserAlreadyUnfollowed = userToBeUnfollowed.followers.find(
                (follower) => follower.toString() === userWhoUnfollowed._id.toString()
            );
            if (!isUserAlreadyUnfollowed) {
                return next(appErr("You are not following this user"));
            } else {
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                    (follower) => follower.toString() !== userWhoUnfollowed._id.toString()
                );
                await userToBeUnfollowed.save();

                userWhoUnfollowed.following = userToBeUnfollowed.following.filter(
                    (following) => following.toString() !== userWhoUnfollowed._id.toString()
                );
                await userWhoUnfollowed.save();
                res.json({
                    status: "success",
                    msg: "You have successfully unfollowed the user",
                    usertobeunfollowed: userToBeUnfollowed.followers,
                    userwhounfollowed: userWhoUnfollowed.following,
                });
            }
        }
    } catch (error) {
        next(appErr(error.message));
    }
};
const blockedUserCtrl = async (req, res, next) => {
    try{
        const userToBlocked = await User.findById(req.params.id);
        const userWhoBlocked = await User.findById(req.params.id);
        if (userToBlocked && userWhoBlocked) {
            const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
                (blocked) => blocked.toString() === userToBlocked._id.toString()
            );
            if (!isUserAlreadyBlocked) {
                return next(appErr("You already blocked the user"));
            } else {
                userWhoBlocked.blocked.push(userToBlocked._id);

                await userWhoBlocked.save();
                res.json({
                    status: "success",
                    message: "You have successfully blocked this user",
                    blocked: userWhoBlocked.blocked,
                });
            }
        }
    } catch (error) {
        next(appErr(error.message));
    }
};
// const unBlockedUserCtrl = async (req, res, next) => {
//     try{
//         const userToUnBlocked = await User.findById(req.params.id);
//         const userWhoUnBlocked = await User.findById(req.userAuth);
//         if (userToUnBlocked && userWhoUnBlocked) {
//             const isUserAlreadyUnBlocked = userWhoUnBlocked.unblocked.find(
//                 (unblocked) => unblocked.toString() === userToUnBlocked._id.toString()
//             );
//         }
//     } catch (error) {
//         next(appErr(error.message));
//     }
// };

const adminBlockUserCtrl = async (req, res, next) => {
    try {
        const userToBeBlocked = await User.findById(req.params.id);
        if (!userToBeBlocked) {
            return next(appErr("User Not Found", 400));
        }
        userToBeBlocked.isBlocked = true;
        await userToBeBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully blocked this user",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const updateUserCtrl = async (req, res, next) => {
    const { email, firstName, lastName } = req.body;
    try {
        if (email) {
            if (emailFound) {
                return next(appErr("Email is taken", 400));
            }
        }
        const user = await User.findByIdAndUpdate(
            req.userAuth,
            { lastName, firstName,email },
            { new: true, runValidators: true}
        );
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                await User.findByIdAndUpdate(
                    req.userAuth,
                    {
                        password: hashedPassword,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                res.json({
                    status: "success",
                    data: "Password update successfully",
                });
            } else {
                return next(appErr("Please Provide password field"));
            }
        } catch (error) {
            res.json(error.message);
        }
};

const deleteUserCtrl = async (req, res, next) => {
    try {
        const userToDelete = await User.findByIdAndDelete(req.userAuth);
        await Post.deleteMany({ user: req.userAuth });
        await Comment.deleteMany({ user: req.userAuth });
        await Category.deleteMany({ user: req.userAuth });
        // await userToDelete.deleteOne();
        res.json({
            status: "success",
            data: "Your account has been deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
module.exports = {
    register,
    login,
    allUsers,
    singleUser,
    updateUser,
    // deleteUser,
    profilePhotoUploadCtrl,
    whoViewedMyProfileCtrl,
    followingCtrl,
    unFollowCtrl,
    blockedUserCtrl,
    adminBlockUserCtrl,
    updateUserCtrl,
    updatePasswordCtrl,
    deleteUserCtrl,
    // unBlockedUserCtrl,
}

