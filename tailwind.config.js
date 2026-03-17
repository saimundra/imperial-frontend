/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* gold-20 */
        input: 'var(--color-input)', /* gray-900 */
        ring: 'var(--color-ring)', /* gold */
        background: 'var(--color-background)', /* near-black */
        foreground: 'var(--color-foreground)', /* gray-100 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* gold */
          foreground: 'var(--color-primary-foreground)', /* gray-900 */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* darkgoldenrod */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* cornsilk */
          foreground: 'var(--color-accent-foreground)', /* gray-800 */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-800 */
          foreground: 'var(--color-muted-foreground)', /* gray-400 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* gray-900 */
          foreground: 'var(--color-card-foreground)', /* gray-200 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* gray-900 */
          foreground: 'var(--color-popover-foreground)', /* gray-200 */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* limegreen */
          foreground: 'var(--color-success-foreground)', /* black */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* orange */
          foreground: 'var(--color-warning-foreground)', /* black */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        surface: {
          elevated: 'var(--color-surface-elevated)', /* gray-800 */
          'elevated-high': 'var(--color-surface-elevated-high)', /* gray-700 */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Karla', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'golden-sm': '0 0 8px rgba(255, 215, 0, 0.15)',
        'golden': '0 0 20px rgba(255, 215, 0, 0.15)',
        'golden-lg': '0 0 40px rgba(255, 215, 0, 0.2)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
}