import { pluralize } from "./plural";

export function getDepoStats(depo) {
  const answers = depo?.Answers_Depos?.length ?? 0;
  const photos = depo?.Images_Depos?.length ?? 0;

  return {
    answers,
    photos,
    answersLabel: pluralize(answers, "answer"),
    photosLabel: pluralize(photos, "photo"),
  };
}
