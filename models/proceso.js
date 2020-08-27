/*
* Este documento JSON almacena el nombre de los procesos permitidos por la aplicación
*
*/
const mongoose = require('mongoose')
var validate = require('mongoose-validator')

// Schema es como una tabla en la DB
const procesoSchema = new mongoose.Schema({
    //autoIndex: false,
    nombre : {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    }
})

module.exports = mongoose.model('Proceso', procesoSchema)