import requests
from datetime import datetime

COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets'

def fetch_market_data():

    params = {
        'vs_currency': 'usd',
        'order': 'market_cap_desc',
        'per_page': 10,
        'page': 1,
        'sparkline': False
    }

    try:

        response = requests.get(
            COINGECKO_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        market_data = []

        for coin in data:

            market_data.append({
                'symbol': coin['symbol'].upper(),
                'price': coin['current_price'],
                'volume': coin['total_volume'],
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

        return market_data

    except Exception as e:

        print("API Error:", e)

        return []