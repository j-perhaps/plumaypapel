// carrito-refactor.js
// Esta versión refactorizada utiliza "Bs" como moneda para todos los cálculos y mensajes.

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let carrito = [];
    let contadorCarrito = document.querySelector('.carrito-count');
    let tipoEnvioSeleccionado = 5; // Valor por defecto para envío estándar en Bs
    let codigoDescuento = ''; // Para almacenar el código de descuento aplicado
    let porcentajeDescuento = 0; // Porcentaje de descuento a aplicar

    // Flag para controlar la visibilidad del resumen
    let resumeDesaparecido = false;

    // Cargar carrito desde localStorage si existe
    inicializarCarrito();

    // Configurar eventListeners para botones de añadir al carrito
    configurarBotonesCarrito();

    // Función para inicializar el carrito
    function inicializarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoProductos');
        if (carritoGuardado) {
            try {
                carrito = JSON.parse(carritoGuardado);
                actualizarContadorCarrito();
                console.log('Carrito cargado desde localStorage:', carrito);
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
                carrito = [];
            }
        }
    }

    // Función para configurar los botones de añadir al carrito
    function configurarBotonesCarrito() {
        const botonesAñadirEstaticos = document.querySelectorAll('.btn-añadir-carrito');

        botonesAñadirEstaticos.forEach(boton => {
            boton.addEventListener('click', manejarClickAñadirCarrito);
        });

        const contenedorProductosDinamicos = document.getElementById('productos-dinamicos');
        if (contenedorProductosDinamicos) {
            contenedorProductosDinamicos.addEventListener('click', function (event) {
                if (event.target.classList.contains('btn-añadir-carrito') ||
                    event.target.closest('.btn-añadir-carrito')) {
                    manejarClickAñadirCarrito.call(event.target.closest('.btn-añadir-carrito'), event);
                }
            });
        }
    }

    // Manejador de evento para añadir al carrito
    function manejarClickAñadirCarrito(event) {
        event.preventDefault();
        event.stopPropagation();

        const tarjetaProducto = this.closest('.producto-card');
        if (!tarjetaProducto) return;

        const productoId = tarjetaProducto.dataset.id || generarIdUnico();
        const nombreProducto = tarjetaProducto.querySelector('.producto-nombre').textContent.trim();
        const categoriaProducto = tarjetaProducto.querySelector('.producto-categoria').textContent.trim();
        const precioTexto = tarjetaProducto.querySelector('.producto-precio').textContent.trim();
        const precio = parseFloat(precioTexto.replace('Bs', '').replace(',', ''));
        const imagenSrc = tarjetaProducto.querySelector('.producto-imagen img').src;

        const productoExistente = carrito.find(item => item.id === productoId);

        if (productoExistente) {
            productoExistente.cantidad += 1;
            showToast(`¡${nombreProducto} añadido otra vez! (${productoExistente.cantidad})`);
        } else {
            carrito.push({
                id: productoId,
                nombre: nombreProducto,
                categoria: categoriaProducto,
                precio: precio,
                imagen: imagenSrc,
                cantidad: 1
            });
            showToast(`¡${nombreProducto} añadido al carrito! 🛒`);
        }

        guardarCarrito();
        actualizarContadorCarrito();
        animarIconoCarrito();
    }

    // Función para actualizar los totales del carrito
    function actualizarTotalesCarrito() {
        console.log('[DEBUG] Actualizando totales del carrito');
        const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        let envio = tipoEnvioSeleccionado;

        if (subtotal >= 500 && envio > 0) {
            envio = 0; // Envío gratis para compras mayores a 500 Bs
        }

        const descuento = subtotal * (porcentajeDescuento / 100);
        const total = subtotal + envio - descuento;

        const subtotalElement = document.querySelector('.valor-subtotal');
        const envioElement = document.querySelector('.valor-envio');
        const descuentoElement = document.querySelector('.valor-descuento');
        const totalElement = document.querySelector('.valor-total');

        if (subtotalElement) subtotalElement.textContent = `Bs ${subtotal.toFixed(2)}`;
        if (envioElement) {
            if (envio === 0) {
                envioElement.textContent = 'GRATIS 🎉';
                envioElement.classList.add('envio-gratis');
            } else {
                envioElement.textContent = `Bs ${envio.toFixed(2)}`;
                envioElement.classList.remove('envio-gratis');
            }
        }
        if (descuentoElement) descuentoElement.textContent = `-Bs ${descuento.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `Bs ${total.toFixed(2)}`;

        setTimeout(verificarVisibilidadResumen, 50);
    }

    // Configurar botón de WhatsApp
    function configurarBotonWhatsApp() {
        const btnWhatsApp = document.getElementById('btn-whatsapp-checkout');

        if (!btnWhatsApp) return;

        btnWhatsApp.addEventListener('click', function () {
            verificarVisibilidadResumen();

            let mensaje = "¡Hola! 👋 Quiero realizar el siguiente pedido:\n\n";

            carrito.forEach(producto => {
                mensaje += `• ${producto.cantidad}x ${producto.nombre} - Bs ${(producto.precio * producto.cantidad).toFixed(2)}\n`;
            });

            const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
            let envio = tipoEnvioSeleccionado;

            if (subtotal >= 500 && envio > 0) {
                envio = 0;
            }

            const descuento = subtotal * (porcentajeDescuento / 100);
            const total = subtotal + envio - descuento;

            mensaje += `\n📋 RESUMEN:\n`;
            mensaje += `• Subtotal: Bs ${subtotal.toFixed(2)}\n`;

            if (envio === 0) {
                mensaje += `• Envío: GRATIS 🎉\n`;
            } else {
                mensaje += `• Envío: Bs ${envio.toFixed(2)}\n`;
            }

            if (descuento > 0) {
                mensaje += `• Descuento (${porcentajeDescuento}%): -Bs ${descuento.toFixed(2)}\n`;
            }

            mensaje += `• TOTAL: Bs ${total.toFixed(2)}\n\n`;
            mensaje += "¡Estoy interesado/a en realizar este pedido! 🛍️";

            const mensajeCodificado = encodeURIComponent(mensaje);
            const numeroWhatsApp = "59175249275";
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
            window.open(urlWhatsApp, '_blank');
        });
    }

    // Función para guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carritoProductos', JSON.stringify(carrito));
        console.log('Carrito guardado:', carrito);
    }

    // Función para actualizar el contador del carrito
    function actualizarContadorCarrito() {
        if (contadorCarrito) {
            const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
            contadorCarrito.textContent = totalItems;

            if (totalItems > 0) {
                contadorCarrito.style.display = 'flex';
            } else {
                contadorCarrito.style.display = 'none';
            }
        }
    }

    function animarIconoCarrito() {
        const iconoCarrito = document.querySelector('.carrito-icon');
        if (iconoCarrito) {
            // Añadir clase para la animación
            iconoCarrito.classList.add('cart-bounce');

            // Eliminar la clase después de que termine la animación
            setTimeout(() => {
                iconoCarrito.classList.remove('cart-bounce');
            }, 800);
        }
    }

    function generarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Mostrar notificación toast
    function showToast(message, duration = 3000) {
        // Comprobar si ya existe un toast y eliminarlo
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Crear nuevo toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;

        // Añadir al DOM
        document.body.appendChild(toast);

        // Efecto de entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-eliminar después de un tiempo
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // Agregar estilos para animación del carrito si no existen
    function agregarEstilosCarrito() {
        const style = document.createElement('style');
        style.textContent = `
            .cart-bounce {
                animation: cartBounce 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            
            @keyframes cartBounce {
                0%, 100% { transform: scale(1); }
                20% { transform: scale(1.4); }
                50% { transform: scale(0.8); }
                80% { transform: scale(1.15); }
            }
            
            .carrito-icon {
                position: relative;
            }
            
            .carrito-count {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
                height: 20px;
                background-color: #FF5757;
                color: white;
                border-radius: 50%;
                font-size: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                transition: transform 0.3s ease;
            }
            
            .toast-notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background-color: #4E67EB;
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                font-weight: 500;
            }
            
            .toast-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            /* Estilos para asegurar visibilidad del resumen */
            .totales-resumen.forzar-visible {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Añadir los estilos necesarios
    agregarEstilosCarrito();

    // SISTEMA MEJORADO DE VERIFICACIÓN DE RESUMEN
    function verificarVisibilidadResumen() {
        const seccionTotales = document.querySelector('.totales-resumen');
        if (!seccionTotales) return;

        // Si la sección está oculta, forzamos su visibilidad y marcamos el flag
        if (window.getComputedStyle(seccionTotales).display === 'none') {
            console.log('[DEBUG] La sección de resumen está oculta. Forzando visibilidad.');
            resumeDesaparecido = true;
            seccionTotales.style.display = 'block';
            seccionTotales.classList.add('forzar-visible');

            // Verificamos que el resumen tenga contenido
            actualizarTotalesCarrito();
        }
    }

    // Configurar un observador para detectar cambios en el DOM
    function configurarObservadorResumen() {
        const seccionTotales = document.querySelector('.totales-resumen');
        if (!seccionTotales) {
            console.error('[DEBUG] No se encontró la sección de totales para observar');
            return;
        }

        console.log('[DEBUG] Configurando observador para la sección de resumen');

        // Crear un MutationObserver para detectar cambios
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // Si hay cambios en los atributos de estilo
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const estiloDisplay = window.getComputedStyle(seccionTotales).display;

                    // Si se oculta la sección, verificamos si debería estar visible
                    if (estiloDisplay === 'none') {
                        console.log('[DEBUG] Observador: La sección de resumen se ocultó');

                        // Forzar visibilidad después de un pequeño retraso
                        setTimeout(function () {
                            seccionTotales.style.display = 'block';
                            seccionTotales.classList.add('forzar-visible');
                            console.log('[DEBUG] Forzando visibilidad por observador');
                        }, 50);
                    }
                }
            });
        });

        // Configurar el observador para vigilar cambios en atributos
        observer.observe(seccionTotales, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        return observer;
    }

    // ===== Funcionalidad para la página de carrito =====
    // Verificar si estamos en la página del carrito
    if (window.location.pathname.includes('carrito.html')) {
        console.log('[DEBUG] Inicializando página de carrito');

        // Renderizar los productos en el carrito
        renderizarPaginaCarrito();

        // Configurar selector de envío
        const selectorEnvio = document.getElementById('select-envio');
        if (selectorEnvio) {
            selectorEnvio.addEventListener('change', function () {
                tipoEnvioSeleccionado = parseFloat(this.value);
                actualizarTotalesCarrito();
                verificarVisibilidadResumen(); // Verificar después de actualizar
                showToast('Método de envío actualizado');
            });
        }

        // Configurar botón de seguir comprando
        const btnSeguirComprando = document.getElementById('btn-seguir-comprando');
        if (btnSeguirComprando) {
            btnSeguirComprando.addEventListener('click', function () {
                window.location.href = 'catalogo.html';
            });
        }

        // Configurar sistema de verificación del resumen
        const resumenObserver = configurarObservadorResumen();

        // Verificar visibilidad periódicamente
        setInterval(verificarVisibilidadResumen, 1000);

        // Verificar inmediatamente después de cargar
        setTimeout(verificarVisibilidadResumen, 500);
        setTimeout(verificarVisibilidadResumen, 1500);
        setTimeout(verificarVisibilidadResumen, 2500);

        // Activar verificación en interacciones del usuario
        document.addEventListener('click', function () {
            setTimeout(verificarVisibilidadResumen, 100);
        });

        // Configurar botón de WhatsApp
        configurarBotonWhatsApp();

        // Cargar sugerencias de productos
        cargarSugerenciasProductos();

        // Registrar desconexión del observador
        window.addEventListener('beforeunload', function () {
            if (resumenObserver) {
                resumenObserver.disconnect();
            }
        });
    }

    function renderizarPaginaCarrito() {
        console.log('[DEBUG] Ejecutando renderizarPaginaCarrito');
        const contenedorCarrito = document.querySelector('.carrito-items');
        if (!contenedorCarrito) return;

        // Referencia a la sección de totales (importante mantenerla visible)
        const seccionTotales = document.querySelector('.totales-resumen');
        if (seccionTotales) {
            // Aseguramos que la sección de totales sea visible siempre
            console.log('[DEBUG] Asegurando visibilidad de sección de totales');
            seccionTotales.style.display = 'block';

            // Si ya hemos detectado problemas, aplicamos clase forzada
            if (resumeDesaparecido) {
                seccionTotales.classList.add('forzar-visible');
            }
        }

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>¡Tu carrito está más vacío que nevera de estudiante! 🙈</h3>
                    <p>Ve a nuestro catálogo y añade productos increíbles.</p>
                    <a href="catalogo.html" class="btn-primary">¡Quiero ver productos! 🛍️</a>
                </div>
            `;

            // IMPORTANTE: NO ocultamos la sección de totales, incluso con carrito vacío
            // Desactivar botón de WhatsApp sin ocultar sección
            const btnWhatsApp = document.getElementById('btn-whatsapp-checkout');
            if (btnWhatsApp) {
                btnWhatsApp.disabled = true;
            }

            // Actualizar totales incluso con carrito vacío
            actualizarTotalesCarrito();

            return;
        }

        // Limpiar contenedor
        contenedorCarrito.innerHTML = '';
        // Añadir esta sección al método renderizarPaginaCarrito() después de limpiar el contenedor
// y antes de activar el botón de WhatsApp

// Renderizar cada producto del carrito
carrito.forEach(producto => {
    const subtotalProducto = producto.precio * producto.cantidad;
    const itemHTML = `
        <div class="carrito-item" data-id="${producto.id}">
            <div class="item-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="item-detalles">
                <h3 class="item-nombre">${producto.nombre}</h3>
                <p class="item-categoria">${producto.categoria}</p>
                <p class="item-precio">Bs ${producto.precio.toFixed(2)}</p>
            </div>
            <div class="item-cantidad">
                <button class="btn-restar">-</button>
                <span class="cantidad-valor">${producto.cantidad}</span>
                <button class="btn-sumar">+</button>
            </div>
            <div class="item-subtotal">
                <p>Bs ${subtotalProducto.toFixed(2)}</p>
            </div>
            <button class="btn-eliminar-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    contenedorCarrito.insertAdjacentHTML('beforeend', itemHTML);
});

        // Activar botón de WhatsApp
        const btnWhatsApp = document.getElementById('btn-whatsapp-checkout');
        if (btnWhatsApp) {
            btnWhatsApp.disabled = false;
        }

        // Actualizar totales
        actualizarTotalesCarrito();

        // Configurar eventos para los botones de cantidad y eliminar
        configurarEventosCarrito();

        // Verificar visibilidad después de renderizar
        setTimeout(verificarVisibilidadResumen, 100);
    }

    function configurarEventosCarrito() {
        // Botones de sumar cantidad
        const botonesSumar = document.querySelectorAll('.btn-sumar');
        botonesSumar.forEach(boton => {
            boton.addEventListener('click', function () {
                const itemCarrito = this.closest('.carrito-item');
                const id = itemCarrito.dataset.id;
                const producto = carrito.find(item => item.id === id);

                if (producto) {
                    producto.cantidad += 1;
                    guardarCarrito();
                    renderizarPaginaCarrito();
                    actualizarContadorCarrito();
                }
            });
        });

        // Botones de restar cantidad
        const botonesRestar = document.querySelectorAll('.btn-restar');
        botonesRestar.forEach(boton => {
            boton.addEventListener('click', function () {
                const itemCarrito = this.closest('.carrito-item');
                const id = itemCarrito.dataset.id;
                const producto = carrito.find(item => item.id === id);

                if (producto && producto.cantidad > 1) {
                    producto.cantidad -= 1;
                    guardarCarrito();
                    renderizarPaginaCarrito();
                    actualizarContadorCarrito();
                }
            });
        });

        // Botones de eliminar
        const botonesEliminar = document.querySelectorAll('.btn-eliminar-item');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function () {
                const itemCarrito = this.closest('.carrito-item');
                const id = itemCarrito.dataset.id;

                // Filtrar el producto del carrito
                carrito = carrito.filter(item => item.id !== id);

                guardarCarrito();
                renderizarPaginaCarrito();
                actualizarContadorCarrito();

                showToast('Producto eliminado del carrito 🗑️');
            });
        });

        // Botón de vaciar carrito
        const btnVaciarCarrito = document.querySelector('.btn-vaciar-carrito');
        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', function () {
                if (confirm('¿Seguro que quieres vaciar tu carrito? ¡Desaparecerán todos tus productos!')) {
                    carrito = [];
                    guardarCarrito();
                    renderizarPaginaCarrito();
                    actualizarContadorCarrito();

                    showToast('Carrito vaciado con éxito 🧹');
                }
            });
        }

        // Botón de aplicar cupón
        const btnAplicarCupon = document.querySelector('.btn-aplicar-cupon');
        const inputCupon = document.querySelector('.input-cupon');

        if (btnAplicarCupon && inputCupon) {
            btnAplicarCupon.addEventListener('click', function () {
                const cupon = inputCupon.value.trim().toUpperCase();

                // Verificar códigos de cupón válidos
                if (cupon === 'SOYCOOL2025') {
                    codigoDescuento = cupon;
                    porcentajeDescuento = 5; // 5% de descuento
                    showToast('¡Cupón aplicado! 5% de descuento 🎉');
                    actualizarTotalesCarrito();
                } else if (cupon === 'LEOLEGAL') {
                    codigoDescuento = cupon;
                    porcentajeDescuento = 10; // 5% de descuento
                    showToast('¡Cupón aplicado! 5% de descuento 🎉');
                    actualizarTotalesCarrito();
                } else if (cupon === 'FLASH') {
                    codigoDescuento = cupon;
                    porcentajeDescuento = 5; // 5% de descuento
                    showToast('¡Cupón aplicado! 5% de descuento 🎉');
                    actualizarTotalesCarrito();
                } else {
                    showToast('Cupón inválido o expirado 😢');
                }
            });
        }
    }

    // Cargar sugerencias de productos en la página del carrito
    function cargarSugerenciasProductos() {
        const contenedorSugerencias = document.getElementById('sugerencias-productos');
        if (!contenedorSugerencias) return;

        // Array de productos sugeridos (esto podría venir de una API o ser generado dinámicamente)
        const productosSugeridos = [
            {
                id: 'sug1',
                nombre: 'Libreta Mágica',
                categoria: 'Cuadernos',
                precio: 45.99,
                imagen: 'img/productos/libreta-magica.jpg'
            },
            {
                id: 'sug2',
                nombre: 'Set de Resaltadores',
                categoria: 'Escritura',
                precio: 28.50,
                imagen: 'img/productos/resaltadores.jpg'
            },
            {
                id: 'sug3',
                nombre: 'Estuche Expandible',
                categoria: 'Accesorios',
                precio: 65.75,
                imagen: 'img/productos/estuche.jpg'
            },
            {
                id: 'sug4',
                nombre: 'Plumas Gel',
                categoria: 'Escritura',
                precio: 32.99,
                imagen: 'img/productos/plumas-gel.jpg'
            }
        ];

        // Generar HTML para las sugerencias
        productosSugeridos.forEach(producto => {
            const productoHTML = `
                <div class="producto-card sugerencia-card" data-id="${producto.id}">
                    <div class="producto-imagen">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <span class="producto-categoria">${producto.categoria}</span>
                        <div class="producto-precio">Bs ${producto.precio.toFixed(2)}</div>
                    </div>
                    <button class="btn-añadir-carrito">
                        <i class="fas fa-cart-plus"></i> Añadir
                    </button>
                </div>
            `;

            contenedorSugerencias.insertAdjacentHTML('beforeend', productoHTML);
        });

        // Configurar slider
        configurarSliderSugerencias();
    }

    // Configurar slider de sugerencias
    function configurarSliderSugerencias() {
        const sliderPrev = document.querySelector('.slider-prev');
        const sliderNext = document.querySelector('.slider-next');
        const sliderContainer = document.querySelector('.sugerencias-productos');

        if (!sliderPrev || !sliderNext || !sliderContainer) return;

        // Configurar eventos de botones
        sliderNext.addEventListener('click', function () {
            sliderContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        sliderPrev.addEventListener('click', function () {
            sliderContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }

    // Exponer funciones útiles globalmente (para uso desde otros scripts)
    window.carritoApp = {
        añadirProducto: function (producto) {
            const productoExistente = carrito.find(item => item.id === producto.id);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            guardarCarrito();
            actualizarContadorCarrito();
            animarIconoCarrito();

            return true;
        },

        contarProductos: function () {
            return carrito.reduce((total, item) => total + item.cantidad, 0);
        },

        obtenerCarrito: function () {
            return [...carrito];
        },

        vaciarCarrito: function () {
            carrito = [];
            guardarCarrito();
            actualizarContadorCarrito();
            return true;
        }
    };
});