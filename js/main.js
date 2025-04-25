import data from './data.js';

const activeClassOverlay = 'overlay--active';
const bookListStyleMap = {
    0: 'book-item--grid-1',
    1: 'book-item--grid-2',
    2: 'book-item--grid-3',
    3: 'book-item--grid-4',
    4: 'book-item--grid-5',
    5: 'book-item--grid-6',
    6: 'book-item--grid-7',
    7: 'book-item--grid-8',
    8: 'book-item--grid-9',
    9: 'book-item--grid-10',
};

function imageLazyLoad() {
    const images = document.querySelectorAll('.js-lazyload-img');

    if (images.length) {
        images.forEach(img => {
            const loaded = () => img.classList.remove('lazyload-img--loading');

            if (img.complete) loaded();
            else img.addEventListener('load', loaded);
        });
    }
}

function openOverlayByHash() {
    const hash = window.location.hash.substring(1); // Remove the '#' from the hash
    if (hash) {
        const overlayElement = document.querySelector(`.js-overlay[data-name="${hash}"]`);
        if (overlayElement) {
            overlayElement.classList.add(activeClassOverlay);
            document.documentElement.style.overflow = 'hidden';
        }
    }
}

function closeOverlay(overlayElement) {
    overlayElement.classList.remove(activeClassOverlay);
    setTimeout(() => {
        document.documentElement.style.overflow = 'visible';
        overlayElement.scrollTop = 0;
    }, 400);
}

window.addEventListener('load', () => {
    document.querySelector('.js-lobby-section').classList.remove('lobby--loading');

    const renderBooks = async () => {
        const books = await data.books_read();
        let BookGroups = [];

        books.forEach((_, index, bookList) => {
            if (index % Object.entries(bookListStyleMap).length === 0) {
                BookGroups.push(bookList.slice(index, index + Object.entries(bookListStyleMap).length));
            }
        });

        for (const group of BookGroups) {
            group.forEach(({ id, title, author_name, book_large_image_url, notes_url, user_rating }, index) => {
                const bookElement = document.createElement('figure');
                bookElement.classList.add('book-item');
                bookElement.classList.add(bookListStyleMap[index]);
                bookElement.innerHTML = `
                    <div class="book-item__image">
                        <a href="${notes_url}" target="_blank">
                            <img class="js-lazyload-img lazyload-img lazyload-img--loading" src="${book_large_image_url}" loading="lazy" alt="${title} - ${id}">
                        </a>
                    </div>
                    <figcaption>
                        <h3 class="book-item__title"><a href="${notes_url}" target="_blank">${title}</a></h3>
                        <p class="book-item__author">${author_name}</p>
                        <p>${'⭐️'.repeat(user_rating)}</p>
                    </figcaption>
                `;

                document.querySelector('.js-book-list-container').appendChild(bookElement);
            });
        }

        imageLazyLoad();
    };

    imageLazyLoad();
    renderBooks();

    // Open overlay based on the current hash
    openOverlayByHash();
});

document.addEventListener('click', event => {
    if (event.target.closest('.js-overlay-close-btn')) {
        const overlayElement = event.target.closest('.js-overlay');
        closeOverlay(overlayElement);

        // Remove the hash from the URL
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    if (event.target.closest('.js-overlay-open-btn')) {
        const overlayName = event.target.dataset.overlay;
        const overlayElement = document.querySelector(`.js-overlay[data-name="${overlayName}"]`);
        if (overlayElement) {
            overlayElement.classList.add(activeClassOverlay);
            document.documentElement.style.overflow = 'hidden';

            // Update the URL hash
            history.pushState('', document.title, `#${overlayName}`);
        }
    }
});

// Listen for hash changes and open the corresponding overlay
window.addEventListener('hashchange', openOverlayByHash);
