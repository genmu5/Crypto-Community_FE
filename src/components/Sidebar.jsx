import React, { useState, useEffect } from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const MARKETS = [
    { label: 'BTC', code: 'KRW-BTC' },
    { label: 'ETH', code: 'KRW-ETH' },
    { label: 'XRP', code: 'KRW-XRP' },
    { label: 'SAND', code: 'KRW-SAND' },
    { label: 'SOL', code: 'KRW-SOL' },
];

export default function Sidebar({ selected, onSelect }) {
    // 가격·등락률 상태
    const [tickers, setTickers] = useState({});

    useEffect(() => {
        async function load() {
            // 백엔드 API 호출
            const marketsCsv = MARKETS.map(m => m.code).join(',');
            const res = await fetch(`http://localhost:8080/api/tickers?markets=${marketsCsv}`);
            const data = await res.json();
            // 객체 형태로 재구성
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
        const iv = setInterval(load, 60_000);  // 1분마다 업데이트
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
                        <li
                            key={code}
                            onClick={() => onSelect(code)}
                            className={`p-2 rounded cursor-pointer flex justify-between items-center
                ${selected === code
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
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}