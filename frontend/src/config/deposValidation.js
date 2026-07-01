export const VALIDATION = {
  depo: {
    title: {
      label: "Title",
      min: 4,
      max: 25,
    },

    description: {
      label: "Description",
      min: 4,
      max: 255,
    },
  },

  answer: {
    description: {
      label: "Answer",
      min: 4,
      max: 255,
    },
  },
};

export function validateMax(value, field) {
  const text = value.trim();

  if (text.length > field.max) {
    return `${field.label} must be at most ${field.max} characters.`;
  }

  return "";
}

export function validateMin(value, field) {
  const text = value.trim();

  if (text.length > 0 && text.length < field.min) {
    return `${field.label} must be at least ${field.min} characters.`;
  }

  return "";
}

export function isValidLength(value, field) {
  const text = value.trim();

  return text.length >= field.min && text.length <= field.max;
}
