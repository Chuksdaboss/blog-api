
const Post = require("../Model/Post/Post");
const User = require("../Model/User/User");
const appErr = require("../Utils/appErr");


//create post
const createPostCtrl = async ( req,res, next) =>{
    const { title , descriptions, category } = req.body;
    try {
        //Find the user 
        const author = await User.findById(req.userAuth);

        //Checkif the user is blocked
        if (author.isBlocked === true) {
            return next(appErr("Access denied, account blocked", 403));
        }

        const postTitle = await User.findOne({ title });
        if (postTitle) {
            return next(appErr(`${title} already exists`, 403));
        }
       
        //create the post 
        const postCreated = await Post.create({
            title,
            descriptions,
            category,
            user: author._id,
        });
        //Associate user to a post - Push the post into posts
        author.posts.push(postCreated);
        await author.save();
        res.json({
            status: "success",
            data: postCreated,
        })
    } catch (error) {
      res.json(error.message)  
    }
};

//single Post
const SinglePost = async ( req,res) =>{
    try {
        const userPost = await Post.findById(req.params.id); 
        //find the user who made a single 
        res.json({
            status: "success",
            data: userPost,
        })
    } catch (error) {
      res.json(error.message)  
    }
}

//All Users
const Allpost = async (req,res) =>{
    try{
        res.json({
            status: "success",
            data: "All User"
        })
    } catch (error) {
        res.json(error.message)
    }
}

//update user
const Updatepost= async (req,res)=>{
    try {
        res.json({
            status: "success",
            data: "update User"
        })
    } catch (error) {
        res.json(error.message)
    }
}

const Deletepost=  async (req,res)=>{
    try {
        res.json({
            status: "success",
            data: "delete User"
        })
    } catch (error) {
        res.json(error.message)
    }
}

const fetchPostsCtrl = async (req, res) => {
    try{
        const posts = await Post.find({})
        .populate("category","title")
        .populate("user");

        const filteredPosts = posts.filter((post) => {
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);
            return !isBlocked;
        })
        res.json({
            status: "success",
            data: posts
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const toggleLikesPostCtrl = async (req,res,next) => {
 try {
    const post = await Post.findById(req.params.id);

    const isDisLiked = post.dislikes.includes(req.userAuth);

    const isLiked = post.likes.includes(req.userAuth);

    if (isDisLiked){
        return next (appErr("You have already disliked this post, undislike to like the post"));
    } else {
        if(isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString())
            await post.save()
        }else{
            post.likes.push(req.userAuth)
            await post.save()
        }
        res.json({
            status: 'success',
            data: post,
        });
    }

    } catch (error) {
        next(appErr(error.message));
    };
};
const toggleDisLikesPostCtrl = async (req,res,next) => {
 try {
    const post = await Post.findById(req.params.id);

    const isDisLiked = post.dislikes.includes(req.userAuth);

    const isLiked = post.likes.includes(req.userAuth);

    if (isLiked) {
        return next(
            appErr(
                "You have already liked this post,unlike to Dislike the post",
                403
            )
        );
    } else {
        if(isDisLiked) {
            post.dislikes = post.dislikes.filter((dislikes) => dislikes.toString() !== req.userAuth.toString());
            await post.save()
        }else{
            post.dislikes.push(req.userAuth)
            await post.save()
        }
        res.json({
            status: 'success',
            data: post
        });
    } 
    }catch (error) {
            next(appErr(error.message));
    };
};

const postDetailsCtrl = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);

        const isViewed = await post.numViews.includes(req.userAuth);
        if (isViewed) {
            res.json({
                status: 'success',
                data: post,
            });
        } else {
            post.numViews.push(req.userAuth);
            await post.save();
            res.json({
                status: "success",
                data: post,
            });
        }
    } catch (error) {
        next(appErr(error.message));
    }
};

const deletePost = async (req,res, next) => {
    try{
        const post = await Post.findById(req.params.id);

        if(post.user.toString() !== req.userAuth.toString()){
            return next(appErr(`You are not allowed to delete this post`, 403))
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Post Has Been Deleted",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
const updateUserPost = async (req,res,next) => {
    const { title, description, category } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to update this post", 403));
        }
        const updatePost = await Post.findByIdAndUpdate(req.params.id ,
            { title, description, category, photo: req?.file?.path },
            { new: true}
        );
        res.json({
            status: "success",
            data: updateUserPost,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};


module.exports = {
    Allpost,
    SinglePost,
    Updatepost,
    Deletepost,   
    createPostCtrl, 
    fetchPostsCtrl, 
    toggleLikesPostCtrl,
    toggleDisLikesPostCtrl,
    postDetailsCtrl,
    deletePost,
    updateUserPost,
}