import { spawn, exec } from "child_process";

const URL = "http://localhost:5173";
const BACKEND_HEALTH = "http://localhost:5000/health";

const mode = process.argv[2] || "dev";
const validModes = ["dev", "rebuild", "clean", "stop"];

const commands = {
  dev: ["-f", "docker-compose.dev.yml", "up", "-d"],
  rebuild: ["-f", "docker-compose.dev.yml", "up", "--build", "-d"],
  clean: ["-f", "docker-compose.dev.yml", "down", "-v"],
  stop: ["-f", "docker-compose.dev.yml", "down"],
};

function run(args) {
  return spawn("docker", ["compose", ...args], {
    stdio: "inherit",
  });
}

async function wait(url, name) {
  console.log(`⏳ Waiting for ${name}...`);

  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`✅ ${name} ready`);
        return true;
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`⚠️ Timeout waiting for ${name}`);
  return false;
}

function openBrowser(url) {
  const platform = process.platform;

  if (platform === "win32") {
    spawn("cmd.exe", ["/c", "start", "", url], {
      stdio: "ignore",
    });
  } else if (platform === "linux" && process.env.WSL_DISTRO_NAME) {
    exec(`cmd.exe /c start "" "${url}"`);
  } else if (platform === "linux") {
    spawn("xdg-open", [url], { stdio: "ignore" });
  } else {
    console.log("Open manually:", url);
  }
}

async function main() {
  if (!validModes.includes(mode)) {
    console.log(`⚠️ Unknown mode: ${mode}`);
    process.exit(1);
  }

  console.log(`🚀 Mode: ${mode}`);

  if (mode === "clean") {
    const p = run(commands.clean);
    p.on("close", () => console.log("✅ Clean complete"));
    return;
  }

  if (mode === "stop") {
    const p = run(commands.stop);
    p.on("close", () => console.log("✅ Containers stopped"));
    return;
  }

  if (mode === "dev" || mode === "rebuild") {
    console.log(`🚀 Starting ${mode}...`);

    const p = run(commands[mode]);
    p.on("close", async () => {
      const backendReady = await wait(BACKEND_HEALTH, "backend");

      if (!backendReady) {
        console.log("❌ Backend failed");
        return;
      }

      console.log("");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("          © 2026 ShareUp — Designed by Lyonx.");
      console.log("");
      console.log(`             🌐 ${URL}`);
      console.log("");
      console.log("      🛑  To stop the containers: npm run stop");
      console.log("      🗄️  To see the database: npm run studio");
      console.log("              from ~/portfolio/backend/$");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      openBrowser(URL);
    });
    return;
  }
}

main();
