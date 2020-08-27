/*
* Este documento JSON almacena el nombre de las operaciones permitidas por la aplicación. Tambien almacena un documento json que
*
*/
const mongoose = require('mongoose')
var validate = require('mongoose-validator')


const formatoSchema = new mongoose.Schema({
    palabraClaveEmail: { type: String, required: false },
    regexDni: { type: String, required: false },
    regexCodCurso: { type: String, required: false }
});


// Schema es como una tabla en la DB
const operacionSchema = new mongoose.Schema({
    /*proceso: {
        type: String,
        required: true,
    },*/
    proceso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proceso'
    },
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    formatoFields: formatoSchema //"palabraClaveEmail":"esborrat","regexDni":"/\\s\\d{8}\\s/g ","regexCodCurso":"/[A]\\d{13}/g"}

})


module.exports = mongoose.model('Operacion', operacionSchema)