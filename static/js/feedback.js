const itemsPerPage = 3;
let currentPage = 1;
const totalPages = Math.ceil(feedbackData.length / itemsPerPage);

function displayFeedbacks(page) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => displayFeedbacks(page));
        return;
    }

    const container = document.getElementById('feedbackContainer');
    if (!container) {
        console.error('Feedback container element not found');
        // Retry after a short delay in case the element is not yet available
        setTimeout(() => displayFeedbacks(page), 100);
        return;
    }
    
    container.innerHTML = '';
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = feedbackData.slice(start, end);

    paginatedItems.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'flex justify-between items-center p-2 bg-[#252525] rounded-lg';
        feedbackElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <p class="text-white text-sm">${feedback.name}</p>
                    <p class="text-[#b3b3b3] text-xs">${feedback.time} ago</p>
                </div>
            </div>
            <p class="text-[#b3b3b3] text-sm">${feedback.message}</p>
        `;
        container.appendChild(feedbackElement);
    });

    // Update pagination elements
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (currentPageEl) currentPageEl.textContent = page;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
    
    // Update button states
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === totalPages;
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayFeedbacks(currentPage);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayFeedbacks(currentPage);
    }
}

// Initialize display
displayFeedbacks(currentPage);

// Also listen for DOM content loaded to ensure initialization
document.addEventListener('DOMContentLoaded', () => {
    displayFeedbacks(currentPage);
});
