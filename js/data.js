import books from '../books.json' assert { type: 'json' };

export default {
    books_read: books.map(item => ({
        id: item.book_id,
        title: item.title,
        author: item.author,
        cover_image: item.book_large_image_url,
    })),
}
