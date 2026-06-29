import { searchCities } from "../services/cities.service.js";

export function getCities(req, res) {
  try {
    const q = req.query.q || "";
    const results = searchCities(q);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "City search failed" });
  }
}
