import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    registerables,
    TimeScale,
    LinearScale,
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// 1) 플러그인, 스케일 등록 (한 번만!)
ChartJS.register(
    ...registerables,
    CandlestickController,
    CandlestickElement,
    TimeScale,
    LinearScale,
);

export default function CandleChartCS({ market = 'KRW-BTC', limit = 100 }) {
    const [candles, setCandles] = useState([]);

    useEffect(() => {
        let iv;
        async function load() {
            const res  = await fetch(`http://localhost:8080/api/candles?market=${market}&limit=${limit}`);
            const data = await res.json();
            const mapped = data
                .map(d => ({
                    x: new Date(d.timestamp),    // Date 객체
                    o: +d.opening_price,         // o,h,l,c
                    h: +d.high_price,
                    l: +d.low_price,
                    c: +d.trade_price,
                }))
                .sort((a, b) => a.x - b.x);

            setCandles(mapped);
        }

        load();
        iv = setInterval(load, 5000);
        return () => clearInterval(iv);
    }, [market, limit]);

    // y축 범위 자동 계산
    const lows  = candles.map(c => c.l);
    const highs = candles.map(c => c.h);
    const minY = Math.min(...lows)  * 0.995;
    const maxY = Math.max(...highs) * 1.005;

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Chart
                type="candlestick"
                data={{
                    datasets: [{
                        label: market,
                        data: candles,
                        barThickness: 8,         // 고정 폭
                        maxBarThickness: 12,
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            distribution: 'series',    // 데이터 순서대로 균등 배치
                            time: {
                                unit: 'minute',
                                displayFormats: { minute: 'HH:mm' }
                            },
                            ticks: {
                                source: 'data',
                                autoSkip: true,
                                maxTicksLimit: 10,        // 최대 10개만 표시
                                maxRotation: 0,
                                minRotation: 0,
                            },
                            offset: true,
                        },
                        y: {
                            suggestedMin: minY,        // 약간 여백 주기
                            suggestedMax: maxY,
                            ticks: {
                                callback: v => Intl.NumberFormat().format(v),
                                maxTicksLimit: 5,        // y축 눈금 개수 제한
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: ctx => {
                                    const { o, h, l, c } = ctx.raw;
                                    return `O:${o}  H:${h}  L:${l}  C:${c}`;
                                }
                            }
                        },
                        legend: { display: true },
                    },
                }}
                redraw={true}
            />
        </div>
    );
}
