// use package async handler which handles the error automatically
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ msg: 'User already exists' });
  }
  const newUser = await User.create({
    name,
    email,
    password
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id) // jwt token ** important
    });
  } else {
    res.status(400).json({ msg: 'User could not be created' });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //need to add same variable for username and email.
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      await user.updatePassword(req.body.password);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  // If using sessions
  req.session = null;

  // If using JWTs
  // Usually, you can't manually expire JWTs. But you can delete the saved token from the client side.

  res.json({ message: 'User logged out successfully' });
});

module.exports = { registerUser, authUser, updateUserProfile, logoutUser };
