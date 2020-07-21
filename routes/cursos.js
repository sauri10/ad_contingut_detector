const express = require('express');
const router = express.Router();
const Curso = require('../models/curso')

/* Ruta de listar todos los cursos */
router.get('/', async (req, res) => {
    let query = Curso.find()
    console.log("publicaDespues: "+req.query.publicadoDespues)
    if (req.query.codigoCurso != null && req.query.codigoCurso != '') {
        query = query.regex('codigoCurso', new RegExp(req.query.codigoCurso, 'i'))
    }
    if (req.query.publicadoAntes != null && req.query.publicadoAntes != '') {
        query = query.lte('fechaCreacion', req.query.publicadoAntes)
    } else console.log("No puedo filtrar publicado antes")
    if (req.query.publicadoDespues != null && req.query.publicadoDespues != '') {
        query = query.gte('fechaCreacion', req.query.publicadoDespues)
    } else console.log("No puedo filtrar publicado Despues")
    try {
        const cursos = await query.exec()
        res.render('cursos/index', {
            cursos: cursos,
            searchOptions: req.query
        })
    } catch{
        res,redirect('/')
    }
    
})

/* Ruta formulario de alta del curso.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', async (req, res) => {
    renderNewPage(res, new Curso())
})

/* Ruta de creaci�n de un curso
 */
router.post('/', async (req, res) => {
    const curso = new Curso({
        codigoCurso: req.body.codigoCurso
    })
    /*
     * Si(existeAsignatura){
     *      
     * } si_no{
     *      Crear_asignatura
     * }
     *      
     */
    try{
        const newCurso = await curso.save()
        //res.redirect(`profesores/${newCurso.id}`)
        res.redirect(`cursos`)
    } catch (err) {
        console.log(err)
        renderNewPage(res, curso, true)
        res.render('cursos/alta', {
            curso: curso,
            errorMessage: 'Error en el alta del profesor'
        })

    }
})

async function renderNewPage(res, curso, hasError = false) {
    try {
        const params = {
            curso: curso
        }
        if (hasError) params.errorMessage = 'Error al crear el curso'
        res.render('cursos/alta', params)
    } catch {
        res.redirect('/cursos')
    }
}

module.exports = router