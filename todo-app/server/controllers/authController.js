const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const emailRx = /^\S+@\S+\.\S+$/;
const bad = (msg) => Object.assign(new Error(msg), { status: 400 });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw bad("Name, email and password are required");
    if (!emailRx.test(email)) throw bad("Invalid email address");
    if (password.length < 6) throw bad("Password must be at least 6 characters");
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw bad("Email and password are required");
    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
};
