import React, { useEffect, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    registerables,
    TimeScale,
    LinearScale,
    CategoryScale,
    BarController,
    BarElement,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// Register necessary components
ChartJS.register(
    ...registerables,
    TimeScale,
    LinearScale,
    CategoryScale,
    CandlestickController,
    CandlestickElement,
    BarController,
    BarElement,
    zoomPlugin
);

export default function CandleChartCS({ market = 'KRW-BTC', limit = 100 }) {
    const candleChartRef = useRef(null);
    const volumeChartRef = useRef(null);
    const isSyncing = useRef(false);

    // Fetch data and update charts
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/candles?market=${market}&limit=${limit}`);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                const mappedCandles = sortedData.map(d => ({
                    x: new Date(d.timestamp).valueOf(),
                    o: +d.opening_price,
                    h: +d.high_price,
                    l: +d.low_price,
                    c: +d.trade_price,
                }));
                const mappedVolumes = sortedData.map(d => ({
                    x: new Date(d.timestamp).valueOf(),
                    y: +d.candle_acc_trade_volume,
                    color: d.trade_price > d.opening_price ? "#4AFA9A" : "#E33F64",
                }));

                if (candleChartRef.current && volumeChartRef.current) {
                    candleChartRef.current.data.datasets[0].data = mappedCandles;
                    volumeChartRef.current.data.datasets[0].data = mappedVolumes;
                    volumeChartRef.current.data.datasets[0].backgroundColor = mappedVolumes.map(v => v.color);
                    
                    candleChartRef.current.update('none'); // Use 'none' to prevent animation
                    volumeChartRef.current.update('none');
                }

            } catch (error) {
                console.error("Failed to load chart data:", error);
            }
        };

        load();
        const iv = setInterval(load, 5000);
        return () => clearInterval(iv);
    }, [market, limit]);

    // Sync charts on zoom/pan
    const syncCharts = (sourceChart, targetChart) => {
        if (isSyncing.current || !sourceChart || !targetChart) return;
        isSyncing.current = true;
        const { min, max } = sourceChart.scales.x;
        targetChart.zoomScale('x', { min, max }, 'none');
        setTimeout(() => { isSyncing.current = false; }, 50);
    };

    const createSyncCallback = (currentChartRef, otherChartRef) => ({ chart }) => {
        syncCharts(currentChartRef.current, otherChartRef.current);
    };

    // Common options for both charts
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: {
            padding: {
                right: 50
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                distribution: 'linear',
                offset: true,
                ticks: {
                    source: 'auto',
                    maxRotation: 0,
                    autoSkip: true,
                },
            },
            y: {
                position: 'left',
                afterFit: (scaleInstance) => {
                    scaleInstance.width = 60;
                },
            },
        },
    };

    // Specific options for the candle chart
    const candleChartOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            zoom: {
                ...commonOptions.plugins.zoom,
                pan: {
                    ...commonOptions.plugins.zoom.pan,
                    onPanComplete: createSyncCallback(candleChartRef, volumeChartRef),
                },
                zoom: {
                    ...commonOptions.plugins.zoom.zoom,
                    onZoomComplete: createSyncCallback(candleChartRef, volumeChartRef),
                },
            },
        },
        scales: {
            ...commonOptions.scales,
            x: {
                ...commonOptions.scales.x,
                display: false,
            },
            y: {
                ...commonOptions.scales.y,
                grace: '5%',
                ticks: {
                    callback: (value) => {
                        if(value >= 1000000){
                            return `${(value / 1000000).toFixed(2)}M`;
                        }
                        if(value >= 1000){
                            return `${value / 1000}k`;
                        }
                        return value;
                    }
                }
            },
        },
    };

    // Specific options for the volume chart
    const volumeChartOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            zoom: {
                ...commonOptions.plugins.zoom,
                pan: {
                    ...commonOptions.plugins.zoom.pan,
                    onPanComplete: createSyncCallback(volumeChartRef, candleChartRef),
                },
                zoom: {
                    ...commonOptions.plugins.zoom.zoom,
                    onZoomComplete: createSyncCallback(volumeChartRef, candleChartRef),
                },
            },
        },
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                beginAtZero: true,
                ticks: {
                    callback: (value) => {
                        if(value >= 1000000){
                            return `${(value / 1000000).toFixed(2)}M`;
                        }
                        if (value >= 1000) {
                            return `${(value / 1000).toFixed(1)}k`;
                        }
                        return value;
                    },
                },
            },
        },
    };

    const handleReset = () => {
        candleChartRef.current?.resetZoom('none');
        volumeChartRef.current?.resetZoom('none');
    };

    return (
        <div>
            <div className="flex space-x-2 mb-2">
                <button onClick={() => candleChartRef.current?.zoom(1.2)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                <button onClick={() => candleChartRef.current?.zoom(0.8)} className="px-3 py-1 bg-gray-200 rounded">–</button>
                <button onClick={handleReset} className="px-3 py-1 bg-gray-200 rounded">Reset</button>
            </div>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                <Chart
                    ref={candleChartRef}
                    type="candlestick"
                    data={{
                        datasets: [{
                            label: 'Price',
                            data: [],
                            barThickness: 5,
                            maxBarThickness: 8,
                        }],
                    }}
                    options={candleChartOptions}
                />
            </div>
            <div style={{ width: '100%', height: '150px', position: 'relative', paddingTop: '0' }}>
                <Chart
                    ref={volumeChartRef}
                    type="bar"
                    data={{
                        datasets: [{
                            label: 'Volume',
                            data: [],
                            backgroundColor: [],
                        }],
                    }}
                    options={volumeChartOptions}
                />
            </div>
        </div>
    );
}
