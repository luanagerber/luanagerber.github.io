// Mobile menu toggle with enhanced animation
let isMenuOpen = false;

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger) {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.add('active');
            hamburger.classList.add('active');
        } else {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
}

// Enhanced smooth scroll to sections with floating nav offset
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Calculate offset for floating nav
        const offset = 100;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (isMenuOpen) {
            toggleMenu();
        }
    }
}

// Auto-close menu when clicking on menu items (backup for header-loader)
function setupMenuAutoClose() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close menu after a short delay for better UX
            setTimeout(() => {
                if (isMenuOpen) {
                    toggleMenu();
                }
            }, 150);
        });
    });
}

// Close menu when clicking outside (backup for header-loader)
function setupClickOutside() {
    document.addEventListener('click', (event) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const nav = document.querySelector('nav');
        
        // Check if click is outside nav and menu is open
        if (isMenuOpen && mobileMenu && nav) {
            if (!nav.contains(event.target) && !mobileMenu.contains(event.target)) {
                toggleMenu();
            }
        }
    });
}

// Enhanced smooth scroll for all anchor links
function setupSmoothScrollForAnchors() {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            
            if (targetId) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });
}

// Hamburger animation on hover and active states
function setupHamburgerAnimations() {
    const hamburger = document.querySelector('.hamburger');
    
    if (hamburger) {
        // Add CSS for hamburger animation
        const style = document.createElement('style');
        style.textContent = `
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize enhanced menu behaviors
function initializeMenuBehaviors() {
    setupMenuAutoClose();
    setupClickOutside();
    setupSmoothScrollForAnchors();
    setupHamburgerAnimations();
}

// Expose isMenuOpen globally for header-loader compatibility
window.isMenuOpen = isMenuOpen;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeMenuBehaviors();
});

// Re-initialize when header is dynamically loaded
document.addEventListener('headerLoaded', () => {
    initializeMenuBehaviors();
});

// Backup initialization with slight delay (for dynamic content)
setTimeout(() => {
    initializeMenuBehaviors();
}, 500);