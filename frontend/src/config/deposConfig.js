export const deposConfig = {
  market: {
    title: "Treasure Island",
    subtitle: "Share or discover, your next quest awaits!",
    icon: "🏝️",
    allowedTypes: ["OFFER", "REQUEST"],
    filters: {
      type: true,
      category: true,
      user: true,
      radius: true,
    },
    label: "chests",
  },

  faq: {
    title: "The Request Lagoon",
    subtitle: "Here we share ideas and answers to our questions.",
    icon: "🪷",
    allowedTypes: ["QUESTION"],
    filters: {
      type: false,
      category: false,
      user: true,
      radius: false,
    },
    label: "questions",
  },
};
