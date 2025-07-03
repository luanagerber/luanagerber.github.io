// header-loader.js - Simple Header Component Loader
// Only loads header HTML, doesn't interfere with existing menu functions

class HeaderLoader {
    constructor() {
        // Detect if we're on a sub-page (in projects folders)
        this.isSubPage = window.location.pathname.includes('/swift/') || 
                        window.location.pathname.includes('/web/');
        
        // Set the correct base path for file loading
        this.basePath = this.isSubPage ? '../' : './';
        
        console.log('HeaderLoader initialized:', {
            isSubPage: this.isSubPage,
            basePath: this.basePath,
            pathname: window.location.pathname
        });
    }

    async loadHeader() {
        try {
            // Find the header placeholder element
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (!headerPlaceholder) {
                console.error('Header placeholder not found. Add <div id="header-placeholder"></div> to your HTML.');
                return;
            }

            // Fetch the modular header HTML file
            const response = await fetch(`${this.basePath}components/header.html`);
            if (!response.ok) {
                throw new Error(`Failed to load header: ${response.status} ${response.statusText}`);
            }
            
            const headerHTML = await response.text();
            
            // Inject the header HTML into the placeholder
            headerPlaceholder.innerHTML = headerHTML;
            
            // Wait for DOM to be ready, then update navigation links for sub-pages
            setTimeout(() => {
                this.updateNavigationLinks();
                // Initialize menu behaviors after header is loaded
                this.initializeMenuBehaviors();
            }, 100);
            
            console.log('Header loaded successfully');
            
        } catch (error) {
            console.error('Error loading header:', error);
            console.log('Falling back to basic header...');
            
            // Create fallback header if loading fails
            this.createFallbackHeader();
        }
    }

    updateNavigationLinks() {
        // Only update links if we're on a sub-page
        if (!this.isSubPage) {
            console.log('Not on sub-page, skipping link updates');
            return;
        }

        console.log('Updating navigation links for sub-page...');

        // Update all navigation links to include '../' for sub-pages
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
        console.log('Found navigation links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            console.log(`Link ${index}: ${href}`);
            
            // Skip external links and already updated links
            if (href && !href.startsWith('http') && !href.startsWith('../')) {
                const newHref = `../${href}`;
                link.setAttribute('href', newHref);
                console.log(`Updated link ${index}: ${href} -> ${newHref}`);
            }
        });
    }

    createFallbackHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        // Create basic header if modular loading fails
        const linkPrefix = this.isSubPage ? '../' : './';
        
        headerPlaceholder.innerHTML = `
          <nav>
    <div class="nav-container">
        <h1 class="nav-title"><a href="${linkPrefix}index.html">Luana Gerber</a></h1>
        <div class="nav-links">
            <a href="${linkPrefix}index.html#hero">About Me</a>
            <a href="${linkPrefix}index.html#skills">Skills</a>
            <a href="${linkPrefix}index.html#portfolio">Projects</a>
            <a href="${linkPrefix}index.html#contact">Contact</a>
            <a href="https://luanagerber.duno.ch/assets/docs/cv_luanagerber_dev.pdf" target="_blank">CV</a>
        </div>
    </div>
</nav>
<div class="navMobile-container" onclick="event.stopPropagation(); toggleMenu();">
    <button class="hamburger">
        <span></span>
        <span></span>
        <span></span>
    </button>
</div>
<div class="mobile-menu" id="mobileMenu">
    <a href="${linkPrefix}index.html#hero">About Me</a>
    <a href="${linkPrefix}index.html#skills">Skills</a>
    <a href="${linkPrefix}index.html#portfolio">Projects</a>
    <a href="${linkPrefix}index.html#contact">Contact</a>
    <a href="https://luanagerber.duno.ch/assets/docs/cv_luanagerber_dev.pdf" target="_blank">CV</a>
</div>      
        `;
        
        // Initialize menu behaviors for fallback header too
        setTimeout(() => {
            this.initializeMenuBehaviors();
        }, 100);
    }

    // Initialize all menu behaviors
    initializeMenuBehaviors() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            this.setupMenuAutoClose();
            this.setupClickOutside();
            this.setupSmoothScroll();
        }, 100);
    }

    // Auto-close menu when clicking on menu items
    setupMenuAutoClose() {
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu after a short delay for better UX
                setTimeout(() => {
                    const mobileMenu = document.getElementById('mobileMenu');
                    const hamburger = document.querySelector('.hamburger');
                    
                    if (mobileMenu && hamburger) {
                        mobileMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                        // Update global isMenuOpen state
                        if (window.isMenuOpen !== undefined) {
                            window.isMenuOpen = false;
                        }
                    }
                }, 150);
            });
        });
    }

    // Close menu when clicking outside
    setupClickOutside() {
        document.addEventListener('click', (event) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburger = document.querySelector('.hamburger');
            const nav = document.querySelector('nav');
            
            // Check if click is outside nav and menu is open
            if (mobileMenu && hamburger && mobileMenu.classList.contains('active')) {
                if (!nav.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    // Update global isMenuOpen state
                    if (window.isMenuOpen !== undefined) {
                        window.isMenuOpen = false;
                    }
                }
            }
        });
    }

    // Smooth scroll for anchor links
    setupSmoothScroll() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Offset for floating nav
                    const offset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Public method to manually reload header
    async reload() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = '<div style="padding: 1rem; text-align: center;">Loading header...</div>';
        }
        await this.loadHeader();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const headerLoader = new HeaderLoader();
    headerLoader.loadHeader();
});

// Make HeaderLoader available globally for manual control if needed
window.HeaderLoader = HeaderLoader;