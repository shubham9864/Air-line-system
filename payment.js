// Payment Module
const Payment = (function() {
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const bookingDetails = document.getElementById('booking-details');
    const baseFare = document.getElementById('base-fare');
    const taxesFees = document.getElementById('taxes-fees');
    const totalPrice = document.getElementById('total-price');
    
    // Initialize the payment functionality
    function init() {
        // Populate booking summary
        populateBookingSummary();
        
        // Setup event listeners
        setupEventListeners();
        
        // Format input fields
        setupInputFormatting();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        if (paymentForm) {
            paymentForm.addEventListener('submit', handlePayment);
        }
    }
    
    // Setup input formatting for card fields
    function setupInputFormatting() {
        const cardNumber = document.getElementById('card-number');
        const expiryDate = document.getElementById('expiry-date');
        const cvv = document.getElementById('cvv');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                let formattedValue = '';
                
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                
                e.target.value = formattedValue;
            });
        }
        
        if (expiryDate) {
            expiryDate.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                
                e.target.value = value;
            });
        }
        
        if (cvv) {
            cvv.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
            });
        }
    }
    
    // Populate booking summary from stored data
    function populateBookingSummary() {
        const currentBooking = getCurrentBooking();
        
        if (!currentBooking || !currentBooking.flight) {
            // No booking data, redirect to search
            window.location.href = 'search.html';
            return;
        }
        
        if (bookingDetails) {
            const flight = currentBooking.flight;
            const passengers = currentBooking.passengers || 1;
            
            bookingDetails.innerHTML = `
                <div class="booking-detail-item">
                    <span>Flight:</span>
                    <span>${flight.id} (${flight.airline})</span>
                </div>
                <div class="booking-detail-item">
                    <span>Route:</span>
                    <span>${flight.origin} to ${flight.destination}</span>
                </div>
                <div class="booking-detail-item">
                    <span>Date & Time:</span>
                    <span>${formatDate(flight.date)} | ${flight.departureTime}</span>
                </div>
                <div class="booking-detail-item">
                    <span>Class:</span>
                    <span>${capitalizeFirst(flight.class)}</span>
                </div>
                <div class="booking-detail-item">
                    <span>Passengers:</span>
                    <span>${passengers}</span>
                </div>
            `;
            
            // Calculate price breakdown
            const baseAmount = flight.price * passengers;
            const taxAmount = Math.round(baseAmount * 0.15); // 15% tax
            const totalAmount = baseAmount + taxAmount;
            
            if (baseFare) baseFare.textContent = `$${baseAmount}`;
            if (taxesFees) taxesFees.textContent = `$${taxAmount}`;
            if (totalPrice) totalPrice.textContent = `$${totalAmount}`;
            
            // Update booking with tax details
            currentBooking.baseFare = baseAmount;
            currentBooking.taxesFees = taxAmount;
            currentBooking.totalPrice = totalAmount;
            saveCurrentBooking(currentBooking);
        }
    }
    
    // Handle payment form submission
    function handlePayment(e) {
        e.preventDefault();
        
        // Get form values
        const cardHolder = document.getElementById('card-holder').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        // Basic validation
        if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate card number format (simple check)
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            showMessage('Please enter a valid 16-digit card number', 'error');
            return;
        }
        
        // Validate expiry date format
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            showMessage('Please enter a valid expiry date (MM/YY)', 'error');
            return;
        }
        
        // Validate CVV
        if (cvv.length !== 3) {
            showMessage('Please enter a valid 3-digit CVV', 'error');
            return;
        }
        
        // Simulate payment processing
        showProcessingUI();
        
        // After "processing", complete the booking
        setTimeout(() => {
            completeBooking();
        }, 2000);
    }
    
    // Show processing UI during payment
    function showProcessingUI() {
        // Create processing overlay
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <p>Processing Payment...</p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .processing-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .processing-content {
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            .processing-spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid var(--color-primary);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }
    
    // Complete the booking and redirect to confirmation
    function completeBooking() {
        const currentBooking = getCurrentBooking();
        
        if (currentBooking) {
            // Generate booking reference
            const bookingReference = generateBookingReference();
            
            // Add booking reference and update status
            currentBooking.reference = bookingReference;
            currentBooking.status = 'confirmed';
            currentBooking.paymentDate = new Date().toISOString();
            
            // Save to localStorage
            saveCurrentBooking(currentBooking);
            
            // Add to bookings history
            saveBookingToHistory(currentBooking);
            
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        }
    }
    
    // Generate a random booking reference
    function generateBookingReference() {
        const prefix = 'RA';
        const randomNumbers = Math.floor(1000000 + Math.random() * 9000000);
        return prefix + randomNumbers;
    }
    
    // Save booking to history
    function saveBookingToHistory(booking) {
     const bookings = getBookingHistory();
     const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser && currentUser.username) {
        booking.user = currentUser.username; // Assign username to booking
     }

     booking.bookedAt = new Date().toISOString(); // Add timestamp
     bookings.push(booking);
     localStorage.setItem('bookingHistory', JSON.stringify(bookings));
}

    
    // Get booking history from localStorage
    function getBookingHistory() {
        const bookings = localStorage.getItem('bookingHistory');
        return bookings ? JSON.parse(bookings) : [];
    }
    
    // Get current booking from localStorage
    function getCurrentBooking() {
        const booking = localStorage.getItem('currentBooking');
        return booking ? JSON.parse(booking) : null;
    }
    
    // Save current booking to localStorage
    function saveCurrentBooking(booking) {
        localStorage.setItem('currentBooking', JSON.stringify(booking));
    }
    
    // Format date string
    function formatDate(dateString) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Show message (success/error)
    function showMessage(message, type) {
        // Check if message container exists, if not create one
        let messageContainer = document.querySelector('.message-container');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'message-container';
            
            // Add styles
            messageContainer.style.position = 'fixed';
            messageContainer.style.top = '20px';
            messageContainer.style.left = '50%';
            messageContainer.style.transform = 'translateX(-50%)';
            messageContainer.style.padding = '10px 20px';
            messageContainer.style.borderRadius = '4px';
            messageContainer.style.zIndex = '1000';
            messageContainer.style.fontFamily = 'var(--font-primary)';
            
            document.body.appendChild(messageContainer);
        }
        
        // Set message and style based on type
        messageContainer.textContent = message;
        
        if (type === 'success') {
            messageContainer.style.backgroundColor = 'var(--color-success)';
            messageContainer.style.color = 'white';
        } else {
            messageContainer.style.backgroundColor = 'var(--color-error)';
            messageContainer.style.color = 'white';
        }
        
        // Show message with animation
        messageContainer.style.display = 'block';
        messageContainer.style.animation = 'fadeIn 0.3s ease-in';
        
        // Hide after timeout
        setTimeout(() => {
            messageContainer.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 300);
        }, 3000);
    }
    
    // Public methods
    return {
        init
    };
})();
  

// Initialize payment when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Payment.init();
});