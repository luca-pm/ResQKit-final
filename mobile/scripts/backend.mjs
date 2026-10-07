// Starts the Python backend (backend/run.py) with its own virtualenv.
// First-time setup: npm run backend:setup
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const backendDir = path.resolve(import.meta.dirname, "..", "..", "backend");
const python = process.platform === "win32"
  ? path.join(backendDir, ".venv", "Scripts", "python.exe")
  : path.join(backendDir, ".venv", "bin", "python");

const setup = process.argv.includes("--setup");

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: backendDir, stdio: "inherit" });
    child.on("exit", (code) => resolve(code ?? 0));
  });
}

if (setup) {
  const sysPython = process.platform === "win32" ? "python" : "python3";
  let code = await run(sysPython, ["-m", "venv", ".venv"]);
  if (code === 0) code = await run(python, ["-m", "pip", "install", "-r", "requirements.txt"]);
  if (code === 0 && !existsSync(path.join(backendDir, ".env"))) {
    console.log("\nNow copy backend/.env.example to backend/.env and set JWT_SECRET_KEY and ADMIN_PASSWORD.");
  }
  process.exit(code);
}

if (!existsSync(python)) {
  console.error("Backend not set up yet. Run: npm run backend:setup");
  process.exit(1);
}
if (!existsSync(path.join(backendDir, ".env"))) {
  console.error("Missing backend/.env. Copy backend/.env.example to backend/.env first.");
  process.exit(1);
}
process.exit(await run(python, ["run.py"]));
