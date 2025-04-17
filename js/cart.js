// cart.js - Sistema de carrito de compras

// Inicializar el carrito
function initShoppingCart() {
    updateCartCount();
    
    // Si estamos en la página del carrito, mostrar los productos
    if (document.querySelector('.carrito-page')) {
        renderCartItems();
    }
}

// Clase Producto para gestionar mejor los productos
class Producto {
    constructor(id, nombre, precio, imagen, descripcion, categoria, cantidad = 1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.cantidad = cantidad;
    }
}

// Inicializar acciones de productos (añadir al carrito, etc.)
function initProductActions() {
    // Botones de añadir al carrito
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Obtener los datos del producto
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.id || generateProductId();
            const productName = productCard.querySelector('h3').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price-current').textContent.replace('$', ''));
            const productImg = productCard.querySelector('.product-img').src;
            const productCategory = productCard.dataset.category || 'general';
            
            // Crear objeto de producto
            const producto = new Producto(
                productId,
                productName,
                productPrice,
                productImg,
                productDescription,
                productCategory
            );
            
            // Añadir al carrito
            addToCart(producto);
            
            // Mostrar animación de producto añadido
            animateAddToCart(productCard);
            
            // Mostrar notificación
            showNotification(`¡${productName} añadido al carrito!`, 'success');
        });
    });
    
    // Generar ID único para productos que no lo tienen
    function generateProductId() {
        return 'prod_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Animación cuando se añade al carrito
    function animateAddToCart(productCard) {
        // Crear elemento para la animación
        const animatedElement = document.createElement('div');
        animatedElement.className = 'cart-animation';
        
        // Obtener posición del producto
        const productRect = productCard.getBoundingClientRect();
        
        // Obtener posición del icono del carrito
        const cartIcon = document.querySelector('.carrito-icon');
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Establecer imagen del producto
        const productImg = productCard.querySelector('.product-img').src;
        animatedElement.style.backgroundImage = `url(${productImg})`;
        
        // Posiciones iniciales
        animatedElement.style.top = `${productRect.top + window.scrollY}px`;
        animatedElement.style.left = `${productRect.left + productRect.width/2}px`;
        
        // Añadir al DOM
        document.body.appendChild(animatedElement);
        
        // Añadir estilo básico si no está en el CSS
        if (!document.querySelector('style#cart-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-animation-styles';
            style.textContent = `
                .cart-animation {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    pointer-events: none;
                    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .cart-animation.animate {
                    width: 20px;
                    height: 20px;
                    opacity: 0;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Iniciar animación
        setTimeout(() => {
            animatedElement.classList.add('animate');
            animatedElement.style.top = `${cartRect.top + window.scrollY}px`;
            animatedElement.style.left = `${cartRect.left + cartRect.width/2}px`;
            
            // Hacer que el carrito pulse
            cartIcon.classList.add('pulse');
            
            // Retirar elementos después de la animación
            setTimeout(() => {
                if (document.body.contains(animatedElement)) {
                    document.body.removeChild(animatedElement);
                }
                cartIcon.classList.remove('pulse');
            }, 800);
        }, 10);
    }
}

// Añadir producto al carrito
function addToCart(producto) {
    let cart = getCart();
    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === producto.id);
    
    if (existingProductIndex >= 0) {
        // Incrementar cantidad si ya existe
        cart[existingProductIndex].cantidad += 1;
    } else {
        // Añadir nuevo producto
        cart.push(producto);
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(cart));
    
    // Actualizar contador
    updateCartCount();
    
    // Si estamos en la página del carrito, actualizar la vista
    if (document.querySelector('.carrito-page')) {
        renderCartItems();
    }
}

// Obtener el carrito actual desde localStorage
function getCart() {
    const cartData = localStorage.getItem('carrito');
    return cartData ? JSON.parse(cartData) : [];
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    
    const cartCountElement = document.querySelector('.carrito-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        // Hacer visible o invisible según contenido
        if (totalItems > 0) {
            cartCountElement.classList.add('visible');
        } else {
            cartCountElement.classList.remove('visible');
        }
    }
}

// Remover producto del carrito
function removeFromCart(productId) {
    let cart = getCart();
    
    // Filtrar el producto a eliminar
    cart = cart.filter(item => item.id !== productId);
    
    // Guardar carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(cart));
    
    // Actualizar contador y vista
    updateCartCount();
    
    if (document.querySelector('.carrito-page')) {
        renderCartItems();
    }
}

// Actualizar cantidad de un producto
function updateProductQuantity(productId, quantity) {
    let cart = getCart();
    
    // Encontrar el producto
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex >= 0) {
        // Actualizar cantidad
        cart[productIndex].cantidad = Math.max(1, quantity);
        
        // Guardar carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(cart));
        
        // Actualizar contador y vista
        updateCartCount();
        
        if (document.querySelector('.carrito-page')) {
            renderCartItems();
        }
    }
}

// Vaciar el carrito completo
function clearCart() {
    localStorage.removeItem('carrito');
    updateCartCount();
    
    if (document.querySelector('.carrito-page')) {
        renderCartItems();
    }
}

// Renderizar productos del carrito en la página de carrito
function renderCartItems() {
    const cartContainer = document.querySelector('.carrito-items');
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        // Carrito vacío
        cartContainer.innerHTML = `
            <div class="carrito-vacio">
                <div class="carrito-vacio-icon">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <h3>¡Tu carrito está más vacío que una clase el viernes por la tarde!</h3>
                <p>Añade algunos productos útiles (o no tan útiles) para continuar</p>
                <a href="catalogo.html" class="btn-primary">Explorar productos</a>
            </div>
        `;
        // Ocultar el resumen si está vacío
        const cartSummary = document.querySelector('.carrito-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }
    
    // Mostrar el resumen
    const cartSummary = document.querySelector('.carrito-summary');
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    // Generar HTML para cada producto en el carrito
    let cartItemsHTML = '';
    
    cart.forEach(item => {
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        
        cartItemsHTML += `
            <div class="carrito-item" data-id="${item.id}">
                <div class="carrito-item-imagen">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="carrito-item-detalles">
                    <h3>${item.nombre}</h3>
                    <p class="carrito-item-descripcion">${item.descripcion}</p>
                    <div class="carrito-item-categoria">${item.categoria}</div>
                </div>
                <div class="carrito-item-precio">
                    <span>$${item.precio.toFixed(2)}</span>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad decrease">-</button>
                    <input type="number" min="1" value="${item.cantidad}" class="cantidad-input">
                    <button class="btn-cantidad increase">+</button>
                </div>
                <div class="carrito-item-subtotal">
                    <span>$${subtotal}</span>
                </div>
                <div class="carrito-item-acciones">
                    <button class="btn-remove" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // Actualizar el contenedor con los productos
    cartContainer.innerHTML = cartItemsHTML;
    
    // Actualizar resumen del carrito
    updateCartSummary();
    
    // Añadir event listeners para los botones de cantidad
    const decreaseButtons = document.querySelectorAll('.btn-cantidad.decrease');
    const increaseButtons = document.querySelectorAll('.btn-cantidad.increase');
    const removeButtons = document.querySelectorAll('.btn-remove');
    const quantityInputs = document.querySelectorAll('.cantidad-input');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.carrito-item');
            const productId = cartItem.dataset.id;
            const quantityInput = cartItem.querySelector('.cantidad-input');
            const currentQuantity = parseInt(quantityInput.value);
            
            if (currentQuantity > 1) {
                updateProductQuantity(productId, currentQuantity - 1);
            }
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.carrito-item');
            const productId = cartItem.dataset.id;
            const quantityInput = cartItem.querySelector('.cantidad-input');
            const currentQuantity = parseInt(quantityInput.value);
            
            updateProductQuantity(productId, currentQuantity + 1);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            
            // Animar la eliminación
            const cartItem = this.closest('.carrito-item');
            cartItem.classList.add('removing');
            
            setTimeout(() => {
                removeFromCart(productId);
            }, 300);
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.carrito-item');
            const productId = cartItem.dataset.id;
            const newQuantity = parseInt(this.value);
            
            if (newQuantity >= 1) {
                updateProductQuantity(productId, newQuantity);
            } else {
                this.value = 1;
                updateProductQuantity(productId, 1);
            }
        });
    });
    
    // Añadir event listener para el botón de vaciar carrito
    const clearCartButton = document.querySelector('.btn-clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres vaciar tu carrito? ¡Todos esos útiles escolares tan chulos se perderán!')) {
                clearCart();
                showNotification('Tu carrito ha sido vaciado', 'info');
            }
        });
    }
    
    // Añadir event listener para el botón de comprar
    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            processCheckout();
        });
    }
}

