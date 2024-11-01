const Code = require("../models/modelCode");
const Usuario = require("../models/modelUser");

const generateCodes = async (req, res) => {
  const totalCodes = 1000;
  const winnerCount = 100;

  try {
    const codes = [];
    for (let i = 0; i < totalCodes; i++) {
      let code = i.toString().padStart(4, "0");
      codes.push({
        code,
        isWinner: false,
      });
    }

    for (let i = 0; i < winnerCount; i++) {
      const randomIndex = Math.floor(Math.random() * codes.length);
      codes[randomIndex].isWinner = true;
    }

    await Code.insertMany(codes);

    res.status(201).json({
      msg: "Códigos generados exitosamente",
      codes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al generar los códigos",
    });
  }
};

const claimCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  try {
    const existingCode = await Code.findOne({ code });
    if (!existingCode) {
      return res.status(404).json({
        msg: "El código ingresado no es válido",
        success: false
      });
    }

    if (existingCode.claimedBy) {
      return res.status(400).json({
        msg: "El código ya fue registrado",
        success: false
      });
    }

    const currentUser = await Usuario.findById(userId);
    if (!currentUser.codes) {
      currentUser.codes = []; 
    }

    if (currentUser.codes.includes(existingCode._id)) {
      return res.status(400).json({
        msg: "Ya has registrado este código anteriormente",
        success: false
      });
    }

    existingCode.claimedBy = userId;
    existingCode.claimedAt = new Date();
    await existingCode.save();

    currentUser.codes.push(existingCode._id);
    await currentUser.save();

    res.json({
      msg: existingCode.isWinner ? "¡Felicidades, has ganado!" : "Código registrado correctamente, pero no es ganador",
      code: existingCode.code,
      isWinner: existingCode.isWinner,
      success: true
    });
  } catch (error) {
    console.error("Error en claimCode:", error);
    res.status(500).json({
      msg: "Error al reclamar el código",
      success: false
    });
  }
};



const getCodes = async (req = request, res = response) => {
  const [total, codes] = await Promise.all([
    Code.countDocuments(),
    Code.find(),
  ]);

  res.json({
    total,
    codes,
  });
};

const getUserCodes = async (req, res) => {
  const userId = req.user._id;

  try {
    
    const user = await Usuario.findById(userId).populate(
      "codes",
      "code isWinner"
    );

   
    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

   
    const codes = user.codes
      ? user.codes.map((code) => ({
          code: code.code,
          isWinner: code.isWinner,
        }))
      : [];

    res.json({ codes });
  } catch (error) {
    console.error("Error en getUserCodes:", error);
    res.status(500).json({
      msg: "Error al obtener los códigos registrados",
    });
  }
};

module.exports = {
  generateCodes,
  claimCode,
  getCodes,
  getUserCodes,
};
