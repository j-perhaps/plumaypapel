// Pluma & Papel - Script principal
// Este archivo contiene todas las funcionalidades JavaScript para la web

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funciones al cargar la página
    initPreloader();
    initMobileMenu();
    initCountdown();
    initTestimonialCarousel();
    initAOS();
    initCookieNotice();
    initSubscriptionForm();
    initShoppingCart();
    initProductCards();
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
});

// === 1. PRELOADER ===
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // Simular carga y ocultar preloader después de 1.5 segundos
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Añadir clase para animar entrada de contenido
            document.body.classList.add('content-loaded');
        }, 500);
    }, 1500);
}

// === 2. MENÚ MÓVIL ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuContainer = document.querySelector('.menu-container');
    
    if (!menuToggle || !menuContainer) return;
    
    menuToggle.addEventListener('click', function() {
        menuContainer.classList.toggle('active');
        this.classList.toggle('active');
        
        // Cambiar icono según estado
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const menuLinks = menuContainer.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Cerrar menú al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// === TEMPORIZADOR DE CUENTA REGRESIVA ===
function initCountdown() {
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');

    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;

    let countdownInterval = null;
    let targetDate = null;

    // Función para configurar manualmente la fecha objetivo
    function setTargetDate(year, month, day, hour = 0, minute = 0, second = 0) {
        targetDate = new Date(year, month - 1, day, hour, minute, second); // Meses en JavaScript son 0-indexados
        console.log(`Fecha objetivo configurada: ${targetDate}`);
        startCountdown();
    }

    // Función para iniciar el temporizador
    function startCountdown() {
        if (!targetDate) {
            console.error('No se ha configurado una fecha objetivo.');
            return;
        }

        // Limpiar cualquier intervalo previo
        clearInterval(countdownInterval);

        // Actualizar el temporizador inmediatamente
        updateCountdown();

        // Actualizar cada segundo
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Función para detener el temporizador
    function stopCountdown() {
        clearInterval(countdownInterval);
        console.log('Temporizador detenido.');
    }

    // Función para actualizar el temporizador
    function updateCountdown() {
        const currentDate = new Date();
        const difference = targetDate - currentDate;

        if (difference <= 0) {
            // La oferta ha terminado
            countdownDays.textContent = '0';
            countdownHours.textContent = '00';
            countdownMinutes.textContent = '00';
            countdownSeconds.textContent = '00';

            // Opcional: actualizar el banner cuando termina
            const promoBanner = document.querySelector('.promo-banner');
            if (promoBanner) {
                promoBanner.innerHTML = '<p><strong>¡OFERTA FINALIZADA!</strong> Pero tenemos otras increíbles ofertas para ti 🎁</p>';
            }

            clearInterval(countdownInterval);
            console.log('El temporizador ha finalizado.');
            return;
        }

        // Calcular tiempo restante
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Actualizar elementos DOM
        countdownDays.textContent = days;
        countdownHours.textContent = hours < 10 ? '0' + hours : hours;
        countdownMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
        countdownSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    // Configurar manualmente la fecha objetivo desde el JavaScript
    // Ejemplo: Configurar el temporizador para que termine el 5 de abril de 2025 a las 23:59:59
    setTargetDate(2025, 4, 1, 23, 59, 59);

    // Exponer funciones para control manual (opcional)
    window.startCountdown = startCountdown;
    window.stopCountdown = stopCountdown;
    window.setTargetDate = setTargetDate;
}
// === 4. CARRUSEL DE TESTIMONIOS ===
function initTestimonialCarousel() {
    const testimonioCards = document.querySelectorAll('.testimonio-card');
    const testimonioDots = document.querySelectorAll('.testimonio-dot');
    const prevButton = document.querySelector('.testimonio-prev');
    const nextButton = document.querySelector('.testimonio-next');
    
    if (!testimonioCards.length || !testimonioDots.length) return;
    
    let currentIndex = 0;
    const totalTestimonios = testimonioCards.length;
    
    // Función para actualizar el carrusel
    function updateCarousel(index) {
        // Remover clases activas
        testimonioCards.forEach(card => card.classList.remove('active'));
        testimonioDots.forEach(dot => dot.classList.remove('active'));
        
        // Aplicar nueva posición
        currentIndex = (index + totalTestimonios) % totalTestimonios;
        
        // Activar elementos actuales
        testimonioCards[currentIndex].classList.add('active');
        testimonioDots[currentIndex].classList.add('active');
    }
    
    // Event listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
        });
    }
    
    // Añadir eventos a los puntos
    testimonioDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });
    
    // Cambio automático cada 5 segundos
    const autoChangeInterval = setInterval(() => {
        updateCarousel(currentIndex + 1);
    }, 5000);
    
    // Detener cambio automático cuando el usuario interactúa
    const carouselContainer = document.querySelector('.testimonios-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoChangeInterval);
        });
        
        // Opcional: reiniciar al salir el ratón
        carouselContainer.addEventListener('mouseleave', () => {
            clearInterval(autoChangeInterval);
            const newInterval = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 5000);
        });
    }
    
    // Permitir deslizar en móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Deslizar izquierda
                updateCarousel(currentIndex + 1);
            } else if (touchEndX > touchStartX + 50) {
                // Deslizar derecha
                updateCarousel(currentIndex - 1);
            }
        }
    }
}

