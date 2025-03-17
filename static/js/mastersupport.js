function showCreateSupportPopup() {
    document.getElementById('createSupportPopup').classList.remove('hidden');
}

function closeCreateSupportPopup() {
    document.getElementById('createSupportPopup').classList.add('hidden');
}
function showConnectCustomerPopup() {
    document.getElementById('connectCustomerPopup').classList.remove('hidden');
}

function closeConnectCustomerPopup() {
    document.getElementById('connectCustomerPopup').classList.add('hidden');
    document.getElementById('connectCustomerForm').reset();
}

// Form submission handling
document.getElementById('connectCustomerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;

    try {
        const response = await fetch('/masteradmin/send_support_notification/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Customer connected successfully',
                icon: 'success',
                confirmButtonColor: '#2196F3'
            });
            closeConnectCustomerPopup();
        } else {
            throw new Error(data.message || 'Something went wrong');
        }
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonColor: '#FF9800'
        });
    }
});

// Close popup when clicking outside
document.getElementById('connectCustomerPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeConnectCustomerPopup();
    }
});

function filterSupportUsers(searchText) {
    const select = document.getElementById('supportSelect');
    const options = select.getElementsByTagName('option');
    
    for (let option of options) {
        const email = option.textContent.toLowerCase();
        const search = searchText.toLowerCase();
        
        if (email.includes(search)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}