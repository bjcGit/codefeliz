const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        unique: true
    },
    identificacion: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, contraseña, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
