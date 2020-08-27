
/*function promesas() {

    let miPrimeraPromise = new Promise((resolve, reject) => {

        setTimeout(function () {
            resolve("¡Soy la primera promesa!"); // ¡Todo salió bien!
        }, 250);
    });

    let miSegundaPromise = new Promise((resolve, reject) => {

        setTimeout(function () {
            resolve("¡Soy la segunda promesa!"); // ¡Todo salió bien!
        }, 250);
    });

    miSegundaPromise.then(results =>{
        console.log("Me estoy ejecutando, "+ results)
        miPrimeraPromise.then(results2 => {
            console.log("Me estoy ejecutando, "+ results2)
        })
    })
}

promesas()*/

new Promise(function(resolve, reject) {

    setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

    console.log("primera cadena: "+ result); // 1
    return result * 2;

}).then(function(result) { // (***)

    console.log("segunda cadena: "+ result) // 2
    return result * 2;

}).then(function(result) {

    console.log("Tercera cadena: "+ result) // 4
    return result * 2;

});