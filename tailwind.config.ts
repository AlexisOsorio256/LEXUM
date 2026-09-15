/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F4F8",
          100: "#DCE6F0",
          200: "#B9CDE3",
          600: "#1E4A7A",
          700: "#16395F",
          800: "#0F2A44",
          900: "#0A1A2F",
          950: "#060F1D",
        },
        gold: {
          50: "#FBF7E8",
          100: "#F5ECD0",
          200: "#EAD9A0",
          300: "#DDC26E",
          400: "#C9A227",
          500: "#B8941F",
          600: "#96761A",
        },
        paper: "#F8F7F4",
        ink: "#1A2332",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(10, 26, 47, 0.25)",
        card: "0 6px 24px -8px rgba(10, 26, 47, 0.14)",
        float: "0 20px 60px -15px rgba(10, 26, 47, 0.35)",
        gold: "0 12px 30px -10px rgba(201, 162, 39, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
    },
  },
  plugins: [],
};
