// Variables y array
let arrayGastos = [];
let comida = 0;
let transporte = 0;
let entretenimiento = 0;
let vivienda = 0;

// Query Selector
let botonAgregar = document.querySelector('#agregarGastos');
const botonbuscar = document.querySelector('#boton_BuscarPersona');
const tablaGastos = document.querySelector('#tablaGastos');
const formulario = document.querySelector('.formulario_registro_gastos');
const sMostrarGastos = document.querySelector('#moneda');



// Clase del array
class ArrayGastos {
    constructor({ date, category, description, monto }) {
        
        this.fecha = date;
        this.categoria = category;
        this.descripcion = description;
        this.monto = monto;
    }
}

// Ingreso de gastos
let rut = '';

// Clase para validar que no se ingrese datos vacíos
class ValidadorGastos {
    constructor(data) {
        this.data = data;
    }

    validarFecha() {
        const fecha = new Date(this.data.date);
        return !isNaN(fecha.getTime());
    }

    validarCategoria() {
        const categoriasValidas = ["Comida", "Transporte", "Vivienda", "Entretenimiento"];
        return categoriasValidas.includes(this.data.category);
    }

    validarDescripcion() {
        return this.data.description.trim() !== "";
    }

    validarMonto() {
        const monto = parseFloat(this.data.monto);
        return !isNaN(monto) && monto > 0;
    }

    validarTodos() {
        return this.validarFecha() && this.validarCategoria() && this.validarDescripcion() && this.validarMonto();
    }
}

// Evento para agregar gastos
botonAgregar.addEventListener('click', () => {
    const formDatos = new FormData(formulario);
    const datos = {};
    formDatos.forEach((value, key) => {
        datos[key] = value;
    });

    const validar = new ValidadorGastos(datos);

    if (validar.validarTodos()) {

        let contador = 1;
        let salida = true;


        

        while (salida) {
            let clave = `${contador}_${rut}`;
            let data = JSON.parse(localStorage.getItem(clave));


            if (data == null) {
                localStorage.setItem(clave,JSON.stringify(datos));
                salida = false;
                mostrarToast("success", "Gasto Ingresado");
            }
            contador++;
        }
    } else {
        Swal.fire({
            title: "Por favor, completa todos los campos correctamente",
            icon: "error"
        });
        return;
    }

    mostrarGastos();
    crearChart();
    formulario.reset();
});

// Función para mostrar un toast
function mostrarToast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({ icon, title });
}

// Buscar usuario previamente creado
function buscarUsuarios(rut) {
    const dataPersona = localStorage.getItem(rut);
    return dataPersona ? JSON.parse(dataPersona) : null;
}

// Evento para buscar al usuario ingresado
botonbuscar.addEventListener('click', (event) => {
    event.preventDefault();
    rut = document.querySelector('#rut').value;
    let data = buscarUsuarios(rut);
    const divInfo = document.querySelector('.div_informacionUsuario');

    if (data) {
        mostrarDivs(true);
        divInfo.innerHTML = `
        <h3>Datos del usuario</h3>
        <p><strong>RUT:</strong> ${rut}</p>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Correo:</strong> ${data.correo}</p>
        <p><strong>Presupuesto:</strong> ${data.presupuesto}</p>`;
    
    } else {
        Swal.fire({
            title: "RUT ingresado no es correcto",
            icon: "error"
        });
    }


    mostrarGastos();
    crearChart();
});

// Función para mostrar y ocultar secciones de la UI
function mostrarDivs(mostrar) {
    const divRG = document.querySelector('.div_RegistoGastos');
    const divIF = document.querySelector('.div_informacionUsuario');
    const divMG = document.querySelector('.divMostrarGastos');
    const divC = document.querySelector('.div_Chart');
    const divCM = document.querySelector('.div_BotonMoneda');
    const displayStyle = mostrar ? 'block' : 'none';

    divRG.style.display = displayStyle;
    divIF.style.display = displayStyle;
    divMG.style.display = displayStyle;
    divC.style.display = displayStyle;
    divCM.style.display = displayStyle;
}

