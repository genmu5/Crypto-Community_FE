import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Sidebar() {
    const coins = [
        { symbol: 'BTC', change: '+1.23%' },
        { symbol: 'ETH', change: '+2.34%' },
        { symbol: 'ADA', change: '-0.56%' },
        { symbol: 'SOL', change: '+0.89%' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r ring-1 ring-gray-200 p-6">
            <h2 className="flex items-center text-xl font-bold mb-6">
                <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                코인 현황
            </h2>
            <ul className="flex-1 overflow-auto space-y-3 no-scrollbar">
                {coins.map(coin => (
                    <li
                        key={coin.symbol}
                        className="flex items-center p-3 rounded-lg hover:bg-secondary hover:text-white transition cursor-pointer"
                    >
                        <span className="font-medium">{coin.symbol}</span>
                        <span
                            className={`ml-auto text-sm font-semibold ${
                                coin.change.startsWith('+') ? 'text-success' : 'text-danger'
                            }`}
                        >
              {coin.change}
            </span>
                    </li>
                ))}
            </ul>

        </aside>
    );
}