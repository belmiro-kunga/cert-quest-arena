
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        cert: {
          blue: "hsl(194, 60%, 36%)",      // Solarized Blue
          darkblue: "hsl(194, 80%, 20%)",  // Darker Solarized Blue
          gray: "hsl(46, 10%, 60%)",       // Solarized Gray
          white: "hsl(44, 87%, 94%)",      // Solarized Off-White
          green: "hsl(68, 100%, 30%)",     // Solarized Green
          orange: "hsl(18, 80%, 44%)",     // Solarized Orange
          purple: "hsl(256, 45%, 56%)",    // Harmonious Purple
          success: "hsl(68, 100%, 30%)",   // Solarized Green for success
          warning: "hsl(45, 100%, 50%)",   // Solarized Yellow for warnings
          error: "hsl(1, 71%, 52%)",       // Solarized Red for errors
          info: "hsl(194, 60%, 36%)",      // Solarized Blue for info
          study: "hsl(175, 74%, 26%)",     // Solarized Cyan for study areas
          premium: "hsl(68, 100%, 30%)",   // Solarized Green for premium
          basic: "hsl(194, 60%, 36%)",     // Solarized Blue for basic
        },
        status: {
          passed: "hsl(68, 100%, 30%)",     // Solarized Green
          failed: "hsl(1, 71%, 52%)",       // Solarized Red
          pending: "hsl(45, 100%, 50%)",    // Solarized Yellow
          inProgress: "hsl(194, 60%, 36%)", // Solarized Blue
        },
        solarized: {
          base03: "hsl(193, 100%, 10%)",    // Darkest background
          base02: "hsl(192, 100%, 15%)",    // Dark background
          base01: "hsl(194, 14%, 40%)",     // Content secondary
          base00: "hsl(196, 13%, 45%)",     // Content tertiary
          base0: "hsl(186, 13%, 55%)",      // Content primary
          base1: "hsl(180, 7%, 60%)",       // Emphasized content
          base2: "hsl(46, 42%, 88%)",       // Background secondary
          base3: "hsl(44, 87%, 94%)",       // Background primary
          yellow: "hsl(45, 100%, 50%)",     // Accent
          orange: "hsl(18, 80%, 44%)",      // Accent
          red: "hsl(1, 71%, 52%)",          // Accent
          magenta: "hsl(331, 74%, 46%)",    // Accent
          violet: "hsl(237, 45%, 50%)",     // Accent
          blue: "hsl(205, 82%, 33%)",       // Accent
          cyan: "hsl(175, 74%, 26%)",       // Accent
          green: "hsl(68, 100%, 30%)",      // Accent
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'cert': '0 4px 6px -1px rgba(7, 54, 66, 0.2), 0 2px 4px -1px rgba(7, 54, 66, 0.1)',
        'cert-lg': '0 10px 15px -3px rgba(7, 54, 66, 0.2), 0 4px 6px -2px rgba(7, 54, 66, 0.1)',
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
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        "pulse-slow": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'progress': 'progress 2s ease-in-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
