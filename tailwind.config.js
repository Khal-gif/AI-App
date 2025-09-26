/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
        sans: ['Mulish', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',    // 8pt grid
        'sm': '14px',    // 8pt grid  
        'base': '16px',  // 8pt grid
        'lg': '18px',    // 8pt grid
        'xl': '20px',    // 8pt grid
        '2xl': '24px',   // 8pt grid
        '3xl': '32px',   // 8pt grid
        '4xl': '40px',   // 8pt grid
        '5xl': '48px',   // 8pt grid
      },
      fontWeight: {
        normal: '400',     // Only allowed weights
        medium: '500',     // Only allowed weights
        semibold: '600',   // Only allowed weights
        bold: '700',       // Only allowed weights
      },
      spacing: {
        '1': '4px',    // 8pt grid
        '2': '8px',    // 8pt grid
        '3': '12px',   // 8pt grid
        '4': '16px',   // 8pt grid
        '5': '20px',   // 8pt grid
        '6': '24px',   // 8pt grid
        '8': '32px',   // 8pt grid
        '10': '40px',  // 8pt grid
        '12': '48px',  // 8pt grid
        '16': '64px',  // 8pt grid
        '20': '80px',  // 8pt grid
        '24': '96px',  // 8pt grid
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}