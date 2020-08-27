const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const inc_secretariaSchema = new mongoose.Schema({

    incidencia: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Incidencia'
    },
    operacion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Operacion'
    },
    fResolucion: {
        type: Date
    },
    esValida: {
        type: Boolean
    },
    profesor: {
        type: String
    },
    cursoActual: {
        type: String
    },
    cursoPasado: {
        type: String
    }

    

})
inc_secretariaSchema({ "_id": 1, "incidencia": 1 }, { unique: true })

module.exports = mongoose.model('Profesor_curso', profesor_cursoSchema)