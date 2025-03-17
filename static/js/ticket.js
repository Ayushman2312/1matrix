// Ticket Actions
function markAsResolved() {
    const ticketId = getCurrentTicketId(); // Implement this based on your ticket display logic
    fetch('/api/tickets/resolve/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ ticketId: ticketId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            showNotification('Ticket marked as resolved', 'success');
            updateTicketStatus(ticketId, 'resolved');
        }
    })
    .catch(error => showNotification('Error resolving ticket', 'error'));
}

function hideTicket() {
    const ticketId = getCurrentTicketId();
    fetch('/api/tickets/hide/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ ticketId: ticketId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            showNotification('Ticket hidden successfully', 'success');
            removeTicketFromView(ticketId);
        }
    })
    .catch(error => showNotification('Error hiding ticket', 'error'));
}

function showAssignTicketModal() {
    const modal = document.getElementById('assignTicketModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    loadAgents();
}

function closeAssignModal() {
    const modal = document.getElementById('assignTicketModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function loadAgents() {
    fetch('/api/agents/list/')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('agentSelect');
            select.innerHTML = '<option value="">Select Agent</option>';
            data.agents.forEach(agent => {
                select.innerHTML += `<option value="${agent.id}">${agent.name}</option>`;
            });
        });
}

function assignTicketToAgent() {
    const ticketId = getCurrentTicketId();
    const agentId = document.getElementById('agentSelect').value;
    
    if (!agentId) {
        showNotification('Please select an agent', 'warning');
        return;
    }

    fetch('/api/tickets/assign/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ 
            ticketId: ticketId,
            agentId: agentId
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            showNotification('Ticket assigned successfully', 'success');
            closeAssignModal();
            updateTicketAssignment(ticketId, agentId);
        }
    })
    .catch(error => showNotification('Error assigning ticket', 'error'));
}

function deleteTicket() {
    if(!confirm('Are you sure you want to delete this ticket?')) return;
    
    const ticketId = getCurrentTicketId();
    fetch('/api/tickets/delete/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ ticketId: ticketId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            showNotification('Ticket deleted successfully', 'success');
            removeTicketFromView(ticketId);
        }
    })
    .catch(error => showNotification('Error deleting ticket', 'error'));
}

function searchTicket() {
    const mobile = document.getElementById('customerMobile').value;
    const email = document.getElementById('customerEmail').value;
    
    fetch('/api/tickets/search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ 
            mobile: mobile,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.tickets) {
            displaySearchResults(data.tickets);
        } else {
            showNotification('No tickets found', 'info');
        }
    })
    .catch(error => showNotification('Error searching tickets', 'error'));
}

// Utility Functions
function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function showNotification(message, type) {
    // Implement your notification system
    console.log(`${type}: ${message}`);
}

function updateTicketStatus(ticketId, status) {
    // Implement UI update logic
}

function removeTicketFromView(ticketId) {
    // Implement UI removal logic
}

function updateTicketAssignment(ticketId, agentId) {
    // Implement UI update logic
}

function displaySearchResults(tickets) {
    // Implement search results display logic
}

function getCurrentTicketId() {
    // Implement logic to get current ticket ID
    return document.querySelector('[data-ticket-id]').dataset.ticketId;
}

function openReplyModal() {
    const modal = document.getElementById('replyTicketModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeReplyModal() {
    const modal = document.getElementById('replyTicketModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

document.getElementById('replyTicketForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Handle form submission here
    closeReplyModal();
});

function toggleCreateTicketForm() {
    const createTicketPopup = document.getElementById('createTicketPopup');
    createTicketPopup.classList.toggle('hidden');
}


