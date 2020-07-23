const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Profesor = require('../models/profesor')
const Curso = require('../models/curso')
const Asignatura = require('../models/asignatura')
const Profesor_curso = require('../models/profesor_curso')

/* Ruta de listar todos los cursos */
router.get('/', async (req, res) => {
    res.send("Todos los profesores, cursos y asignaturas");

})

/* Ruta formulario de alta del curso.- Sirve para desplegar el formulario
 * de alta del profesor
 */
router.get('/alta', async (req, res) => {
    renderNewPage(res, new Profesor(), new Curso())
})

/* Ruta de creaci�n de un curso
 */
router.post('/', async (req, res) => {
    // Se supone que el formato de codigoCurso, siempre sera el correcto
    
    const datosFormat = formatCodigoAsignatura(req.body.codigoCurso) // Los datos de la asignatura se obtienen a partir del código del curso

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        let asignatura = await Asignatura.findOne({ codigoAsignatura: datosFormat.codigoAsignatura })
        
        let curso = await Curso.findOne({ codigoCurso: req.body.codigoCurso })
        let profesor = await Profesor.findOne({ dni: req.body.dni })
    

        asignatura = await setDocumento(asignatura, datosFormat).save()
        console.log(asignatura)
        const paramsCurso = {
            codigoCurso: req.body.codigoCurso,
            grupo: datosFormat.grupo,
            asignatura: asignatura.id
        }
        curso = await setDocumento(curso, paramsCurso).save()
        profesor = await setDocumento(profesor, req.body).save()

        
    } catch (err){
        console.log(err)
    }
    /*
    try {

        asignatura = setCollection(asignatura, datosFormat)
        curso = setCollection(curso, asignatura)

        

        if (asignatura != null && asignatura != '') { // Si existe asignatura
            
            curso.asignatura = asignatura.id // asignamos el ID de la asignatura al curso

        } else { // si no existe la asignatura
            const asignatura = new Asignatura({
                anoAcademico: datosFormat.anoAcademico,
                codigoAsignatura: datosFormat.codigoAsignatura
            })
            const newAsignatura = await asignatura.save()
            curso.asignatura = newAsignatura.id

        }
        const newCurso = await curso.save()
        const newProfesor = await profesor.save()
        const profesor_curso = new Profesor_curso({
            profesor: newProfesor.id,
            curso: newCurso.id
        })
        const newProfesor_curso = await profesor_curso.save()
        //res.redirect(`profesores/${newCurso.id}`)
        res.redirect(`profesores_cursos`)

        await session.commitTransaction();
    } catch (err) {
        console.log(err)
        renderNewPage(res, profesor, curso, true)
        res.render('profesores_cursos/alta', {
            curso: curso,
            errorMessage: 'Error en el alta del profesor'
        })
        await session.abortTransaction();
    } finally {
        // ending the session
        session.endSession();
    }*/
})

async function renderNewPage(res, profesor, curso, hasError = false) {
    try {
        const params = {
            profesor: profesor,
            curso: curso
        }
        if (hasError) params.errorMessage = 'Error al crear el curso'
        res.render('profesores_cursos/alta', params)
    } catch {
        res.redirect('/profesores_cursos')
    }
}

/* El código del curso (codigoCurso) tiene el formato 'A2019202307101'
 * del cual los primeros 7 digitos, corresponden al año académico 'A201920'
 * Los siguientes 5 dígitos, corresponden al código de la asignatura '23071'
 * y los últimos 2 dígitos, al grupo '01'.
 * Este método permite obtener el código de la asignatura
*/
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

function setDocumento(collection, params) {
    const model = collection.constructor.modelName
    console.log(model)
    switch (model) {
        case 'Asignatura':
            if (collection != null && collection != '') {
                return collection
            } else {
                const asignatura = new Asignatura({
                    anoAcademico: params.anoAcademico,
                    codigoAsignatura: params.codigoAsignatura
                })
                return asignatura
            }
            break
        case 'Curso':
            if (collection != null && collection != '') {
                return collection
            } else {
                const curso = new Curso({
                    codigoCurso: params.codigoCurso,
                    grupo: params.grupo,
                    asignatura: params.asignatura
                })
                return curso
            }
            break
        case 'Profesor':
            if (collection != null && collection != '') {
                return collection
            } else {
                const profesor = new Profesor({
                    dni: params.dni
                })
                return profesor
            }
    }

}



module.exports = router