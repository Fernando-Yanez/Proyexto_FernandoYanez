//let personaArray = [];
//let gastos = [];

//Funcion para derigirse a la pagina de gastos
function redirigir() {
    window.location.href = './html/gastos.html';
}




//Validacion de formatos para el ingreso de de los datos del usuario
function formatoRut(rut) {
    const validador = /^[0-9]{8,9}-[1-9kK]{1}$/
    return validador.test(rut);
}


//Funcion para invertir los datos ingresados
function invertirRut(rut) {
    let rutInvertido = '';

    for (i = rut.length - 1; i >= 0; i--) {
        rutInvertido += rut[i];
    }
    return rutInvertido;
}
//Funcion para validar que el rut sea correcto
function ValidadorRut(rut) {
    let salida = true; //Variable de salida del ciclo
    let digitoVerificador = rut[rut.length - 1]; //Obtencion del digito verificador del rut
    let rutSinVerificador = '';
    let rutInvertido = '';
    let multiplicador = 2;
    let suma = 0;
    let resto = 0;
    let digitoVerificadorCalculado = 0;

    //ciclo para separar la primera parte del string 
    for (i = 0; i < rut.length; i++) {
        if (rut[i] != '-') {
            rutSinVerificador += rut[i];
        } else { break; }
    }

    rutInvertido = invertirRut(rutSinVerificador);

    for (i = 0; i < rutInvertido.length; i++) {
        let numero = parseInt(rutInvertido[i]); // Obtencion de los caracteres del string rut y convirtiendolos en numero

        suma += numero * multiplicador;

        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }

    }

    resto = suma % 11;
    digitoVerificadorCalculado = 11 - resto; //Fin del calculo para obtener el digito verificador

    if (digitoVerificadorCalculado == 10) {
        digitoVerificadorCalculado = 'k';
    }
    if (digitoVerificadorCalculado == 11) {
        digitoVerificadorCalculado = 0;
    }

    return digitoVerificador == digitoVerificadorCalculado ? true : false;
}

function formatoNombre(nombre) {
    const validador = /^[a-zA-ZñÑ]+$/
    return validador.test(nombre);
}

function formatoEdad(edad) {
    const validador = /^[0-9][0-9]{0,2}$/;
    return validador.test(edad);
}

function formatoCorreo(correo) {
    const validador = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validador.test(correo);
}
function formatoPresupuesto(presupuesto) {
    const validador = /^\d+(\.\d+)?$/;
    return validador.test(presupuesto);
}





//funcion para agregar personas y gastos
function agregarPersona() {
    const formulario = Array.from(document.querySelectorAll('.formulario_registro_persona input, .formulario_registro_persona select, .formulario_registro_persona textarea')); //Acceder al formulario y obtener sus elementos
    const datos = formulario.map(element => element.value) // Creacion de array con los datos del formulario

    const errores = [];

    if (!formatoRut(datos[0].trim())) {
        errores.push('rut ingresado no cumple el formato');
    }

    console.log(datos[0]);


    if (!ValidadorRut(datos[0].trim())) {
        errores.push('rut ingresado no es valido');
    }
    if (!formatoNombre(datos[1].trim())) {
        errores.push('Nombre mal ingresado');
    }
    if (!formatoEdad(datos[2].trim())) {
        errores.push('edad ingresada no cumple el formato');
    }
    if (!formatoCorreo(datos[3].trim())) {
        errores.push('El correo ingresado no cumple el formato');
    }

    if (!formatoPresupuesto(datos[4].trim())) {
        errores.push('El presupuesto ingresado no cumple el formato');
    }

    if (errores.length > 0) {
        const mensajeErrorDiv = document.querySelector('.mensaje_Error');
        mensajeErrorDiv.innerHTML = '';
        errores.forEach((error, index) => {
            const parrafo = document.createElement('p');
            parrafo.textContent = `${index + 1}. ${error}`;
            mensajeErrorDiv.appendChild(parrafo);
        });

        return;
    }


    // Crear un objeto estructurado con los datos del formulario
    const nuevaPersona = {
        rut: datos[0],
        nombre: datos[1],
        edad: datos[2],
        correo: datos[3],
        presupuesto: datos[4]
    };

    return nuevaPersona;


}

let boton = document.querySelector('#botton_AgregarPersona');

boton.addEventListener('click', (event) => {
    const nuevaPersona = agregarPersona();
    if (nuevaPersona) {
        // Convertir a JSON y almacenar en localStorage usando el RUT como clave
        localStorage.setItem(nuevaPersona.rut, JSON.stringify(nuevaPersona));

        // Limpiar el formulario después de agregar
        document.querySelector('.formulario_registro_persona').reset();

        Swal.fire({
            title: "Registro existoso",
            //text: "You clicked the button!",
            icon: "success",
            confirmButtonText: 'Aceptar'
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                window.location.href = './html/gastos.html';
            }
        });
    }
})

//Obction de los boton de registro y inicio
let botonRegistro = document.querySelector('#boton_registro');
let botonRegistrado = document.querySelector('#boton_Usuario_Registrado');

//obtencion de las propiedades de los formularios
const registroUsuario = document.querySelector('.formulario_registro_persona');
const btRegistro = document.querySelector('.button_registro')
const btIncio = document.querySelector('.button_Inicio')

//Evento para mostrar el formulario de registro de persona
botonRegistro.addEventListener('click', (event) => {

    registroUsuario.style.display = 'block';
    btRegistro.style.display = 'none';
    btIncio.style.gridArea = 'btR';
})





