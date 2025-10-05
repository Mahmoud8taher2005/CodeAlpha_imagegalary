document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let visibleItems = galleryItems; // Tracks which items are currently shown

    // --- Helper to Update Lightbox Image ---
    function updateLightboxImage(src) {
        lightboxImage.style.opacity = 0; 
        setTimeout(() => {
            lightboxImage.src = src;
            lightboxImage.style.opacity = 1;
        }, 300);
    }

    // --- 1. Lightbox Open/Close ---
    function openLightbox(item) {
        const fullSrc = item.getAttribute('data-full');
        // Find the index of the clicked item ONLY within the visible items array
        currentIndex = visibleItems.indexOf(item); 
        updateLightboxImage(fullSrc);
        lightbox.classList.remove('lightbox-hidden');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.add('lightbox-hidden');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('lightbox-hidden');
        }
    });

    // --- 2. Navigation (Next/Previous) ---
    nextBtn.addEventListener('click', () => {
        if (visibleItems.length === 0) return; // Prevent error if no images are visible
        currentIndex = (currentIndex + 1) % visibleItems.length;
        const nextItem = visibleItems[currentIndex];
        updateLightboxImage(nextItem.getAttribute('data-full'));
    });

    prevBtn.addEventListener('click', () => {
        if (visibleItems.length === 0) return;
        // The common trick for seamless looping backward
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; 
        const prevItem = visibleItems[currentIndex];
        updateLightboxImage(prevItem.getAttribute('data-full'));
    });


    // --- 3. BONUS: Filtering Logic ---
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Apply filter
            visibleItems = [];
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    visibleItems.push(item);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Optional: Keyboard Navigation (Same as before)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox-hidden')) {
            if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        }
    });
});