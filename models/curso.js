const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const cursoSchema = new mongoose.Schema({
    codigoCurso : { 
        type: String,
        required: true,
        unique: true
    },
    grupo: {
        type: Number, // MongoDB utiliza los mismos tipos que json (Number, String ...)
        required: false // true
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    /*Recursos: { // Se actualiza con las incidencias
        type: Boolean,
        required: true
    },*/
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Asignatura'
    }
    /* Añadir luego el profesor
    profesor: {
    type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor'
},*/

})

module.exports = mongoose.model('Curso', cursoSchema)