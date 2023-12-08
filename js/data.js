export default {
    books_read: async () => {
        const response = await fetch('../books.json');
        const items = await response.json();

        return items.map(item => ({
            id: item.book_id,
            title: item.title,
            author: item.author,
            cover_image: item.book_large_image_url,
            notes_url: item.notes_url,
        }));
    },
}
