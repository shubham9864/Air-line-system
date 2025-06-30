// Flight Search Module
const FlightSearch = (function() {
    // DOM Elements
    const searchForm = document.getElementById('flight-search-form');
    const resultsSection = document.getElementById('results-section');
    const flightResults = document.getElementById('flight-results');
    const liveSearch = document.getElementById('live-search');
    
    // Mock data for flights
    const mockFlights = [
        {
            id: 'RA1001',
            airline: 'Royal Airways',
            origin: 'New York',
            destination: 'London',
            departureTime: '08:00',
            arrivalTime: '20:00',
            duration: '7h 00m',
            price: 599,
            class: 'economy',
            date: '2025-06-15'
        },
        {
            id: 'RA1002',
            airline: 'Royal Airways',
            origin: 'New York',
            destination: 'Paris',
            departureTime: '10:30',
            arrivalTime: '22:15',
            duration: '6h 45m',
            price: 649,
            class: 'economy',
            date: '2025-06-15'
        },
        {
            id: 'RA1003',
            airline: 'Royal Airways',
            origin: 'London',
            destination: 'New York',
            departureTime: '14:15',
            arrivalTime: '17:30',
            duration: '8h 15m',
            price: 579,
            class: 'economy',
            date: '2025-06-20'
        },
        {
            id: 'RA1004',
            airline: 'Royal Airways',
            origin: 'Paris',
            destination: 'Tokyo',
            departureTime: '13:45',
            arrivalTime: '08:30',
            duration: '11h 45m',
            price: 899,
            class: 'economy',
            date: '2025-06-18'
        },
        {
            id: 'RA1005',
            airline: 'Royal Airways',
            origin: 'Tokyo',
            destination: 'Sydney',
            departureTime: '23:30',
            arrivalTime: '10:45',
            duration: '9h 15m',
            price: 799,
            class: 'economy',
            date: '2025-06-22'
        },
        {
            id: 'RA1006',
            airline: 'Sky Alliance',
            origin: 'New York',
            destination: 'London',
            departureTime: '19:00',
            arrivalTime: '07:30',
            duration: '7h 30m',
            price: 549,
            class: 'economy',
            date: '2025-06-15'
        },
        {
            id: 'RA1007',
            airline: 'Global Air',
            origin: 'London',
            destination: 'Paris',
            departureTime: '06:15',
            arrivalTime: '08:30',
            duration: '1h 15m',
            price: 199,
            class: 'economy',
            date: '2025-06-15'
        },
        {
            id: 'RA1008',
            airline: 'Royal Airways',
            origin: 'New York',
            destination: 'London',
            departureTime: '08:00',
            arrivalTime: '20:00',
            duration: '7h 00m',
            price: 1299,
            class: 'business',
            date: '2025-06-15'
        },
        {
            id: 'RA1009',
            airline: 'Royal Airways',
            origin: 'New York',
            destination: 'London',
            departureTime: '08:00',
            arrivalTime: '20:00',
            duration: '7h 00m',
            price: 2499,
            class: 'first',
            date: '2025-06-15'
        },
        {
            id: 'RA1010',
            airline: 'Global Air',
            origin: 'Paris',
            destination: 'Rome',
            departureTime: '09:45',
            arrivalTime: '11:50',
            duration: '2h 05m',
            price: 179,
            class: 'economy',
            date: '2025-06-17'
        }
    ];
    
    // Initialize the search functionality
    function init() {
        // Check URL parameters for pre-filled destination
        checkUrlParams();
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Check URL parameters for pre-filled search
    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const destination = params.get('destination');
        
        if (destination && document.getElementById('destination')) {
            document.getElementById('destination').value = destination;
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }
        
        if (liveSearch) {
            liveSearch.addEventListener('input', handleLiveSearch);
        }
    }
    
    // Handle search form submission
    function handleSearch(e) {
        e.preventDefault();
        
        // Get form values
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        const passengers = document.getElementById('passengers').value;
        const travelClass = document.getElementById('class').value;
        
        // Validate form
        if (!origin || !destination || !departureDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Filter flights based on search criteria
        const filteredFlights = mockFlights.filter(flight => {
            return (flight.origin.toLowerCase().includes(origin.toLowerCase()) || 
                   origin.toLowerCase().includes(flight.origin.toLowerCase())) && 
                   (flight.destination.toLowerCase().includes(destination.toLowerCase()) || 
                   destination.toLowerCase().includes(flight.destination.toLowerCase())) && 
                   flight.class === travelClass;
        });
        
        // Display search results
        displayResults(filteredFlights);
        
        // Save search details for booking
        saveSearchDetails({
            origin,
            destination,
            departureDate,
            returnDate,
            passengers: parseInt(passengers),
            travelClass
        });
    }
    
    // Handle live search filtering
    function handleLiveSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const flightCards = document.querySelectorAll('.flight-card');
        
        flightCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Display search results
    function displayResults(flights) {
        // Show results section
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
        
        // Clear previous results
        if (flightResults) {
            flightResults.innerHTML = '';
            
            if (flights.length === 0) {
                flightResults.innerHTML = '<p class="no-results">No flights found matching your criteria. Please try different search parameters.</p>';
                return;
            }
            
            // Create flight cards
            flights.forEach(flight => {
                const flightCard = createFlightCard(flight);
                flightResults.appendChild(flightCard);
            });
        }
    }
    
    // Create a flight card element
    function createFlightCard(flight) {
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.dataset.flightId = flight.id;
        
        // Format price based on class
        let priceDisplay = `$${flight.price}`;
        let classDisplay = flight.class.charAt(0).toUpperCase() + flight.class.slice(1);
        
        card.innerHTML = `
            <div class="flight-info">
                <div class="airline-logo">${flight.airline.charAt(0)}</div>
                <div class="flight-details">
                    <div class="flight-route">${flight.origin} to ${flight.destination}</div>
                    <div class="flight-time">${flight.departureTime} - ${flight.arrivalTime}</div>
                    <div class="flight-duration">${flight.duration} | ${flight.airline}</div>
                </div>
            </div>
            <div class="flight-price">
                <div class="price-amount">${priceDisplay}</div>
                <div class="price-type">${classDisplay}</div>
                <button class="btn btn-primary btn-select">Select</button>
            </div>
        `;
        
        // Add event listener to select button
        const selectButton = card.querySelector('.btn-select');
        selectButton.addEventListener('click', () => selectFlight(flight));
        
        return card;
    }
    
    // Handle flight selection
    function selectFlight(flight) {
        // Save selected flight to localStorage
        saveSelectedFlight(flight);
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    }
    
    // Save search details to localStorage
    function saveSearchDetails(details) {
        localStorage.setItem('searchDetails', JSON.stringify(details));
    }
    
    // Save selected flight to localStorage
    function saveSelectedFlight(flight) {
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        
        // Get search details for passenger count
        const searchDetails = JSON.parse(localStorage.getItem('searchDetails') || '{}');
        
        // Calculate total price based on passengers
        const passengers = searchDetails.passengers || 1;
        const totalPrice = flight.price * passengers;
        
        // Save booking details
        const bookingDetails = {
            flight: flight,
            passengers: passengers,
            totalPrice: totalPrice,
            bookingDate: new Date().toISOString()
        };
        
        localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    }
    
    // Get saved flight from localStorage
    function getSelectedFlight() {
        const flight = localStorage.getItem('selectedFlight');
        return flight ? JSON.parse(flight) : null;
    }
    
    // Public methods
    return {
        init,
        getSelectedFlight
    };
})();

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    FlightSearch.init();
});