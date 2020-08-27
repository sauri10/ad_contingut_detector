
function ejecutarFormateo (){
    /*var arrEmail = [" Esborrat  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213 ",
        " Afegit  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213"]*/

    var arrEmail = {mensaje:"Esborrat  el professor/a 43034972 al grup d'assignatura 20602-13 del 2019-20, que té vinculat el curs de teleeducació A2019202060213 "}
    //const incidencias = crearIncidencias(arrEmail)
    obtenerIncidencia(arrEmail)
        .then(result => {
            console.log("El resultado es: "+ result)
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
                        console.log("formatearIncidencias: "+ results)
                        resolve(results)
            })
            .catch((e) => {
                console.log("formatearIncidencias ERROR")
                reject(e)
            });
        //Si(email_es)
    })
}

function obtenerIncidencia(incidencia){
    return new Promise((resolve, reject) => {
        //console.log("El mensaje es: " + incidencia.mensaje)
        emailEsCorrecto(incidencia)
            .then(result =>{
                if(result != null) {
                    console.log("Entro en buscar operacion: " + result)
                    buscarOperacion(result.mensaje)
                        .then((operacion) => {
                            resolve(operacion)
                            console.log("La operacion es:" + operacion)
                        })
                }else{
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
function emailEsCorrecto(email) {//
    return new Promise((resolve, reject) => {
        let esCorrecto = false
        let vProcesos = process.env.EMAILS_ACEPTADOS //Datos sobre los procesos admitidos
        //console.log(arrEmails)
        let arrProcesosJSON = JSON.parse(arrEmails) //Convertimos los datos en objetos
        console.log("El tema es: "+ email.subject)
        console.log("El emisor es: "+ email.from)
        comprobarJSON(arrProcesosJSON.from, email.from)

    })
}

function comprobarJSON(objProceso, objEmail) {
    //iteramos sobre el objeto json
    return new Promise((resolve, reject) => {
        let it = 0;
        let esCorrecto = false
        while (it < objProceso.length && !esCorrecto) {
            if (typeof objProceso != "object") {
                console.log("NO soy un objeto")
                let regex = new RegExp(objProceso[it], "i") // Establecemos que la busqueda sea independiente de mayúsculas o minúsculas
                console.log("El Emisor JSON es: " + objProceso[it])
                let compararObj = objEmail.match(regex)
                console.log("emisor: " + compararObj)
                if (compararObj != null) {
                    resolve()
                }else {
                    console.log("No cumplo con las espectativas")
                    it++
                }
            } else {
                console.log("Soy un objeto")
                it++
            }
            console.log("Me ejecuto: " + it + " veces")
            let regex1 = new RegExp(objProceso[it].from, "i") // Establecemos que la busqueda sea independiente de mayúsculas o minúsculas
            console.log("El Emisor JSON es: " + aux[it].from)
            let emisor = email.from.match(regex1)
            console.log("emisor: " + emisor)
            if (emisor != null) {
                console.log("El emisor es correcto:" + emisor)
                let regex2 = new RegExp(aux[it].subject, "i") // Establecemos que la busqueda sea independiente de mayúsculas o minúsculas
                let tema = email.subject.match(regex2)
                console.log("El Tema JSON es: " + aux[it].subject)
                console.log("tema:" + tema)
                if (tema != null) {
                    console.log("El tema es correcto:" + tema)
                    console.log("El email es correcto: " + emisor + " y " + tema)
                    esCorrecto = true
                    resolve(email)
                } else
                    it++
            } else
                it++
        }
        console.log("esCorrecto vale: " + esCorrecto)
        if (esCorrecto == false) {
            //console.log("El item -- "+ mensaje+ " -- no tiene ninguna operacion permitida")
            resolve(null)
            //return("El item -- " + mensaje + " -- no tiene ninguna operacion permitida")
        }
    })
}


function buscarOperacion (mensaje){
    return new Promise((resolve, reject) => {
        let encuentraOperacion = false
        //const aux = ["afegit", "esborrat"]
        //console.log("String: "+aux)
        const operaciones = dividirCadena(process.env.OP_PROF_CURSO,',')
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

function dividirCadena(cadena,separador){
    return cadena.split(separador)
}


exports.ejecutarFormateo = ejecutarFormateo
exports.crearIncidencias = crearIncidencias