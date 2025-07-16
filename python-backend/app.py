
import sys
import sqlite3
import json
import os
import hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/bookstore.db')

def hash_password(password):
    """Simple password hashing using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(user_data):
    """Register a new user"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        # Check if email already exists
        c.execute('SELECT id FROM users WHERE email = ?', (user_data['email'],))
        if c.fetchone():
            conn.close()
            print(json.dumps({"success": False, "error": "Email already registered"}))
            return
        
        # Hash password and insert user
        hashed_password = hash_password(user_data['password'])
        c.execute('''
            INSERT INTO users (name, email, password, doc_type, doc_value) 
            VALUES (?, ?, ?, ?, ?)
        ''', (user_data['name'], user_data['email'], hashed_password, 
              user_data['docType'], user_data['docValue']))
        
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        
        print(json.dumps({
            "success": True, 
            "user": {
                "id": user_id,
                "name": user_data['name'],
                "email": user_data['email'],
                "docType": user_data['docType'],
                "docValue": user_data['docValue']
            }
        }))
    except Exception as e:
        conn.close()
        print(json.dumps({"success": False, "error": str(e)}))

def login_user(login_data):
    """Authenticate user login"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        hashed_password = hash_password(login_data['password'])
        c.execute('SELECT id, name, email, doc_type, doc_value FROM users WHERE email = ? AND password = ?', 
                 (login_data['email'], hashed_password))
        user = c.fetchone()
        conn.close()
        
        if user:
            print(json.dumps({
                "success": True,
                "user": {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                    "docType": user[3],
                    "docValue": user[4]
                }
            }))
        else:
            print(json.dumps({"success": False, "error": "Invalid email or password"}))
    except Exception as e:
        conn.close()
        print(json.dumps({"success": False, "error": str(e)}))

def update_user_profile(update_data):
    """Update user profile information"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        user_id = update_data['userId']
        
        # Check if email already exists for other users
        if 'email' in update_data:
            c.execute('SELECT id FROM users WHERE email = ? AND id != ?', 
                     (update_data['email'], user_id))
            if c.fetchone():
                conn.close()
                print(json.dumps({"success": False, "error": "Email already in use by another user"}))
                return
        
        # If password change is requested, verify current password first
        if 'currentPassword' in update_data and 'newPassword' in update_data:
            current_password_hash = hash_password(update_data['currentPassword'])
            c.execute('SELECT password FROM users WHERE id = ?', (user_id,))
            stored_password = c.fetchone()
            
            if not stored_password or stored_password[0] != current_password_hash:
                conn.close()
                print(json.dumps({"success": False, "error": "Contraseña actual incorrecta"}))
                return
        
        # Update user data
        update_fields = []
        update_values = []
        
        if 'name' in update_data:
            update_fields.append('name = ?')
            update_values.append(update_data['name'])
        if 'email' in update_data:
            update_fields.append('email = ?')
            update_values.append(update_data['email'])
        if 'docType' in update_data:
            update_fields.append('doc_type = ?')
            update_values.append(update_data['docType'])
        if 'docValue' in update_data:
            update_fields.append('doc_value = ?')
            update_values.append(update_data['docValue'])
        if 'newPassword' in update_data:
            update_fields.append('password = ?')
            update_values.append(hash_password(update_data['newPassword']))
        
        if update_fields:
            update_values.append(user_id)
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
            c.execute(query, update_values)
            conn.commit()
        
        # Get updated user data
        c.execute('SELECT id, name, email, doc_type, doc_value FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        conn.close()
        
        if user:
            print(json.dumps({
                "success": True,
                "user": {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                    "docType": user[3],
                    "docValue": user[4]
                }
            }))
        else:
            print(json.dumps({"success": False, "error": "User not found"}))
    except Exception as e:
        conn.close()
        print(json.dumps({"success": False, "error": str(e)}))

def get_all_users():
    """Get all users (Admin function)"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        c.execute('SELECT id, name, email, doc_type, doc_value, created_at FROM users ORDER BY id')
        users = []
        for row in c.fetchall():
            users.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "docType": row[3],
                "docValue": row[4],
                "created_at": row[5]
            })
        conn.close()
        print(json.dumps(users))
    except Exception as e:
        conn.close()
        print(json.dumps({"error": str(e)}))

def update_user_admin(update_data):
    """Update user by admin"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        user_id = update_data['userId']
        
        # Check if email already exists for other users
        if 'email' in update_data:
            c.execute('SELECT id FROM users WHERE email = ? AND id != ?', 
                     (update_data['email'], user_id))
            if c.fetchone():
                conn.close()
                print(json.dumps({"success": False, "error": "Email already in use by another user"}))
                return
        
        # Update user data
        update_fields = []
        update_values = []
        
        if 'name' in update_data:
            update_fields.append('name = ?')
            update_values.append(update_data['name'])
        if 'email' in update_data:
            update_fields.append('email = ?')
            update_values.append(update_data['email'])
        if 'docType' in update_data:
            update_fields.append('doc_type = ?')
            update_values.append(update_data['docType'])
        if 'docValue' in update_data:
            update_fields.append('doc_value = ?')
            update_values.append(update_data['docValue'])
        
        if update_fields:
            update_values.append(user_id)
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
            c.execute(query, update_values)
            conn.commit()
        
        conn.close()
        print(json.dumps({"success": True, "message": "User updated successfully"}))
    except Exception as e:
        conn.close()
        print(json.dumps({"success": False, "error": str(e)}))

def delete_user(user_id):
    """Delete user by ID"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        # Check if user exists
        c.execute('SELECT id FROM users WHERE id = ?', (user_id,))
        if not c.fetchone():
            conn.close()
            print(json.dumps({"success": False, "error": "User not found"}))
            return
        
        # Delete user
        c.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
        
        print(json.dumps({"success": True, "message": "User deleted successfully"}))
    except Exception as e:
        conn.close()
        print(json.dumps({"success": False, "error": str(e)}))

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
    elif cmd == 'register':
        user_data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        register_user(user_data)
    elif cmd == 'login':
        login_data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        login_user(login_data)
    elif cmd == 'update_profile':
        update_data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        update_user_profile(update_data)
    elif cmd == 'get_users':
        get_all_users()
    elif cmd == 'update_user_admin':
        update_data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        update_user_admin(update_data)
    elif cmd == 'delete_user':
        user_id = sys.argv[2] if len(sys.argv) > 2 else None
        if user_id:
            delete_user(user_id)
        else:
            print(json.dumps({"error": "User ID required"}))
    else:
        print(json.dumps({"error": "Unknown command"}))

if __name__ == '__main__':
    main()
