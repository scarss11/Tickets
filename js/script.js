// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    console.log('DVSCARS - Página cargada correctamente');

    // Inicializar todas las funcionalidades
    initScrollEffects();
    initCards();
    initAnimations();
    initParallax();
    initIntersectionObserver();
    highlightActiveLink();
    initHamburgerMenu(); // <--- AÑADIR ESTA LÍNEA
});

//======================================================================
// RESALTAR ENLACE DE NAVEGACIÓN ACTIVO
//======================================================================
function highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    // Obtiene el nombre del archivo de la URL actual (ej: "products.html")
    // Si está en la raíz, lo trata como "index.html"
    const pathSegments = window.location.pathname.split('/');
    let currentPage = pathSegments.pop() || pathSegments.pop(); // Maneja el caso de una barra final /
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    navLinks.forEach(link => {
        // Obtiene el nombre del archivo del atributo href del enlace
        const linkPage = link.getAttribute('href').split('/').pop();

        // Si el nombre del archivo del enlace coincide con el de la página actual, se activa
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}


//======================================================================
// OTRAS FUNCIONES (sin cambios)
//======================================================================

// Efectos de scroll
// Efectos de scroll
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    // SOLUCIÓN: Solo ejecuta la lógica si el navbar existe
    if (!navbar) {
        return;
    }

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // El resto de la función solo se ejecutará si navbar existe
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Interactividad de tarjetas
function initCards() {
    // Tarjetas flotantes en hero
    const floatingCards = document.querySelectorAll('.card-3d');

    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) rotateY(15deg) rotateX(5deg)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        });

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.icon-bg');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.icon-bg');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Animaciones generales
function initAnimations() {
    const buttons = document.querySelectorAll('button, .btn-hero-primary, .btn-hero-secondary');

    buttons.forEach(button => {
        button.addEventListener('click', function (event) { // <--- Se añade "event"
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', function () {
            this.style.backgroundSize = '200% 200%';
            this.style.animation = 'gradientShift 2s ease infinite';
        });

        text.addEventListener('mouseleave', function () {
            this.style.animation = 'none';
            this.style.backgroundSize = '100% 100%';
        });
    });
}

// Efectos de paralaje
function initParallax() {
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}


// Observer para animaciones al hacer scroll
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const elementsToObserve = [
        '.feature-card',
        '.hero-title',
        '.hero-description',
        '.section-header',
        '.cta-content'
    ];

    elementsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });
    });
}


// Utilidades adicionales
function addRippleEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar estilos adicionales
addRippleEffect();

// Funciones de utilidad para interacciones
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar scroll con throttle
const optimizedScrollHandler = throttle(() => {
    // Lógica optimizada de scroll aquí si es necesario
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Easter egg - Konami code
let konamiCode = [];
const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function (e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > correctCode.length) {
        konamiCode.shift();
    }

    if (konamiCode.toString() === correctCode.toString()) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = 'none';
            alert('🎉 ¡Has encontrado el easter egg de DVSCARS! 🚀');
        }, 2000);
    }
});

// Agregar animación rainbow para easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
// Clase para manejar el modal
class ModalManager {
    constructor() {
        this.modal = document.getElementById('infoModal');
        this.modalText = document.getElementById('modalText');
        this.links = document.querySelectorAll('a[data-modal-info]');
        this.hideTimeout = null;

        // === Agrega la verificación aquí ===
        if (this.modal) {
            this.init();
        }
    }

    bindEvents() {
        // Eventos para cada enlace
        this.links.forEach(link => {
            link.addEventListener('mouseenter', (e) => this.showModal(e));
            link.addEventListener('mouseleave', () => this.hideModal());
        });

        // Eventos para el modal
        this.modal.addEventListener('mouseenter', () => this.clearHideTimeout());
        this.modal.addEventListener('mouseleave', () => this.hideModal());

        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.modal') && !e.target.closest('a[data-modal-info]')) {
                this.hideModal();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }

    showModal(event) {
        this.clearHideTimeout();

        const link = event.target;
        const info = link.getAttribute('data-modal-info');

        if (!info) return;

        // Actualizar contenido
        this.modalText.textContent = info;

        // Posicionar modal
        this.positionModal(link);

        // Mostrar modal
        this.modal.classList.add('show');
    }

    hideModal() {
        this.hideTimeout = setTimeout(() => {
            this.modal.classList.remove('show');
        }, 100); // Pequeño delay para permitir hover sobre el modal
    }

    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    positionModal(triggerElement) {
        const rect = triggerElement.getBoundingClientRect();

        // Calcular posición - siempre arriba del enlace
        let left = rect.left + (rect.width / 2);
        let top = rect.top - 15; // Espacio entre el enlace y el modal

        // Ajustar horizontalmente si se sale de la pantalla
        const modalWidth = 280;
        const viewportWidth = window.innerWidth;

        // Calcular la posición real del modal considerando el transform
        let modalLeft = left - (modalWidth / 2);

        if (modalLeft < 20) {
            left = 20 + (modalWidth / 2);
        }

        if (modalLeft + modalWidth > viewportWidth - 20) {
            left = viewportWidth - modalWidth - 20 + (modalWidth / 2);
        }

        // Aplicar posición
        this.modal.style.left = left + 'px';
        this.modal.style.top = top + 'px';
        this.modal.style.transform = 'translate(-50%, -100%)';
    }

}
//======================================================================
// MENÚ HAMBURGUESA
//======================================================================
function initHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navContent = document.getElementById('navContent');

    if (!hamburgerMenu || !navContent) return;

    hamburgerMenu.addEventListener('click', function () {
        hamburgerMenu.classList.toggle('active');
        navContent.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (móvil)
    const navLinks = navContent.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburgerMenu.classList.remove('active');
            navContent.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera (móvil)
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768) {
            if (!hamburgerMenu.contains(event.target) && !navContent.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                navContent.classList.remove('active');
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    new ModalManager();
});
