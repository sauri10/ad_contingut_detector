const incidencia = require('../models/incidencia')

function ejecutarFormateo() {
    /*var arrEmail = [" Esborrat  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213 ",
        " Afegit  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213"]*/

    var arrEmail = {mensaje: "Esborrat  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213 "}
    //const incidencias = crearIncidencias(arrEmail)
    obtenerIncidencia(arrEmail)
        .then(result => {
            console.log("El resultado es: " + result)
        })
    //console.log("El resultado es: "+ incidencias)
    //console.log("El resultado es: "+ arrEmail.length)
}

async function crearIncidencias(arrEmails) {

    //return new Promise ((resolve, reject) =>{
    formatearIncidencias(arrEmails)
        .then((result) => {
            console.log("crearIncidencias: " + JSON.stringify(result))
        }).catch(e => {
        console.log(e)
    })
    //crearIncidencias

}


function formatearIncidencias(arrEmails) {
    return new Promise((resolve, reject) => {
        // Metodo que obtiene los datos necesarios para crear una nueva incidencia
        let incidencias = []
        arrEmails.forEach(function (item, index) {
            incidencias.push(obtenerIncidencia(item, index)) //Obtenemos un array de promesas que se cumplen con "Promise.all" mas adelante
        });
        Promise.all(incidencias) // Se cumplen las promesas con la orden Promise.all
            .then((results) => {
                console.log("formatearIncidencias: " + results)
                resolve(results)
            })
            .catch((e) => {
                console.log("formatearIncidencias ERROR")
                reject(e)
            });
        //Si(email_es)
    })
}

function obtenerIncidencia(incidencia) {
    return new Promise((resolve, reject) => {
        //console.log("El mensaje es: " + incidencia.mensaje)
        emailEsCorrecto(incidencia)
            .then(result => {
                if (result != null) {
                    buscarDatosEmail(result, incidencia.mensaje)
                    console.log("Entro en buscar operacion: " + JSON.stringify(result))
                    //altaIncidencia(result)
                } else {
                    resolve(null)
                }
            }).catch(e => {
            reject(e)
        })
        /*buscarOperacion(incidencia.mensaje)
            .then((operacion)=>{
                resolve(operacion)
                console.log("La operacion es:" + operacion)
            }).catch((e) => {
                reject(e)
            });*/


        //buscarDNI
        //buscarCodCurso
    })

}

function buscarDatosEmail(incidencia, mensaje) {
    console.log("El mensaje es: "+mensaje)
    let proceso1= process.env.EMAIL_SUBJECT
    console.log("El proceso es: "+proceso1)
    switch (incidencia.subject){
        case proceso1:
            let regexDni=new RegExp(/\s\d{8}\s/g)//Encontrar una cadena de texto con 8 numeros sin letras
            let DNI = mensaje.match(regexDni)
            if(DNI != null){
                console.log("El dni es: '"+parseInt(DNI)+"'")
            }
            //encontrarCodCurso
            let regexCodCurso = new RegExp(/[A]\d{13}/g)
            let codCurso = mensaje.match(regexCodCurso)
            if(codCurso != null){
                console.log("El Codigo del curso es: '"+codCurso+"'")
            }
    }
}

function emailEsCorrecto(email) {
    return new Promise((resolve, reject) => {
        let vProcesos = process.env.EMAILS_ACEPTADOS //Datos sobre los procesos admitidos
        //console.log(arrEmails)
        let arrProcesosJSON = JSON.parse(vProcesos) //Convertimos los datos en objetos
        console.log("El tema es: " + email.subject)
        console.log("El emisor es: " + email.from)
        //console.log("El array de procesos es: "+ JSON.stringify(arrProcesosJSON))
        console.log("El array de procesos es: " + arrProcesosJSON)
        //console.log("Los procesos tienen: '"+Object.keys(arrProcesosJSON.wd).length+"' elementos")
        //console.log("Los procesos tienen: '"+arrProcesosJSON[0].procesos.length+"' elementos")
        let resolverPromesas=[]
        let incidencia = {}


        comprobarJSON(arrProcesosJSON, email.from)
            .then(results => {
                incidencia.from = results
                console.log("Los resultados son:wwww "+ results)
                comprobarJSON(arrProcesosJSON, email.subject)
                    .then(results => {
                        incidencia.subject = results
                        console.log("Los resultados son:wwww "+ results)
                        comprobarJSON(arrProcesosJSON, email.mensaje)
                            .then(results => {
                                incidencia.mensaje = results
                                if (infoEsCompleta(incidencia)){
                                    resolve(incidencia)
                                    console.log("Los resultados son:wwww "+ JSON.stringify(incidencia))
                                }else{
                                    resolve(null)
                                    console.log("El email no esta en el formato correcto")
                                }

                            })
                    })
            })

    })
}