// Actualizar resumen del carrito
function updateCartSummary() {
    const summarySubtotal = document.querySelector('.summary-subtotal');
    const summaryShipping = document.querySelector('.summary-shipping');
    const summaryDiscount = document.querySelector('.summary-discount');
    const summaryTotal = document.querySelector('.summary-total');
    
    if (!summarySubtotal || !summaryTotal) return;
    
    const cart = getCart();
    
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const shipping = subtotal > 0 ? 4.99 : 0; // Envío gratuito si la compra supera $50
    const discount = 0; // Por ahora no hay descuento
    const total = subtotal + shipping - discount;
    
    // Actualizar valores en el DOM
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    if (summaryShipping) {
        summaryShipping.textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'Gratis';
    }
    
    if (summaryDiscount) {
        summaryDiscount.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
    }
    
    summaryTotal.textContent = `$${total.toFixed(2)}`;
    
    // Mensaje de envío gratuito
    const freeShippingMessage = document.querySelector('.free-shipping-message');
    if (freeShippingMessage) {
        const freeShippingThreshold = 50;
        const remaining = freeShippingThreshold - subtotal;
        
        if (remaining > 0) {
            freeShippingMessage.innerHTML = `¡Añade $${remaining.toFixed(2)} más para obtener <strong>envío gratis</strong>! <i class="fas fa-truck"></i>`;
            freeShippingMessage.style.display = 'block';
        } else {
            freeShippingMessage.innerHTML = `<i class="fas fa-check-circle"></i> ¡Genial! Has conseguido <strong>envío gratis</strong> <i class="fas fa-truck"></i>`;
            freeShippingMessage.style.display = 'block';
        }
    }
}

// Procesar checkout
function processCheckout() {
    // Aquí normalmente redirigirías a una pasarela de pago
    // Por ahora simularemos un checkout exitoso
    
    showNotification('¡Procesando tu pedido...', 'info');
    
    setTimeout(() => {
        showNotification('¡Pedido realizado con éxito! En breve recibirás un email de confirmación.', 'success');
        clearCart();
        
        // Redirigir a página de confirmación tras 2 segundos
        setTimeout(() => {
            // window.location.href = 'confirmacion.html';
            // Como no tenemos esa página, mostramos un mensaje
            alert('¡Gracias por tu compra! Los útiles escolares ya están volando hacia ti. 🚀📚✏️');
        }, 2000);
    }, 2000);
}