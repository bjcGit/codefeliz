const { Router } = require("express");
const { check } = require("express-validator");
const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch
} = require("../controllers/controlUser");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarToken } = require("../middlewares/validarToken");
const { validarAdminRole } = require("../middlewares/validar-rol");
const { usuarioPorId } = require('../helpers/dbValidacion');


const router = Router();

router.get("/", usersGet);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('identificacion', 'La identificación es obligatoria').not().isEmpty(),
  check('fecha_naci', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
  check('correo', 'El correo es obligatorio').isEmail(),
  check('celular', 'El celular es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria y debe tener al menos 4 caracteres').isLength({ min: 4 }),
  validarCampos
], usersPost);

router.delete("/:id",[
  validarToken,
  validarAdminRole, 
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(usuarioPorId),
  validarCampos
], usersDelete);

router.patch("/", usersPatch);

module.exports = router;
