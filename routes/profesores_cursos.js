
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Profesor = require('../models/profesor')
const Curso = require('../models/curso')
const Asignatura = require('../models/asignatura')
const Profesor_curso = require('../models/profesor_curso')
const imap = require('imap')

// Ruta de listar todos los cursos
router.get('/', async (req, res) => {
    res.send("Todos los profesores, cursos y asignaturas");

})//

//  Ruta formulario de alta del curso.- Sirve para desplegar el formulario
// de alta del profesor

router.get('/alta', async (req, res) => {
    renderNewPage(res, new Profesor(), new Curso())
})

// Ruta de creaci�n de un curso

router.post('/', async (req, res) => {
    // Se supone que el formato de codigoCurso, siempre sera el correcto
    let asignatura = new Asignatura()
    let curso = new Curso()
    let profesor = new Profesor()
    let profesor_curso = new Profesor_curso()

    // Obtener el objeto email con los datos del email


    const datosFormat = formatCodigoAsignatura(req.body.codigoCurso) // Los datos de la asignatura se obtienen a partir del código del curso
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        // Si falla alguna de las
        let newAsignatura = await Asignatura.findOne({ codigoAsignatura: datosFormat.codigoAsignatura }, null, {session})
        let newCurso = await Curso.findOne({ codigoCurso: req.body.codigoCurso }, null, {session})
        let newProfesor = await Profesor.findOne({ dni: req.body.dni }, null, {session})

        if (!existeDocumento(newAsignatura)) {
            newAsignatura = await setDocumento(asignatura, datosFormat)
            await newAsignatura.save()
        }
        if (!existeDocumento(newProfesor)) {
            newProfesor = await setDocumento(profesor, req.body)
            await newProfesor.save()
        }
        if (!existeDocumento(newCurso)) {
            const paramsCurso = {
                codigoCurso: req.body.codigoCurso,
                grupo: datosFormat.grupo,
                asignatura: asignatura.id
            }
            newCurso = await setDocumento(curso, paramsCurso)
            await newCurso.save()
        }
        // Queremos encontrar el registro y hacerlo parte de la transacción, de esta manera si lo encontramos, interrumpimos la ejecución

        let newProfesor_curso = await Profesor_curso.findOne({
            profesor: newProfesor.id,
            curso: newCurso.id
        }, null, { session })


        if (!existeDocumento(newProfesor_curso)) {
            const paramsProfesor_curso = {
                profesor: newProfesor.id,
                curso: newCurso.id
            }
            newProfesor_curso = await setDocumento(profesor_curso, paramsProfesor_curso)
            await newProfesor_curso.save()
        } else {
            console.log("Se ha encontrado el documento Profesor_curso: " + newProfesor_curso)
            throw 'Se ha encontrado el profesor'//
        }


        await session.commitTransaction();
        //res.redirect(`profesores/${newCurso.id}`)
        res.redirect(`profesores_cursos`)

    } catch (err){
        console.log(err)
        await session.abortTransaction();
        renderNewPage(res, profesor, curso, true)

    } finally {
        // ending the session

        session.endSession();
    }

})

async function renderNewPage(res, profesor, curso, hasError = false) {
    try {
        const params = {
            profesor: profesor,
            curso: curso
        }
        if (hasError) params.errorMessage = 'Error al dar de alta profesores o cursos'
        res.render('profesores_cursos/alta', params)
    } catch {
        res.redirect('/profesores_cursos')
    }
}

function existeDocumento(collection) {
    if (collection != null && collection != '') {
        return true
    } else {
        return false
    }
}

 //    El código del curso (codigoCurso) tiene el formato 'A2019202307101'
 // * del cual los primeros 7 digitos, corresponden al año académico 'A201920'
 // * Los siguientes 5 dígitos, corresponden al código de la asignatura '23071'
 // * y los últimos 2 dígitos, al grupo '01'.
 // * Este método permite obtener el código de la asignatura

function formatCodigoAsignatura(codigoCurso) {
    let i_anyo=7, i_cod=12, i_grupo=14
    let datos =  codigoCurso.substring(0, i_anyo) + "," + codigoCurso.substring(i_anyo, i_cod) + "," + codigoCurso.substring(i_cod, i_grupo)
    datos = datos.split(',')
    return {
        anoAcademico: datos[0],
        codigoAsignatura: datos[1],
        grupo: datos[2]
    }
}

function setDocumento(nomCollection, params) {
    const model = nomCollection.constructor.modelName
    switch (model) {
        case 'Asignatura':
            const asignatura = new Asignatura({
                anoAcademico: params.anoAcademico,
                codigoAsignatura: params.codigoAsignatura
            })
            return asignatura
            break
        case 'Curso':
            const curso = new Curso({
                codigoCurso: params.codigoCurso,
                grupo: params.grupo,
                asignatura: params.asignatura
            })
            return curso
            break
        case 'Profesor':
            const profesor = new Profesor({
                dni: params.dni
            })
            return profesor
            break
        case 'Profesor_curso':
            const profesor_curso = new Profesor_curso({
                profesor: params.profesor,
                curso: params.curso
            })
            return profesor_curso
            break
    }

}



module.exports = router