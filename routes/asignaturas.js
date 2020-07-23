const express = require('express');
const router = express.Router();
const Asignatura = require('../models/asignatura')

/* Ruta de listar todas las asignaturas */
router.get('/', async (req, res) => {

})

/* Ruta formulario de alta de asignatura.- Sirve para desplegar el formulario
 * de alta de asignatura
 */
router.get('/alta', (req, res) => {

})

/* Ruta de creaci�n de una asignatura
 */
router.post('/', async (req, res) => {
    /*
     * 
     */
    const asignatura = new Asignatura({
        codigoAsignatura: req.body.codigoAsignatura

    })
})

module.exports = router