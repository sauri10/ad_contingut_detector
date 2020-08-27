const express = require('express');
const router = express.Router();
const axios = require('axios');
const Proceso = require('../models/proceso')

router.get('/', async (req, res, next) => {
    let query = Proceso.find()
    console.log("Nombre del proceso: "+req.query.nombre)
    if (req.query.nombre != null && req.query.nombre != '') {
        query = query.regex('nombre', new RegExp(req.query.nombre, 'i'))
    } else
        console.log("No se ha podido encontrar ningun Proceso")

    try {
        const proceso = await query.exec()
        res.render('procesos/index', {
            proceso: proceso,
            searchOptions: req.query
        })
    } catch{
        res,redirect('/')
    }

})

router.get('/alta', async (req, res) => {
    renderNewPage(res, new Proceso())
})

router.post('/', async (req, res) => {
    console.log("El valor del proceso es: "+JSON.stringify(req.body))
    console.log("")
    const proceso = new Proceso({
        nombre: req.body.nombre
    })
    try{
        const newProceso = await proceso.save()
        console.log("El proceso se ha dado de alta correctamente y tiene el ID: "+ newProceso.id)
        res.send(newProceso)
        //res.redirect(`profesores/${newProfesor.id}`)
        res.redirect(`procesos`)
    }catch(err) {
        console.log(err)
        renderNewPage(res, curso, true)
        res.render('cursos/alta', {
            proceso: proceso,
            errorMessage: 'Error en el alta del proceso'
        })
    }
})

async function renderNewPage(res, proceso, hasError = false) {
    try {
        const params = {
            proceso: proceso
        }
        if (hasError) params.errorMessage = 'Error al crear el curso'
        res.render('procesos/alta', params)
    } catch {
        res.redirect('/procesos')
    }
}


module.exports = router
