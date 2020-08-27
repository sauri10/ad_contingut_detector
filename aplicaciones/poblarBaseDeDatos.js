// Node.js program to demonstrate the
// fs.readFileSync() method

/*function poblarDB() {
// Include fs module
    const fs = require('fs');

// Calling the readFileSync() method
// to read 'input.txt' file
    const data = fs.readFileSync('./aplicaciones/procesos.txt',
        {encoding: 'utf8', flag: 'r'});

// Display the file data
    console.log(data);
}*/


const Proceso = require('../models/proceso')
const Operacion = require('../models/operacion')
const fs = require('fs')

async function poblarDB() {

    try {
        /*const procesos = JSON.parse(await fs.readFileSync("./aplicaciones/BaseDeDatosJSON/procesos.json", 'utf-8'));

        const operaciones = JSON.parse(await fs.readFileSync("./aplicaciones/BaseDeDatosJSON/operaciones.json", 'utf-8'));*/

        //const proceso = await AltaDB(Proceso,"./aplicaciones/BaseDeDatosJSON/procesos.json")
        //console.log("El proceso es: " + JSON.stringify(proceso))

        const proceso = await Proceso.find()

        let operacion = new Operacion()

        operacion = AltaDB(Operacion, "./aplicaciones/BaseDeDatosJSON/operaciones.json", Proceso, "proceso", "nombre")

/*
        await Operacion.insertMany(operaciones);
        console.log('Done Procesos!');
        process.exit();*/

    } catch (e) {
        console.log(e);
        process.exit();
    }

    /*
    async function loadMeetings() {
        try {
            await Proceso.insertMany(meetings);
            console.log('Done!');
            process.exit();
        } catch (e) {
            console.log(e);
            process.exit();
        }
    };*/
}

async function AltaDB(col1, ruta, col2, col1Clave, col2Clave){
    return new Promise(async (resolve, reject) => {
        let fichero=""
        let updateColection=""
        try {
            //Leemos el fichero en el cual esta la coleccion a almacenarse en la DB
            fichero = JSON.parse(await fs.readFileSync(ruta, 'utf-8'));
            //Si el fichero tiene una clave que depende de una otra collección, entramos en la condición
            if(col2!=null && col2!="" && col1Clave!=null && col1Clave!="" && col2Clave!=null && col2Clave!=""){
                fichero = await setColeccionId(fichero, col2, col1Clave, col2Clave)
            }
            console.log("Los ficheros son: " + JSON.stringify(fichero))
            await col1.insertMany(fichero);
            console.log('Se han insertado los datos');
            resolve(fichero)
        } catch (err) {
            console.log("Ha ocurrido un error: "+err)
            reject(err)
        }
    })
}

async function setColeccionId(fichero, col2, col1Clave, col2Clave){

    return new Promise((resolve, reject) => {
        try {
            let i = 0
            var iterar = new Promise((resolve, reject) => {
                fichero.forEach(async (value, key) => {

                    //Buscamos el ID en la colección padre a partir de la clave especificada por el usuario
                    let objId = await col2.findOne({[col2Clave]: value[col1Clave]}).select('_id')
                    value[col1Clave] = objId.id
                    if (value[col1Clave] == null && value[col1Clave] == "") reject("No existe el documento indicado")
                    if(i === (fichero.length - 1)) resolve()
                    i++
                })
            })

            iterar.then(() => {
                resolve(fichero)
            });

        } catch (e) {
            console.log(e)
            reject(e)
        }
    })

}

exports.poblarDB = poblarDB