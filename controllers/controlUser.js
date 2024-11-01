const { response, request } = require("express");
const Usuario = require("../models/modelUser"); 
const Role = require('../models/rolesModel');
const bcryptjs = require("bcryptjs");

const usersGet = async (req = request, res = response) => {
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(),
    Usuario.find()
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usersPut = async (req, res = response) => {
  const { nombre } = req.params;  
  const { password, ...resto } = req.body;  


  if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
  }

  try {
     
      const usuario = await Usuario.findOneAndUpdate({ nombre }, resto, { new: true });

      if (!usuario) {
          return res.status(404).json({
              msg: 'Usuario no encontrado'
          });
      }

      res.json({
          msg: 'password actualizada con éxito',
          usuario
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({
          msg: 'Error al actualizar la password, contacte al administrador'
      });
  }
};


const usersPost = async (req, res = response) => {
  const { nombre, password, identificacion } = req.body;

  try {

    const usuario = new Usuario({ nombre, password });
   
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

   
    await usuario.save();

    res.json({
      msg: "Usuario creado exitosamente",
      usuario,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno del servidor",
      error,
    });
  }
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
  res.json({
    msg: "Este usuario ha sido inhabilitado",
    usuario
  });
};

const usersPatch = (req, res = response) => {
  res.json({
    msg: "patch API - PatchUsers",
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch 
};
