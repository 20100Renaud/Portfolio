export const TYPES_DEPOS = [
  { value: "OFFER", label: "Offer" },
  { value: "REQUEST", label: "Request" },
  { value: "QUESTION", label: "Question" },
];

export const deposConfig = {
  market: {
    title: "Treasure Island",
    subtitle: "Share or discover your next quest !",
    icon: "🏝️",
    allowedTypes: ["OFFER", "REQUEST"],
    showFilters: true,
    filters: {
      type: true,
      category: true,
      user: true,
      radius: true,
    },
    label: "chest",
    createButtonLabel: "Buried a deposit",
  },

  faq: {
    title: "Whisper Lagoon",
    subtitle: "Here we share ideas and answers to our questions.",
    icon: "🪷",
    allowedTypes: ["QUESTION"],
    showFilters: true,
    filters: {
      type: false,
      category: true,
      user: true,
      radius: false,
    },
    label: "question",
    createButtonLabel: "Ask a question",
  },

  dashboard: {
    title: "My Deposits",
    subtitle: "Manage your buried treasures",
    icon: "📦",
    allowedTypes: ["OFFER", "REQUEST", "QUESTION"],
    showFilters: true,
    filters: {
      type: true,
      category: true,
      user: false,
      radius: false,
    },
    label: "deposit",
    createButtonLabel: "Buried a deposit",
  },
};
