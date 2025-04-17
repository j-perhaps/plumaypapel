// productos.js - Script para manejar datos de productos
document.addEventListener('DOMContentLoaded', function() {
    // Variables para control de paginación
    let paginaActual = 0;
    const productosPorPagina = 4;
    let todosLosProductos = [];
    let jsonYaCargado = false; // Flag para controlar si ya se cargó el JSON
    
    const contenedorProductos = document.getElementById('productos-dinamicos');
    const btnCargarMas = document.querySelector('.btn-cargar-mas');
    const contadorProductos = document.querySelector('.productos-count');

    // Función para crear una tarjeta de producto
    function crearTarjetaProducto(producto) {
        // Crear elemento div principal
        const card = document.createElement('div');
        card.className = 'producto-card';
        // Asignar ID único para identificar el producto
        card.dataset.id = producto.id || `product-${Math.random().toString(36).substr(2, 9)}`;
        
        // Determinar badge
        let badgeHTML = '';
        if (producto.discount) {
            badgeHTML = `<div class="producto-badge">¡-${producto.discount}%! 🎉</div>`;
        } else if (producto.isNew) {
            badgeHTML = `<div class="producto-badge badge-new">¡Nuevo! 🆕</div>`;
        } else if (producto.isEco) {
            badgeHTML = `<div class="producto-badge badge-eco">¡Eco! 🌱</div>`;
        } else if (producto.isHot) {
            badgeHTML = `<div class="producto-badge badge-hot">¡HOT! 🔥</div>`;
        }
        
        // Generar estrellas
        let starsHTML = '';
        if (producto.rating) {
            const fullStars = Math.floor(producto.rating);
            const halfStar = producto.rating % 1 >= 0.5;
            
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else if (i === fullStars && halfStar) {
                    starsHTML += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }
        } else {
            // Default: 4 estrellas
            starsHTML = `
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="far fa-star"></i>
            `;
        }
        
        // Información de precio
        let priceHTML = '';
        if (producto.oldPrice) {
            priceHTML = `
                <span class="producto-precio">Bs ${parseFloat(producto.price).toFixed(2)}</span>
                <span class="producto-precio-anterior">Bs ${parseFloat(producto.oldPrice).toFixed(2)}</span>
                <span class="producto-descuento">¡Ganga! 🤑</span>
            `;
        } else {
            priceHTML = `<span class="producto-precio">Bs ${parseFloat(producto.price).toFixed(2)}</span>`;
        }
        
        // Información de stock
        let stockHTML = '';
        if (producto.stock && producto.stock < 5) {
            stockHTML = `
                <div class="stock-info">
                    <i class="fas fa-fire"></i> ¡Se están acabando! Solo ${producto.stock} unidades
                </div>
            `;
        }
        
        // Etiquetas
        let tagsHTML = '';
        if (producto.tags && producto.tags.length) {
            tagsHTML = '<div class="producto-tags">';
            producto.tags.forEach(tag => {
                tagsHTML += `<span class="tag-item">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        // Construir HTML completo
        card.innerHTML = `
            ${badgeHTML}
            <button class="producto-favorito"><i class="far fa-heart"></i></button>
            <div class="producto-imagen">
                <img src="${producto.image || '/api/placeholder/200/200'}" alt="${producto.name}">
                <div class="imagen-overlay">
                    <span class="quick-view">¡Mírame de cerca! 👀</span>
                </div>
            </div>
            <div class="producto-info">
                <span class="producto-categoria">${producto.category || 'Sin categoría'}</span>
                <h3 class="producto-nombre">${producto.icon || ''} ${producto.name || 'Producto sin nombre'}</h3>
                <p class="producto-descripcion">${producto.description || 'Sin descripción'}</p>
                <div class="producto-precio-container">
                    ${priceHTML}
                </div>
                <div class="producto-rating">
                    <div class="producto-stars">
                        ${starsHTML}
                    </div>
                    <span class="producto-reviews">(${producto.reviews || '0'} fans)</span>
                </div>
                ${stockHTML}
                <div class="producto-accion">
                    <button class="btn-ver-producto">¡Quiero ver más! 👀</button>
                    <button class="btn-añadir-carrito" data-id="${card.dataset.id}"><i class="fas fa-shopping-cart"></i> ¡Mío!</button>
                </div>
                ${tagsHTML}
            </div>
        `;
        
        return card;
    }

    // Función para cargar productos desde JSON
    async function cargarProductos(cargaInicial = false) {
        console.log(`Cargando productos... (cargaInicial=${cargaInicial}, paginaActual=${paginaActual})`);
        
        try {
            // Solo cargar JSON si no se ha cargado antes
            if (!jsonYaCargado) {
                console.log('Cargando JSON por primera vez...');
                
                try {
                    const respuesta = await fetch('data/productos.json');
                    if (!respuesta.ok) {
                        throw new Error(`Error HTTP: ${respuesta.status}`);
                    }
                    
                    todosLosProductos = await respuesta.json();
                    jsonYaCargado = true; // Marcar como cargado
                    
                    // Solo limpiar el contenedor si es la carga inicial
                    if (cargaInicial) {
                        contenedorProductos.innerHTML = '';
                        paginaActual = 0;
                    }
                } catch (errorJson) {
                    console.error('Error al cargar JSON:', errorJson);
                    contenedorProductos.innerHTML = `
                        <div class="error-message">
                            <h3>¡Ups! No pudimos cargar los productos 😢</h3>
                            <p>Detalles: ${errorJson.message}</p>
                        </div>
                    `;
                    if (btnCargarMas) btnCargarMas.style.display = 'none';
                    return;
                }
            }
            
            // Verificar si hay productos
            if (todosLosProductos.length === 0) {
                contenedorProductos.innerHTML = '<p>No hay productos disponibles.</p>';
                if (btnCargarMas) btnCargarMas.style.display = 'none';
                return;
            }
            
            // Calcular qué productos mostrar en esta página
            const inicio = paginaActual * productosPorPagina;
            const fin = inicio + productosPorPagina;
            const productosAMostrar = todosLosProductos.slice(inicio, fin);
            
            console.log(`Mostrando productos ${inicio+1} a ${fin}`);
            
            // Añadir productos a la página sin eliminar los anteriores
            productosAMostrar.forEach(producto => {
                const tarjeta = crearTarjetaProducto(producto);
                contenedorProductos.appendChild(tarjeta);
                
                // Añadir animación con un pequeño retraso
                setTimeout(() => {
                    tarjeta.classList.add('visible');
                }, 100);
            });
            
            // Actualizar contador
            if (contadorProductos) {
                const totalMostrados = Math.min((paginaActual + 1) * productosPorPagina, todosLosProductos.length);
                contadorProductos.textContent = `Mostrando ${totalMostrados} de ${todosLosProductos.length} productos`;
            }
            
            // Mostrar u ocultar botón según si hay más productos
            if (btnCargarMas) {
                btnCargarMas.style.display = fin >= todosLosProductos.length ? 'none' : 'block';
            }
            
            // Incrementar página para próxima carga
            paginaActual++;
            
        } catch (error) {
            console.error('Error general:', error);
            if (contenedorProductos) {
                contenedorProductos.insertAdjacentHTML('beforeend', `
                    <div class="error-message">
                        <p>¡Error inesperado! ${error.message}</p>
                    </div>
                `);
            }
        }
    }

    // IMPORTANTE: Configurar el botón de cargar más correctamente
    if (btnCargarMas) {
        // Eliminar cualquier evento existente y crear uno nuevo
        btnCargarMas.replaceWith(btnCargarMas.cloneNode(true));
        
        // Obtener la referencia actualizada
        const newBtnCargarMas = document.querySelector('.btn-cargar-mas');
        
        // Agregar el evento correcto
        newBtnCargarMas.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Añadir indicador visual de carga
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            this.disabled = true;
            
            // CRUCIAL: pasar false para no reiniciar
            setTimeout(() => {
                cargarProductos(false).then(() => {
                    // Restaurar botón después de cargar
                    this.innerHTML = '¡Muéstrame más tesoros escolares! 🏴‍☠️';
                    this.disabled = false;
                });
            }, 500); // Pequeño retraso para mejor experiencia visual
        });
    }
    
    // Iniciar con carga inicial (true)
    cargarProductos(true);
    
    // Exponer funciones útiles globalmente
    window.productosApp = {
        cargarProductos: cargarProductos,
        obtenerTodosLosProductos: () => todosLosProductos,
        buscarProductos: (termino) => {
            termino = termino.toLowerCase();
            return todosLosProductos.filter(producto => 
                producto.name.toLowerCase().includes(termino) || 
                producto.description.toLowerCase().includes(termino) ||
                producto.category.toLowerCase().includes(termino)
            );
        }
    };
});