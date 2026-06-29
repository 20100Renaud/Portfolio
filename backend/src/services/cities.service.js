import fs from "fs";

const cities = JSON.parse(
  fs.readFileSync(new URL("../data/cities.json", import.meta.url)),
);

export function searchCities(query) {
  if (!query || query.length < 1) return [];

  const q = query.toLowerCase();

  return cities.filter((c) => c.nom.toLowerCase().startsWith(q)).slice(0, 10);
}
