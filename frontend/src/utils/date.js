import { pluralize } from "./plural";

// Default lifetime when creating a new depo
export function getDefaultLifetime() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  return date.toISOString().slice(0, 10);
}

// Convert a DateTime into a number of months
export function getLifetimeMonths(date) {
  if (!date) return 1;

  const today = new Date();
  const expiration = new Date(date);

  const months =
    (expiration.getFullYear() - today.getFullYear()) * 12 +
    expiration.getMonth() -
    today.getMonth();

  return Math.max(1, months);
}

// Change lifetime
export function changeLifetimeMonths(currentMonths, amount) {
  return Math.max(1, currentMonths + amount);
}

// Convert months back to a DateTime string
export function lifetimeMonthsToDate(months) {
  const date = new Date();

  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}


// Lifetime sentence with days
export function getLifetimeTextFromDate(date) {
  if (!date) return "";

  const today = new Date();
  const expiration = new Date(date);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const days = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "Expires today";
  }

  if (days < 30) {
    return `${pluralize(days, "day")}`;
  }

  const months = Math.floor(days / 30);

  return `${pluralize(months, "month")}`;
}

// Red warning when lifetime is soon
export function isLifetimeUrgent(date) {
  if (!date) return false;

  const today = new Date();
  const expiration = new Date(date);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const days = (expiration - today) / (1000 * 60 * 60 * 24);

  return days <= 7;
}
