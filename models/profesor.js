const mongoose = require('mongoose')
var validate = require('mongoose-validator')

var validarDni = [
    validate({
        validator: 'isLength',
        arguments: [8, 9],
        message: 'El DNI debe tener entre {ARGS[0]} y {ARGS[1]} caracteres'
    }),
    validate({
        validator: 'isAlphanumeric',
        //passIfEmpty: true, // Sirve para poder pasar la validación en caso de se la cadena sea vacia
        message: 'El DNI debe contener solamente caracteres alfanuméricos'
    }),
]

var validarEmail = [
    validate({
        validator: 'isEmail',
        message: 'insertar una dirección de correo electrónico válida'
    })
]


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
        type: Number,
        required: true,
        validate: validarDni
    },
    email: {
        type: String,
        required: false,
        validate: validarEmail
    }
})

module.exports = mongoose.model('Profesor', profesorSchema)