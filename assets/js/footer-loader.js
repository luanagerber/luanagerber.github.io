// footer-loader.js - Simple Footer Component Loader
// Loads footer with compact contact section and copyright

class FooterLoader {
    constructor() {
        // Detect if we're on a sub-page (in projects or pages folder)
        this.isSubPage = window.location.pathname.includes('/swift/') || 
                        window.location.pathname.includes('/web/');
        
        // Set the correct base path for file loading
        this.basePath = this.isSubPage ? '../' : './';
    }

    async loadFooter() {
        try {
            // Find the footer placeholder element
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (!footerPlaceholder) {
                console.error('Footer placeholder not found. Add <div id="footer-placeholder"></div> to your HTML.');
                return;
            }

            // Fetch the modular footer HTML file
            const response = await fetch(`${this.basePath}components/footer.html`);
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.status} ${response.statusText}`);
            }
            
            const footerHTML = await response.text();
            
            // Inject the footer HTML into the placeholder
            footerPlaceholder.innerHTML = footerHTML;
            
            console.log('Footer loaded successfully');
            
        } catch (error) {
            console.error('Error loading footer:', error);
            console.log('Falling back to basic footer...');
            
            // Create fallback footer if loading fails
            this.createFallbackFooter();
        }
    }

    createFallbackFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        // Create basic footer if modular loading fails
        footerPlaceholder.innerHTML = `
             <section class="section contact-footer">
        <div class="container">
            <h3>Get In Touch</h3>
            <div class="contact-links">
                <a href="mailto:luanagerber.dev@gmail.com" class="contact-link">
                    <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-10 5L2 7"/>
                    </svg>
                    Email
                </a>
                <a href="https://www.linkedin.com/in/gerberluana/" target="_blank" class="contact-link">
                    <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                    </svg>
                    LinkedIn
                </a>
                <a href="https://github.com/luanagerber" target="_blank" class="contact-link">
                    <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    GitHub
                </a>
            </div>
        </div>
    </section>
    
    <footer>
    <p>© Luana Gerber – 2025 | Designed by <a href="https://www.linkedin.com/in/luiz-formariz/" target="_blank">Luiz Formariz</a></p>
    </footer>
        `;
    }

    // Public method to manually reload footer
    async reload() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = '<div style="padding: 1rem; text-align: center;">Loading footer...</div>';
        }
        await this.loadFooter();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const footerLoader = new FooterLoader();
    footerLoader.loadFooter();
});

// Make FooterLoader available globally for manual control if needed
window.FooterLoader = FooterLoader;