const User = require("../Model/User/User");
const appErr = require("../Utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isAdmin = async (req, res, next) => {
    //get token from Headers
    const token = getTokenFromHeader(req);
    //verify token
    const decodedUser = verifyToken(token)
    //save the user into req obj
    req.userAuth = decodedUser.id;
    //find the user in DB
    const user = await User.findById(decodedUser.id);
    if (user.isAdmin){
        return next();
    }else{
        return next(appErr("Access denied,Admin Only" ,404));
    }
}

module.exports = isAdmin;