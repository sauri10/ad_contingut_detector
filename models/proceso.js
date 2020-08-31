/*
* Este documento JSON almacena el nombre de los procesos permitidos por la aplicación
*
*/
const mongoose = require('mongoose')
var validate = require('mongoose-validator')

const formatoSchema = new mongoose.Schema({
    carpeta: { type: String, required: false },
    regexDni: { type: String, required: false },
    regexCodCurso: { type: String, required: false }
});

// Schema es como una tabla en la DB
const procesoSchema = new mongoose.Schema({
    //autoIndex: false,
    nombre : { // El nombre coincide con el tema del email
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    formato: formatoSchema //"palabraClaveEmail":"esborrat","regexDni":"/\\s\\d{8}\\s/g ","regexCodCurso":"/[A]\\d{13}/g"}
})

module.exports = mongoose.model('Proceso', procesoSchema)