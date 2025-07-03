class Lightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.createLightboxHTML();
        this.bindEvents();
        this.initializeImages();
    }

    createLightboxHTML() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-prev">&#8249;</button>
                    <img class="lightbox-image" src="" alt="">
                    <button class="lightbox-next">&#8250;</button>
                </div>
                <div class="lightbox-counter">
                    <span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    initializeImages() {
        this.images = Array.from(document.querySelectorAll('.screenshot img, .mobile-screenshot img'));
        
        this.images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => this.openLightbox(index));
        });
    }

    bindEvents() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        // Close lightbox
        closeBtn.addEventListener('click', () => this.closeLightbox());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        // Navigation
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.querySelector('.lightbox-image');
        
        lightboxImage.src = this.images[index].src;
        lightboxImage.alt = this.images[index].alt;
        
        this.updateCounter();
        this.updateNavigation();
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.updateImage();
    }

    nextImage() {
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.updateImage();
    }

    updateImage() {
        const lightboxImage = document.querySelector('.lightbox-image');
        lightboxImage.src = this.images[this.currentIndex].src;
        lightboxImage.alt = this.images[this.currentIndex].alt;
        this.updateCounter();
    }

    updateCounter() {
        document.querySelector('.lightbox-current').textContent = this.currentIndex + 1;
        document.querySelector('.lightbox-total').textContent = this.images.length;
    }

    updateNavigation() {
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        if (this.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});