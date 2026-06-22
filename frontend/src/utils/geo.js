import { distance } from "@turf/turf";

export const isWithinRadius = (user, depo, km) => {
  if (
    depo.User_Depos?.Latitude_User == null ||
    depo.User_Depos?.Longitude_User == null
  ) {
    return false;
  }

  const dist = distance(
    [user.lng, user.lat],
    [depo.User_Depos.Longitude_User, depo.User_Depos.Latitude_User],
    { units: "kilometers" },
  );

  return dist <= km;
};
