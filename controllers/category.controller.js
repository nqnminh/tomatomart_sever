const Category =require ('../models/category.models');

module.exports.index = async(req,res) => {
    const category = await Category.find();
    res.json(category);
}