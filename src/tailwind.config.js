module.exports = {
    content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
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