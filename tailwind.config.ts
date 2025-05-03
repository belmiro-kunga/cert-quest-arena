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
          blue: "hsl(215, 90%, 50%)",      // Azul principal
          darkblue: "hsl(215, 85%, 45%)",  // Azul escuro
          gray: "hsl(215, 16%, 88%)",      // Cinza azulado
          white: "hsl(0, 0%, 100%)",       // Branco
          green: "hsl(142, 76%, 36%)",     // Verde sucesso
          orange: "hsl(45, 93%, 47%)",     // Laranja alerta
          purple: "hsl(265, 89%, 78%)",    // Roxo destaque
          success: "hsl(142, 76%, 36%)",   // Verde para aprovação
          warning: "hsl(45, 93%, 47%)",    // Amarelo para atenção
          error: "hsl(0, 84%, 60%)",       // Vermelho para erro
          info: "hsl(215, 90%, 50%)",      // Azul para informação
          study: "hsl(215, 85%, 45%)",     // Azul para área de estudo
          premium: "hsl(142, 76%, 36%)",   // Verde para conteúdo premium
          basic: "hsl(215, 85%, 45%)",     // Azul para conteúdo básico
        },
        status: {
          passed: "hsl(142, 76%, 36%)",
          failed: "hsl(0, 84%, 60%)",
          pending: "hsl(45, 93%, 47%)",
          inProgress: "hsl(215, 90%, 50%)",
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
        'cert': '0 4px 6px -1px rgba(33, 90, 198, 0.1), 0 2px 4px -1px rgba(33, 90, 198, 0.06)',
        'cert-lg': '0 10px 15px -3px rgba(33, 90, 198, 0.1), 0 4px 6px -2px rgba(33, 90, 198, 0.05)',
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
