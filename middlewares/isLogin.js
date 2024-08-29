const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isLogin = (req, res, next) => {
    const token = getTokenFromHeader(req);
    const decodedUser = verifyToken(token);
    req.userAuth = decodedUser.id

    if (!decodedUser) {
        return res.json({
            msg: "Invalid/Expired token, please login again"
        });
    }else{
        next()
    }
}

module.exports = isLogin;