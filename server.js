if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()

}

const express = require('express')//
const app = express()
const expressLayouts = require('express-ejs-layouts')
/* 'body-parser' permite interactuar con las diferentes instrucciones REST como:
'POST', 'PUT', 'DELETE'
*/
const bodyParser= require('body-parser')

// Se establece la dirección del router que queremos utilizar
const indexRouter = require('./routes/index')
// Router para los profesores
const profesorRouter = require('./routes/profesores')
// Router para los cursos
const cursoRouter = require('./routes/cursos')
// Router para las asignaturas
const asignaturaRouter = require('./routes/asignaturas')

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
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
    mongoose.connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Conected to Mongoose'))

// Se utiliza el router cuando el usuario accede a la dirección establecida en la declaración (arriba)
app.use('/', indexRouter)

app.use('/profesores', profesorRouter)
app.use('/cursos', cursoRouter)
app.use('/asignaturas', asignaturaRouter)

// Se establce el puerto por el cual el servidor ejecutará la aplicación∫
app.listen(process.env.PORT || 3000)