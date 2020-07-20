const express = require('express');
const router = express.Router();
const Curso = require('../models/curso')

/* Ruta de listar todos los cursos */
router.get('/', async (req, res) => {
    res.send('Todos los curso')
})

/* Ruta formulario de alta del curso.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', (req, res) => {
    res.render('cursos/alta', {
        curso: new Curso()
    })
})

/* Ruta de creaci�n de un curso
 */
router.post('/', async (req, res) => {
    const curso = new Curso({
        _id: req.body.id
    })
    try{
        const newCurso = await curso.save()
        //res.redirect(`profesores/${newProfesor.id}`)
        res.redirect(`cursos`)
    }catch {

        res.render('cursos/alta', {
            profesor: profesor,
            errorMessage: 'Error en el alta del profesor'
        })

    }
})

module.exports = router