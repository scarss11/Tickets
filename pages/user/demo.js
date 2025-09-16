// === SISTEMA DE TICKETS MEJORADO ===
let ticketCounter = 4;
let draftCounter = 2;

// === GESTIÓN DE MODALES ===
function showNewTicketModal(type = 'active') {
    const modal = document.getElementById('newTicketModal');
    const modalTitle = document.getElementById('modalTitle');
    const ticketType = document.getElementById('ticketType');
    const submitBtn = document.getElementById('submitBtn');
    
    modalTitle.textContent = type === 'draft' ? 'Crear Borrador' : 'Crear Nuevo Ticket';
    submitBtn.textContent = type === 'draft' ? '💾 Guardar Borrador' : '✅ Crear Ticket';
    
    ticketType.value = type;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideNewTicketModal() {
    const modal = document.getElementById('newTicketModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Limpiar formulario
    const form = document.getElementById('newTicketForm');
    if (form) {
        form.reset();
        document.getElementById('editingTicketId').value = '';
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showAuthOptions() {
    showLoginModal();
}

// === GESTIÓN DE FILTROS Y CONTROLES ===
function toggleCollapsible(id) {
    const content = document.getElementById(id);
    const icon = content.previousElementSibling.querySelector('.toggle-icon');

    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.style.transform = 'rotate(0deg)';
        content.style.maxHeight = '0';
        content.style.padding = '0 24px';
    } else {
        content.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.padding = '24px';
    }
}

function filterTickets() {
    // Obtener los filtros activos
    const statusFilter = document.querySelector('.btn-filter-status.active').getAttribute('data-status');
    const priorityFilter = document.querySelector('.btn-filter-priority.active').getAttribute('data-priority');
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    const cards = document.querySelectorAll('.ticket-card');
    cards.forEach(card => {
        const ticketStatus = card.getAttribute('data-status');
        const ticketPriority = card.getAttribute('data-priority');
        const ticketSearch = card.getAttribute('data-search').toLowerCase();

        const statusMatch = statusFilter === 'all' || ticketStatus === statusFilter;
        const priorityMatch = priorityFilter === 'all' || ticketPriority === priorityFilter;
        const searchMatch = ticketSearch.includes(searchFilter);

        if (statusMatch && priorityMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function clearFilters() {
    document.querySelector('.btn-filter-status.active').classList.remove('active');
    document.querySelector('.btn-filter-status[data-status="all"]').classList.add('active');
    
    document.querySelector('.btn-filter-priority.active').classList.remove('active');
    document.querySelector('.btn-filter-priority[data-priority="all"]').classList.add('active');
    
    document.getElementById('searchFilter').value = '';
    filterTickets();
}

// === GESTIÓN DE BORRADORES Y TICKETS ===
document.getElementById('newTicketForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const ticketType = document.getElementById('ticketType').value;
    const editingId = document.getElementById('editingTicketId').value;
    
    if (editingId) {
        // Editar un borrador existente
        updateDraft(editingId, subject, description, priority);
    } else {
        // Crear un nuevo ticket o borrador
        if (ticketType === 'draft') {
            createDraft(subject, description, priority);
        } else {
            createTicket(subject, description, priority);
        }
    }
    
    hideNewTicketModal();
});

function createTicket(subject, description, priority) {
    const newId = `#TK-${String(ticketCounter++).padStart(3, '0')}`;
    const newCard = createTicketCard(newId, 'open', 'Abierto', subject, description, priority);
    document.getElementById('ticketsGrid').appendChild(newCard);
    showNotification(`Ticket creado: ${subject}`, 'success');
    filterTickets();
}

function createDraft(subject, description, priority) {
    const newId = `#TK-DRAFT-${String(draftCounter++).padStart(3, '0')}`;
    const newCard = createTicketCard(newId, 'draft', 'Borrador', `Borrador: ${subject}`, description, priority, true);
    document.getElementById('ticketsGrid').appendChild(newCard);
    showNotification(`Borrador guardado: ${subject}`, 'info');
    filterTickets();
}

function updateDraft(ticketId, subject, description, priority) {
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);

    if (ticketCard) {
        ticketCard.querySelector('h3').textContent = `Borrador: ${subject}`;
        ticketCard.querySelector('p').textContent = description;
        ticketCard.setAttribute('data-priority', priority);
        ticketCard.setAttribute('data-search', `Borrador: ${subject} ${description}`);
        
        const priorityBadge = ticketCard.querySelector('[class*="priority-"]');
        priorityBadge.textContent = getPriorityText(priority);
        priorityBadge.className = `meta-item priority-${priority}`;

        showNotification(`Borrador actualizado: ${subject}`, 'info');
        filterTickets();
    }
}

function editDraft(ticketId) {
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    
    if (!ticketCard) return;
    
    const subject = ticketCard.querySelector('h3').textContent.replace('Borrador: ', '');
    const description = ticketCard.querySelector('p').textContent;
    const priority = ticketCard.getAttribute('data-priority');
    
    // Llenar formulario
    document.getElementById('subject').value = subject;
    document.getElementById('description').value = description;
    document.getElementById('priority').value = priority;
    document.getElementById('editingTicketId').value = ticketId;
    
    // Mostrar modal en modo edición
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    modalTitle.textContent = 'Editar Borrador';
    submitBtn.textContent = '✅ Actualizar Borrador';
    document.getElementById('ticketType').value = 'draft';
    
    showNewTicketModal('draft');
}

function submitDraft(ticketId) {
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    
    if (ticketCard) {
        // Cambiar estado a abierto y crear un nuevo ID
        const newId = `#TK-${String(ticketCounter++).padStart(3, '0')}`;
        ticketCard.querySelector('.ticket-id').textContent = newId;
        ticketCard.querySelector('h3').textContent = ticketCard.querySelector('h3').textContent.replace('Borrador: ', '');
        ticketCard.setAttribute('data-status', 'open');
        ticketCard.setAttribute('data-ticket-id', newId.replace('#',''));
        ticketCard.setAttribute('data-search', ticketCard.querySelector('h3').textContent.toLowerCase());
        
        // Actualizar badge
        const statusBadge = ticketCard.querySelector('.status-badge');
        statusBadge.className = 'status-badge open';
        statusBadge.textContent = 'Abierto';
        
        // Actualizar acciones
        const actionsDiv = ticketCard.querySelector('.ticket-actions');
        actionsDiv.innerHTML = `<button class="btn btn-secondary btn-small" onclick="viewTicketDetails('${newId.replace('#','')}')">Ver Detalles</button>`;

        showNotification(`Borrador enviado como ticket: ${newId}`, 'success');
        filterTickets();
    }
}

function deleteDraft(ticketId) {
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    if (ticketCard) {
        if (confirm('¿Estás seguro de que quieres eliminar este borrador?')) {
            ticketCard.remove();
            showNotification(`Borrador eliminado: ${ticketId}`, 'error');
            filterTickets();
        }
    }
}

// Funciones auxiliares para generar el HTML del ticket
function createTicketCard(id, status, statusText, subject, description, priority, isDraft = false) {
    const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const priorityText = getPriorityText(priority);
    const priorityClass = `priority-${priority}`;
    
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.setAttribute('data-status', status);
    card.setAttribute('data-priority', priority);
    card.setAttribute('data-search', `${subject.toLowerCase()} ${description.toLowerCase()}`);
    card.setAttribute('data-ticket-id', id.replace('#', ''));
    
    let actionsHtml = '';
    if (isDraft) {
        actionsHtml = `
            <button class="btn btn-primary btn-small" onclick="editDraft('${id.replace('#','')}')">✏️ Editar</button>
            <button class="btn btn-success btn-small" onclick="submitDraft('${id.replace('#','')}')">📤 Enviar</button>
            <button class="btn btn-danger btn-small" onclick="deleteDraft('${id.replace('#','')}')">🗑️</button>
        `;
    } else {
        actionsHtml = `
            <button class="btn btn-secondary btn-small" onclick="viewTicketDetails('${id.replace('#','')}')">Ver Detalles</button>
        `;
    }

    card.innerHTML = `
        <div class="ticket-header">
            <span class="ticket-id">${id}</span>
            <span class="status-badge ${status}">${statusText}</span>
        </div>
        <h3>${subject}</h3>
        <p>${description}</p>
        <div class="ticket-meta">
            <span class="meta-item">📅 ${date}</span>
            <span class="meta-item ${priorityClass}">${priorityText}</span>
        </div>
        <div class="ticket-actions">
            ${actionsHtml}
        </div>
    `;
    return card;
}

function getPriorityText(priority) {
    switch(priority) {
        case 'high': return '🔴 Alta';
        case 'medium': return '⚠️ Media';
        case 'low': return '🔵 Baja';
        default: return '';
    }
}

function viewTicketDetails(ticketId) {
    showNotification(`Ver detalles del ticket ${ticketId}`, 'info');
}

// === NOTIFICACIONES ===
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease-in forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', () => {
    // Escuchadores de eventos para los botones de estado y prioridad
    const statusButtons = document.querySelectorAll('.btn-filter-status');
    statusButtons.forEach(btn => btn.addEventListener('click', function() {
        statusButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterTickets();
    }));

    const priorityButtons = document.querySelectorAll('.btn-filter-priority');
    priorityButtons.forEach(btn => btn.addEventListener('click', function() {
        priorityButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterTickets();
    }));
    
    // Aplicar filtros iniciales al cargar la página
    filterTickets();
});