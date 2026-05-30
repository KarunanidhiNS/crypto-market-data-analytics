let priceChart;
let volumeChart;
let doughnutChart;
let polarChart;
let mixedChart;

Chart.defaults.color = '#6A7A8E';
Chart.defaults.borderColor = '#1E2530';
Chart.defaults.font.family = "'Share Tech Mono', monospace";
Chart.defaults.font.size = 11;

const CHART_COLORS = [
    '#F0A500', '#00D68F', '#FF4D6A', '#3E9BFF',
    '#B06FFF', '#00C4D4', '#FF8C42', '#C8E04A'
];

async function loadMarkets() {
    try {
        const response = await fetch('/markets');
        const data = await response.json();

        const table = document.getElementById('marketTable');
        table.innerHTML = '';

        let labels  = [];
        let prices  = [];
        let volumes = [];
        let totalVol = 0;

        data.forEach((item, i) => {
            labels.push(item.symbol);
            prices.push(item.price);
            volumes.push(item.volume);
            totalVol += item.volume;

            const row = document.createElement('tr');
            row.style.animationDelay = `${i * 40}ms`;
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${item.symbol}</td>
                <td>$${Number(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td>${Number(item.volume).toLocaleString()}</td>
                <td>${item.timestamp}</td>
            `;
            table.appendChild(row);
        });

        document.getElementById('statMarkets').textContent = data.length;
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        document.getElementById('statAvgPrice').textContent =
            '$' + avgPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('statVolume').textContent =
            totalVol.toLocaleString();
        document.getElementById('statUpdated').textContent =
            data.length > 0 ? data[data.length - 1].timestamp : '—';

        loadCharts(labels, prices, volumes);
    } catch (err) {
        console.error('loadMarkets error:', err);
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch('/analytics');
        const data = await response.json();
        const analyticsDiv = document.getElementById('analytics');
        analyticsDiv.innerHTML = '';

        data.forEach((item, i) => {
            const priceUp  = parseFloat(item.price_change_percent) >= 0;
            const volUp    = parseFloat(item.volume_change_percent) >= 0;
            const card = document.createElement('div');
            card.className = 'analytics-card';
            card.style.animationDelay = `${i * 60}ms`;
            card.innerHTML = `
                <div class="analytics-symbol">${item.symbol}</div>
                <div class="analytics-row">
                    <span class="analytics-key">LATEST PRICE</span>
                    <span class="analytics-val">$${Number(item.latest_price).toLocaleString(undefined,{minimumFractionDigits:2})}</span>
                </div>
                <div class="analytics-row">
                    <span class="analytics-key">PRICE Δ</span>
                    <span class="analytics-val ${priceUp ? 'up' : 'down'}">${priceUp ? '▲' : '▼'} ${Math.abs(item.price_change_percent)}%</span>
                </div>
                <div class="analytics-row">
                    <span class="analytics-key">VOLUME Δ</span>
                    <span class="analytics-val ${volUp ? 'up' : 'down'}">${volUp ? '▲' : '▼'} ${Math.abs(item.volume_change_percent)}%</span>
                </div>
            `;
            analyticsDiv.appendChild(card);
        });
    } catch (err) {
        console.error('loadAnalytics error:', err);
    }
}

async function runStrategy() {
    try {
        const response = await fetch('/run-strategy', { method: 'POST' });
        const data = await response.json();
        const strategyDiv = document.getElementById('strategy');
        strategyDiv.innerHTML = '';

        data.forEach((item, i) => {
            const sig = (item.signal || '').toString().toUpperCase();
            const sigClass =
                sig.includes('BUY')  ? 'signal-buy'  :
                sig.includes('SELL') ? 'signal-sell' : 'signal-hold';

            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.style.animationDelay = `${i * 60}ms`;
            card.innerHTML = `
                <div class="strategy-symbol">${item.symbol}</div>
                <div class="strategy-ma-row">SHORT MA: ${item.short_ma}</div>
                <div class="strategy-ma-row">LONG MA:  ${item.long_ma}</div>
                <div class="strategy-signal ${sigClass}">${sig}</div>
            `;
            strategyDiv.appendChild(card);
        });
    } catch (err) {
        console.error('runStrategy error:', err);
    }
}

function destroyCharts() {
    if (priceChart)    priceChart.destroy();
    if (volumeChart)   volumeChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (polarChart)    polarChart.destroy();
    if (mixedChart)    mixedChart.destroy();
}

function loadCharts(labels, prices, volumes) {
    destroyCharts();

    const panelBg   = '#111418';
    const accent    = '#F0A500';
    const accentDim = '#7A5200';
    const upGreen   = '#00D68F';
    const downRed   = '#FF4D6A';
    const border    = '#1E2530';
    const textDim   = '#6A7A8E';

    const barColors = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

    priceChart = new Chart(document.getElementById('priceChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Price (USD)',
                data: prices,
                backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length] + '33'),
                borderColor:     barColors,
                borderWidth: 1.5
            }]
        },
        options: chartOptions('Price (USD)')
    });

    volumeChart = new Chart(document.getElementById('volumeChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Volume',
                data: volumes,
                fill: true,
                backgroundColor: upGreen + '11',
                borderColor: upGreen,
                borderWidth: 2,
                pointBackgroundColor: upGreen,
                pointRadius: 4,
                pointHoverRadius: 7,
                tension: 0.35
            }]
        },
        options: chartOptions('Volume')
    });

    doughnutChart = new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: prices,
                backgroundColor: CHART_COLORS.map(c => c + 'BB'),
                borderColor: '#0A0C0F',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            ...baseOptions(),
            cutout: '62%',
            plugins: {
                ...baseOptions().plugins,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { color: textDim, font: { size: 10 }, padding: 10, boxWidth: 10 }
                }
            }
        }
    });

    polarChart = new Chart(document.getElementById('polarChart'), {
        type: 'polarArea',
        data: {
            labels,
            datasets: [{
                data: volumes,
                backgroundColor: CHART_COLORS.map(c => c + '55'),
                borderColor: CHART_COLORS,
                borderWidth: 1.5
            }]
        },
        options: {
            ...baseOptions(),
            scales: {
                r: {
                    grid:      { color: border },
                    ticks:     { color: textDim, backdropColor: 'transparent', font: { size: 9 } },
                    pointLabels: { color: textDim }
                }
            },
            plugins: {
                ...baseOptions().plugins,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { color: textDim, font: { size: 10 }, padding: 10, boxWidth: 10 }
                }
            }
        }
    });

    mixedChart = new Chart(document.getElementById('mixedChart'), {
        data: {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Price',
                    data: prices,
                    backgroundColor: accent + '33',
                    borderColor: accent,
                    borderWidth: 1.5,
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'Volume',
                    data: volumes,
                    fill: false,
                    borderColor: upGreen,
                    borderWidth: 2,
                    pointBackgroundColor: upGreen,
                    pointRadius: 5,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            ...baseOptions(),
            scales: {
                x: {
                    grid:  { color: border },
                    ticks: { color: textDim }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    grid:  { color: border },
                    ticks: { color: accent }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid:  { drawOnChartArea: false },
                    ticks: { color: upGreen }
                }
            }
        }
    });
}

function baseOptions() {
    return {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 600, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0F1215',
                borderColor: '#2A3040',
                borderWidth: 1,
                titleColor: '#F0A500',
                bodyColor: '#D4DCE8',
                padding: 10,
                titleFont: { family: "'Orbitron', sans-serif", size: 11 },
                bodyFont:  { family: "'Share Tech Mono', monospace", size: 11 }
            }
        }
    };
}

function chartOptions(label) {
    return {
        ...baseOptions(),
        scales: {
            x: {
                grid:  { color: '#1E2530' },
                ticks: { color: '#6A7A8E' }
            },
            y: {
                grid:  { color: '#1E2530' },
                ticks: { color: '#6A7A8E' }
            }
        }
    };
}

window.onload = function () {
    loadMarkets();
};

setInterval(() => {
    loadMarkets();
}, 30000);
