const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { jsonJWT } = require('../helpers/token');
const Usuario = require('../models/modelUser');

const login = async (req, res = response) => {
  const { identificacion, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ identificacion });
    if (!usuario) {
      return res.status(400).json({
        msg: 'El usuario no existe'
      });
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'El usuario está inhabilitado'
      });
    }

    const validaContraseña = bcryptjs.compareSync(password, usuario.password);
    if (!validaContraseña) {
      return res.status(400).json({
        msg: 'La contraseña no es correcta'
      });
    }

    const token = await jsonJWT(usuario.id);

    res.json({
      token,
      usuario
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Contacta al administrador'
    });
  }
};

module.exports = {
  login
};
