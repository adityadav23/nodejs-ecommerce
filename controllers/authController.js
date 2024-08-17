const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: `Hello, ${email}!` });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.logoutUser = (req, res) => {
  res.json({ message: "User logged out" });
};

// POST /api/auth/register - Register a new user
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ email, password, role });
    await newUser.save();

    res
      .status(201)
      .json({ msg: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
