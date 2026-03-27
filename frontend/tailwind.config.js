import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['"Open Sans"', 'sans-serif'],
        sans: ['"Zain"', 'serif'],
      },

      keyframes: {
        text_animation_sm: {
          "0%": {
            transform: "scale(5)",
            animationTimingFunction: "ease-in"
          },
          "40%": {
            transform: "scale(4)",
            animationTimingFunction: "ease-out"
          },
          "100%": { transform: "scale(1)" },
        },
        text_animation_xs: {
          "0%": {
            transform: "scale(4)",
            animationTimingFunction: "ease-in"
          },
          "40%": {
            transform: "scale(3)",
            animationTimingFunction: "ease-out"
          },
          "100%": { transform: "scale(1)" },
        },
        arrows_animation_sm: {
          "0%": {
            transform: "scale(5) rotate(0deg)",
            animationTimingFunction: "ease-in"
          },
          "40%": {
            transform: "scale(4) rotate(0deg)",
            animationTimingFunction: "ease-out"
          },
          "100%": { transform: "scale(1) rotate(180deg)" },
        },
        arrows_animation_xs: {
          "0%": {
            transform: "scale(4) rotate(0deg)",
            animationTimingFunction: "ease-in"
          },
          "40%": {
            transform: "scale(3) rotate(0deg)",
            animationTimingFunction: "ease-out"
          },
          "100%": { transform: "scale(1) rotate(180deg)" },
        },
        arrows_flat_animation_infinite: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        arrows_flat_animation: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },

      animation: {
        text_animation_sm: "text_animation_sm 1.2s forwards",
        text_animation_xs: "text_animation_xs 1.2s forwards",
        arrows_animation_sm: "arrows_animation_sm 1.2s forwards",
        arrows_animation_xs: "arrows_animation_xs 1.2s forwards",
        arrows_flat_animation_infinite: "arrows_flat_animation_infinite 3s infinite linear",
        arrows_flat_animation: "arrows_flat_animation 1s ease-in-out",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  }
}
