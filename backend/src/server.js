// server.js
import "dotenv/config";
import app from "./app.js";
import { startDepoCleanupJob } from "./jobs/cleanupDepos.job.js";

const PORT = process.env.PORT || 5000;

startDepoCleanupJob();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});