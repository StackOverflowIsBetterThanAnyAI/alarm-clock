/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                'pulse-fast':
                    'pulse 1s cubic-bezier(0.4, 0.5, 0.6, 1) infinite',
            },
            minHeight: {
                90: '364px',
            },
        },
    },
    plugins: [],
}
