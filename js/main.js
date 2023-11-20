window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.js-lobby-section').classList.remove('lobby--loading');
    }, 500);
});
