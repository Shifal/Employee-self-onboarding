const express = require("express");
const app = express();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const saveExcelSheet = require("../middleware/exclefile");
const fs = require("fs");
const xlsx = require("xlsx");

let asyncloop = require("async");

app.use(express.json());

//importting schema
const Application = require("../FieldAgentmodel/submission");
const Token = require("../FieldAgentmodel/token");
const User = require("../Admin/userregistered");

// Define the registration route

module.exports = {
//admin:
// Admin login
AdminLogin: async (req, res) => {
  // our login logic goes here
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24hrs",
        }
      );
      //save token
      user.token = token;

      const token1 = await Token.findOne({ userName: user.role });
      if (token1) {
        await Token.updateOne({ userName: user.role }, { $set: { token } });
      } else {
        // save user token
        const savedToken1 = await Token.create({
          userName: user.role,
          token,
        });
      }
      res.status(200).send({
        status: "success",
        message: "Logged in successfully",
        data: { token: token },
      });
      console.log("Admin login successfully");
      // res.json({ token });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
},
// Admin logout
AdminLogout: async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Check if email and password are valid
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).send("Invalid email or password");
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const tokenDoc = await Token.findOne({ token, userName: user.role });
    if (!tokenDoc) {
      return res.status(400).send("Invalid token");
    }
    await Token.deleteOne({ token, userName: user.role });
    return res
      .status(200)
      .send({ status: "success", message: "Logout successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
},
//Register a new Field Agent
FieldAgentRegister : async (req, res) => {
  try {
    await verifyToken(req, "Admin", res, async () => {
      // Get user input
      const { name, email, password, role, verified } = req.body;
      // Verify that the current user is an admin

      // Validate that all required fields are present
      if (!(name && email && password && role && verified)) {
        res.status(400).send("All input is required");
      }

      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist");
      }

      //encrypt the password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create in our database
      const user = await User.create({
        name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role,
        verified,
      });
      // return;
      res.status(201).json(user);
    });
  } catch (err) {
    console.log(err);
  }
},
// Register a new HR Executive
HrexecutivesRegister: async (req, res) => {
  try {
    await verifyToken(req, "Admin", res, async () => {
      // Get user input
      const { name, email, password, role, verified } = req.body;
      // Verify that the current user is an admin

      // Validate that all required fields are present
      if (!(name && email && password && role && verified)) {
        res.status(400).send("All input is required");
      }

      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist");
      }

      //encrypt the password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create in our database
      const user = await User.create({
        name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role,
        verified,
      });
      // return;
      res.status(201).json(user);
    });
  } catch (err) {
    console.log(err);
  }
},
// Get the list of registered employees
AdminUsers: async (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server Error");
    });
},
// get the count document list
AdminView: async (req, res) => {
  try {
    const verifiedCount = await Application.countDocuments({
      isVerified: true,
    });
    const unverifiedCount = await Application.countDocuments({
      isVerified: false,
    });
    const totalCount = verifiedCount + unverifiedCount;
    res.send({
      TotalApplication: totalCount,
      VerifiedApplication: verifiedCount,
      UnverifiedApplication: unverifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
},

//Field agent:
//filed agent login
FieldAgentLogin: async (req, res) => {
  // our login logic goes here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24hrs",
        }
      );
      //save token
      user.token = token;

      const token1 = await Token.findOne({ userName: user.role });
      if (token1) {
        await Token.updateOne({ userName: user.role }, { $set: { token } });
      } else {
        // save user token
        const savedToken = await Token.create({
          userName: user.role,
          token,
        });
      }
      res.status(200).send({
        status: "success",
        message: "Logged in successfully",
        data: { token: token },
      });
      // res.json({ token });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
},
//field agent logout
FieldAgentLogout: async (req, res) => {
  // our logout logic goes here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Check if email and password are valid
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).send("Invalid email or password");
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user1 = await User.findOne({ _id: decoded.user_id });
    const tokenDoc = await Token.findOne({ token, userName: user.role });
    if (!tokenDoc) {
      return res.status(400).send("Invalid token");
    }
    await Token.deleteOne({ token, userName: user.role });
    return res
      .status(200)
      .send({ status: "success", message: "Logout successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
},
//field agent submit the Application of employee
FieldAgentSubmit:async (req, res) => {
    try {
      await verifyToken(req, "FieldAgent", res, async () => {
        // Get file path of uploaded image
        const imagePath = req.file.path; // Define imagePath here
        const contentType = req.file.mimetype;
        const {
          employeename,
          dob,
          fatherName,
          email,
          password,
          phono,
          motherName,
          gender,
          maritalStatus,
          permanentAddress,
          communicationAddress,
          city,
          taluk,
          district,
          state,
          pincode,
          alternateMobileNumber,
          institution,
          degree,
          yearOfPassing,
          certificates,
          employerName,
          joiningDate,
          relievingDate,
          experience,
          position,
          relievingLetter,
          payslips,
          offerLetter,
          name,
          relationship,
          mobileNumber,
          addressProof,
          ageProof,
          signatureProof,
          isVerified,
        } = req.body;

        encryptedPassword = await bcrypt.hash(password, 10);

        const application = new Application({
          basicdetails: {
            employeename,
            dob,
            fatherName,
            email,
            password,
            phono,
          },
          personaldetails: {
            motherName,
            gender,
            maritalStatus,
            permanentAddress,
            communicationAddress,
            city,
            taluk,
            district,
            state,
            pincode,
            alternateMobileNumber,
          },
          educationDetails: {
            institution,
            degree,
            yearOfPassing,
            certificates,
          },
          previousEmployment: {
            employerName,
            joiningDate,
            relievingDate,
            experience,
            position,
            relievingLetter,
            payslips,
            offerLetter,
          },
          familyMembers: {
            name,
            relationship,
            mobileNumber,
          },
          kycDetails: {
            addressProof,
            ageProof,
            signatureProof,
          },
          photographs: {
            recentPhotograph: {
              path: imagePath,
              contentType: contentType,
            },
          },
          isVerified,
        });

        try {
          await application.save();
          res.status(200).send({
            status: "success",
            message: "Application submitted successfully.",
            data: { application },
          });
        } catch (err) {
          // console.log(err);
          if (err.code === 11000) {
            res.status(400).send({
              status: "error",
              message: "Application already exists with the given email",
            });
          } else {
            res.status(500).send("Application submission failed");
          }
        }
      });
    } catch (err) {
      res.status(500).send("Internal server error");
    }
},
//field agent access the profile of employee
photograph: async (req, res) => {
  const id = req.params.id;

  try {
    await verifyToken(req, "FieldAgent", res, async () => {
      const application = await Application.findById(id);
      const image = application.photographs.recentPhotograph;
      const file = fs.readFileSync(image.path); // read the file
      res.contentType(image.contentType);
      res.send(file); // send the file contents as response body
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
},
// Define a route to generate and download an Excel sheet of all applications
ExcelSheet:  async (req, res, next) => {
    try {
      // Find all applications
      const data = await Application.find({});
      // console.log(data);
      let applications = [];
      asyncloop.forEachOf(data, (item, key, next) => {
        applications.push({
          'employeename': item.basicdetails.employeename,
          'dob': item.basicdetails.dob,
          'fatherName': item.basicdetails.fatherName,
          'email': item.basicdetails.email,
          'password': item.basicdetails.password,
          'phono': item.basicdetails.phono,

          'motherName': item.personaldetails.motherName,
          'gender': item.personaldetails.gender,
          'maritalStatus': item.personaldetails.maritalStatus,
          'permanentAddress': item.personaldetails.permanentAddress,
          'communicationAddress': item.personaldetails.communicationAddress,
          'city': item.personaldetails.city,
          'taluk': item.personaldetails.taluk,
          'district': item.personaldetails.district,
          'state': item.personaldetails.state,
          'pincode': item.personaldetails.pincode,
          'alternateMobileNumber': item.personaldetails.alternateMobileNumber,

          'institution': item.educationDetails.institution,
          'degree': item.educationDetails.degree,
          'yearOfPassing': item.educationDetails.yearOfPassing,
          'certificates': item.educationDetails.certificates,

          'employerName': item.previousEmployment.employerName,
          'joiningDate': item.previousEmployment.joiningDate,
          'relievingDate': item.previousEmployment.relievingDate,
          'experience': item.previousEmployment.experience,
          'position': item.previousEmployment.position,
          'relievingLetter': item.previousEmployment.relievingLetter,
          'payslips': item.previousEmployment.payslips,
          'offerLetter': item.previousEmployment.offerLetter,

          'addressProof': item.kycDetails.addressProof,
          'ageProof': item.kycDetails.ageProof,
          'signatureProof': item.kycDetails.signatureProof,

          'recentPhotograph':item.photographs.recentPhotograph.path,

          'isVerified': item.isVerified
        });
        next();
      });
      console.log(applications);
      console.log("Number of applications fetched:", applications.length);

      // Create a new workbook
      var today = new Date(Date.now());
      const ws = xlsx.utils.json_to_sheet(applications);
      var filePath = `./excel/Report${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.xlsx`;
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Prospects");
      xlsx.writeFile(wb, filePath);
      res.download(filePath);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
    saveExcelSheet("./excel"),
  async (req, res) => {
    res.status(200).send({
      status: "success",
      message: "Excel sheet generated and sent",
      data: req.applications,
    })
  }
},

// Hr-Executive:
//Hr executive login
HrexecutiveLogin : async (req, res) => {
  // our login logic goes here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24hr",
        }
      );
      //save token
      user.token = token;

      const token1 = await Token.findOne({ userName: user.role });
      if (token1) {
        await Token.updateOne({ userName: user.role }, { $set: { token } });
      } else {
        // save user token
        const savedToken = await Token.create({
          userName: user.role,
          token,
        });
      }
      res.status(200).send({
        status: "success",
        message: "Logged in successfully",
        data: { token: token },
      });
      // res.json({ token });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {}
},
// Hr executive logout
HrexecutiveLogout : async (req, res) => {
  // our logout logic goes here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Check if email and password are valid
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).send("Invalid email or password");
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user1 = await User.findOne({ _id: decoded.user_id });
    const tokenDoc = await Token.findOne({ token, userName: user.role });
    if (!tokenDoc) {
      return res.status(400).send("Invalid token");
    }
    await Token.deleteOne({ token, userName: user.role });
    return res
      .status(200)
      .send({ status: "success", message: "Logout successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
},
//view the employee list
HrexecutiveEmployees :  async (req, res) => {
  Application.find({})
    .then((application) => {
      res.json(application);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server Error");
    })
},
// verify the employees
HrexecutiveVerify :  async (req, res) => {
  try {
    await verifyToken(req, "HR Executive", res, async () => {
      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        { $set: { isVerified: req.body.isVerified } },
        { new: true, runValidators: true }
      );

      if (!updatedApplication) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (!updatedApplication.isVerified) {
        return res.status(400).json({ error: "Application rejected" });
      }

      console.log(updatedApplication);

      res.status(201).json({
        message: "Application submitted successfully",
        application: updatedApplication,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Application update failed");
}
}

}