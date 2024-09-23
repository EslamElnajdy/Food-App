import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const foodRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in your Cloudinary storage
    format: async (req, file) => "jpg", // Specify the image format
    public_id: (req, file) => Date.now() + "_" + file.originalname, // Unique file name
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);








export default foodRouter;