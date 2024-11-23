// Obtener el mapa de asientos y los botones
const mapaAsientos = document.getElementById("mapa-asientos");
const btnConfirmar = document.getElementById("confirmar-reserva");

// ID de la película y del usuario (estos valores deben ser dinámicos)
const usuarioId = sessionStorage.getItem("usuarioId");
const peliculaId = 1; // Cambia este valor según la película seleccionada

// Cargar asientos desde el back-end
async function cargarAsientos() {
    try {
        const response = await fetch(`/reservas/asientos/${peliculaId}`);
        if (!response.ok) {
            throw new Error("Error al cargar los asientos");
        }
        const data = await response.json();
        generarMapaAsientos(data.asientos);
    } catch (error) {
        console.error("Error al cargar los asientos:", error.message);
        alert("Hubo un problema al cargar el mapa de asientos.");
    }
}

// Generar el mapa de asientos dinámicamente
function generarMapaAsientos(asientos) {
    mapaAsientos.innerHTML = ""; // Limpiar el mapa actual
    asientos.forEach((asiento) => {
        const asientoDiv = document.createElement("div");
        asientoDiv.className = "asiento";
        asientoDiv.dataset.asientoId = asiento.id;
        asientoDiv.innerText = asiento.numero;

        // Si el asiento ya está reservado
        if (asiento.reservado) {
            asientoDiv.classList.add("reservado");
        } else {
            asientoDiv.addEventListener("click", seleccionarAsiento);
        }

        mapaAsientos.appendChild(asientoDiv);
    });
}

// Manejar selección de asientos
let asientosSeleccionados = [];
function seleccionarAsiento(event) {
    const asientoDiv = event.target;
    const asientoId = asientoDiv.dataset.asientoId;

    // Alternar selección
    if (asientoDiv.classList.contains("seleccionado")) {
        asientoDiv.classList.remove("seleccionado");
        asientosSeleccionados = asientosSeleccionados.filter(
            (id) => id !== asientoId
        );
    } else {
        asientoDiv.classList.add("seleccionado");
        asientosSeleccionados.push(asientoId);
    }

    btnConfirmar.disabled = asientosSeleccionados.length === 0;
    console.log(asientosSeleccionados); // Verifica los asientos seleccionados
}

// Confirmar reserva con fecha y hora
btnConfirmar.addEventListener("click", async () => {
    const fechaSeleccionada = document.getElementById("fecha").value;
    const horaSeleccionada = document.getElementById("hora").value;

    // Validar que se haya seleccionado fecha y hora
    if (!fechaSeleccionada || !horaSeleccionada) {
        alert("Por favor, selecciona una fecha y hora.");
        return;
    }

    try {
        const response = await fetch("/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                pelicula_id: peliculaId,
                asientos: asientosSeleccionados,
                fecha: fechaSeleccionada,
                hora: horaSeleccionada,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al reservar los asientos");
        }

        alert("Reserva realizada con éxito");
        cargarAsientos();
    } catch (error) {
        console.error("Error al realizar la reserva:", error.message);
        alert("Hubo un problema al confirmar la reserva.");
    }
});

// Cargar los asientos al iniciar
cargarAsientos();
