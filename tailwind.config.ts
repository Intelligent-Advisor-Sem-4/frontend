/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", '[data-theme="dark"]'],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
            colors: {
                border: "var(--color-border)",
                input: "var(--color-input)",
                ring: "var(--color-ring)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)",
                    foreground: "var(--color-destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-popover)",
                    foreground: "var(--color-popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                sidebar: {
                    DEFAULT: "var(--color-sidebar)",
                    foreground: "var(--color-sidebar-foreground)",
                    primary: "var(--color-sidebar-primary)",
                    "primary-foreground": "var(--color-sidebar-primary-foreground)",
                    accent: "var(--color-sidebar-accent)",
                    "accent-foreground": "var(--color-sidebar-accent-foreground)",
                    border: "var(--color-sidebar-border)",
                    ring: "var(--color-sidebar-ring)",
                },
                chart: {
                    1: "var(--color-chart-1)",
                    2: "var(--color-chart-2)",
                    3: "var(--color-chart-3)",
                    4: "var(--color-chart-4)",
                    5: "var(--color-chart-5)",
                },
                up: "oklch(0.651 0.222 142.03)", // Green color for positive stock movement
                down: "oklch(0.645 0.246 16.439)", // Red color for negative stock movement
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
                xl: "var(--radius-xl)",
            },
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
                },
                "stock-up": {
                    '0%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-4px)'},
                    '100%': {transform: 'translateY(0)'}
                },
                "stock-down": {
                    '0%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(4px)'},
                    '100%': {transform: 'translateY(0)'}
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "stock-up": "stock-up 1s ease-in-out",
                "stock-down": "stock-down 1s ease-in-out"
            },
        },
    },
    plugins: [
        function ({addUtilities}: { addUtilities: (utilities: Record<string, Record<string, unknown>>) => void }) {
            const newUtilities = {
                '.up': {
                    color: 'var(--color-up, oklch(0.651 0.222 142.03))',
                    fontWeight: '500',
                    '&::before': {
                        content: '"▲ "',
                        display: 'inline-block'
                    }
                },
                '.down': {
                    color: 'var(--color-down, oklch(0.645 0.246 16.439))',
                    fontWeight: '500',
                    '&::before': {
                        content: '"▼ "',
                        display: 'inline-block'
                    }
                }
            }
            addUtilities(newUtilities)
        }
    ]
}