document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const randomMessageElement = document.getElementById('random-message');
    const loginErrorDiv = document.querySelector('.login-error');
    const panicButton = document.querySelector('.panic-button');
    
    // Array de mensajes divertidos aleatorios
    const funnyMessages = [
        "Consejo del día: Si escribes tu contraseña incorrectamente, nuestro hamster administrativo se enojará mucho. 🐹",
        "Dato curioso: El 23% de las contraseñas administrativas contiene el nombre de una mascota. ¡Guau! 🐶",
        "¿Sabías que? Algunos usuarios piensan que 'Contraseña123' es una buena contraseña. Esos usuarios están equivocados. 🤦‍♂️",
        "Aviso importante: Mirar fijamente a esta pantalla durante 10 horas puede causar fatiga ocular y un deseo insaciable de helado. 🍦",
        "Información técnica: Nuestros servidores funcionan con risas de unicornio y polvo de hadas. ✨",
        "Alerta: Si olvidas tu contraseña tres veces seguidas, tendrás que cantar el himno de la empresa en la próxima reunión. 🎤",
        "Recuerda: Una buena contraseña es como un buen chiste. Nadie debería poder adivinarla. 😂",
        "Nota mental: El café ayuda a recordar contraseñas. La ciencia aún no sabe por qué. ☕",
        "Atención: Nuestro sistema detecta niveles de frustración. Respira profundo y cuenta hasta 10. 🧘‍♂️",
        "Estado del servidor: Funcionando perfectamente desde hace 3 horas y 42 minutos. ¡Nuevo récord! 🏆"
    ];
    
    // Contador de intentos fallidos
    let failedAttempts = 0;
    
    // Función para mostrar un mensaje aleatorio
    function showRandomMessage() {
        const randomIndex = Math.floor(Math.random() * funnyMessages.length);
        randomMessageElement.textContent = funnyMessages[randomIndex];
        
        // Efecto de aparición con fade
        randomMessageElement.style.opacity = 0;
        setTimeout(() => {
            randomMessageElement.style.opacity = 1;
        }, 100);
    }
    
    // Mostrar un mensaje aleatorio al cargar la página
    showRandomMessage();
    
    // Cambiar el mensaje cada 15 segundos
    setInterval(showRandomMessage, 15000);
    
    // Función para alternar la visibilidad de la contraseña
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el ícono del botón
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
    
    // Manejar el envío del formulario
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Simulación de validación (en producción esto se haría en el servidor)
        if (username === 'plumaypapel' && password === 'chompiras2025') {
            // Login exitoso
            loginSuccessful();
        } else {
            // Login fallido
            loginFailed();
        }
    });
    
    // Función para login exitoso
    function loginSuccessful() {
        // Animación de éxito
        document.querySelector('.login-card').classList.add('success');
        
        // Redireccionar después de un momento
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }
    
    // Función para login fallido
    function loginFailed() {
        failedAttempts++;
        
        // Mostrar el mensaje de error
        loginErrorDiv.style.display = 'block';
        
        // Animación de sacudida en el formulario
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
        
        // Animar la barra de progreso "de seguridad"
        const secureBar = document.querySelector('.secure-bar');
        secureBar.style.width = '0%';
        
        setTimeout(() => {
            secureBar.style.width = '100%';
            
            // Después de la animación, mostrar un consejo divertido
            setTimeout(() => {
                document.querySelector('.secure-text').textContent = 
                    failedAttempts > 2 
                        ? "¿Has probado con 'por favor'? A veces la cortesía funciona. 🎩" 
                        : "Verificación completada. Resultado: ¡Eres humano, pero olvidadizo! 🧠";
            }, 1500);
        }, 100);
        
        // Limpiar el campo de contraseña
        passwordInput.value = '';
        passwordInput.focus();
    }
    
    // Función del "Botón de Pánico"
    panicButton.addEventListener('click', () => {
        // Redirigir a un sitio "seguro" como Google
        const safeUrl = 'https://www.google.com/search?q=hojas+de+cálculo+aburridas';
        
        // Guardar los datos del formulario en localStorage para recuperarlos después
        localStorage.setItem('username', usernameInput.value);
        localStorage.setItem('remember', document.getElementById('remember').checked);
        
        window.location.href = safeUrl;
    });
    
    // Recuperar datos guardados si existen
    if (localStorage.getItem('username') && localStorage.getItem('remember') === 'true') {
        usernameInput.value = localStorage.getItem('username');
        document.getElementById('remember').checked = true;
    }
    
    // Animación para los elementos flotantes
    const floatingItems = document.querySelectorAll('.floating-item');
    floatingItems.forEach(item => {
        // Posición inicial aleatoria
        const startX = Math.random() * 10 - 5;
        const startY = Math.random() * 10 - 5;
        
        // Aplicar animación CSS
        item.style.animation = `float 8s infinite ease-in-out ${Math.random() * 5}s`;
        item.style.transform = `translate(${startX}px, ${startY}px)`;
    });
    
    // Añadir funcionalidad al enlace de contraseña olvidada
    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Mostrar un mensaje divertido en lugar de la funcionalidad real
        alert('🕵️‍♂️ Investigación en curso: Nuestros detectives de contraseñas están buscando la tuya. Mientras tanto, intenta recordar dónde la anotaste... ¿Post-it amarillo? ¿Reverso de una factura? ¿La frente de tu compañero mientras dormía?');
    });
    
    // Agregar animación CSS para el float de los elementos decorativos
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(5px, -5px) rotate(5deg); }
            50% { transform: translate(0, -10px) rotate(0deg); }
            75% { transform: translate(-5px, -5px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .success {
            animation: success-pulse 1.5s ease-in-out;
        }
        
        @keyframes success-pulse {
            0% { box-shadow: 0 0 0 0 rgba(72, 199, 116, 0.7); }
            50% { box-shadow: 0 0 0 20px rgba(72, 199, 116, 0); }
            100% { box-shadow: 0 0 0 0 rgba(72, 199, 116, 0); }
        }
    `;
    document.head.appendChild(styleElement);
});