// === 5. ANIMACIONES DE SCROLL (AOS) ===
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
}

// === 6. AVISO DE COOKIES ===
function initCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');
    
    if (!cookieNotice) return;
    
    // Comprobar si ya se aceptaron las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (cookiesAccepted) {
        cookieNotice.style.display = 'none';
    } else {
        // Mostrar aviso con un poco de retraso para mejor UX
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 2000);
    }
    
    // Aceptar cookies
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.classList.remove('show');
            setTimeout(() => {
                cookieNotice.style.display = 'none';
            }, 500);
        });
    }
    
    // Rechazar cookies
    if (rejectCookiesBtn) {
        rejectCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            cookieNotice.classList.remove('show');
            setTimeout(() => {
                cookieNotice.style.display = 'none';
            }, 500);
        });
    }
}

// === 7. FORMULARIO DE SUSCRIPCIÓN ===
function initSubscriptionForm() {
    const subscriptionForm = document.getElementById('subscription-form');
    
    if (!subscriptionForm) return;
    
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showFormMessage(subscriptionForm, 'Por favor, introduce un email válido 📧', 'error');
            return;
        }
        
        // Simulación de envío (aquí irían las llamadas a tu API/backend)
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        // Simular retraso de servidor (eliminar en producción)
        setTimeout(() => {
            // Éxito
            emailInput.value = '';
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            showFormMessage(subscriptionForm, '¡Genial! Ya estás suscrito a nuestra newsletter 🎉', 'success');
            
            // Guardar en localStorage para recordar que está suscrito
            localStorage.setItem('subscribed', email);
        }, 1500);
    });
    
    // Validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Mostrar mensaje
    function showFormMessage(form, message, type) {
        // Eliminar mensajes anteriores
        const oldMessage = form.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
        
        // Crear nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insertar después del formulario
        form.insertAdjacentElement('afterend', messageElement);
        
        // Animar entrada
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Eliminar después de unos segundos si es éxito
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.remove('show');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 5000);
        }
    }
}

