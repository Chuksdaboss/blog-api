// const Category = require("../Model/Category/Category");
// const Category = require("../Model/Catergory/Category");
const Comment = require("../Model/Comment/Comment");
const User = require("../Model/User/User");
const post  = require("../Model/Post/Post");
const appErr = require("./utils/appErr");

const createCommentCtrl = async (req, res, next) => {
    const { description} = req.body;
    try{
        const post = await post.findById(req.params.id);
        const comment = await Comment.create({ 
            post: post._id,
            description,
            user: req.userAuth,
        });
            post.comments.push(comment._id);
            const user = await User.findById(req.userAuth);
            user.comments.push(comment._id);

            await post.save();
            await user.save();

        res.json({
            status: "success",
            data: comment,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
const fetchCommentCtrl = async (req, res, next) => {
        try {
            const comment = await Comment.find();
            res.json({
                status: "success",
                data: comment,
            });
        } catch (error) {
            next(appErr(error.message));
        }
};
const singleComment = async (req,res, next) =>{
    // const  = await Comment.findById(req.params.id);
    try{
        res.json({
            status: "success",
            data: Comment,
        })
    } catch (error) {
        next(appErr(error.message));
    }
};

const deleteCommentCtrl = async (req, res, next) => {
    
    try{
        const comments = await Comment.findById(req.params.id);    
        if(!comments){
            return next(appErr("Comment does not exist or it has been deleted"), 403);
        }  
        if(comments.user.toString() != req.userAuth.toString()){
            return next(appErr("You are not allowed to delete this comment"), 403)
        }
        await Comment.findByIdAndDelete(req.params.id)
        res.json({
            status: "success",
            data: "Comment is deleted successfully"
        });
    } catch (error) {
        next(appErr(error.message));
    }
};


module.exports = {
    createCommentCtrl,
    fetchCommentCtrl,
    singleComment,
    deleteCommentCtrl,
}
