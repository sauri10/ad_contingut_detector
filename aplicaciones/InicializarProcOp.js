const axios = require('axios');

function httpPostproceso(nombre) {
    return new Promise ((resolve, reject) => {
        axios.post('http://localhost:3000/procesos', {
            nombre
        })
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}


function httpPostOperacion(id, formatoFields) {
    var params = {
        //id: id,
        id: "5f3aa3e1398df508e79d5495",
        formatoFields: formatoFields
    }
    return new Promise ((resolve, reject) => {
        axios.post('http://localhost:3000/operaciones', {
            params
        })
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}

function httpGetOperacion(){
    axios.get('http://localhost:3000/operaciones', {
        params: {
            nombre: 'Baja de profesores en cursos'
        }
    })
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function inicializarProceso() {

    //Inicializar el proceso con sus 2 operaciones
    const proceso = "Modificació professor/a grup d'asignatura de teleeducació."
    const baja = process.env.BAJA_PROF_CURSO
    const alta = process.env.ALTA_PROF_CURSO
    httpPostproceso(proceso)
        .then(response=>{
            const procID = response._id
            console.log("El id en la inicializacion del proceso es: "+ procID)
            httpPostOperacion(response._id, baja)
                .then(response=>{
                    httpPostOperacion(procID, alta)
                        .then(response=>{//
                            console.log(response)
                        })
                })
        })
}

function inicializarOperacion(opJSON) {

    httpPostOperacion(opJSON)
        .then(response=>{
            console.log("SE ha devuelto el siguiente valor: " + response)
        })
}

exports.httpGetOperacion = httpGetOperacion
exports.inicializarProceso = inicializarProceso
exports.inicializarOperacion = inicializarOperacion

