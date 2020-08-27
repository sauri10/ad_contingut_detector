const mongoose = require('mongoose')
var validate = require('mongoose-validator')

var validarDni = [
    validate({
        validator: 'isNumeric',
        message: 'El DNI debe contener solamente números',
    }),
    validate({
        validator: 'isLength',
        arguments: [8,9],
        message: 'El DNI debe tener entre {ARGS[0]} y {ARGS[1]} caracteres',
    })
]

/*var validarEmail = [
    validate({
        validator: 'isEmail',
        message: 'insertar una direcci�n de correo electr�nico v�lida'
    })
]*/


// Schema es como una tabla en la DB
const profesorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: false
    },
    apellidos: {
        type: String,
        required: false
    },
    dni: {
        type: String,
        required: true,
        validate: validarDni
    },
    email: {
        type: String,
        required: false
        //validate: validarEmail
    }
})

module.exports = mongoose.model('Profesor', profesorSchema)