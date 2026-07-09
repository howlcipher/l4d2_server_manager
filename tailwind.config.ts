import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        glass: "var(--bg-glass)",
        foreground: "var(--text-primary)",
        muted: "var(--text-secondary)",
        border: "var(--border-color)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        brand: "var(--color-brand)",
      },
    },
  },
  plugins: [],
} satisfies Config;
