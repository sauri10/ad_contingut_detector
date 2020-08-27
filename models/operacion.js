/*
* Este documento JSON almacena el nombre de las operaciones permitidas por la aplicación. Tambien almacena un documento json que
*
*/
const mongoose = require('mongoose')
var validate = require('mongoose-validator')


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
    palabraClave: {
        type: String,
        required: false,
    },
    descripcion: {
        type: String,
        required: true,
    }

})


module.exports = mongoose.model('Operacion', operacionSchema)