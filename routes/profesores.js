const express = require('express');
const router = express.Router();
const Profesor = require('../models/profesor')

/* Ruta de listar todos los profesores */
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.dni != null && req.query.dni !== '') {
        searchOptions.dni = new RegExp(req.query.dni, 'i') //buscamos por DNI
        // Buscar por nombre != null
        //searchOptions.nombre= new RegExp('^(?!\\s*$).+')
    }

    try{
        const profesores = await Profesor.find(searchOptions) //Para encontrar todos los Profesores

        console.log(profesores)
        res.render('profesores/index', {
            profesores: profesores,
            searchOptions: req.query
        })

    } catch (err) {
        console.log(err)//
        res.redirect('/')
    }
})

/* Ruta formulario de alta del profesor.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', (req, res) => {
    res.render('profesores/alta', {
        profesor: new Profesor()
    })
})

/* Ruta de creaci�n del profesor
 */
router.post('/', async (req, res) => {
    const profesor = new Profesor({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,//
        dni:  req.body.dni,
        email:  req.body.email
    })
    try{
        const newProfesor = await profesor.save()
        //res.redirect(`profesores/${newProfesor.id}`)
        res.redirect(`profesores`)
    }catch (err){
        console.log(err)
        res.render('profesores/alta', {
            profesor: profesor,
            errorMessage: 'Error en el alta del profesor'
        })

    }
})

module.exports = router