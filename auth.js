// User Authentication Module
const Auth = (function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const userGreeting = document.getElementById('user-greeting');
    
    // Initialize the authentication state
    function init() {
        // Check if a user is logged in
        const currentUser = getCurrentUser();
        
        if (currentUser) {
            // Update UI for logged-in user
            updateUserUI(currentUser);
            
            // Redirect if on login/register page but already logged in
            if (isAuthPage()) {
                window.location.href = '../pages/search.html';
            }
        } else {
            // If not logged in and on a protected page, redirect to login
            if (isProtectedPage()) {
                window.location.href = '../pages/login.html';
            }
        }
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Check if current page is login or register
    function isAuthPage() {
        const path = window.location.pathname;
        return path.includes('login.html') || path.includes('register.html');
    }
    
    // Check if current page is protected (requires authentication)
    function isProtectedPage() {
        const path = window.location.pathname;
        return path.includes('search.html') || 
               path.includes('payment.html') || 
               path.includes('confirmation.html');
    }
    
    // Setup event listeners for auth forms and logout button
    function setupEventListeners() {
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    // Handle login form submission
    function handleLogin(e) {
        e.preventDefault();
        
        // Reset error messages
        clearErrors();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate form
        let isValid = true;
        
        if (!username) {
            showError('username', 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check credentials against stored users
        const users = getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            showError('username', 'Username not registered');
            return;
        }
        
        if (user.password !== password) {
            showError('password', 'Incorrect password');
            return;
        }
        
        // Login successful
        setCurrentUser(user);
        
        // Show success message and redirect
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '../pages/search.html';
        }, 1500);
    }
    
    // Handle register form submission
    function handleRegister(e) {
        e.preventDefault();
        
        // Reset error messages
        clearErrors();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate form
        let isValid = true;
        
        if (!fullName) {
            showError('fullName', 'Full name is required');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        }
        
        if (!username) {
            showError('username', 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!terms) {
            showError('terms', 'You must agree to the terms');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check if username already exists
        const users = getUsers();
        if (users.some(u => u.username === username)) {
            showError('username', 'Username already exists');
            return;
        }
        
        // Create new user object
        const newUser = {
            fullName,
            email,
            phone,
            username,
            password,
            registeredOn: new Date().toISOString()
        };
        
        // Add user to storage
        users.push(newUser);
        saveUsers(users);
        
        // Set as current user
        setCurrentUser(newUser);
        
        // Show success message and redirect
        showMessage('Registration successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '../pages/search.html';
        }, 1500);
    }
    
    // Handle logout
    function handleLogout() {
        // Clear current user
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = '../pages/login.html';
    }
    
    // Update UI elements for logged-in user
    function updateUserUI(user) {
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${user.fullName.split(' ')[0]}`;
        }
    }
    
    // Get all users from localStorage
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }
    
    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Get current logged-in user
    function getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    
    // Set current user in localStorage
    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Show error message for a form field
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    // Clear all error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    // Show general message (success/error)
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
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Public methods
    return {
        init,
        getCurrentUser
    };
})();

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
});