// Confirmation Module
const Confirmation = (function() {
    // DOM Elements
    const bookingReference = document.getElementById('booking-reference');
    const flightDetails = document.getElementById('confirmation-flight-details');
    const passengerDetails = document.getElementById('confirmation-passenger-details');
    const downloadTicketBtn = document.getElementById('download-ticket');
    const emailTicketBtn = document.getElementById('email-ticket');
    
    // Initialize the confirmation page
    function init() {
        // Display booking details
        displayBookingDetails();
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        if (downloadTicketBtn) {
            downloadTicketBtn.addEventListener('click', handleDownloadTicket);
        }
        
        if (emailTicketBtn) {
            emailTicketBtn.addEventListener('click', handleEmailTicket);
        }
    }
    
    // Display booking details from localStorage
    function displayBookingDetails() {
        const currentBooking = getCurrentBooking();
        
        if (!currentBooking || !currentBooking.reference) {
            // No confirmed booking, redirect to search
            window.location.href = 'search.html';
            return;
        }
        
        // Display booking reference
        if (bookingReference) {
            bookingReference.textContent = currentBooking.reference;
        }
        
        // Display flight details
        if (flightDetails && currentBooking.flight) {
            const flight = currentBooking.flight;
            
            flightDetails.innerHTML = `
                <h4>Flight Information</h4>
                <div class="detail-item">
                    <span>Flight Number:</span>
                    <span>${flight.id}</span>
                </div>
                <div class="detail-item">
                    <span>Airline:</span>
                    <span>${flight.airline}</span>
                </div>
                <div class="detail-item">
                    <span>Route:</span>
                    <span>${flight.origin} to ${flight.destination}</span>
                </div>
                <div class="detail-item">
                    <span>Date:</span>
                    <span>${formatDate(flight.date)}</span>
                </div>
                <div class="detail-item">
                    <span>Departure:</span>
                    <span>${flight.departureTime}</span>
                </div>
                <div class="detail-item">
                    <span>Arrival:</span>
                    <span>${flight.arrivalTime}</span>
                </div>
                <div class="detail-item">
                    <span>Duration:</span>
                    <span>${flight.duration}</span>
                </div>
                <div class="detail-item">
                    <span>Class:</span>
                    <span>${capitalizeFirst(flight.class)}</span>
                </div>
            `;
        }
        
        // Display passenger details
        if (passengerDetails) {
            const user = getCurrentUser();
            const passengers = currentBooking.passengers || 1;
            
            let passengerHTML = `
                <h4>Passenger Information</h4>
                <div class="detail-item">
                    <span>Lead Passenger:</span>
                    <span>${user ? user.fullName : 'Guest'}</span>
                </div>
                <div class="detail-item">
                    <span>Contact:</span>
                    <span>${user ? user.email : 'Not provided'}</span>
                </div>
                <div class="detail-item">
                    <span>Total Passengers:</span>
                    <span>${passengers}</span>
                </div>
            `;
            
            // Add pricing information
            passengerHTML += `
                <h4>Payment Information</h4>
                <div class="detail-item">
                    <span>Base Fare:</span>
                    <span>$${currentBooking.baseFare}</span>
                </div>
                <div class="detail-item">
                    <span>Taxes & Fees:</span>
                    <span>$${currentBooking.taxesFees}</span>
                </div>
                <div class="detail-item total">
                    <span>Total Paid:</span>
                    <span>$${currentBooking.totalPrice}</span>
                </div>
            `;
            
            passengerDetails.innerHTML = passengerHTML;
        }
        
        // Add styles for detail items
        const style = document.createElement('style');
        style.textContent = `
            .detail-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            
            .detail-item:last-child {
                border-bottom: none;
            }
            
            .detail-item.total {
                font-weight: 700;
                margin-top: 8px;
                border-top: 1px solid #ddd;
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle download ticket button
    function handleDownloadTicket() {
        // Simulate ticket download
        showMessage('Preparing your E-Ticket for download...', 'success');
        
        setTimeout(() => {
            simulateDownload('e-ticket.pdf');
        }, 1500);
    }
    
    // Handle email ticket button
    function handleEmailTicket() {
        // Show prompt for email
        const user = getCurrentUser();
        const defaultEmail = user ? user.email : '';
        
        // Create modal for email input
        createEmailModal(defaultEmail);
    }
    
    // Create email modal
    function createEmailModal(defaultEmail) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'email-modal';
        
        modal.innerHTML = `
            <div class="email-modal-content">
                <h3>Send E-Ticket to Email</h3>
                <form id="email-form">
                    <div class="form-group">
                        <label for="email-address">Email Address</label>
                        <input type="email" id="email-address" value="${defaultEmail}" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline" id="cancel-email">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .email-modal {
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
            
            .email-modal-content {
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            .email-modal-content h3 {
                margin-bottom: 20px;
                font-family: var(--font-primary);
            }
            
            .modal-actions {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Setup event listeners for modal
        document.getElementById('cancel-email').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('email-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-address').value;
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Show success message
            showMessage(`E-Ticket sent to ${email}`, 'success');
        });
    }
    
    // Simulate file download
    function simulateDownload(filename) {
        // Create a dummy link and trigger download
        const link = document.createElement('a');
        link.href = '#';
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Show message since we can't actually download
        showMessage('Your E-Ticket would download now in a real application.', 'success');
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    }
    
    // Get current booking from localStorage
    function getCurrentBooking() {
        const booking = localStorage.getItem('currentBooking');
        return booking ? JSON.parse(booking) : null;
    }
    
    // Get current user from localStorage
    function getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    
    // Format date string
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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

// Initialize confirmation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Confirmation.init();
});