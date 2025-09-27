/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        border: 'var(--border)',
        success: {
          DEFAULT: 'rgb(34 197 94 / 0.1)',
          foreground: '#15803d',
          border: '#bbf7d0'
        },
        warning: {
          DEFAULT: 'rgb(249 115 22 / 0.1)',
          foreground: '#b45309',
          border: '#fed7aa'
        },
        danger: {
          DEFAULT: 'rgb(239 68 68 / 0.1)',
          foreground: '#b91c1c',
          border: '#fecaca'
        },
        info: {
          DEFAULT: 'rgb(59 130 246 / 0.1)',
          foreground: '#1d4ed8',
          border: '#bfdbfe'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
      }
    },
  },
  plugins: [],
}