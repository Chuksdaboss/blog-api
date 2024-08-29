
const express = require ("express");
const userRouter = require("./Route/userRoutes");
const postRouter = require("./Route/postRoutes");
const commentRouter = require("./Route/commentRoutes");
const categoryRouter = require("./Route/categoryRoutes");
const { applyDefaults } = require("./Model/User/User");
const globalErrHandler = require("./middlewares/globalErrHandler");
const isLogin = require("./middlewares/isLogin");
// const app = express()
require("dotenv").config()
require("./Config/dbConnect")


const app = express();

//Middleware
app.use(express.json());
const userAuth = {
    isLogin: true,
    isAdmin: false,
};
app.use((req, res, next) => {
    if (userAuth.isLogin) {
        next();
    } else {
        return res.json({
            msg: "invalid login credentials",
        });
    }
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/category",categoryRouter);

app.use(globalErrHandler);
//404 error
app.use("*", (req,res) => {
    res.status(404).json({
        message: `${req.originalUrl} - Route not found`
    });
});

// app.post("/api/v1/user/register", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "User register successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })
// app.post("/api/v1/user/login", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "User Login successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })
// app.get("/api/v1/users", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "All User Fetched successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })
// app.get("/api/v1/user/:id", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "Single User Fetched successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })
// app.put("/api/v1/user/:id", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "User Update successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })
// app.delete("/api/v1/user/:id", (req,res)=>{
//     try{
//         res.json({
//             status: "success",
//             data: "User Deleted successfully"
//         })
//     } catch (error) {
//         res.json(error.message)
//     }
// })



const PORT = process.env.PORT || 9000

app.listen(PORT, console.log(`server is running on ${PORT}`))

