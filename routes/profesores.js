const express = require('express');
const router = express.Router();
const Profesor = require('../models/profesor')

/* Ruta de listar todos los profesores */
router.get('/', (req, res) => {
    res.render('profesores/index')
})

/* Ruta formulario de alta del profesor.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', (req, res) => {
    res.render('profesores/alta', {
        profesor: new Profesor()
    })
})

/* Ruta de creación del profesor
 */
router.post('/', (req, res) => {
    res.send('Creación del profesor')
})

module.exports = router