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
}

window.addEventListener('load', () => {
    document.querySelector('.js-lobby-section').classList.remove('lobby--loading');

    let BookGroups = [];

    data.books_read.forEach((_, index, bookList) => {
        if (index % Object.entries(bookListStyleMap).length === 0) {
            BookGroups.push(bookList.slice(index, index + Object.entries(bookListStyleMap).length));
        }
    });

    BookGroups.forEach(group => {
        group.forEach(({ id, title, author, cover_image, notes_url }, index) => {
            const bookElement = document.createElement('figure');
            bookElement.classList.add('book-item');
            bookElement.classList.add(bookListStyleMap[index]);
            bookElement.innerHTML = `
                <div class="book-item__image">
                    <a href="${ notes_url }" target="_blank">
                        <img class="js-lazyload-img lazyload-img lazyload-img--loading" src="${ cover_image }" loading="lazy" alt="${ title } - ${id}">
                    </a>
                </div>
                <figcaption>
                    <h3 class="book-item__title">${ title }</h3>
                    <p class="book-item__author">${ author }</p>
                </figcaption>
            `;

            document.querySelector('.js-book-list-container').appendChild(bookElement);
        });
    })

    document.querySelectorAll('.js-lazyload-img').forEach(img => {
        const loaded = () => img.classList.remove('lazyload-img--loading');

        if (img.complete) loaded();
        else img.addEventListener('load', loaded);
    });
});

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
