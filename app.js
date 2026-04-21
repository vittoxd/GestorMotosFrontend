const URL_API = "https://localhost:7258/api/Moto"

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
                <botton onclick ="prepararEdicion(${moto.id})">✏️</button>
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
   const idMoto = document.getElementById("input-id").value; 
    
    const marca = document.getElementById("input-marca").value;
    const modelo = document.getElementById("input-modelo").value;
    const anio = document.getElementById("input-anio").value;
    const kilometraje = document.getElementById("input-kilometraje").value;

    let metodo = "POST";
    let urlEnvio = URL_API;

    // 2. LÓGICA DE EDICIÓN
    if (idMoto) {
        metodo = "PUT";
        urlEnvio = `${URL_API}/${idMoto}`;
    }

    // 3. CREAMOS EL OBJETO (Usando las variables de arriba)
    const moto = {
        id: idMoto ? parseInt(idMoto) : 0,
        marca: marca,
        modelo: modelo,
        año: parseInt(anio),
        kilometraje: parseInt(kilometraje)
    };

    try {
        const response = await fetch(urlEnvio, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(moto)
        });

        if (response.ok) {
            const textoMensaje = idMoto ? "Moto actualizada con éxito" : "Moto registrada con éxito";
            mostrarMensaje(textoMensaje);
            
            formulario.reset();
            document.getElementById("input-id").value = ""; 
            
            // CAMBIO AQUÍ: Tu función se llama cargarMotos, no obtenerMotos
            cargarMotos(); 
            
            // Volvemos el botón a su estado original
            const boton = document.querySelector("#formulario_moto button[type='submit']");
            boton.innerText = "Registrar Moto en Sistema 🏍️✨";
        } else {
            mostrarMensaje("Error al procesar la solicitud", true);
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarMensaje("No se pudo conectar con el servidor", true);
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

