// this is basically a hash string encoded with user data.
// it helps us to verify the user at the backend.

const jwt = require('jsonwebtoken');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '365d'
  });
};
module.exports = generateToken;
