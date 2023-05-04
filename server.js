const http = require("http");
const app = require("./app");
const bcrypt =require("bcrypt");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const Admin = require("./Admin/userregistered");

const adminCreation = async () => {
  const name = "admin1";
  const email = "admin@gmail.com";
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10);
  const exist = await Admin.findOne({ email });
  if (exist) {
    console.log("admin already created");
  } else {
    const admin = await new Admin({ name, email, password: hashedPassword });
    await admin.save();
    console.log("Admin created successfully");
  }
};
adminCreation();

server.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
