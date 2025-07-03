import React from 'react';
import CandleChart from './CandleChart';

export default function ChartPlaceholder() {
    return (
        <div className="w-full h-[400px]">
            <CandleChart market="KRW-BTC" limit={100} />
        </div>
    );
}