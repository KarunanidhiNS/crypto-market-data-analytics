from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import sqlite3
from apscheduler.schedulers.background import BackgroundScheduler

from services.fetch_data import fetch_market_data
from services.analytics import generate_analytics
from services.strategy import run_strategy

app = Flask(__name__)
CORS(app)

DATABASE = 'crypto.db'


def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT,
            price REAL,
            volume REAL,
            timestamp TEXT
        )
    ''')

    conn.commit()
    conn.close()


def update_market_data():
    data = fetch_market_data()

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    for coin in data:
        cursor.execute('''
            INSERT INTO market_data(symbol, price, volume, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (
            coin['symbol'],
            coin['price'],
            coin['volume'],
            coin['timestamp']
        ))

    conn.commit()
    conn.close()

    print('Market data updated successfully')

scheduler = BackgroundScheduler()
scheduler.add_job(update_market_data, 'interval', minutes=30)
scheduler.start()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/markets', methods=['GET'])
def get_markets():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM market_data
        WHERE id IN (
            SELECT MAX(id)
            FROM market_data
            GROUP BY symbol
        )
    ''')

    rows = cursor.fetchall()
    conn.close()

    result = [dict(row) for row in rows]

    return jsonify(result)


@app.route('/history/<symbol>', methods=['GET'])
def get_history(symbol):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM market_data
        WHERE symbol = ?
        ORDER BY id DESC
        LIMIT 50
    ''', (symbol.upper(),))

    rows = cursor.fetchall()
    conn.close()

    result = [dict(row) for row in rows]

    return jsonify(result)

@app.route('/analytics', methods=['GET'])
def analytics():
    result = generate_analytics(DATABASE)
    return jsonify(result)

@app.route('/run-strategy', methods=['POST'])
def execute_strategy():
    result = run_strategy(DATABASE)
    return jsonify(result)

@app.route('/refresh-data', methods=['GET'])
def refresh_data():

    update_market_data()

    return jsonify({
        "message": "Market data updated successfully"
    })


if __name__ == '__main__':
    init_db()
    update_market_data()
    app.run(debug=True)