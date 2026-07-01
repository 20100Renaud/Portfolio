export async function searchCities(query) {
  if (!query || query.length < 1) return [];

  // https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
  // => adresses-france.csv.gz -> backend/src/data/cities.json
  const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);

  // // External API
  // const response = await fetch(
  //   `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
  //     query,
  //   )}&fields=centre,codesPostaux`,
  // );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  return response.json();
}



