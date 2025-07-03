module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E3A8A',
                secondary: '#3B82F6',
                success: '#10B981',
                danger:  '#EF4444',
            },
            fontFamily: {
                sans: ['"Noto Sans KR"', 'sans-serif'],
            }
        }
    },
    plugins: [],
};