const jwt = require("jsonwebtoken");
const config = process.env;
const Token = require("../FieldAgentmodel/token");
const User = require("../Admin/userregistered");

const verifyToken = async (req, role, res, next) => {
  const Authorization = req.header("Authorization");
  if (!Authorization) {
    return res.status(401).json("Invalid Authorization");
  }
  const token = Authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(400).send("Invalid or expired token");
  }

  const tokenDoc = await Token.findOne({ token });
  if (!tokenDoc) {
    return res.status(401).send("Token not found in database");
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    // const user = req.user;
    // console.log(user)
    const data = await User.findOne({ _id: req.user.user_id });
    // console.log(data)
    if (data.role === role) {
      console.log(data.role == role)
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err.message);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("Invalid token");
    } else {
      return res.status(500).send("Internal Server Error");
    }
  }
};

module.exports = verifyToken;