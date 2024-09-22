import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// login user
export const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    // check if user exists
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "Invalid email or password"});
    }

    // compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({success: false, message: "Invalid email or password"});
    }

    const token = createToken(user._id);
    res.json({success: true, token});

  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error"});
  }

}

// create token
const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  })
}


// register user
export const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({success: false, message: "User already exists"});
    }

    // validate email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Invalid email format"});
    }
    if (password.length < 8) {
      return res.json({success: false, message: "Password is too short"});
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword
    })

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({success: true, token});


  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error"});
  } 

}