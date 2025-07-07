import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';

const MARKETS = [
    { label: 'BTC', code: 'KRW-BTC' },
    { label: 'ETH', code: 'KRW-ETH' },
    { label: 'XRP', code: 'KRW-XRP' },
    { label: 'SAND', code: 'KRW-SAND' },
    { label: 'SOL', code: 'KRW-SOL' },
];

export default function Sidebar() {
    const { market: selectedMarket } = useParams();
    const [tickers, setTickers] = useState({});

    useEffect(() => {
        async function load() {
            const marketsCsv = MARKETS.map(m => m.code).join(',');
            const res = await fetch(`http://localhost:8080/api/tickers?markets=${marketsCsv}`);
            const data = await res.json();
            const obj = {};
            data.forEach(d => {
                obj[d.market] = {
                    price: d.trade_price,
                    changeRate: d.signed_change_rate,
                };
            });
            setTickers(obj);
        }
        load();
        const iv = setInterval(load, 60_000);
        return () => clearInterval(iv);
    }, []);

    return (
        <aside className="w-64 bg-white border-r p-4">
            <h2 className="flex items-center text-lg font-semibold mb-4">
                <FiTrendingUp className="mr-2" /> 코인 현황
            </h2>
            <ul className="space-y-2">
                {MARKETS.map(({ label, code }) => {
                    const info = tickers[code] || {};
                    const price = info.price?.toLocaleString('ko-KR');
                    const rate = info.changeRate != null
                        ? (info.changeRate * 100).toFixed(2)
                        : null;
                    const rateColor = rate >= 0 ? 'text-green-500' : 'text-red-500';

                    return (
                        <li key={code}>
                            <Link
                                to={`/board/${code}`}
                                className={`p-2 rounded cursor-pointer flex justify-between items-center
                                    ${selectedMarket === code
                                        ? 'bg-blue-100 font-semibold'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div>
                                    <div>{label}</div>
                                    {price && (
                                        <div className="text-sm text-gray-600">
                                            ₩{price}
                                        </div>
                                    )}
                                </div>
                                {rate != null && (
                                    <div className={`${rateColor} font-medium`}>
                                        {rate > 0 && '+'}{rate}%
                                    </div>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}