const express = require('express');
const router = express.Router();
const Curso = require('../models/asignatura')

/* Ruta de listar todos los cursos */
router.get('/', async (req, res) => {

})

/* Ruta formulario de alta del curso.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', (req, res) => {

})

/* Ruta de creaci�n de un curso
 */
router.post('/', async (req, res) => {

})

module.exports = router