import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3'", "system-ui", "sans-serif"],
        display: ["'Nunito'", "system-ui", "sans-serif"],
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
        // Animal-specific colors
        animal: {
          gecko: {
            main: "hsl(var(--animal-gecko-main))",
            accent: "hsl(var(--animal-gecko-accent))",
            bg: "hsl(var(--animal-gecko-bg))",
            text: "hsl(var(--animal-gecko-text))",
          },
          turtle: {
            main: "hsl(var(--animal-turtle-main))",
            accent: "hsl(var(--animal-turtle-accent))",
            bg: "hsl(var(--animal-turtle-bg))",
            text: "hsl(var(--animal-turtle-text))",
          },
          hamster: {
            main: "hsl(var(--animal-hamster-main))",
            accent: "hsl(var(--animal-hamster-accent))",
            bg: "hsl(var(--animal-hamster-bg))",
            text: "hsl(var(--animal-hamster-text))",
          },
          rabbit: {
            main: "hsl(var(--animal-rabbit-main))",
            accent: "hsl(var(--animal-rabbit-accent))",
            bg: "hsl(var(--animal-rabbit-bg))",
            text: "hsl(var(--animal-rabbit-text))",
          },
          fish: {
            main: "hsl(var(--animal-fish-main))",
            accent: "hsl(var(--animal-fish-accent))",
            bg: "hsl(var(--animal-fish-bg))",
            text: "hsl(var(--animal-fish-text))",
          },
          bird: {
            main: "hsl(var(--animal-bird-main))",
            accent: "hsl(var(--animal-bird-accent))",
            bg: "hsl(var(--animal-bird-bg))",
            text: "hsl(var(--animal-bird-text))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
