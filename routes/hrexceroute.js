const express = require ("express");
const auth = require("../middleware/auth");
const Controller = require("../controller/controller") 
const router = express.Router();


router.post("/login",Controller.HrexecutiveLogin)
router.delete("/logout", auth,Controller.HrexecutiveLogout)
router.get("/employees",Controller.HrexecutiveEmployees)
router.put("/employees/:id", auth,Controller.HrexecutiveVerify)


module.exports= router;