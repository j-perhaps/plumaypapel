document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const cookieConsent = document.getElementById('cookieConsent');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const toastPromo = document.getElementById('toastPromo');
    const exitPopup = document.getElementById('exitPopup');
    
    // Toggle para menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });

    // Animación de WhatsApp flotante
    if (whatsappFloat) {
        setTimeout(() => {
            whatsappFloat.classList.add('visible');
        }, 2000);
        
        // Animación de pulso cada 5 segundos
        setInterval(() => {
            whatsappFloat.classList.add('pulse');
            setTimeout(() => {
                whatsappFloat.classList.remove('pulse');
            }, 1000);
        }, 5000);
    }
    
    // Mostrar Toast promocional después de 5 segundos
    if (toastPromo) {
        setTimeout(() => {
            toastPromo.classList.add('show');
            
            // Auto ocultar después de 10 segundos
            setTimeout(() => {
                toastPromo.classList.remove('show');
            }, 10000);
        }, 5000);
        
        // Cerrar Toast al hacer clic en el botón de cerrar
        const toastClose = toastPromo.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => {
                toastPromo.classList.remove('show');
            });
        }
    }
    
    // Gestión de cookies
    if (cookieConsent) {
        // Comprobar si ya se aceptaron las cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieConsent.classList.add('active');
            }, 1500);
            
            // Botones de cookies
            const acceptBtn = cookieConsent.querySelector('.btn-cookie-accept');
            const denyBtn = cookieConsent.querySelector('.btn-cookie-deny');
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieConsent.classList.remove('active');
                });
            }
            
            if (denyBtn) {
                denyBtn.addEventListener('click', () => {
                    // Añadir efecto divertido
                    denyBtn.textContent = "Ok, acepto 😅";
                    setTimeout(() => {
                        localStorage.setItem('cookiesAccepted', 'true');
                        cookieConsent.classList.remove('active');
                    }, 1000);
                });
            }
        }
    }
    
    // Contador regresivo para ofertas
    const countdowns = document.querySelectorAll('.offer-countdown');
    countdowns.forEach(countdown => {
        const expiryDate = countdown.getAttribute('data-expires');
        
        if (expiryDate) {
            const updateCountdown = () => {
                const now = new Date();
                const expiry = new Date(expiryDate);
                const timeLeft = expiry - now;
                
                if (timeLeft <= 0) {
                    countdown.querySelector('.countdown-text').textContent = "¡Oferta expirada!";
                    return;
                }
                
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                
                let countdownText = "";
                if (days > 0) {
                    countdownText = `${days} día${days !== 1 ? 's' : ''}`;
                } else if (hours > 0) {
                    countdownText = `${hours} hora${hours !== 1 ? 's' : ''}`;
                } else {
                    countdownText = `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
                }
                
                countdown.querySelector('.countdown-text').textContent = countdownText;
            };
            
            // Actualizar cada minuto
            updateCountdown();
            setInterval(updateCountdown, 60000);
        }
    });
    
    // Popup de salida
    if (exitPopup) {
        let popupShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            // Detectar si el cursor sale por la parte superior de la página
            if (!popupShown && e.clientY < 0 && !localStorage.getItem('exitPopupShown')) {
                exitPopup.classList.add('show');
                popupShown = true;
            }
        });
        
        // Cerrar popup
        const popupClose = exitPopup.querySelector('.popup-close');
        if (popupClose) {
            popupClose.addEventListener('click', () => {
                exitPopup.classList.remove('show');
                localStorage.setItem('exitPopupShown', 'true');
            });
        }
        
        // Botón de copiar código
        const btnCopy = exitPopup.querySelector('.btn-copy');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const code = btnCopy.getAttribute('data-code');
                navigator.clipboard.writeText(code);
                btnCopy.textContent = "¡Copiado!";
                setTimeout(() => {
                    btnCopy.textContent = "Copiar";
                }, 2000);
            });
        }
    }
    
    // Botones con efecto de pulso
    const pulseButtons = document.querySelectorAll('.btn-pulse');
    if (pulseButtons.length > 0) {
        // Agregar clase de pulso cada 3 segundos
        setInterval(() => {
            pulseButtons.forEach(btn => {
                btn.classList.add('pulsate');
                setTimeout(() => {
                    btn.classList.remove('pulsate');
                }, 1000);
            });
        }, 3000);
    }
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Animación al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('aos-animate');
            }
        });
    };
    
    // Inicializar animaciones
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Animar elementos visibles al cargar
});