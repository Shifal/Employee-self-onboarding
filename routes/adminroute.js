const express = require ("express");
const Controller = require("../controller/controller")
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/login",Controller.AdminLogin)
router.delete("/logout", auth,Controller.AdminLogout)
router.post("/field-agents/register", auth,Controller.FieldAgentRegister )
router.post("/hr-executives/register", auth,Controller.HrexecutivesRegister)
router.get("/users",Controller.AdminUsers)
router.get("/view",Controller.AdminView)

module.exports= router;