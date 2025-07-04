import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    registerables,
    TimeScale,
    LinearScale,
    CategoryScale,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    ...registerables,
    TimeScale,
    LinearScale,
    CategoryScale,
    CandlestickController,
    CandlestickElement,
    zoomPlugin
);

export default function CandleChartCS({ market = 'KRW-BTC', limit = 100 }) {
    const [candles, setCandles] = useState([]);
    const chartRef = useRef(null);

    // 데이터 로드
    useEffect(() => {
        let iv;
        async function load() {
            const res = await fetch(`http://localhost:8080/api/candles?market=${market}&limit=${limit}`);
            const data = await res.json();
            const mapped = data.map(d => ({
                x: new Date(d.timestamp),
                o: +d.opening_price,
                h: +d.high_price,
                l: +d.low_price,
                c: +d.trade_price,
            })).sort((a, b) => a.x - b.x);
            setCandles(mapped);
        }
        load();
        iv = setInterval(load, 5000);
        return () => clearInterval(iv);
    }, [market, limit]);


    const handleZoomIn = () => {
        const chart = chartRef.current;
        if (chart) chart.zoom(1.2);       // 120% 확대
    };
    const handleZoomOut = () => {
        const chart = chartRef.current;
        if (chart) chart.zoom(0.8);       // 80% 축소
    };
    const handleReset = () => {
        const chart = chartRef.current;
        if (chart) chart.resetZoom();
    };

    return (
        <div>
            <div className="flex space-x-2 mb-2">
                <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-200 rounded">+</button>
                <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-200 rounded">–</button>
                <button onClick={handleReset} className="px-3 py-1 bg-gray-200 rounded">Reset</button>
            </div>
            <div style={{ width: '100%', height: '400px' }}>
                <Chart
                    ref={chartRef}
                    type="candlestick"
                    data={{
                        datasets: [{
                            label: market,
                            data: candles,
                            barThickness: 5,
                            maxBarThickness: 8,
                            categoryPercentage: 0.6,
                        }],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'time',
                                distribution: 'series',
                                time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } },
                                ticks: { autoSkip: true, maxTicksLimit: 6 },
                                offset: true,
                            },
                            y: {
                                grace: '3%',
                                ticks: { maxTicksLimit: 5 },
                            },
                        },
                        plugins: {
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
                    }}
                    redraw={true}
                />
            </div>
        </div>
    );
}