import sqlite3
import pandas as pd


def generate_analytics(database):
    conn = sqlite3.connect(database)

    query = '''
        SELECT * FROM market_data
        ORDER BY id ASC
    '''

    df = pd.read_sql_query(query, conn)

    conn.close()

    analytics_result = []

    symbols = df['symbol'].unique()

    for symbol in symbols:
        coin_df = df[df['symbol'] == symbol]

        if len(coin_df) < 2:
            continue

        first_price = coin_df.iloc[0]['price']
        latest_price = coin_df.iloc[-1]['price']

        first_volume = coin_df.iloc[0]['volume']
        latest_volume = coin_df.iloc[-1]['volume']

        price_change = ((latest_price - first_price) / first_price) * 100
        volume_change = ((latest_volume - first_volume) / first_volume) * 100

        analytics_result.append({
            'symbol': symbol,
            'latest_price': latest_price,
            'price_change_percent': round(price_change, 2),
            'volume_change_percent': round(volume_change, 2)
        })

    analytics_result = sorted(
        analytics_result,
        key=lambda x: x['price_change_percent'],
        reverse=True
    )

    return analytics_result
