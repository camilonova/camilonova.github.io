window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.js-lobby-section').classList.remove('lobby--loading');
    }, 500);
});

const activeClassOverlay = 'overlay--active';

document.addEventListener('click', event => {
    if (event.target.closest('.js-overlay-close-btn')) {
        const overlayElement = event.target.closest('.js-overlay');

        overlayElement.classList.remove(activeClassOverlay);
        setTimeout(() => {
            document.documentElement.style.overflow = 'visible';
            overlayElement.scrollTop = 0;
        }, 400);
    }

    if (event.target.closest('.js-overlay-open-btn')) {
        document.querySelector(`.js-overlay[data-name="${event.target.dataset.overlay}"]`).classList.add(activeClassOverlay);
        document.documentElement.style.overflow = 'hidden';
    }
});
