/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f172a', // Deep charcoal
                'electric-blue': '#00f3ff', // Neon Blue
                'neon-amber': '#ffbc0e', // Warning
                'crimson-red': '#ff003c', // Critical
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            boxShadow: {
                'neon-blue': '0 0 10px rgba(0, 243, 255, 0.5)',
                'neon-red': '0 0 10px rgba(255, 0, 60, 0.5)',
            }
        },
    },
    plugins: [],
}
