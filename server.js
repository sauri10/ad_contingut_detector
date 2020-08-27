if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()

}

const express = require('express')//
const app = express()
const expressLayouts = require('express-ejs-layouts')
/* 'body-parser' permite interactuar con las diferentes instrucciones REST como:
'POST', 'PUT', 'DELETE'
*/
const bodyParser = require('body-parser')
/* "Imap" permite gestionar una cuenta de email
*/
const Imap = require('imap')
const bluebird = require('bluebird');
const axios = require('axios');

const Db = require('./aplicaciones/poblarBaseDeDatos')

const Cp = require('./aplicaciones/InicializarProcOp')//

const Gm = require('./aplicaciones/GestionEmail')

const incidenciaProfesorCurso = require('./aplicaciones/parser/incidenciaProfesorCurso')

// Se establece la dirección del router que queremos utilizar
const indexRouter = require('./routes/index')
// Router para los profesores
const profesorRouter = require('./routes/profesores')
// Router para los cursos
const cursoRouter = require('./routes/cursos')
// Router para las asignaturas
const asignaturaRouter = require('./routes/asignaturas')

const profesor_cursoRouter = require('./routes/profesores_cursos')

const emailRouter = require('./routes/emails')

const procesoRouter = require('./routes/procesos')

const operacionRouter = require('./routes/operaciones')


app.set('view engine', 'ejs')

//Se establece la carpeta donde estaran almacenadas las vistas de la aplicación
app.set('views', __dirname + '/views')
//Se establece la carpeta en donde se almacenan los trozos de código
// que se repiten en la aplicación para no tener que repetir código
app.set('layout', 'layouts/layout')
// Se especifica a la aplicación que se utilizar la librería "expressLayouts"
app.use(expressLayouts)
// Se establece la carpeta en donde estará toda la información pública
// de la aplicación (css, imagenes, ..,)
app.use(express.static('public'))//
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

app.use(express.json());

const mongoose = require('mongoose')
    mongoose.connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Conected to Mongoose'))


/* 1. Establecer conexion al email con IMAP
*
*/


var imap = bluebird.promisifyAll(imap = new Imap({
    user: 'MMR544',
    password: 'RMakhoul02071978',
    host: 'imap.uib.es',
    port: 993,
    tls: true
}));

//Establecer conexion con el Email a través del IMAP
const coneccion = async (imap) => {
    try {
        imap.connect()
        imap.once('error', error => console.log(error))
        imap.once('ready', () => {
            console.log('Conectado al IMAP')
            //Leemos todos los emails nuevos
            Gm.leerNuevosEmails(imap)
                /*.then(arrEmail => {
                    console.log(arrEmail)
                })*/

        })
        imap.once('end', () => console.log('Connection ended'))
    } catch (err) {
        console.error(err)
    }
}

//incidenciaProfesorCurso.ejecutarFormateo()
//coneccion(imap)
//Cp.inicializarOperacion(process.env.BAJA_PROF_CURSO)//
//Cp.httpGetOperacion()//
//Cp.inicializarProceso()
Db.poblarDB()



app.use('/emails', emailRouter)

app.use('/procesos', procesoRouter)

app.use('/operaciones', operacionRouter)


// Se utiliza el router cuando el usuario accede a la dirección establecida en la declaración (arriba)
app.use('/', indexRouter)

app.use('/profesores', profesorRouter)
app.use('/cursos', cursoRouter)
app.use('/asignaturas', asignaturaRouter)
app.use('/profesores_cursos', profesor_cursoRouter)

// Se establce el puerto por el cual el servidor ejecutará la aplicación∫

app.listen(process.env.PORT || 3000)