// Mostrar gastos
async function mostrarGastos() {
    let salida = true;
    let contador = 1;
    arrayGastos = [];
    comida = 0;
    transporte = 0;
    vivienda = 0;
    entretenimiento = 0;

    while (salida) {
        let clave = `${contador}_${rut}`;
        let data = JSON.parse(localStorage.getItem(clave));
        if (data != null) {
            arrayGastos.push(new ArrayGastos(data));
        } else {
            salida = false;
        }
        contador++;
    }

    arrayGastos.forEach(gasto => {

        if (gasto.categoria == 'Comida') {
            comida += parseFloat(gasto.monto);

        }
        if (gasto.categoria == 'Transporte') {
            transporte += parseFloat(gasto.monto);

        }
        if (gasto.categoria == 'Vivienda') {
            vivienda += parseFloat(gasto.monto);

        }
        if (gasto.categoria == 'Entretenimiento') {
            entretenimiento += parseFloat(gasto.monto);

        }
    });

    let totalGastos = comida+transporte+vivienda+entretenimiento;


    // Crear filas para cada gasto
    let filas = `<thead>
    <tr>
        <th>Fecha</th>
        <th>Categoría</th>
        <th>Descripción</th>
        <th>Monto</th>
    </tr>
</thead>
<tbody></tbody>`;


    for (const gasto of arrayGastos) {
        const montoConvertido = await convertirDivisas(gasto.monto, 'CLP', sMostrarGastos.value);
        filas += `
            <tr>
                <td>${gasto.fecha}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.descripcion}</td>
                <td>${montoConvertido.toFixed(2)} ${sMostrarGastos.value}</td>
                
            </tr>
        `;
    }

    // Añadir una fila al final de la tabla para mostrar el total

    const totalConvertido = await convertirDivisas(totalGastos,'CLP', sMostrarGastos.value);
    filas += `
        <tr>
            <td colspan="3" style="text-align:right;"><strong>Total Gastos:</strong></td>
            <td><strong>${totalConvertido.toFixed(2)} ${sMostrarGastos.value}</strong></td>
        </tr>
    `;
    tablaGastos.innerHTML = filas; // Actualiza la tabla con las filas generadas
}

// Escuchar cambios en el select para actualizar la tabla de gastos
sMostrarGastos.addEventListener('change', mostrarGastos);

// Diagrama en formato PIE


let chart;
console.log('valor chart: ', comida, transporte, vivienda, entretenimiento)

function crearChart() {
    // Seleccionar el elemento canvas en el que se mostrará el gráfico
    const crt = document.getElementById('canvas');



    // Si ya existe un gráfico, destruirlo antes de crear uno nuevo para evitar superposición
    if (chart) {
        chart.destroy();
    }

    // Crear el gráfico de tipo pie
    chart = new Chart(crt, {
        type: 'pie',
        data: {
            labels: ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento'],
            datasets: [{
                label: 'Gastos',
                data: [comida, transporte, vivienda, entretenimiento], // Usar las variables con los datos actualizados
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colores de cada segmento
            }]
        },
        options: {
            responsive: true,  // Ajusta el gráfico a la pantalla
            maintainAspectRatio: false  // Permite que el gráfico se ajuste a diferentes relaciones de aspecto
        }
    });
}

// IMPLEMENTACION DE API
const api_key = '45c8e52fd24c1f3c2f2d92b1';

async function convertirDivisas(monto, divisaOrigen, divisaDestino) {
    const url = `https://v6.exchangerate-api.com/v6/${api_key}/pair/${divisaOrigen}/${divisaDestino}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.result === 'success') {
            const montoConvertido = datos.conversion_rate * monto;
            return montoConvertido;
        } else {
            console.log('Error tasa de cambio ', datos['error-type']);
        }
    } catch (error) {
        console.error('Error en la solicitud ', error);
    }
}

// Eliminar gastos (Función no implementada)
function eliminarGasto(clave) {
    localStorage.removeItem(clave); // Elimina el gasto del localStorage
    mostrarGastos(); // Vuelve a mostrar la tabla de gastos actualizada

    // Muestra un mensaje de confirmación
    Swal.fire({
        title: "Gasto eliminado",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    });
}

// Aquí puedes agregar la lógica para eliminar gastos si es necesario
    // Evento para eliminar gastos
    tablaGastos.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
            const clave = event.target.getAttribute('data-clave');
            eliminarGasto(clave);
           // mostrarGastos()
        }
    });

// Actualizar gastos cuando cambie el select
sMostrarGastos.addEventListener('change', mostrarGastos);

