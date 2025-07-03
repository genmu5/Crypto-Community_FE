export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-100 p-4">
            <h2 className="text-xl font-bold mb-4">코인 현황</h2>
            <ul className="space-y-2">
                <li>BTC</li><li>ETH</li><li>ADA</li>
            </ul>
        </aside>
    );
}