// === 8. CARRITO DE COMPRAS ===
function initShoppingCart() {
    const cartButtons = document.querySelectorAll('.btn-add-cart'); // Botones para añadir al carrito
    const cartCount = document.querySelector('.carrito-count'); // Contador del carrito

    if (!cartButtons.length || !cartCount) return;

    // Recuperar carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Añadir event listeners a los botones
    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card'); // Contenedor del producto
            if (!productCard) return;

            const productId = productCard.dataset.id; // ID único del producto
            const productTitle = productCard.querySelector('.product-title').textContent; // Nombre del producto
            const productImg = productCard.querySelector('.product-img').src; // Imagen del producto
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('Bs', '').trim()); // Precio del producto

            // Crear objeto del producto
            const product = {
                id: productId,
                title: productTitle,
                image: productImg,
                price: productPrice,
                quantity: 1
            };

            // Comprobar si el producto ya existe en el carrito
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                // Incrementar la cantidad si ya existe
                cart[existingProductIndex].quantity++;
            } else {
                // Añadir nuevo producto al carrito
                cart.push(product);
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Actualizar el contador del carrito
            updateCartCount();

            // Mostrar animación de añadido
            animateAddToCart(productCard);
        });
    });

    // Actualizar el contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Efecto visual si hay items
        if (totalItems > 0) {
            cartCount.classList.add('has-items');
        } else {
            cartCount.classList.remove('has-items');
        }
    }

    // Animación al añadir al carrito
    function animateAddToCart(productCard) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = '<i class="fas fa-check"></i> ¡Añadido al carrito!';

        // Añadir al producto
        productCard.appendChild(notification);

        // Animar
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Eliminar después de unos segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);

        // Animar icono de carrito
        const cartIcon = document.querySelector('.carrito-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => {
                cartIcon.classList.remove('shake');
            }, 500);
        }
    }
}

// === 9. INTERACTIVIDAD EN TARJETAS DE PRODUCTOS ===
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    if (!productCards.length) return;
    
    productCards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Click para ver detalles (opcional)
        const productImg = card.querySelector('.product-img');
        const productTitle = card.querySelector('h3');
        
        if (productImg) {
            productImg.addEventListener('click', function() {
                const productId = generateProductId(productTitle.textContent);
                window.location.href = `producto.html?id=${productId}`;
            });
        }
        
        if (productTitle) {
            productTitle.addEventListener('click', function() {
                const productId = generateProductId(this.textContent);
                window.location.href = `producto.html?id=${productId}`;
            });
        }
    });
    
    // Generar ID único para producto (duplicado para modularidad)
    function generateProductId(title) {
        return title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
}

// === 10. FUNCIONES ADICIONALES ===

// Detectar scroll para cambiar estilos del header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-container');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animación del botón de WhatsApp
const whatsappButton = document.querySelector('.whatsapp-button');
if (whatsappButton) {
    // Mostrar tooltip al hacer hover
    whatsappButton.addEventListener('mouseenter', function() {
        this.classList.add('show-tooltip');
    });
    
    whatsappButton.addEventListener('mouseleave', function() {
        this.classList.remove('show-tooltip');
    });
    
    // Animación periódica para llamar la atención
    setInterval(() => {
        whatsappButton.classList.add('pulse');
        setTimeout(() => {
            whatsappButton.classList.remove('pulse');
        }, 1000);
    }, 10000);
}

