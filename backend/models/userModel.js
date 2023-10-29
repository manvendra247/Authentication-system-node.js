const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // to encrypt password

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

userSchema.methods.matchPassword = async function (entered_password) {
  return await bcrypt.compare(entered_password, this.password);
};

userSchema.methods.updatePassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};
// encypt the password before saving it to the database.
userSchema.pre('save', async function (next) {
  // .pre  -> this function will be executed before saving the data.
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // higher the value, more strong incryption.
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
