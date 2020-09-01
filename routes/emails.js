const express = require('express');
const router = express.Router();
const inProfCurso = require('./entradasEmail')
const axios = require('axios');
const Curso = require('../models/curso')
const Asignatura = require('../models/asignatura')

router.get('/', (req, res, next) => {
    try {
    res.send("Hola papa! ")
} catch (err){
        res.send(err)
    }

})

router.post('/', async (req, res) => {
    //console.log("Se ejecuta: "+ req.body.arrEmails[1].mensaje)
    const emails = inProfCurso.crearIncidencias(req.body.arrEmails)
    //res.send(req.body.arrEmails[1].mensaje)
    //console.log("Estoy en email: "+ res.data)
    //res.send('ok');
})


module.exports = router
