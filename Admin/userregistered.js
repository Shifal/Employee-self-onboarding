const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new mongoose.Schema({
    name:{type:String},
    email: {type:String,require:true},
    password: {type:String},
    role: {type:String, default: 'Admin', enum: ['Admin','FieldAgent', 'HR Executive'], required: true },
    verified: {type:Boolean},
  },
  { timestamps: true },
  );
  // Define the isValidPassword method on the userSchema
userSchema.methods.isValidPassword = async function(password) {
  try {
    // Use bcrypt to compare the given password with the hashed password in the database
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
  module.exports = mongoose.model("User", userSchema);