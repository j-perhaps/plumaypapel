// Script para manejar el buscador y filtrado de productos
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos principales
    const buscadorInput = document.getElementById('buscador');
    const btnCategorias = document.querySelectorAll('.btn-categoria');
    const ordenarSelect = document.getElementById('ordenar');
    const productosContainer = document.querySelector('.productos-container');
    const productosDinamicos = document.getElementById('productos-dinamicos');
    
    // Selectores para filtros avanzados
    const btnFiltros = document.querySelector('.btn-filtros');
    const filtrosDropdown = document.getElementById('filtros-dropdown');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const colorOptions = document.querySelectorAll('.color-option');
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const btnAplicarFiltros = document.querySelector('.btn-aplicar-filtros');
    const btnLimpiarFiltros = document.querySelector('.btn-limpiar-filtros');
    
    // Estado de los filtros
    let filtros = {
        busqueda: '',
        categoria: 'todos',
        precioMax: 500,
        colores: [],
        tipos: []
    };
    
    // Mostrar/ocultar el dropdown de filtros avanzados
    if (btnFiltros) {
        btnFiltros.addEventListener('click', function() {
            filtrosDropdown.classList.toggle('active');
        });
    }
    
    // Actualizar el valor del precio mientras se desliza
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            filtros.precioMax = this.value;
            priceValue.textContent = `Bs ${this.value} (${getPrecioEstado(this.value)})`;
        });
    }
    
    // Función para determinar el texto basado en el precio
    function getPrecioEstado(precio) {
        if (precio < 200) return "Pobre de mí 😢";
        if (precio < 700) return "Normal 😊";
        return "¡Rico! 🤑";
    }
    
    // Manejar selección de colores
    colorOptions.forEach(color => {
        color.addEventListener('click', function() {
            this.classList.toggle('selected');
            const colorRGB = this.style.backgroundColor;
            
            if (this.classList.contains('selected')) {
                if (!filtros.colores.includes(colorRGB)) {
                    filtros.colores.push(colorRGB);
                }
            } else {
                filtros.colores = filtros.colores.filter(c => c !== colorRGB);
            }
        });
    });
    
    // Manejar selección de tipos de productos
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const tipoTexto = this.parentElement.textContent.trim().split('(')[0].trim();
            
            if (this.checked) {
                if (!filtros.tipos.includes(tipoTexto)) {
                    filtros.tipos.push(tipoTexto);
                }
            } else {
                filtros.tipos = filtros.tipos.filter(t => t !== tipoTexto);
            }
        });
    });
    
    // Aplicar filtros
    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', function() {
            filtrarProductos();
            filtrosDropdown.classList.remove('active');
        });
    }
    
    // Limpiar filtros
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', function() {
            // Resetear estado de filtros
            filtros = {
                busqueda: buscadorInput ? buscadorInput.value : '',
                categoria: 'todos',
                precioMax: 500,
                colores: [],
                tipos: []
            };
            
            // Resetear UI
            if (priceRange) priceRange.value = 500;
            if (priceValue) priceValue.textContent = "Bs 500 (Normal 😊)";
            
            colorOptions.forEach(color => {
                color.classList.remove('selected');
            });
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Re-aplicar filtros (en este caso mostrar todo)
            filtrarProductos();
        });
    }
    
    // Manejar búsqueda en tiempo real
    if (buscadorInput) {
        buscadorInput.addEventListener('input', function() {
            filtros.busqueda = this.value.toLowerCase();
            filtrarProductos();
        });
    }
    
    // Manejar selección de categorías
    btnCategorias.forEach(btn => {
        btn.addEventListener('click', function() {
            btnCategorias.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const categoria = this.textContent.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/g, '').trim();
            filtros.categoria = categoria === 'Todo' ? 'todos' : categoria;
            filtrarProductos();
        });
    });
    
    // Manejar ordenación
    if (ordenarSelect) {
        ordenarSelect.addEventListener('change', function() {
            ordenarProductos(this.value);
        });
    }
    
    // Función principal para filtrar productos
    function filtrarProductos() {
        const todosProductos = document.querySelectorAll('.producto-card');
        let contadorVisibles = 0;
        
        todosProductos.forEach(producto => {
            let coincideBusqueda = true;
            let coincideCategoria = true;
            let coincidePrecio = true;
            let coincideColor = filtros.colores.length === 0;
            let coincideTipo = filtros.tipos.length === 0;
            
            // Filtrar por texto de búsqueda
            if (filtros.busqueda) {
                const nombre = producto.querySelector('.producto-nombre').textContent.toLowerCase();
                const descripcion = producto.querySelector('.producto-descripcion').textContent.toLowerCase();
                coincideBusqueda = nombre.includes(filtros.busqueda) || descripcion.includes(filtros.busqueda);
            }
            
            // Filtrar por categoría
            if (filtros.categoria !== 'todos') {
                const categoriaProducto = producto.querySelector('.producto-categoria').textContent.toLowerCase();
                coincideCategoria = categoriaProducto.includes(filtros.categoria.toLowerCase());
            }
            
            // Filtrar por precio
            const precioTexto = producto.querySelector('.producto-precio').textContent;
            const precio = parseFloat(precioTexto.replace(/[^\d.]/g, ''));
            coincidePrecio = precio <= filtros.precioMax;
            
            // Filtrar por color (simulado, en realidad necesitaríamos datos de color en el HTML)
            if (filtros.colores.length > 0) {
                // Esta es una simulación - en un caso real necesitaríamos tener esta info en el HTML
                const colorRandom = Math.random() > 0.5;
                coincideColor = colorRandom;
            }
            
            // Filtrar por tipo (simulado, basado en la categoría del producto)
            if (filtros.tipos.length > 0) {
                const categoriaProducto = producto.querySelector('.producto-categoria').textContent;
                coincideTipo = filtros.tipos.some(tipo => tipo.toLowerCase().includes(categoriaProducto.toLowerCase()));
            }
            
            // Mostrar u ocultar el producto según los filtros
            if (coincideBusqueda && coincideCategoria && coincidePrecio && coincideColor && coincideTipo) {
                producto.style.display = 'flex';
                contadorVisibles++;
            } else {
                producto.style.display = 'none';
            }
        });
        
        // Actualizar contador de productos
        const productosCount = document.querySelector('.productos-count');
        if (productosCount) {
            productosCount.textContent = `Mostrando ${contadorVisibles} producto(s)`;
        }
        
        // Mensaje si no hay resultados
        if (contadorVisibles === 0) {
            mostrarMensajeNoResultados();
        } else {
            ocultarMensajeNoResultados();
        }
    }
    
    // Mostrar mensaje de no resultados
    function mostrarMensajeNoResultados() {
        let mensajeNoResultados = document.querySelector('.no-resultados');
        
        if (!mensajeNoResultados) {
            mensajeNoResultados = document.createElement('div');
            mensajeNoResultados.className = 'no-resultados';
            mensajeNoResultados.innerHTML = `
                <i class="fas fa-search fa-3x"></i>
                <h3>¡Ups! No encontramos nada 😢</h3>
                <p>¿Quizás buscabas algo demasiado cool? Intenta con otras palabras o filtros menos estrictos.</p>
                <button class="btn-primary">Ver todos los productos</button>
            `;
            
            if (productosDinamicos) {
                productosDinamicos.appendChild(mensajeNoResultados);
            } else if (productosContainer) {
                productosContainer.after(mensajeNoResultados);
            }
            
            // Botón para resetear filtros
            const resetBtn = mensajeNoResultados.querySelector('button');
            resetBtn.addEventListener('click', resetearFiltros);
        } else {
            mensajeNoResultados.style.display = 'flex';
        }
    }
    
    // Ocultar mensaje de no resultados
    function ocultarMensajeNoResultados() {
        const mensajeNoResultados = document.querySelector('.no-resultados');
        if (mensajeNoResultados) {
            mensajeNoResultados.style.display = 'none';
        }
    }
    
    // Resetear todos los filtros
    function resetearFiltros() {
        if (buscadorInput) buscadorInput.value = '';
        
        btnCategorias.forEach(btn => {
            if (btn.textContent.includes('¡Todo!')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        if (priceRange) priceRange.value = 500;
        if (priceValue) priceValue.textContent = "Bs 500 (Normal 😊)";
        
        colorOptions.forEach(color => {
            color.classList.remove('selected');
        });
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        filtros = {
            busqueda: '',
            categoria: 'todos',
            precioMax: 500,
            colores: [],
            tipos: []
        };
        
        filtrarProductos();
        
        if (filtrosDropdown) {
            filtrosDropdown.classList.remove('active');
        }
    }
    
    // Ordenar productos
    function ordenarProductos(criterio) {
        const productos = Array.from(document.querySelectorAll('.producto-card'));
        
        productos.sort((a, b) => {
            switch (criterio) {
                case 'nombre':
                    const nombreA = a.querySelector('.producto-nombre').textContent;
                    const nombreB = b.querySelector('.producto-nombre').textContent;
                    return nombreA.localeCompare(nombreB);
                    
                case 'precio-asc':
                    const precioA = parseFloat(a.querySelector('.producto-precio').textContent.replace(/[^\d.]/g, ''));
                    const precioB = parseFloat(b.querySelector('.producto-precio').textContent.replace(/[^\d.]/g, ''));
                    return precioA - precioB;
                    
                case 'precio-desc':
                    const precioADesc = parseFloat(a.querySelector('.producto-precio').textContent.replace(/[^\d.]/g, ''));
                    const precioBDesc = parseFloat(b.querySelector('.producto-precio').textContent.replace(/[^\d.]/g, ''));
                    return precioBDesc - precioADesc;
                    
                case 'mas-vendidos':
                    // Simulamos "más vendidos" basado en las reviews
                    const reviewsA = parseInt(a.querySelector('.producto-reviews').textContent.match(/\d+/)[0] || 0);
                    const reviewsB = parseInt(b.querySelector('.producto-reviews').textContent.match(/\d+/)[0] || 0);
                    return reviewsB - reviewsA;
                    
                default:
                    // Por defecto, ordenar por relevancia (simulada)
                    return Math.random() - 0.5;
            }
        });
        
        // Reordenar los productos en el DOM
        const container = productos[0].parentElement;
        productos.forEach(producto => {
            container.appendChild(producto);
        });
    }
    
    // Ejecutar filtrado inicial para asegurarnos que todo está correcto
    setTimeout(filtrarProductos, 500);
    
    // Estilos CSS adicionales inyectados para la funcionalidad
    const estilos = document.createElement('style');
    estilos.textContent = `
        .no-resultados {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 10px;
            margin: 2rem auto;
            max-width: 600px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .no-resultados i {
            color: #6c757d;
            margin-bottom: 1rem;
        }
        
        .no-resultados h3 {
            color: #343a40;
            margin-bottom: 0.5rem;
        }
        
        .no-resultados p {
            color: #6c757d;
            margin-bottom: 1.5rem;
        }
        
        .color-option.selected {
            transform: scale(1.2);
            box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
        }
        
        #filtros-dropdown.active {
            display: block;
        }
    `;
    document.head.appendChild(estilos);
});
// Función para inicializar el cronómetro
function iniciarCronometro() {
    // Establecer la fecha final de la promoción (puedes ajustar según tus necesidades)
    // Fecha actual + 3 días como ejemplo
    const fechaFinal = new Date();
    fechaFinal.setDate(fechaFinal.getDate() + 3);
    fechaFinal.setHours(23, 59, 59);
    
    // Referencias a los elementos del DOM
    const diasElement = document.getElementById('dias');
    const horasElement = document.getElementById('horas');
    const minutosElement = document.getElementById('minutos');
    const segundosElement = document.getElementById('segundos');
    
    // Función para actualizar el cronómetro
    function actualizarCronometro() {
        // Fecha actual
        const ahora = new Date();
        
        // Diferencia en milisegundos
        const diferencia = fechaFinal - ahora;
        
        // Si la promoción ya terminó
        if (diferencia <= 0) {
            diasElement.textContent = '00';
            horasElement.textContent = '00';
            minutosElement.textContent = '00';
            segundosElement.textContent = '00';
            
            // Opcional: mostrar mensaje de promoción terminada
            document.querySelector('.countdown-msg').textContent = '¡La promoción ha terminado!';
            
            // Detener el cronómetro
            clearInterval(intervalo);
            return;
        }
        
        // Calcular días, horas, minutos y segundos
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
        
        // Actualizar el DOM con los valores calculados (añadiendo ceros a la izquierda si es necesario)
        diasElement.textContent = dias < 10 ? '0' + dias : dias;
        horasElement.textContent = horas < 10 ? '0' + horas : horas;
        minutosElement.textContent = minutos < 10 ? '0' + minutos : minutos;
        segundosElement.textContent = segundos < 10 ? '0' + segundos : segundos;
    }
    
    // Actualizar inmediatamente y luego cada segundo
    actualizarCronometro();
    const intervalo = setInterval(actualizarCronometro, 1000);
    
    return intervalo; // Devuelve el ID del intervalo por si necesitas detenerlo externamente
}

// Función para configurar la fecha final manualmente
function configurarFechaFinal(dias, horas, minutos, segundos) {
    const fechaFinal = new Date();
    fechaFinal.setDate(fechaFinal.getDate() + parseInt(dias));
    fechaFinal.setHours(
        fechaFinal.getHours() + parseInt(horas),
        fechaFinal.getMinutes() + parseInt(minutos),
        fechaFinal.getSeconds() + parseInt(segundos)
    );
    return fechaFinal;
}

// Función para establecer valores fijos en el cronómetro (para demostración)
function setValoresFijos(dias, horas, minutos, segundos) {
    document.getElementById('dias').textContent = dias < 10 ? '0' + dias : dias;
    document.getElementById('horas').textContent = horas < 10 ? '0' + horas : horas;
    document.getElementById('minutos').textContent = minutos < 10 ? '0' + minutos : minutos;
    document.getElementById('segundos').textContent = segundos < 10 ? '0' + segundos : segundos;
}

// Manejar el botón para copiar el código de promoción
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar el cronómetro cuando se carga la página
    const cronometroID = iniciarCronometro();
    
    // Configurar el botón para copiar el código
    const botonCopiar = document.querySelector('.btn-copiar-codigo');
    if (botonCopiar) {
        botonCopiar.addEventListener('click', function() {
            const codigo = document.querySelector('.code').textContent;
            navigator.clipboard.writeText(codigo)
                .then(() => {
                    // Cambiar el texto del botón temporalmente
                    const textoOriginal = this.textContent;
                    this.textContent = '¡Código copiado! 👍';
                    
                    // Volver al texto original después de 2 segundos
                    setTimeout(() => {
                        this.textContent = textoOriginal;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar el código: ', err);
                    alert('No se pudo copiar el código. Por favor, cópialo manualmente: SOYCOOL2025');
                });
        });
    }
});

// Exportar funciones para uso externo si es necesario
window.promoTools = {
    iniciarCronometro,
    configurarFechaFinal,
    setValoresFijos
};