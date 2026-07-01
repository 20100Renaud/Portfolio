// first time in ~/Portfolio/backend$
//npm install node-cron

import cron from "node-cron";
import prisma from "../prismaClient.js";

export const startDepoCleanupJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running depo cleanup...");

      const now = new Date();

      const result = await prisma.T_Depos.deleteMany({
        where: {
          Lifetime_Depo: {
            lt: now,
          },
        },
      });

      console.log(`Deleted ${result.count} expired depos`);
    } catch (err) {
      console.error("Cleanup job error:", err);
    }
  });
};
