const Imap = require('imap')
const inspect = require('util').inspect
const fs = require('fs')
const emails = require('./models/email')
const Email = emails.Email
var buffer = ''
var docHtml = ''


function pruebaEmail(){

    const email = new Email('1','2','3','4','5','6','7')

    let aux = JSON.stringify(email, null, '\t')
    //let aux2 = JSON.parse(aux)
    console.log("El email es:"+ aux)
}

function conectar (){
    const imap = new Imap({
        user: 'MMR544',
        password: 'RMakhoul02071978',
        host: 'imap.uib.es',
        port: 993,
        tls: true
    })
    return imap
}

function openInbox(imap, cb) {
    imap.openBox('Modificacio_asignatura', true, cb);// El parametro 'false' abre la carpeta del email en moodo escritura, permitiendo actualizar los flags de los emails. El parametro 'true' en modo solo lectura
}

function nuevoMensaje(){
    const imap = conectar()
    imap.once('ready', function() {
        openInbox(imap ,function (err, box) {
            if (err) throw err;
            // función que nos avisa cuando llega un nuevo email
            imap.on("mail", mail => {
                if (err) throw err;
                const numMensajes = mail
                console.log("El email es: "+ mail)
                let totalMensajes = box.messages.total
                for(let i=0; i<numMensajes; i++){
                    console.log("El indice es: "+ i)
                    let posMensajesNuevos = totalMensajes - (numMensajes - i)
                    console.log("El mensaje nuevo esta en la posicion: "+ posMensajesNuevos)
                    const message = imap.seq.fetch(posMensajesNuevos, {bodies: '', markSeen: true})
                    leerMensajes(imap, message)
                }
            })
        })
    })
    finalizarConexion(imap)
}

function leerEmails() { //pasar parametros (flag, carpetaEmail, ....)
    const imap = conectar()
    imap.once('ready', function () {
        openInbox(imap ,function (err, box) {
            if (err) throw err;
            imap.search(['UNSEEN', ['SUBJECT', 'Modificació professor/a grup d\'asignatura de teleeducació.']], function (err, results) {
                if (err) throw err;
                console.log("El numero de emails encontrados son: " + results.length)
                const message = imap.fetch(results, {
                    bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
                    markSeen: true
                })
                leerMensajes(imap, message)
            });
        });
    });
    finalizarConexion(imap)
}

//Funcion que lle los mensajes
function leerMensajes(imap, message) {
    message.on('message', function (msg, seqno) {
        const email = new Email()
        console.log('Message #%d ' + seqno);
        console.log('Message type ' + msg.text)
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {

            stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8')
                if (info.which === 'TEXT') {
                    email.mensaje = parseEmailEscrito(buffer)
                    console.log("El mensaje escrito es = "+email.mensaje)
                }
            })
            stream.once('end', function () { //['HEADER.FIELDS (FROM)','TEXT']

                if (info.which !== 'TEXT') {
                    // crear una funcion para parsear los datos del email

                    let header = inspect(Imap.parseHeader(buffer)).replace(/'/g,'"').replace(/([a-z]+)(: ?[\[\n])/g, '"$1"$2'); // Parsear cabecera
                    var headerObj = JSON.parse(header);
                    //let mensaje

                    //console.log('Body [%s] found, %d total bytes', inspect(info.which), info.size)
                    //console.log("Aux es igual a: "+ buffer)
                    //console.log("Aux es igual a: "+ header)
                    console.log("Aux es igual a: "+ headerObj.subject)
                }
            });
            console.log(prefix + 'Body');
            stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function (attrs) {
            var atributes = inspect(attrs, false, 8) // No es necesario Parsear, puesto que ya vienen en formato JSON
            console.log("El atributo es: "+ attrs.date)

            //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function () {
            console.log(prefix + 'Finished');
        });
    });
    message.once('error', function (err) {
        console.log('Fetch error: ' + err);
    });
    message.once('end', function () {
        console.log('Done fetching all messages!');
        imap.end();
    });
}

function parseEmailEscrito(buffer){


    //let str = buffer.replace(/={1}/g, ' ');

    let regex = /\r?\n|\r/g
    let arr = buffer.split(/\r?\n|\r/g)
    const NUM_ARRAY = 4 // Número de elementos mínimo que debe tener el array cuando se trata de un email del tipo "Modificació professor/a grup d"asignatura de teleeducació"
    arr = arr.filter(function (e) {return e != ""})
    let texto=''
    if(arr.length>NUM_ARRAY) {
        for (i = NUM_ARRAY; i < arr.length; i++) {
            if (i > NUM_ARRAY) { // el mensaje comienza en la posición 4 del array
                texto = texto + arr[i].replace(/={1}/g, ' ')
            }
            /*if(i>1){
                arr.splice(i, 1)
            }*/
        }
    } else {
        console.log("ERROR: EL EMAIL NO ES DEL TIPO: Modificació professor/a grup d\"asignatura de teleeducació")
    }
    return texto

}

function finalizarConexion(imap){
    imap.once('error', function (err) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}



exports.leerEmail = leerEmails
exports.nuevoMensaje = nuevoMensaje

exports.pruebaEmail = pruebaEmail