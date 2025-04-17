// js/ofertas.js
document.addEventListener("DOMContentLoaded", () => {
    // Carrusel
    const items = document.querySelectorAll(".carrusel-item");
    let currentIndex = 0;

    function mostrarSiguiente() {
        items[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add("active");
    }
    items[currentIndex].classList.add("active");
    setInterval(mostrarSiguiente, 5000);

    // Filtros
    const filtros = document.querySelectorAll(".filtro-btn");
    const filtroPrecio = document.getElementById("filtro-precio");
    const filtroDescuento = document.getElementById("filtro-descuento");
    const ofertas = document.querySelectorAll(".oferta");

    function aplicarFiltros() {
        const categoria = document.querySelector(".filtro-btn.active").dataset.filtro;
        const precioRango = filtroPrecio.value;
        const descuentoMin = filtroDescuento.value;

        ofertas.forEach(oferta => {
            const catMatch = categoria === "todos" || oferta.dataset.categoria === categoria;
            const precio = parseFloat(oferta.dataset.precio);
            const descuento = parseInt(oferta.dataset.descuento);
            let precioMatch = true;
            let descuentoMatch = true;

            if (precioRango !== "todos") {
                const [min, max] = precioRango.split("-").map(v => v === "+" ? Infinity : parseFloat(v));
                precioMatch = precio >= min && (max ? precio <= max : true);
            }
            if (descuentoMin !== "todos") {
                descuentoMatch = descuento >= parseInt(descuentoMin);
            }

            if (catMatch && precioMatch && descuentoMatch) {
                oferta.classList.remove("hidden");
                oferta.style.opacity = "1";
            } else {
                oferta.classList.add("hidden");
            }
        });
    }

    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            filtros.forEach(f => f.classList.remove("active"));
            filtro.classList.add("active");
            aplicarFiltros();
        });
    });

    filtroPrecio.addEventListener("change", aplicarFiltros);
    filtroDescuento.addEventListener("change", aplicarFiltros);

    // Temporizadores individuales
    document.querySelectorAll(".temporizador-oferta").forEach(temporizador => {
        const endTime = new Date(temporizador.dataset.fin).getTime();
        function actualizar() {
            const now = new Date().getTime();
            const distance = endTime - now;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            temporizador.textContent = distance > 0 ? `${hours}h ${minutes}m ${seconds}s` : "¡Terminada!";
        }
        setInterval(actualizar, 1000);
        actualizar();
    });

    // Ver más ofertas - Mostrar mensaje
    const verMas = document.getElementById("ver-mas-ofertas");
    let mensajeMostrado = false;

    verMas.addEventListener("click", () => {
        if (!mensajeMostrado) {
            const mensaje = document.createElement("div");
            mensaje.classList.add("mensaje-fin-ofertas");
            mensaje.textContent = "¡Estos son todos los productos por ahora!";
            document.body.appendChild(mensaje);

            setTimeout(() => mensaje.classList.add("visible"), 10);
            setTimeout(() => {
                mensaje.classList.remove("visible");
                setTimeout(() => document.body.removeChild(mensaje), 500);
            }, 3000);

            mensajeMostrado = true; // Evita mostrar el mensaje varias veces
            setTimeout(() => mensajeMostrado = false, 5000); // Resetea después de 5 segundos
        }
    });

    // Notificaciones
    const btnNotificaciones = document.getElementById("btn-notificaciones");
    const modal = document.getElementById("modal-notificaciones");
    const cerrarModal = document.getElementById("cerrar-modal");
    const formNotificaciones = document.getElementById("form-notificaciones");

    btnNotificaciones.addEventListener("click", () => modal.style.display = "flex");
    cerrarModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
    formNotificaciones.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("¡Suscrito con éxito! Te avisaremos de nuevas ofertas.");
        modal.style.display = "none";
    });

    // Integración con carrito
    document.querySelectorAll(".btn-agregar-oferta").forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const productoExistente = carrito.find(item => item.id === id);
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            const mensaje = `${nombre} x${productoExistente ? productoExistente.cantidad : 1} - ${(precio * (productoExistente ? productoExistente.cantidad : 1)).toFixed(2)} Bs añadido al carrito`;
            const mensajeElemento = document.createElement("div");
            mensajeElemento.classList.add("mensaje-confirmacion");
            mensajeElemento.textContent = mensaje;
            document.body.appendChild(mensajeElemento);
            setTimeout(() => mensajeElemento.classList.add("visible"), 10);
            setTimeout(() => {
                mensajeElemento.classList.remove("visible");
                setTimeout(() => document.body.removeChild(mensajeElemento), 500);
            }, 3000);
        });
    });

    // Aplicar filtros al cargar la página
    aplicarFiltros();
});