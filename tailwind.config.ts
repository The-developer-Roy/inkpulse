import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        dominant: "var(--dominant)",
        primary: "var(--primary)",
        secondary: "var(--secondary)"
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
