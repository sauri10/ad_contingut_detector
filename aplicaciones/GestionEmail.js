const emails = require('./models/email')
const Email = emails.Email
const inspect = require('util').inspect;
const MailParser = require('mailparser').MailParser
const axios = require('axios');

async function nuevoEmail(imap) {
    return new Promise((resolve, reject) => {
        try {
            imap.openBox("Modificacio_asignatura", true, function (err, mailBox) {
                // función que nos avisa cuando llega un nuevo email
                imap.on("mail", mail => {
                    leerNuevosEmails(imap)
                        .then(arrEmail => {

                        })
                })
            })
            //})
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

function leerNuevosEmails(imap) {
    return new Promise((resolve, reject) => {
        //Abrimos el buzon del email
        imap.openBox("Modificacio_asignatura", true, function (err, mailBox) {
            if (err) {
                console.error(err);
                reject(err)
            }
            //Buscamos todos los emails nuevos
            imap.search(['UNSEEN', ['SUBJECT', 'Modificació professor/a grup d\'asignatura de teleeducació.']], async function (err, results) {
                if (!results || !results.length) {//
                    console.log("No unread mails");
                    imap.end();
                    reject(err)
                }
                //leerTodosLosEmails(imap, results).then(results => resolve(JSON.stringify(results)))

                let arrEmails = []
                // Ejecutamos la función "leerEmail" cada vez por cada elemento dentro del array de resultados "results"
                results.forEach(function (item, index) {
                    arrEmails.push(leerEmail(imap, item, index)) //Obtenemos un array de promesas que se cumplen con "Promise.all" mas adelante
                });
                Promise.all(arrEmails) // Se cumplen las promesas con la orden Promise.all
                    .then((results) => {
                        //resolve(JSON.stringify(results))
                        httpPostEmail(results)

                    })
                    .catch((e) => {
                        reject(e)
                    });
            })
        });

    });
}

function leerEmail(imap, item, index) {
    return new Promise((resolve, reject) => {

        var f = imap.fetch(item, {bodies: ""});
        f.on('message', function (msg, seqno) {
            //resolve(processMessage(msg, seqno).then(result => console.log("El resultado es: " + JSON.stringify(result))))
            resolve(processMessage(msg, seqno, imap))
            //console.log("Me he ejecutado " + it + " veces y mi valor es: " + JSON.stringify(actions))
        })
        f.once("error", function(err) {
            return reject(err);
        });
        f.once("end", function() {
            console.log("Done fetching all unseen messages.");
            imap.end();
        });
    })
}

function processMessage(msg, seqno, imap) {
    return new Promise((resolve, reject) => {
        const email = new Email()
        var parser = new MailParser();

        var promiseheaders = new Promise((resolve, reject) => {
            parser.on("headers", function (headers) { // Leemos la cabecera del mensaje
                const objeto = mapToObjeto(headers)
                email.subject = objeto.subject
                email.from = objeto.from.value[0].address
                email.to = objeto.to.value[0].address
                email.date = new Date(objeto.date)
                console.log("Me ejecuto Headers")
                resolve(true)
            });
        })

        var promiseData = new Promise((resolve, reject) => {
            parser.on('data', data => { //Leemos el mensaje
                if (data.type === 'text') {
                    //console.log("El cuerpo del email es: "+JSON.stringify(data))
                    console.log("Me ejecuto Cuerpo del email")
                    email.mensaje = data.text
                    resolve(true)
                }
            });
        })

        var promiseAttributes = new Promise((resolve, reject) => {
            msg.once('attributes', function(attrs) {
                email.uid = attrs.uid
                console.log('Me ejecuto Atributo y mi UID es: '+ email.uid);
                resolve(true)
            });
        })

        parser.on('end', function () {
            let arrPromesas = []
            arrPromesas.push(promiseheaders, promiseData, promiseAttributes)
            Promise.all(arrPromesas) // Se cumplen las promesas con la orden Promise.all
                .then((results) => {
                    //resolve(JSON.stringify(results))
                    resolve(email)

                })
                .catch((e) => {
                    reject(e)
                });//
        })

        parser.once('error', (err) =>{
            console.log("Ha surgido un error en el parser "+ err)
            reject(err)
        })

        msg.on("body", function (stream) {
            stream.on("data", function (chunk) {
                parser.write(chunk.toString("utf8"));
            })

        });

        msg.once("err", (err) => {
            console.log("No se puede leer el mensaje "+ err)
            reject(err)
        })
        msg.once("end", function () {
            parser.end();
        })
    })
}

let object = {}

//Convertir las cabeceras, las cuales son del tipo "MAP(clave, valor)" a objetos
function mapToObjeto(headers) {
    headers.forEach((value, key) => {
        var keys = key.split('.'),
            last = keys.pop();
        keys.reduce((r, a) => r[a] = r[a] || {}, object)[last] = value;
    });
    return object
}

function httpPostEmail(arrEmails) {

    axios.post('http://localhost:3000/emails', {
        arrEmails
    })
        .then(function (response) {
            console.log("SE ha devuelto el siguiente valor: "+ response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


exports.nuevoEmail = nuevoEmail
exports.leerNuevosEmails = leerNuevosEmails
