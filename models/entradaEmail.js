const mongoose = require('mongoose')
var validate = require('mongoose-validator')

const datosFormProfesorSchema = new mongoose.Schema({
    profesor: {type: String},
    cursoActual: {type: String},
    cursoPasado: {type: String}
})

const datosSecretariaSchema = new mongoose.Schema({
    profesor: {type: String},
    cursoActual: {type: String}
});

// Schema es como una tabla en la DB
const entradaEmailSchema = new mongoose.Schema({
    carpeta: {
        type: String,
        required: true
    },
    subject: { //El tema del email coincide con el nombre del proceso (ver el modelo de Proceso)
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    uid: {
        type: Number,
        required: true
    },
    datosFormProfesor: datosFormProfesorSchema,
    datosSecretaria: datosSecretariaSchema
})

module.exports = mongoose.model('EntradaEmail', entradaEmailSchema)