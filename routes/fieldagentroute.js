const express = require ("express");
const auth = require("../middleware/auth");
const Controller = require("../controller/controller")
const upload  = require("../middleware/upload")
const router = express.Router();


router.post("/login",Controller.FieldAgentLogin)
router.delete("/logout", auth,Controller.FieldAgentLogout)
router.post("/submit",auth,upload.single("recentPhotograph"),Controller.FieldAgentSubmit)
router.get("/photograph/:id", auth,Controller.photograph)
router.get("/applications",Controller.ExcelSheet)

module.exports= router;