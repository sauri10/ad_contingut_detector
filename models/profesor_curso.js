const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const profesorSchema = new mongoose.Schema({

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
profesorSchema.index({ "profesor" : 1, "curso" : 1 }, { unique : true })

module.exports = mongoose.model('Profesor_curso', profesorSchema)