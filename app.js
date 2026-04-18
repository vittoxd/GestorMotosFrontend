const URL_API = "https://localhost:7258/api/Motos"

async function cargarMotos() {
    try {
        const respuesta = await fetch(URL_API);

        const Motos = await respuesta.json();

        const tabla = document.getElementById("cuerpo-tabla");

        tabla.innerHTML = "";

        Motos.forEach(moto =>{
            const fila = `
            <tr>
            <td>${moto.id}</td>
            <td>${moto.marca}</td>
            <td>${moto.modelo}</td>
            <td>${moto.año}</td>
            <td>${moto.kilometraje} km</td>
            <td>
                <bottom onclick ="prepararEdicion(${moto.id})">✏️</button>
                <button onclick="eliminarMoto(${moto.id})">🗑️</button>
            </td>
            </tr>
            `;

            tabla.innerHTML += fila;
        } );
    }
     catch (error) {
        console.error("¡Rayos! Algo salió mal:", error);
    }
}

cargarMotos();

const formulario = document.getElementById("formulario_moto");
formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();
    const marcaIngresada = document.getElementById("input-marca").value;
    const modeloIngresada = document.getElementById("input-modelo").value;
    const anioIngresada = parseInt(document.getElementById("input-anio").value);
    const kilometrajeIngresado = parseInt(document.getElementById("input-kilometraje").value);

    const nuevaMoto = {
        marca: marcaIngresada,
        modelo : modeloIngresada,
        año : anioIngresada,
        kilometraje : kilometrajeIngresado
    };

    console.log ("paquete listo para enviar:", nuevaMoto)

    try {
        // 1. Enviamos el paquete
        const respuesta = await fetch(URL_API, {
            method: "POST", // Especificamos que es un envío
            headers: {
                "Content-Type": "application/json" // La "etiqueta" del paquete
            },
            body: JSON.stringify(nuevaMoto) // Convertimos el objeto a texto plano (JSON)
        });

        // 2. Revisamos si el servidor recibió la carta
        if (respuesta.ok) {
            mostrarMensaje("¡Moto guardada con éxito en el taller! 🏍️");
            
            // 3. LIMPIEZA DE INGENIERÍA:
            formulario.reset(); // Borramos lo que el usuario escribió en las cajas
            cargarMotos();      // ¡Mágico! Volvemos a llamar a la función de leer para que la tabla se actualice sola
        } else {
            mostrarMensaje("Hubo un error en el servidor ❌", true);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
    }

});
function mostrarMensaje(texto, esError = false) {
    const caja = document.getElementById("notificacion");
    caja.innerText = texto;
    caja.style.display = "block";
    
    // Colores básicos 
    caja.style.backgroundColor = esError ? "#ffcccc" : "#ccffcc";
    caja.style.color = esError ? "#990000" : "#006600";
    caja.style.border = `1px solid ${esError ? "#990000" : "#006600"}`;

    // Desaparece después de 3 segundos
    setTimeout(() => {
        caja.style.display = "none";
    }, 3000);
}

async function eliminarMoto(id) {
    // 1. Preguntamos por seguridad (el usuario se puede equivocar)
    if (!confirm("¿Estás seguro de que quieres eliminar esta moto? 🧐")) {
        return; // Si dice que no, nos salimos
    }

    try {
        // 2. Llamamos a la API con el método DELETE
        const respuesta = await fetch(`${URL_API}/${id}`, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            mostrarMensaje("Moto eliminada correctamente 🗑️");
            cargarMotos(); // Refrescamos la tabla para que desaparezca
        } else {
            mostrarMensaje("No se pudo eliminar la moto ❌", true);
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
        mostrarMensaje("Error de conexión al eliminar", true);
    }
}

async function prepararEdicion(id) {
    try {
        // 1. Buscamos los datos actuales de esa moto en la API
        const respuesta = await fetch(`${URL_API}/${id}`);
        const moto = await respuesta.json();

        // 2. Llenamos las cajas del formulario con lo que nos mandó la API
        document.getElementById("input-id").value = moto.id;
        document.getElementById("input-marca").value = moto.marca;
        document.getElementById("input-modelo").value = moto.modelo;
        document.getElementById("input-anio").value = moto.año;
        document.getElementById("input-kilometraje").value = moto.kilometraje;

        // 3. Tip de UX: Cambiamos el texto del botón para que el usuario sepa que está editando
        const boton = document.querySelector("#formulario_moto button[type='submit']");
        boton.innerText = "Actualizar Cambios 🔄";
        
        mostrarMensaje("Modo edición activado ✏️");
        
        // 4. Hacemos scroll hacia arriba para que el usuario vea el formulario lleno
        window.scrollTo(0, 0);

    } catch (error) {
        console.error("Error al cargar datos para edición:", error);
    }
}