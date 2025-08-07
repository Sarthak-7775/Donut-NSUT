// Events page functionality
let eventsData = [];
let filteredEvents = [];
let currentPage = 1;
const eventsPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    loadEventsData();
    initializeEventHandlers();
});

async function loadEventsData() {
    try {
        const response = await fetch('events_data.json');
        eventsData = await response.json();
        filteredEvents = [...eventsData];
        renderEvents();
        updateStats();
    } catch (error) {
        console.error('Error loading events data:', error);
        // Use fallback data if JSON file is not available
        eventsData = getFallbackEventsData();
        filteredEvents = [...eventsData];
        renderEvents();
        updateStats();
    }
}

function getFallbackEventsData() {
    return [
        {
            id: 1,
            event_name: "Winter Clothing Drive",
            society: "NSS NSUT",
            event_type: "Clothes Donation",
            date: "2024-02-15",
            time: "10:00 AM - 4:00 PM",
            venue: "Main Auditorium Foyer",
            target_group: "Underprivileged families",
            description: "Collecting warm clothes for winter distribution to nearby slum areas",
            contact_person: "Rohit Verma",
            contact_email: "nss.nsut@gmail.com",
            phone: "+91-9876543210",
            requirements: "Clean winter clothes, blankets, sweaters",
            status: "Upcoming"
        }
        // Add more fallback data as needed
    ];
}

function initializeEventHandlers() {
    // Search functionality
    const searchInput = document.getElementById('eventSearch');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    clearSearch.addEventListener('click', clearSearchHandler);
    
    // Filter functionality
    const filters = ['societyFilter', 'typeFilter', 'statusFilter'];
    filters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });
    
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Load more functionality
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreEvents);
    
    // Modal functionality
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('eventModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Modal action buttons
    document.getElementById('participateBtn').addEventListener('click', participateInEvent);
    document.getElementById('shareBtn').addEventListener('click', shareEvent);
}

function debounce(func, wait) {
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

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const searchBox = document.querySelector('.search-box');
    
    if (searchTerm) {
        searchBox.classList.add('has-content');
    } else {
        searchBox.classList.remove('has-content');
    }
    
    applyFilters();
}

function clearSearchHandler() {
    document.getElementById('eventSearch').value = '';
    document.querySelector('.search-box').classList.remove('has-content');
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('eventSearch').value.toLowerCase().trim();
    const societyFilter = document.getElementById('societyFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredEvents = eventsData.filter(event => {
        const matchesSearch = !searchTerm || 
            event.event_name.toLowerCase().includes(searchTerm) ||
            event.society.toLowerCase().includes(searchTerm) ||
            event.event_type.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm);
            
        const matchesSociety = !societyFilter || event.society === societyFilter;
        const matchesType = !typeFilter || event.event_type === typeFilter;
        const matchesStatus = !statusFilter || event.status === statusFilter;
        
        return matchesSearch && matchesSociety && matchesType && matchesStatus;
    });
    
    currentPage = 1;
    renderEvents();
    updateStats();
}

function resetFilters() {
    document.getElementById('eventSearch').value = '';
    document.getElementById('societyFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.querySelector('.search-box').classList.remove('has-content');
    
    filteredEvents = [...eventsData];
    currentPage = 1;
    renderEvents();
    updateStats();
}

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const noResults = document.getElementById('noResults');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    const startIndex = 0;
    const endIndex = currentPage * eventsPerPage;
    const eventsToShow = filteredEvents.slice(startIndex, endIndex);
    
    eventsGrid.innerHTML = eventsToShow.map(event => createEventCard(event)).join('');
    
    // Show/hide load more button
    if (endIndex >= filteredEvents.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    // Add click handlers to event cards
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.eventId);
            showEventModal(eventId);
        });
    });
}

function createEventCard(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-card-header">
                <h3 class="event-title">${event.event_name}</h3>
                <div class="event-society">
                    <i class="fas fa-users"></i>
                    ${event.society}
                </div>
            </div>
            <div class="event-card-body">
                <div class="event-info">
                    <div class="info-item">
                        <i class="fas fa-tag"></i>
                        <span>${event.event_type}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-bullseye"></i>
                        <span>${event.target_group}</span>
                    </div>
                </div>
                <p class="event-description">${event.description}</p>
            </div>
            <div class="event-card-footer">
                <span class="event-status ${event.status.toLowerCase()}">${event.status}</span>
                <button class="btn-primary" onclick="event.stopPropagation(); showEventModal(${event.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
}

function loadMoreEvents() {
    currentPage++;
    renderEvents();
}

function showEventModal(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    // Populate modal with event data
    document.getElementById('modalEventName').textContent = event.event_name;
    document.getElementById('modalSociety').textContent = event.society;
    document.getElementById('modalDateTime').textContent = `${event.date} at ${event.time}`;
    document.getElementById('modalVenue').textContent = event.venue;
    document.getElementById('modalTarget').textContent = event.target_group;
    document.getElementById('modalDescription').textContent = event.description;
    document.getElementById('modalRequirements').textContent = event.requirements;
    document.getElementById('modalContact').textContent = event.contact_person;
    
    const emailLink = document.getElementById('modalEmail');
    emailLink.textContent = event.contact_email;
    emailLink.href = `mailto:${event.contact_email}`;
    
    const phoneLink = document.getElementById('modalPhone');
    phoneLink.textContent = event.phone;
    phoneLink.href = `tel:${event.phone}`;
    
    // Store event ID for modal actions
    document.getElementById('eventModal').dataset.eventId = eventId;
    
    // Show modal
    document.getElementById('eventModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('eventModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function participateInEvent() {
    const eventId = document.getElementById('eventModal').dataset.eventId;
    const event = eventsData.find(e => e.id === parseInt(eventId));
    
    if (event.status === 'Completed') {
        alert('This event has already been completed.');
        return;
    }
    
    // Create participation email
    const subject = `Participation Request - ${event.event_name}`;
    const body = `Dear ${event.contact_person},

I would like to participate in the "${event.event_name}" event scheduled for ${event.date} at ${event.venue}.

Please let me know the registration process and any additional requirements.

Thank you!

Best regards,
[Your Name]
[Your NSUT ID]
[Your Contact Information]`;
    
    const mailtoLink = `mailto:${event.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
}

function shareEvent() {
    const eventId = document.getElementById('eventModal').dataset.eventId;
    const event = eventsData.find(e => e.id === parseInt(eventId));
    
    if (navigator.share) {
        navigator.share({
            title: event.event_name,
            text: `Join us for ${event.event_name} organized by ${event.society} on ${event.date}`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Join us for ${event.event_name} organized by ${event.society} on ${event.date} at ${event.venue}. Contact: ${event.contact_email}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Event details copied to clipboard!');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Event details copied to clipboard!');
        }
    }
}

function updateStats() {
    const upcomingEvents = filteredEvents.filter(e => e.status === 'Upcoming').length;
    const uniqueSocieties = [...new Set(filteredEvents.map(e => e.society))].length;
    const totalEvents = filteredEvents.length;
    
    document.getElementById('upcomingCount').textContent = upcomingEvents;
    document.getElementById('societyCount').textContent = uniqueSocieties;
    document.getElementById('totalEvents').textContent = totalEvents;
}
