export function pluralize(count, singular, plural = null) {
  const word = count === 1 ? singular : plural || `${singular}s`;

  if (count === 0) {
    return `No ${word}`;
  }

  return `${count} ${word}`;
}
