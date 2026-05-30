# Crypto Market Data & Analytics Application

## Overview

The Crypto Market Data & Analytics Application is a Python-based web application designed to collect, store, analyze, and visualize cryptocurrency market data. The application fetches market information from the CoinGecko Public API, performs basic analytics, generates trading signals using a rule-based strategy, and presents the results through an interactive web dashboard.

This project demonstrates backend development, API integration, data processing, analytics, database management, and frontend visualization.

---

## Features

### Market Data Ingestion

* Fetches cryptocurrency market data from CoinGecko Public API.
* Retrieves information for top crypto assets.
* Stores:

  * Symbol
  * Current Price
  * Trading Volume
  * Timestamp
* Supports automated data refresh using APScheduler.

### Analytics

* Price percentage change analysis.
* Volume percentage change analysis.
* Asset ranking based on market metrics.
* Basic trend and momentum analysis.

### Trading Strategy

* Rule-based strategy implementation.
* Generates:

  * BUY
  * SELL
  * HOLD
* Uses historical market data for signal generation.

### Dashboard

* Cryptocurrency listing.
* Market data visualization.
* Analytics display.
* Trading signal display.
* Interactive charts using Chart.js.

---

## Technology Stack

### Backend

* Python 3
* Flask
* REST APIs
* SQLite
* APScheduler

### Data Processing

* Pandas
* NumPy

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* Chart.js

### Version Control

* Git
* GitHub

---

## Project Structure

```text
crypto-market-data-analytics/
│
├── app.py
├── crypto.db
├── requirements.txt
│
├── services/
│   ├── fetch_data.py
│   ├── analytics.py
│   └── strategy.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── main.js
│
└── README.md
```

---

## Data Source

### CoinGecko Public API

The application uses CoinGecko's public cryptocurrency API to fetch market data.

Data Retrieved:

* Cryptocurrency Symbol
* Current Market Price
* Trading Volume
* Timestamp

API Reference:

```text
https://api.coingecko.com/api/v3/coins/markets
```

No API key is required.

---

## Installation & Setup

### Prerequisites

* Python 3.10+
* Git

### Clone Repository

```bash
git clone https://github.com/KarunanidhiNS/crypto-market-data-analytics.git
```

### Navigate to Project Folder

```bash
cd crypto-market-data-analytics
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

### Open Browser

```text
http://localhost:5000
```

---

## Application Workflow

```text
CoinGecko API
       │
       ▼
Data Fetch Service
       │
       ▼
SQLite Database
       │
       ▼
Analytics Engine
       │
       ▼
Strategy Engine
       │
       ▼
Flask REST APIs
       │
       ▼
Web Dashboard
```

---

## Strategy Logic

The application implements a simple rule-based trading strategy using historical price data.

### BUY Signal

Generated when the current market price indicates a positive trend relative to historical values.

### SELL Signal

Generated when the current market price indicates a negative trend relative to historical values.

### HOLD Signal

Generated when market conditions do not satisfy BUY or SELL criteria.

The strategy module is designed to be modular and extensible for future enhancements.

---

## Analytics Implemented

* Price Change Percentage
* Volume Change Percentage
* Asset Ranking
* Trend Analysis
* Historical Market Tracking

---

## Assumptions

* CoinGecko API is available and accessible.
* Market data returned by the API is accurate.
* SQLite is sufficient for the scope of this project.
* Historical data is adequate for analytics and strategy execution.

---

## Limitations

* Uses public API with request rate limitations.
* Strategy is simplified for demonstration purposes.
* No real-time WebSocket integration.
* No user authentication or authorization.
* SQLite is not intended for large-scale production environments.

---

## Future Enhancements

* PostgreSQL database integration.
* FastAPI migration for improved performance.
* Real-time market updates using WebSockets.
* Advanced trading strategies.
* User authentication and authorization.
* Docker containerization.
* Cloud deployment (AWS/Azure).
* Automated testing and CI/CD pipelines.
* Enhanced analytics and reporting features.

---

## Author

**Karunanidhi N S**

Python Full Stack Developer

GitHub: `https://github.com/KarunanidhiNS`

---

## Conclusion

This project demonstrates the development of a complete cryptocurrency market analytics platform, including data ingestion, storage, analytics, strategy execution, REST API development, and interactive visualization. The architecture is designed to be simple, modular, and extensible for future enhancements.
