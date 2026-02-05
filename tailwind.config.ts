import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais - Barbearia do Moura
        primary: {
          DEFAULT: "#ECD8A8",
          foreground: "#121212",
        },
        accent: {
          DEFAULT: "#013648",
          foreground: "#FFFFFF",
        },
        background: "#121212",
        "background-card": "#1A1A1A",
        "background-elevated": "#242424",
        
        // Cores semânticas
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#E67300",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        
        // Textos
        foreground: "#FFFFFF",
        "muted-foreground": "#A1A1AA",
        "disabled-foreground": "#71717A",
        
        // Bordas
        border: "#2A2A2A",
        "border-hover": "#3A3A3A",
        
        // shadcn/ui compatibility
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#242424",
          foreground: "#A1A1AA",
        },
        secondary: {
          DEFAULT: "#242424",
          foreground: "#FFFFFF",
        },
        input: "#2A2A2A",
        ring: "#ECD8A8",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
