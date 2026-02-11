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
        border: "#000000",
        input: "#000000",
        ring: "#EAD8AC",
        background: "#013648",
        foreground: "#EAD8AC",
        primary: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        secondary: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        destructive: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        muted: {
          DEFAULT: "#013648",
          foreground: "#EAD8AC",
        },
        accent: {
          DEFAULT: "#EAD8AC",
          foreground: "#013648",
        },
        popover: {
          DEFAULT: "#0B0B0B",
          foreground: "#EAD8AC",
        },
        card: {
          DEFAULT: "#0B0B0B",
          foreground: "#EAD8AC",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
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
