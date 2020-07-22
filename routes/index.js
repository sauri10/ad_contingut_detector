const express = require('express');
const router = express.Router();
const Curso = require('../models/curso')

/* GET home page. */
router.get('/', async (req, res) => {
    let cursos
    try {
        cursos = await Curso.find().sort({
            fechaCreacion: 'desc' //Ordenamos la fecha de creación en orden descendente ('desc')
        }).limit(10).exec()
    } catch {
        cursos = []
    }
    res.render('index', {
        cursos: cursos
    })
})

module.exports = router
