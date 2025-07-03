import React from 'react';

export default function ChartPlaceholder() {
    return (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg hover:shadow-xl p-6 h-80 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">BTC/USD 캔들차트</h2>
            <div className="flex-1 flex items-center justify-center text-gray-300">
                차트 로딩 중…
            </div>
            {/* 추후 툴바: zoom, timeframe 버튼 등 추가 */}
        </div>
    );
}