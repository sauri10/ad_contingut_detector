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
/* "Imap" permite gestionar una cuenta de email
*/
/*
const Imap = require('imap')
const inspect = require('util').inspect
const fs = require('fs')
const DomParser = require('dom-parser')
*/
const imap = require('./aplicaciones/GestionEmail')
// Se establece la dirección del router que queremos utilizar
const indexRouter = require('./routes/index')
// Router para los profesores
const profesorRouter = require('./routes/profesores')
// Router para los cursos
const cursoRouter = require('./routes/cursos')
// Router para las asignaturas
const asignaturaRouter = require('./routes/asignaturas')

const profesor_cursoRouter = require('./routes/profesores_cursos')

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

imap.leerEmail()
/*
const imap = new Imap({
    user: 'MMR544',
    password: 'RMakhoul02071978',
    host: 'imap.uib.es',
    port: 993,
    tls: true
})

var buffer = ''
var docHtml = ''

function openInbox(cb) {
    imap.openBox('Modificacio_asignatura', true, cb);//
}

imap.once('ready', function () {
    openInbox(function (err, box) {
        if (err) throw err;
        imap.search(['UNSEEN', ['SUBJECT', 'Modificació professor/a grup d\'asignatura de teleeducació.']], function (err, results) {
            if (err) throw err;
            console.log("El numero de emails encontrados son: "+ results.length)
            var f = imap.fetch(results, { bodies: '1', markSeen: true });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d ' + seqno);
                console.log('Message type ' + msg.text)
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    stream.on('data', function (chunk) {
                        buffer += chunk.toString('utf8');
                        //docHtml = parser.parseFromString(buffer)
                        //console.log("BUFFER" + buffer.toString())

                    })
                    stream.once('end', function () {
                        if (info.which === '1') {
                            console.log("BUFFER" + buffer)
                        }


                    });
                    console.log(prefix + 'Body');
                    stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                });
                msg.once('attributes', function (attrs) {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', function () {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });
});

imap.once('error', function (err) {
    console.log(err);
});

imap.once('end', function () {
    console.log('Connection ended');
});

imap.connect();
*/
/*
imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        // función que nos avisa cuando llega un nuevo email
        imap.on("mail", mail => {
            console.log("New mail arrived 1");
        });
        // Funcion que lee emails
        var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
        f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                if (info.which === 'TEXT')
                    console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                var buffer = '', count = 0;
                stream.on('data', function(chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                    if (info.which === 'TEXT')
                        console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                });
                stream.once('end', function() {
                    if (info.which !== 'TEXT')
                        console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    else
                        console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                });
            });
            msg.once('attributes', function(attrs) {
                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
                console.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});


    imap.once('error', function(err) {
        console.log(err);
    });

    imap.once('end', function() {
        console.log('Connection ended');
    });

    imap.connect();
*/
//Función que se ejecuta cuando llega un nuevo email el correo electrónico
// imap.on("mail", mail => {
//     console.log("New mail arrived 1");
// });

/*imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        var f = imap.seq.fetch('1:3', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
        });
        f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                });
            });
            msg.once('attributes', function(attrs) {
                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
                console.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect(); */

// Se utiliza el router cuando el usuario accede a la dirección establecida en la declaración (arriba)
app.use('/', indexRouter)

app.use('/profesores', profesorRouter)
app.use('/cursos', cursoRouter)
app.use('/asignaturas', asignaturaRouter)
app.use('/profesores_cursos', profesor_cursoRouter)

// Se establce el puerto por el cual el servidor ejecutará la aplicación∫
app.listen(process.env.PORT || 3000)