
import sys
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/bookstore.db')

def get_products():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, title, author, price, image_url FROM books')
    books = [
        {"id": row[0], "title": row[1], "author": row[2], "price": row[3], "image": row[4]} for row in c.fetchall()
    ]
    conn.close()
    print(json.dumps(books))

def add_cart(item):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    book_id = item.get('id')
    c.execute('SELECT id, quantity FROM cart WHERE book_id=?', (book_id,))
    row = c.fetchone()
    if row:
        c.execute('UPDATE cart SET quantity = quantity + 1 WHERE book_id=?', (book_id,))
    else:
        c.execute('INSERT INTO cart (book_id, quantity) VALUES (?, ?)', (book_id, 1))
    conn.commit()
    conn.close()
    print(json.dumps({"success": True}))

def get_cart():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''SELECT b.id, b.title, b.author, b.price, b.image_url, c.quantity FROM cart c JOIN books b ON c.book_id = b.id''')
    cart = [
        {"id": row[0], "title": row[1], "author": row[2], "price": row[3], "image": row[4], "quantity": row[5]} for row in c.fetchall()
    ]
    conn.close()
    print(json.dumps(cart))

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command"}))
        return
    cmd = sys.argv[1]
    if cmd == 'products':
        get_products()
    elif cmd == 'add_cart':
        item = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        add_cart(item)
    elif cmd == 'get_cart':
        get_cart()
    else:
        print(json.dumps({"error": "Unknown command"}))

if __name__ == '__main__':
    main()
