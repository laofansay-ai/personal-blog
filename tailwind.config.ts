import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#00eaff",
        "accent-2": "#ff2bd6",
        "accent-3": "#7c3aed",
      },
    },
  },
  plugins: [],
} satisfies Config;
