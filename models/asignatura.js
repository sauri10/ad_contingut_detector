const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const cursoSchema = new mongoose.Schema({
    codigoAsignatura: {
        type: String,
        required: true,
        unique: true
    },
    nombreAsignatura: { // Nombre de la asignatura. Ej: Matemáticas II
        type: String,
        required: false
    },
    semestre: { //información que deberá proveer el usuario. {1er, 2do}
        type: String,
        required: false
    },
    anoAcademico: {
        type: String, // Hacer una funcion para devolver el año académico
        required: true
    }
})

module.exports = mongoose.model('Asignatura', cursoSchema)