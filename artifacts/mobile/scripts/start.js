const { spawn } = require("child_process");

const env = { ...process.env };
const isReplit = !!env.REPL_ID;
// Use PORT env var if set; fall back to 8082 locally to avoid conflicts with
// any service that may already be using 8081.
const port = env.PORT || "8082";

// Configure Replit-specific tunnel proxy variables if they exist in the env
if (env.REPLIT_EXPO_DEV_DOMAIN) {
  env.EXPO_PACKAGER_PROXY_URL = `https://${env.REPLIT_EXPO_DEV_DOMAIN}`;
}
if (env.REPLIT_DEV_DOMAIN) {
  env.EXPO_PUBLIC_DOMAIN = env.REPLIT_DEV_DOMAIN;
  env.REACT_NATIVE_PACKAGER_HOSTNAME = env.REPLIT_DEV_DOMAIN;
}
if (env.REPL_ID) {
  env.EXPO_PUBLIC_REPL_ID = env.REPL_ID;
}

// Always pass --port so Expo never prompts interactively when a port is busy.
const args = ["expo", "start", "--port", port];
if (isReplit) {
  args.push("--localhost");
}

console.log(
  `Starting Expo dev server (Platform: ${process.platform}, Port: ${port}, Mode: ${isReplit ? "Replit" : "Local"})...`
);

// Spawn the Expo packager process
const child = spawn("npx", args, {
  stdio: "inherit",
  shell: true,
  env,
});

child.on("close", (code) => {
  process.exit(code);
});
