const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const profesor_cursoSchema = new mongoose.Schema({

    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor'

    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Curso'
    }

})
profesor_cursoSchema.index({ "profesor" : 1, "curso" : 1 }, { unique : true })

module.exports = mongoose.model('Profesor_curso', profesor_cursoSchema)