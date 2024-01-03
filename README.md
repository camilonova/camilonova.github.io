# My personal website

This site is available at: https://camilonova.com

## Running

From Visual Studio Code:
1. Ensure [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) is installed.
2. Right click on the index root of the project and "Open with Live Server". That's it! By default project is hosted on ==localhost:5500==.

## Develop

Books read data is taken from [goodreads](https://www.goodreads.com/user/show/67012247-camilo-nova). Information is stored in a [JSON file](./books.json) in the root of the project named ``books.json`` and must be updated manually to display new books.

To do this the following steps must be followed:
1. Run this script in the python shell:

```Python
import json
import urllib.request
import xml.etree.ElementTree as ET



def get_books(user_id: int, page: int = 1) -> dict:
    url = f'https://www.goodreads.com/review/list_rss/{user_id}?shelf=read&page={page}'
    response = urllib.request.urlopen(url)
    xml_data = response.read()

    root = ET.fromstring(xml_data)
    books = []
    for item in root.findall('.//item'):
        book_id = item.find('book_id').text if item.find('book_id') is not None else ''
        title = item.find('title').text if item.find('title') is not None else ''
        book_large_image_url = item.find('book_large_image_url').text if item.find('book_large_image_url') is not None else ''
        author_name = item.find('author_name').text if item.find('author_name') is not None else ''
        user_rating = item.find('user_rating').text if item.find('user_rating') is not None else 0

        books.append({
            'book_id': book_id,
            'title': title,
            'book_large_image_url': book_large_image_url,
            'author_name': author_name,
            'user_rating': user_rating,
            'notes_url': f'https://www.goodreads.com/notes/{book_id}/{user_id}'
        })

    if len(books) % 100 == 0:
        books += get_books(user_id=user_id, page=page+1)

    return books

with open('books.json', 'w') as json_file:
    books = get_books(user_id=67012247)
    json.dump(books, json_file)

```

2. Script will generate a new ``books.json`` file. Replace this file in the root of the project.

3. That's it. List of books will be updated according to how it is on the [goodreads profile](https://www.goodreads.com/review/list/67012247?shelf=read).
