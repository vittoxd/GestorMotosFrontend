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
            </tr>
            `;

            tabla.innerHTML += fila;
        } )
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
            alert("¡Moto guardada con éxito en el taller! 🏍️");
            
            // 3. LIMPIEZA DE INGENIERÍA:
            formulario.reset(); // Borramos lo que el usuario escribió en las cajas
            cargarMotos();      // ¡Mágico! Volvemos a llamar a la función de leer para que la tabla se actualice sola
        } else {
            console.error("Hubo un error en el servidor:", respuesta.status);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
    }

});