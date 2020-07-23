const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const profesorSchema = new mongoose.Schema({

    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profesor',
        unique: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Curso',
        unique: true
    }

})

module.exports = mongoose.model('Profesor_curso', profesorSchema)