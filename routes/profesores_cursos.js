const express = require('express');
const router = express.Router();
const Curso = require('../models/curso')
const Asignatura = require('../models/asignatura')

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
    res.send('Hola')
    //renderNewPage(res, new Curso())
})

/* Ruta de creaci�n de un curso
 */
router.post('/', async (req, res) => {
    // Se supone que el formato de codigoCurso, siempre sera el correcto
    const datosFormat = formatCodigoAsignatura(req.body.codigoCurso) // Los datos de la asignatura se obtienen a partir del código del curso
    const asignatura = await Asignatura.findOne({codigoAsignatura: datosFormat.codigoAsignatura})
    const curso = new Curso({
        codigoCurso: req.body.codigoCurso,
        grupo: datosFormat.grupo
    })

    try {
        if(asignatura != null && asignatura != ''){ // Si existe asignatura
            console.log("EXISTE LA ASIGNATURA POR LO TANTO NO LA CREO")
            curso.asignatura = asignatura.id // asignamos el ID de la asignatura al curso
            const newCurso = await curso.save()
        } else{
            const asignatura = new Asignatura({
                anoAcademico: datosFormat.anoAcademico,
                codigoAsignatura: datosFormat.codigoAsignatura
            })
            const newAsignatura = await asignatura.save()
            curso.asignatura = newAsignatura.id
            const newCurso = await curso.save()
        }
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



module.exports = router