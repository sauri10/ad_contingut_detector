const mongoose = require('mongoose')
var validate = require('mongoose-validator')


// Schema es como una tabla en la DB
const incidenciaSchema = new mongoose.Schema({

    entradaEmail: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EntradaEmail'
    },
    operacion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Operacion'
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Curso'
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor'
    },
    profesor_curso: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor_curso'
    },
    fResolucion: {
        type: Date
    },
    incValida: {
        type: Boolean
    }

})

module.exports = mongoose.model('Incidencia', incidenciaSchema)