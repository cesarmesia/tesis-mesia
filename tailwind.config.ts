import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          2: "hsl(var(--surface-2))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--accent))",
        text: {
          DEFAULT: "hsl(var(--text))",
          muted: "hsl(var(--text-muted))",
        },
        // shadcn aliases mapped onto our tokens
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--text))",
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-fg))",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface-2))",
          foreground: "hsl(var(--text))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-2))",
          foreground: "hsl(var(--text-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-fg))",
        },
        destructive: {
          DEFAULT: "hsl(var(--fail))",
          foreground: "hsl(0 0% 100%)",
        },
        // Semantic dictamen / severidad tokens
        ok: "hsl(var(--ok))",
        observed: "hsl(var(--observed))",
        fail: "hsl(var(--fail))",
        "sev-critica": "hsl(var(--sev-critica))",
        "sev-mayor": "hsl(var(--sev-mayor))",
        "sev-menor": "hsl(var(--sev-menor))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 hsl(240 10% 10% / 0.04), 0 1px 3px 0 hsl(240 10% 10% / 0.06)",
        md: "0 2px 6px -1px hsl(240 10% 10% / 0.08), 0 8px 24px -4px hsl(240 10% 10% / 0.08)",
        lg: "0 8px 32px -4px hsl(240 10% 10% / 0.12), 0 24px 48px -12px hsl(240 10% 10% / 0.16)",
        glow: "0 0 0 1px hsl(var(--accent) / 0.15), 0 8px 32px -8px hsl(var(--accent) / 0.35)",
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
