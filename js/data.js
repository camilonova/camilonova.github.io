export default {
    books_read: async () => {
        const response = await fetch(`../books.json?${new Date().getTime()}`);
        const items = await response.json();

        return items.map(item => ({
            id: item.book_id,
            title: item.title,
            author_name: item.author_name,
            book_large_image_url: item.book_large_image_url,
            notes_url: item.notes_url,
            user_rating: item.user_rating,
        }));
    },
}
