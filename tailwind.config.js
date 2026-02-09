import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },

      keyframes: {
        arrowEnter: {
          "0%": {
            transform: "scale(4) rotate(-180deg)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
        },
      },
      animation: {
        arrowEnter: "arrowEnter 1.2s ease-out forwards",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
}
