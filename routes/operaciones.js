const express = require('express');
const router = express.Router();
const axios = require('axios');
const Operacion = require('../models/operacion')
const Procesos = require('../models/proceso')

router.get('/', async (req, res, next) => {

    let query = Operacion.find().populate({ path: 'Proceso', select: 'nombre' })
    console.log("Entro aqui")
    if (req.query.nombre != null && req.query.nombre != ''){
        query = query.regex('nombre', new RegExp(req.query.nombre, 'i'))
    }
    try {
        const operaciones = await query.exec()
        console.log("Entro aqui")
        console.log("La populacion es: "+JSON.stringify(operaciones))
        res.render('operaciones/index', {
            operaciones: operaciones,
            searchOptions: req.query
        })
    }catch {
        res.redirect('/')
    }

})

router.get('/alta', async (req, res) => {
    let operacion = new Operacion({
        formatoFields: {
            palabraClaveEmail: "",
            regexDni: "",
            regexCodCurso: ""
        }
    })
    renderNewPage(res, operacion)
})

/*router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description

    })

    try {
        const newBook = await book.save()
        //res.redirect('books/${newBook.id}')
        res.redirect(`books/${newBook.id}`)
    }catch {
        if(book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }

        renderNewPage(res, book, true)
    }
})*/

router.post('/', async (req, res) => {

    console.log("Entro aqui")
    //const formatoFields = JSON.parse(req.body.params.formatoFields)
    //console.log("La operación es: "+formatoFields.operacion)
    //console.log("El cuerpo es: "+JSON.stringify(req.body.params))
    //console.log("La operación es: "+req.body.params.formatoFields)
    //console.log("El ID es: "+ req.body.params.id)
    //console.log("El formato es:"+ JSON.stringify(formatojson[0]))

    /*const operacion = new Operacion({
        proceso: req.body.params.id,
        nombre: formatoFields.operacion,
        formatoFields: {
            palabraClaveEmail: formatoFields.palabraClaveEmail,
            regexDni: formatoFields.regexDni,
            regexCodCurso: formatoFields.regexCodCurso
        }
    })*/
    const operacion = new Operacion({
        proceso: req.body.proceso,
        nombre: req.body.nombre,
        formatoFields: {
            palabraClaveEmail: req.body.palabraClaveEmail,
            regexDni: req.body.regexDni,
            regexCodCurso: req.body.regexCodCurso
        }
    })

    console.log("La operación es: "+ JSON.stringify(operacion))

    try{

        const newOperacion = await operacion.save()
        console.log("Se ha almacenado el array: ")
        console.log("El proceso se ha dado de alta correctamente")
        res.send("El proceso se ha ejecutado correctamente")




        //res.redirect(`profesores/${newProfesor.id}`)
        //res.redirect(`profesores`)
    }catch {
        console.log("error en el proceso")
    }
})

async function renderNewPage(res, operacion, hasError = false){

    renderFormPage(res, operacion, 'alta', hasError)
}

async function renderFormPage(res, operacion, form, hasError = false){
    try {
        const procesos = await Procesos.find({})
        console.log("Los procesos son: ")//
        const params = {
            procesos: procesos,
            operacion: operacion
        }
        /*if(hasError){
            if (form === 'edit'){
                params.errorMessage = 'Error updating book'
            } else {
                params.errorMessage = 'Error creating book'
            }
        }*/
        params.errorMessage = 'Error creando las operaciones'
        res.render(`operaciones/${form}`, params)
    } catch(err) {
        console.log(err)
        res.redirect(`/operaciones`)//
    }
}


module.exports = router
