const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { userModel } = require("../models/UserModel");

//register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: "fullname, email and password is required" });
    }
    if(password.length<8){
       return res.status(411).json({error: "Password length is not correct"});
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {

    console.error("Registration error:", err); // Log error in console

    // Fallback
    res.status(500).json({ error: "Internal server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credencial" });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(400).json({ message: "Please input correct password" });
    }
    const accessToken = jwt.sign({ _id : user._id, data: { email: email, password:password } }, "qwertyuiop", {
      expiresIn: "10min",
    });
    const refreshToken = jwt.sign({ _id : user._id ,data: {email: email, password:password } }, "asdfghjkl", {
      expiresIn: "20min",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 600000, // 10 min
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1200 * 1000, // 20 min
    });

    res.json({
      message: "token is send successfully",
      userDetail: { _id: user._id, email: user.email, password: user.password, accessToken: accessToken },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//refreshToken
router.post('/refresh-token',(req,res)=>{
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });
    try{
        const user = jwt.verify(token, "asdfghjkl");
        const newAccessToken = jwt.sign({ data: { user: user.email, password: user.password }}, "qwertyuiop" , {expiresIn: '1min'});
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 60 * 10000
        })
        res.json({ message: "Token refreshed" });
    }
    catch(err){
        res.status(403).json({ error: "Invalid refresh token" });
    }
})

//api-status-check

router.get('/status',(req,res)=>{
  try {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
      return res.status(400).json({ isAuthenticated: false , message: "accessToken is not available"});
    }
    const user = jwt.verify(accessToken,"qwertyuiop");
    if(!user){
      res.json({message: "user is not available"})
      return res.json({isAuthenticated: false})
    }
    res.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error("JWT Error:", error.message);  
    res.json({ isAuthenticated: false , message: error.message});
  }
})

//logout api
router.post('/logout',(req,res)=>{
  try {
    res.clearCookie("accessToken",{
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:false,
      sameSite:"strict"
    })
    res.status(201).json({message:"Logout successfully"});
  } catch (error) {
     res.status(500).json({message: "logout api is not working"});
  }
})

module.exports = router;
