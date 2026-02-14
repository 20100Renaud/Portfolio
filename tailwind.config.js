import daisyui from "daisyui"
import themes from "daisyui/src/colors/themes"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
        fontFamily: {
            sans: ['"Open Sans"', 'sans-serif'],
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
            arrows_animation_sm:{
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
            arrows_animation_xs:{
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
            arrows_flat_animation_infinite:{
                "0%": { transform: "rotate(0deg)"},
                "100%": { transform: "rotate(180deg)"},
            },
            arrows_flat_animation:{
                "0%": { transform: "rotate(0deg)"},
                "100%": { transform: "rotate(180deg)"},
            }
        },

        animation: {
            text_animation_sm: "text_animation_sm 1.2s forwards",
            text_animation_xs: "text_animation_xs 1.2s forwards",
            arrows_animation_sm: "arrows_animation_sm 1.2s forwards",
            arrows_animation_xs: "arrows_animation_xs 1.2s forwards",
            arrows_flat_animation_infinite: "arrows_flat_animation_infinite 1s infinite linear",
            arrows_flat_animation: "arrows_flat_animation 1s ease-in-out",
        },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                light: {
                    ...themes("daisyui/src/colors/themes")["[data-theme=light]"],
                    "base-content": "#000000",
                }
            }
        ],
    },
}
