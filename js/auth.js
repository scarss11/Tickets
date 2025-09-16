// Sistema de autenticación y gestión de tickets
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthSystem();
    initializeTicketSystem();
    checkAuthStatus();
});

// === SISTEMA DE AUTENTICACIÓN ===
function initializeAuthSystem() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    // Credenciales de demo
    if (email === 'admin@demo.com' && password === 'admin123') {
        // Simular almacenamiento de sesión
        sessionStorage.setItem('userType', 'admin');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', 'Administrador');
        
        showNotification('Bienvenido Administrador', 'success');
        setTimeout(() => {
            window.location.href = '../admin/dashboard.html';
        }, 1500);
    } else if (email === 'user@demo.com' && password === 'user123') {
        sessionStorage.setItem('userType', 'user');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', 'Usuario Demo');
        
        showNotification('Inicio de sesión exitoso', 'success');
        setTimeout(() => {
            window.location.href = '../user/tickets.html';
        }, 1500);
    } else {
        showNotification('Credenciales inválidas. Usa las credenciales de demo.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Simular registro exitoso
    showNotification('Registro exitoso. Redirigiendo al login...', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function logout() {
    sessionStorage.clear();
    showNotification('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1500);
}

function checkAuthStatus() {
    const userType = sessionStorage.getItem('userType');
    const currentPath = window.location.pathname;
    
    // Verificar si está en páginas protegidas
    if (currentPath.includes('/admin/') && userType !== 'admin') {
        showNotification('Acceso denegado. Redirigiendo...', 'error');
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 2000);
        return;
    }
    
    if (currentPath.includes('/user/') && !userType) {
        showNotification('Debes iniciar sesión. Redirigiendo...', 'error');
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 2000);
        return;
    }
}

// === SISTEMA DE TICKETS ===
function initializeTicketSystem() {
    const newTicketForm = document.getElementById('newTicketForm');
    
    if (newTicketForm) {
        newTicketForm.addEventListener('submit', handleNewTicket);
    }
    
    // Actualizar estadísticas si estamos en dashboard
    if (document.querySelector('.stats-grid')) {
        updateDashboardStats();
    }
}

function showNewTicketModal() {
    const modal = document.getElementById('newTicketModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

function hideNewTicketModal() {
    const modal = document.getElementById('newTicketModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Limpiar formulario
        const form = document.getElementById('newTicketForm');
        if (form) {
            form.reset();
        }
    }
}

function handleNewTicket(e) {
    e.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    
    if (!subject || !description) {
        showNotification('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Simular creación de ticket
    const ticketId = 'TK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    showNotification(`Ticket ${ticketId} creado exitosamente`, 'success');
    
    // Cerrar modal y limpiar formulario
    hideNewTicketModal();
    
    // Simular actualización de la lista (en una app real, harías una petición al servidor)
    setTimeout(() => {
        addTicketToList(ticketId, subject, description, priority);
    }, 1000);
}

function addTicketToList(ticketId, subject, description, priority) {
    const ticketsGrid = document.querySelector('.tickets-grid');
    if (!ticketsGrid) return;
    
    const priorityColors = {
        low: 'priority-low',
        medium: 'priority-medium', 
        high: 'priority-high'
    };
    
    const priorityTexts = {
        low: '🔵 Baja',
        medium: '⚠️ Media',
        high: '🔴 Alta'
    };
    
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';
    ticketCard.style.animationDelay = '0.2s';
    
    ticketCard.innerHTML = `
        <div class="ticket-header">
            <span class="ticket-id">#${ticketId}</span>
            <span class="status-badge open">Abierto</span>
        </div>
        <h3>${subject}</h3>
        <p>${description}</p>
        <div class="ticket-meta">
            <span class="meta-item">📅 ${new Date().toLocaleDateString()}</span>
            <span class="meta-item ${priorityColors[priority]}">${priorityTexts[priority]}</span>
        </div>
        <div class="ticket-actions">
            <button class="btn-small">Ver Detalles</button>
        </div>
    `;
    
    // Insertar al principio de la lista
    ticketsGrid.insertBefore(ticketCard, ticketsGrid.firstChild);
    
    // Animación de entrada
    ticketCard.style.opacity = '0';
    ticketCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        ticketCard.style.transition = 'all 0.5s ease';
        ticketCard.style.opacity = '1';
        ticketCard.style.transform = 'translateY(0)';
    }, 100);
}

function updateDashboardStats() {
    // Simular datos dinámicos
    const stats = {
        totalUsers: Math.floor(Math.random() * 500) + 1000,
        openTickets: Math.floor(Math.random() * 30) + 15,
        resolvedTickets: Math.floor(Math.random() * 400) + 600,
        satisfaction: (Math.random() * 3 + 95).toFixed(1)
    };
    
    // Actualizar elementos con animación
    updateStatWithAnimation('.stat-card:nth-child(1) .stat-number', stats.totalUsers.toLocaleString());
    updateStatWithAnimation('.stat-card:nth-child(2) .stat-number', stats.openTickets);
    updateStatWithAnimation('.stat-card:nth-child(3) .stat-number', stats.resolvedTickets.toLocaleString());
    updateStatWithAnimation('.stat-card:nth-child(4) .stat-number', stats.satisfaction + '%');
}

function updateStatWithAnimation(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // Animación de cambio
    element.style.transform = 'scale(1.1)';
    element.style.color = 'var(--accent-color)';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.color = 'var(--primary-color)';
    }, 300);
}

function showAddUserModal() {
    // Crear modal dinámicamente
    const modalHTML = `
        <div id="addUserModal" class="ticket-modal">
            <div class="modal-overlay" onclick="hideAddUserModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Agregar Nuevo Usuario</h3>
                    <button onclick="hideAddUserModal()" class="close-btn">✕</button>
                </div>
                <form id="addUserForm" class="ticket-form">
                    <div class="form-group">
                        <label for="newUserName">Nombre Completo</label>
                        <input type="text" id="newUserName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserEmail">Email</label>
                        <input type="email" id="newUserEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserRole">Rol</label>
                        <select id="newUserRole" name="role">
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-hero-primary">Crear Usuario</button>
                        <button type="button" onclick="hideAddUserModal()" class="btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Agregar event listener al formulario
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
}

function hideAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function handleAddUser(e) {
    e.preventDefault();
    
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const role = document.getElementById('newUserRole').value;
    
    if (!name || !email) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    showNotification(`Usuario ${name} agregado exitosamente`, 'success');
    hideAddUserModal();
    
    // En una app real, aquí harías la petición al servidor
    // y actualizarías la tabla
}

// === SISTEMA DE NOTIFICACIONES ===
function showNotification(message, type = 'info') {
    // Remover notificación existente si la hay
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };
    
    const typeColor = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${typeColor.bg};
        color: ${typeColor.color};
        border: 1px solid ${typeColor.border};
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
        animation: slideInNotification 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

// Agregar estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInNotification {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOutNotification {
        from { 
            transform: translateX(0); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%); 
            opacity: 0; 
        }
    }
`;

document.head.appendChild(notificationStyles);

// === MANEJO DE ERRORES ===
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

// Cerrar modales al hacer click en overlay
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.ticket-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Cerrar modales con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const visibleModal = document.querySelector('.ticket-modal[style*="block"]');
        if (visibleModal) {
            visibleModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});