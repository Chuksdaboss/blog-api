const Category = require("../Model/Category/Category");
const Category = require("../Model/Catergory/Category");
const appErr = require("./utils/appErr");

const createCategoryCtrl = async (req, res, next) => {
    const { title } = req.body;
    try{
        const category = await Category.create({ title, user: req.userAuth });
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
const fetchCategoryCtrl = async (req, res, next) => {
        try {
            const categories = await Category.find();
            res.json({
                status: "success",
                data: categories,
            });
        } catch (error) {
            next(appErr(error.message));
        }
};
const singleCategory = async (req,res, next) =>{
    const category = await Category.findById(req.params.id);
    try{
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message));
    }
};


const deleteCategory = 

module.exports = {
    createCategoryCtrl,
    fetchCategoryCtrl,
    singleCategory,
}
