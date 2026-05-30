import sqlite3
import pandas as pd


def run_strategy(database):
    conn = sqlite3.connect(database)

    query = '''
        SELECT * FROM market_data
        ORDER BY id ASC
    '''

    df = pd.read_sql_query(query, conn)

    conn.close()

    strategy_results = []

    symbols = df['symbol'].unique()

    for symbol in symbols:
        coin_df = df[df['symbol'] == symbol]

        # if len(coin_df) < 5:
        if len(coin_df) < 2:
            continue

        prices = coin_df['price']

        short_ma = prices.tail(1).mean()
        long_ma = prices.tail(2).mean()

        signal = 'HOLD'

        if short_ma > long_ma:
            signal = 'BUY'
        elif short_ma < long_ma:
            signal = 'SELL'

        strategy_results.append({
            'symbol': symbol,
            'short_ma': round(short_ma, 2),
            'long_ma': round(long_ma, 2),
            'signal': signal
        })

    return strategy_results
