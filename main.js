// Main application script for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle navigation
            if (mainNav) {
                mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
                
                // Apply mobile styling if not already applied
                if (mainNav.style.display === 'block' && !mainNav.classList.contains('mobile-nav')) {
                    mainNav.classList.add('mobile-nav');
                    
                    // Add mobile styles
                    const mobileNavStyles = document.createElement('style');
                    mobileNavStyles.textContent = `
                        .mobile-nav {
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            background-color: white;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            padding: 1rem;
                            z-index: 99;
                        }
                        
                        .mobile-nav ul {
                            flex-direction: column;
                            gap: 1rem;
                        }
                    `;
                    document.head.appendChild(mobileNavStyles);
                }
            }
            
            // Toggle auth buttons for mobile
            if (authButtons) {
                authButtons.style.display = authButtons.style.display === 'flex' ? 'none' : 'flex';
                
                // Apply mobile styling if not already applied
                if (authButtons.style.display === 'flex' && !authButtons.classList.contains('mobile-auth')) {
                    authButtons.classList.add('mobile-auth');
                    
                    // Add mobile styles
                    const mobileAuthStyles = document.createElement('style');
                    mobileAuthStyles.textContent = `
                        .mobile-auth {
                            position: absolute;
                            top: calc(100% + ${mainNav ? mainNav.offsetHeight : 0}px);
                            left: 0;
                            right: 0;
                            background-color: white;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            padding: 1rem;
                            z-index: 98;
                            justify-content: center;
                        }
                    `;
                    document.head.appendChild(mobileAuthStyles);
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animations to elements
    function addAnimations() {
        // Add fade-in animation to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('fade-in');
        });
        
        // Add slide-up animation to cards
        const cards = document.querySelectorAll('.destination-card, .stat-item');
        cards.forEach(card => {
            card.classList.add('slide-up');
        });
    }
    
    // Call animations after a slight delay
    setTimeout(addAnimations, 100);
});