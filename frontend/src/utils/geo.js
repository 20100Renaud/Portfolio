import { distance } from "@turf/turf";

export const getDistanceKm = (from, depo) => {
  if (
    from?.lat == null ||
    from?.lng == null ||
    depo.User_Depos?.Latitude_User == null ||
    depo.User_Depos?.Longitude_User == null
  ) {
    return null;
  }

  return distance(
    [from.lng, from.lat],
    [depo.User_Depos.Longitude_User, depo.User_Depos.Latitude_User],
    { units: "kilometers" },
  );
};

