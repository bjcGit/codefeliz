const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
    },
    identificacion: {
        type: String,
        unique: true,
        require: true
    },
    fecha_naci: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        unique: true,
        require: true
    },
    celular:{
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    codes: [
        {
            type: String,
            unique: true
        }
    ]
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, contraseña, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
