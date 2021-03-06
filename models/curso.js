const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const cursoSchema = new mongoose.Schema({
    _id : { // el id es el código del curso
        type: String,
        required: true
    },
    grupo: {
        type: Number, // MongoDB utiliza los mismos tipos que json (Number, String ...)
        required: false // true
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    }
    /*
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Asignatura'
    }*/
    /* Añadir luego el profesor
    profesor: {
    type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor'
},*/

})

module.exports = mongoose.model('Curso', cursoSchema)