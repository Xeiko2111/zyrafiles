/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          soft: token("primary-soft"),
          deep: token("primary-deep"),
          fg: token("primary-fg"),
        },
        bg: {
          DEFAULT: token("background"),
          secondary: token("background-secondary"),
        },
        card: { DEFAULT: token("card"), hover: token("card-hover") },
        fg: {
          DEFAULT: token("text"),
          secondary: token("text-secondary"),
          muted: token("text-muted"),
        },
        line: { DEFAULT: token("border"), hover: token("border-hover") },
        success: token("success"),
        danger: token("danger"),
        warning: token("warning"),
      },
      fontFamily: {
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--primary) / 0.35), 0 8px 32px -8px rgb(var(--primary-glow) / 0.55)",
        "glow-sm": "0 0 24px -6px rgb(var(--primary-glow) / 0.6)",
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
      borderRadius: { xl2: "1.125rem" },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "gradient-x": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-ring": { "0%": { transform: "scale(.8)", opacity: ".7" }, "100%": { transform: "scale(2.2)", opacity: "0" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(.2,.6,.4,1) infinite",
      },
    },
  },
  plugins: [],
};
