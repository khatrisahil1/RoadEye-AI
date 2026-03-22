import sqlite3
import datetime

DB_FILE = "./roadeye.db"

def init_db():
    """Initializes the SQLite database and creates the violations table if it doesn't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            violation_type TEXT NOT NULL,
            license_plate TEXT DEFAULT 'UNKNOWN',
            confidence REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            image_base64 TEXT,
            status TEXT DEFAULT 'Processed'
        )
    ''')
    conn.commit()
    conn.close()

def insert_violation(violation_type, confidence, image_base64=None):
    """Inserts a new traffic violation record into the systemic database."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO violations (violation_type, confidence, image_base64)
        VALUES (?, ?, ?)
    ''', (violation_type, float(confidence), image_base64))
    conn.commit()
    conn.close()

def get_all_violations():
    """Retrieves all historical violation records, sorted by newest first."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM violations ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    
    # Convert sqlite3.Row objects to dictionaries for JSON serialization
    return [dict(row) for row in rows]
