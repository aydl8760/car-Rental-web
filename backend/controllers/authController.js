const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { userName, email, password, role } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "all the inputs are required",
      });
    }
    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already used please try another!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = new User({
      userName,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "admin" ? false : true,
    });

    await createUser.save();

    res.status(200).json({
      message: "user Registered successfully",
      createUser,
    });
  } catch (err) {
    console.log(err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email must be unique" });
    }
    res.status(500).json({ error: "Server Error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All inputs are required",
      });
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        message: "Email is not found, please create a new account",
      });
    }

    const createdPassword = await bcrypt.compare(password, findUser.password);

    if (!createdPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //  HTTPS in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: findUser._id,
        email: findUser.email,
        name: findUser.name,
        role: findUser.role,
        isApproved: findUser.isApproved,
        image: findUser.image,
      },
    });
  } catch (err) {
    console.log(err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email must be unique" });
    }
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  signUp,
  signIn,
};
