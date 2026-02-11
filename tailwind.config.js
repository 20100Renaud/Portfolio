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
        },

        animation: {
            text_animation_sm: "text_animation_sm 1.2s forwards",
            text_animation_xs: "text_animation_xs 1.2s forwards",
            arrows_animation_sm: "arrows_animation_sm 1.2s forwards",
            arrows_animation_xs: "arrows_animation_xs 1.2s forwards",
        },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: ["light"],
    },
}
