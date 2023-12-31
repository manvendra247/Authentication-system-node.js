const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').put(updateUserProfile);
router.route('/logout').put(logoutUser);
module.exports = router;
