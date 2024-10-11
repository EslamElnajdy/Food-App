import foodModel from "../models/foodModel.js";
import fs from "fs"; 

// add food item

const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  let image_filename = req.file.path;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: image_filename,
    category: req.body.category
  });

  try {
    const savedFood = await food.save();
    res.json({success: true, message: "Food item added successfully"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }

}

// all food list

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({success: true, data: foods});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
}

// remove food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {})
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success: true, message: "Food item removed successfully"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
}

export {addFood, listFood, removeFood};