require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already exists!"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email")
      }
    }
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    trim: true
  },
  name: {
    type: String,
    required: [true, "Name is required!"],
    trim: true
  }
})

// adminSchema.pre("save", async function (next) {
//   let user = this;
//   if (user.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(user.password, salt);
//     user.password = hash;
//   }
//   next();
// })

// adminSchema.methods.generateToken = function () {
//   let user = this;
//   const userObj = { _id: user._id.toHexString(), email: user.email };
//   const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: '1d' });
//   return token;
// }

adminSchema.methods.comparePassword = async function (enteredPassword) {
  let user = this;
  // const match = await bcrypt.compare(enteredPassword, user.password);
  const match = enteredPassword === user.password;
  return match;
}

adminSchema.statics.isEmailTaken = async function (enteredEmail) {
  const user = await this.findOne({ email: enteredEmail });
  return !!user;
}


const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin };