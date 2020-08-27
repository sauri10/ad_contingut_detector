const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const incidenciaSchema = new mongoose.Schema({
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    valida: {
        type: Boolean, // MongoDB utiliza los mismos tipos que json (Number, String ...)
        required: false // true
    },

    /*Recursos: { // Se actualiza con las incidencias
        type: Boolean,
        required: true
    },*/
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Asignatura'
    },


})

module.exports = mongoose.model('Incidencia', incidenciaSchema)