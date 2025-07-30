import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiTrendingUp, FiUser } from 'react-icons/fi';
import useAuth from '../auth/useAuth';
import api from '../api';

const MARKETS = [
    { label: 'BTC', code: 'KRW-BTC' },
    { label: 'ETH', code: 'KRW-ETH' },
    { label: 'XRP', code: 'KRW-XRP' },
    { label: 'SAND', code: 'KRW-SAND' },
    { label: 'SOL', code: 'KRW-SOL' },
    { label: 'DOGE', code: 'KRW-DOGE' },
    { label: 'TRUMP', code: 'KRW-TRUMP' },
    { label: 'STRIKE', code: 'KRW-STRIKE' },
];

export default function Sidebar() {
    const { market: selectedMarket } = useParams();
    const [tickers, setTickers] = useState({});
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        async function load() {
            const marketsCsv = MARKETS.map(m => m.code).join(',');
            const res = await api.get(`/tickers?markets=${marketsCsv}`);
            const data = res.data;
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
        <aside className="w-64 bg-white border-r p-4 flex flex-col">
            <div className="flex-grow">
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
            </div>
            {isLoggedIn && (
                <div className="pt-4 border-t">
                    <Link to="/verify-password" className="flex items-center p-2 hover:bg-gray-100 rounded">
                        <FiUser className="mr-2" />
                        My Page
                    </Link>
                </div>
            )}
        </aside>
    );
}