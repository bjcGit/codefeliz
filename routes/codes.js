const { Router } = require("express");
const { generateCodes, claimCode, getCodes, getUserCodes } = require("../controllers/controlCode");
const { validarToken } = require("../middlewares/validarToken");

const router = Router();

router.post("/generate", generateCodes); 
router.post("/claim", validarToken, claimCode);
router.get("/", validarToken, getCodes);
router.get("/user-codes", validarToken, getUserCodes);

module.exports = router;