function infoEsCompleta(obj) {
    return new Promise((resolve, reject) => {
        let it=0
        let objetos=[]
        if (obj.length == 3) {

            console.log("el email tiene: '" + obj.length + "' objetos")
            objetos.forEach(([key, val]) => {
                if (val != null) {
                    objetos.push(val)
                    it++
                }
            })
            if (it==3)
                resolve(true)
            else
                resolve(false)
                //resolve("La información del email no es completa. Info actual: '"+objetos.toString()+"'")
        }
    })
}

let CONTADOR = 0
let ESCORRECTO = false
function comprobarJSON(arrProcesosJSON, objEmail, it) {
    //iteramos sobre el objeto json
    ESCORRECTO = false
    return new Promise((resolve, reject) => {
        let it = 0;

        console.log("El proceso es: "+Object.keys(arrProcesosJSON))
        console.log('*******************');
        console.log("Existen: '" + arrProcesosJSON.length + " 'procesos")//
        console.log('*******************');
        while (it < Object.keys(arrProcesosJSON).length && !ESCORRECTO) {

            //arrProcesosJSON.forEach(obj => {
            Object.entries(arrProcesosJSON[it]).some(([key, value]) => {
                if (typeof value != "object") {//
                    console.log("La clave es: '" + `${key}` + "' El valor es: '" + `${value}` + "'");
                    let regex = new RegExp(value, "i") // Establecemos que la busqueda sea independiente de mayúsculas o minúsculas
                    let compararObj = objEmail.match(regex)
                    console.log("comparar objeto vale: "+ compararObj)
                    if (compararObj != null) {
                        let numInfoAdicional = Object.keys(arrProcesosJSON[it]).length
                        let resultado = [compararObj]
                        console.log("La rama tiene: '"+numInfoAdicional+"' hojas")
                        if(CONTADOR>0 && numInfoAdicional>1){
                            let objetos = Object.entries(arrProcesosJSON[it])
                            objetos.forEach( ([key, val]) => {
                                const comp = val.match(regex)
                                if(comp==null) {
                                    resultado.push(val)
                                    console.log("El valor es: "+ val)
                                }
                            })
                        }
                        console.log("Se ha encontrado el valor esperado: " + compararObj)
                        console.log("El valor devuelto es: "+resultado.toString())
                        resolve(resultado.toString())
                        ESCORRECTO = true
                        return true
                    } else {
                        console.log("No se ha encontrado el valor esperado")
                    }
                }
                else {
                    console.log("Es un objeto y su clave es: '" + `${key}` + "' El valor es: '" + `${value}` + "'");
                    comprobarJSON(value, objEmail, CONTADOR++)
                        .then((resultado) =>{
                            if (resultado!=null){
                                console.log("El resultado de la iteraciones: "+resultado)
                                resolve(resultado)
                            }
                        })
                    CONTADOR--

                }
            });
            console.log('-------------------');
            //console.log("el email es: " + objEmail);
            it++
        }
        console.log("esCorrecto vale: " + ESCORRECTO)
        if (ESCORRECTO == false) {
            //console.log("El item -- "+ mensaje+ " -- no tiene ninguna operacion permitida")
            console.log("Devuelvo NULL")
            resolve(null)
            //return("El item -- " + mensaje + " -- no tiene ninguna operacion permitida")
        }
    })
}


function buscarOperacion(mensaje) {
    return new Promise((resolve, reject) => {
        let encuentraOperacion = false
        //const aux = ["afegit", "esborrat"]
        //console.log("String: "+aux)
        const operaciones = dividirCadena(process.env.OP_PROF_CURSO, ',')
        operaciones.forEach(function (item, index) {
            let regex = new RegExp(item, "i") // Establecemos que la busqueda sea independiente de mayúsculas o minúsculas
            let op = mensaje.match(regex)
            if (op != null) {
                //console.log("La operacion es: "+item)
                //console.log("El mensaje incluye: "+ op+"en el mensaje: "+ mensaje)
                encuentraOperacion = true // Establecemos que se ha encontrado la operación
                resolve(mensaje.match(regex))
                //return op
            }
        })
        // Si no encuentra la operación
        if (!encuentraOperacion) {
            //console.log("El item -- "+ mensaje+ " -- no tiene ninguna operacion permitida")
            reject("El item -- " + mensaje + " -- no tiene ninguna operacion permitida")
            //return("El item -- " + mensaje + " -- no tiene ninguna operacion permitida")
        }
    })
}

function dividirCadena(cadena, separador) {
    return cadena.split(separador)
}


exports.ejecutarFormateo = ejecutarFormateo
exports.crearIncidencias = crearIncidencias