// Detectar código de descuento especial del footer
document.addEventListener('keydown', function(e) {
    const keys = [];
    const code = 'LEOLEGAL';
    let currentIndex = 0;
    
    // Detectar teclas presionadas
    window.addEventListener('keydown', function(e) {
        const key = e.key.toUpperCase();
        
        if (key === code[currentIndex]) {
            currentIndex++;
            
            if (currentIndex === code.length) {
                // Código completo ingresado
                showDiscountNotification();
                currentIndex = 0;
            }
        } else {
            currentIndex = 0;
        }
    });
    
    function showDiscountNotification() {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'discount-notification';
        notification.innerHTML = `
            <div class="discount-icon">🎁</div>
            <div class="discount-content">
                <h3>¡Felicidades, detective!</h3>
                <p>Has desbloqueado un 10% extra de descuento con el código <strong>LEOLEGAL</strong></p>
                <p>Aplícalo en tu próxima compra</p>
            </div>
            <button class="discount-close">×</button>
        `;
        
        // Añadir al body
        document.body.appendChild(notification);
        
        // Animar
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Botón de cerrar
        const closeButton = notification.querySelector('.discount-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Guardar en localStorage para recordar
        localStorage.setItem('specialDiscount', 'LEOLEGAL');
    }
});

// Animación de elementos "floating"
const floatingElements = document.querySelectorAll('.floating');
if (floatingElements.length) {
    floatingElements.forEach(element => {
        // Añadir animación aleatoria para que no todas se muevan igual
        const duration = 3 + Math.random() * 2; // Entre 3 y 5 segundos
        const delay = Math.random() * 1; // Entre 0 y 1 segundo
        
        element.style.animation = `floating ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Detectar cuando el usuario intenta salir (pop-up de recuperación)
let showExitIntent = true;

if (showExitIntent) {
    document.addEventListener('mouseleave', function(e) {
        // Solo activar si el ratón sale por la parte superior
        if (e.clientY < 0 && showExitIntent) {
            showExitPopup();
            // Solo mostrar una vez por sesión
            showExitIntent = false;
        }
    });
}

function showExitPopup() {
    // Verificar si ya lo ha visto
    const exitPopupSeen = sessionStorage.getItem('exitPopupSeen');
    if (exitPopupSeen) return;
    
    // Crear elemento popup
    const popup = document.createElement('div');
    popup.className = 'exit-popup';
    popup.innerHTML = `
        <div class="exit-popup-content">
            <button class="exit-popup-close">×</button>
            <div class="exit-popup-image">
                <img src="img/sad-pencil.svg" alt="Lápiz triste">
            </div>
            <h3>¡Espera! ¿Ya te vas? 😢</h3>
            <p>Quedate un ratito mas, talves algo te interese</p>
            
            <button class="btn-primary exit-cta">¡Me quiero quedar!</button>
        </div>
    `;
    
    // Añadir al body
    document.body.appendChild(popup);
    
    // Animar
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Botón de cerrar
    const closeButton = popup.querySelector('.exit-popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
            
            // Guardar en sessionStorage
            sessionStorage.setItem('exitPopupSeen', 'true');
        });
    }
    
    // Botón de CTA
    const ctaButton = popup.querySelector('.exit-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Redirigir a la página de catálogo
            window.location.href = 'catalogo.html?promo=BIENVENIDO5';
        });
    }
}

// === 11. COMPROBACIONES DE COMPATIBILIDAD ===
// Comprobar si el navegador es compatible con todas las funciones
function checkCompatibility() {
    // Verificar soporte de localStorage
    const isLocalStorageSupported = (function() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch(e) {
            return false;
        }
    })();
    
    // Si no es compatible, mostrar mensaje
    if (!isLocalStorageSupported) {
        console.warn('Tu navegador no admite almacenamiento local. Algunas funciones pueden no estar disponibles.');
    }
    
    // Comprobar si está en modo incógnito
    const isIncognito = !isLocalStorageSupported;
    
    if (isIncognito) {
        console.info('Parece que estás navegando en modo incógnito. El carrito y preferencias no se guardarán.');
    }
}

// Ejecutar comprobación
checkCompatibility();

// === 12. MOSTRAR PRODUCTOS EN EL CARRITO ===
function loadCartItems() {
    const cartContainer = document.getElementById('cart-items'); // Contenedor del carrito
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Limpiar el contenedor
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    // Mostrar los productos en el carrito
    cart.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h3>${product.title}</h3>
                <p>Precio: Bs ${product.price.toFixed(2)}</p>
                <p>Cantidad: ${product.quantity}</p>
            </div>
            <button class="btn-remove" data-id="${product.id}">Eliminar</button>
        `;
        cartContainer.appendChild(item);
    });

    // Añadir funcionalidad para eliminar productos
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.id;
            removeFromCart(productId);
        });
    });
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    initShoppingCart(); // Actualizar el contador del carrito
}