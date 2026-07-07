import { CATEGORIES_MARKET } from "../constants/categories_market";
import { CATEGORIES_FAQ } from "../constants/categories_faq";

// Normalize Types
export const TYPES_DEPOS = [
  { value: "OFFER", label: "Offer" },
  { value: "REQUEST", label: "Request" },
  { value: "QUESTION", label: "Question" },
];

// Update Category options from Type
export function getCategoryOptions(type) {
  switch (type) {
    case "QUESTION":
      return CATEGORIES_FAQ;

    case "OFFER":
    case "REQUEST":
      return CATEGORIES_MARKET;

    default:
      return [];
  }
}

// Pages config
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
      user: true,
      radius: false,
    },
    label: "deposit",
    createButtonLabel: "Buried a deposit",
  },
};
