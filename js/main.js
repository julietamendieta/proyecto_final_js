//Elementos de HTML
let botonAceptar = document.querySelector("#aceptar");
let botonAgregar = document.querySelector("#agregar");
let tituloGastos = document.querySelector("#titulo-tipo-gastos");
let listaGastos = document.querySelector("#gasto");

const tiposGastos = document.querySelector("#tipos-gastos");

const peticion = async () => {
    const respuesta = await fetch('tipo.json')
    const datos = await respuesta.json();
    const data = await datos;
    for(item of data) {
        const option = document.createElement("option")
        option.innerHTML = `
            <p>${item.nombre}</p>
        `
        tiposGastos.appendChild(option)
    }
}
peticion();

botonAceptar.addEventListener("click", leerTipoGasto);

let tituloGasto;

//FUNCION PARA AGREGAR TIPO DE GASTO A PARTIR DEL SELECT
function leerTipoGasto() {
    const tipoGastoSeleccionado = document.querySelector("select").value;
    tituloGastos.innerText = `Tus gastos ${tipoGastoSeleccionado}`;
    localStorage.setItem("tipo-seleccionado", JSON.stringify(tipoGastoSeleccionado));
}

let tituloGastoST;
let tituloGastoLS = localStorage.getItem("tipo-seleccionado");
if(tituloGastoLS){
    tituloGastoST = JSON.parse(tituloGastoLS);
    tituloGastos.innerText = `Tus gastos ${tituloGastoST}`;
} else {
    tituloGastos.innerText = `Tus gastos`
}

botonAgregar.addEventListener("click", leerGasto);
botonAgregar.addEventListener("click", () => {
    Toastify({
        text: "Gasto agregado a la lista",
        className: "info",
        style: {
          background: "linear-gradient(to right, #6d2d68, #6d509b)",
        }
      }).showToast();
})


document.querySelector("#ingreso-monto-gasto").addEventListener("keydown", teclado);

function teclado(e) {
    if (e.key === "Enter") {
        leerGasto();
        Toastify({
            text: "Gasto agregado a la lista",
            className: "info",
            style: {
              background: "linear-gradient(to right, #6d2d68, #6d509b)",
            }
          }).showToast();
    }
}

let gastos = localStorage.getItem("gastos-en-lista");
gastos = JSON.parse(gastos);

let gastosLS= localStorage.getItem("gastos-en-lista");

if(gastosLS) {
    gastos = JSON.parse(gastosLS);
} else {
    gastos = [];
}

let categoriaGasto;
let montoGasto;

//FUNCION PARA AGREGAR EL GASTO A LISTA
function leerGasto() {
    let categoriaGasto = document.querySelector("#ingreso-categoria-gasto").value.trim().toUpperCase();
    let montoGasto = Number(document.querySelector("#ingreso-monto-gasto").value);
    if (categoriaGasto && montoGasto) {
        let gasto = {
            nombre: categoriaGasto,
            monto: montoGasto
        };
        gastos.push(gasto);
        console.log(gastos)
        limpiarCampo();
    }
    mostrarGastosEnLista();
}
//FUNCION PARA LIMPIAR CAMPO DE ESCRITURA
function limpiarCampo() {
    const borrar1 = document.querySelector("#ingreso-categoria-gasto");
    borrar1.value = "";
    const borrar2 = document.querySelector("#ingreso-monto-gasto");
    borrar2.value = "";
    borrar1.focus();
}

//Elementos de HTML
let listaVacia=document.querySelector("#lista-vacia");
const botonBorrarLista = document.querySelector("#borrar-lista");
let botonesEliminar = document.querySelectorAll(".eliminar");
const totalGastos = document.querySelector("#total");
const botonDescargar = document.querySelector("#descargar-lista");

//FUNCION PARA CARGAR Y MOSTRAR LA LISTA
function mostrarGastosEnLista() {
    if (gastos && gastos.length > 0) {
        listaGastos.classList.remove("disabled");
        listaVacia.classList.add("disabled");
        listaGastos.innerHTML="";
        gastos.forEach(gasto => {
            const div = document.createElement("div");
            div.classList.add("gasto-lista");
            div.innerHTML = `
                <div class="nombre-gasto">
                    <p>${gasto.nombre}</p>
                </div>
                <div class="monto-gasto">
                    <p>$${gasto.monto}</p>
                </div>
                <button class="eliminar" id="${gasto.nombre}"><i class="bi bi-trash3"></i></button>
            `;
            listaGastos.append(div)
        })
        
    } else {
        listaVacia.classList.remove("disabled");
        listaGastos.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    localStorage.setItem("gastos-en-lista", JSON.stringify(gastos));
    actualizarTotal();
}

mostrarGastosEnLista();

//FUNCIONES DE ACCIONES DE LISTA
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminar);
    });
}

function eliminar(e) {
    const idBoton = e.currentTarget.id;
    const index = gastos.findIndex(gasto => gasto.nombre === idBoton);
    gastos.splice(index, 1);
    localStorage.setItem("gastos-en-lista", JSON.stringify(gastos));
    mostrarGastosEnLista();
}

botonBorrarLista.addEventListener("click", borrarLista);

function borrarLista() {
    gastos.length = 0;
    localStorage.setItem("gastos-en-lista", JSON.stringify(gastos));
    mostrarGastosEnLista();
}

function actualizarTotal() {
    const sumaTotal = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
    totalGastos.innerText = `$${sumaTotal}`;
}

botonDescargar.addEventListener("click", descargarLista);
botonDescargar.addEventListener("click", () => {
    Swal.fire("Lista descargada");
});

function descargarLista() {
    gastos.length = 0;
    localStorage.setItem(("gastos-en-lista"), JSON.stringify(gastos));
    listaVacia.classList.remove("disabled");
    listaGastos.classList.add("disabled");
}
