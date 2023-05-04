const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  basicdetails: {
    employeename: { type: String, required: true },
    dob: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phono: { type: Number, required: true },
  },
  personaldetails: {
    motherName: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    permanentAddress: { type: String },
    communicationAddress: { type: String },
    city: { type: String },
    taluk: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: Number },
    alternateMobileNumber: { type: String },
  },
  educationDetails: {
    institution: { type: String },
    degree: { type: String },
    yearOfPassing: { type: String },
    certificates: { type: String },
  },
  previousEmployment: {
    employerName: { type: String },
    joiningDate: Date,
    relievingDate: Date,
    experience: { type: Number },
    position: { type: String },
    relievingLetter: { type: String },
    payslips: { type: String },
    offerLetter: { type: String },
  },
  familyMembers: {
    name: { type: String },
    relationship: { type: String },
    mobileNumber: { type: String },
  },
  kycDetails: {
    addressProof: { type: String },
    ageProof: { type: String },
    signatureProof: { type: String },
  },
  photographs: {
    recentPhotograph: { 
      path: String,
      contentType: String
    },
  },
  isVerified: { type: Boolean, default: false },
});
module.exports = mongoose.model("Application", applicationSchema);
