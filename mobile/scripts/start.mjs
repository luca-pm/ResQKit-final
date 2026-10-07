// Starts Expo with the PC's Wi-Fi IP in the QR code, so the phone can reach Metro
// even when the PC is also on Ethernet / virtual adapters.
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";

function pickLanIp() {
  const candidates = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    for (const a of addrs || []) {
      if (a.family !== "IPv4" || a.internal || a.address.startsWith("169.254.")) continue;
      candidates.push({ name, address: a.address });
    }
  }
  const wifi = candidates.find((c) => /wi-?fi|wlan|wireless/i.test(c.name));
  return (wifi || candidates[0])?.address;
}

const env = { ...process.env };
if (!env.REACT_NATIVE_PACKAGER_HOSTNAME) {
  const ip = pickLanIp();
  if (ip) env.REACT_NATIVE_PACKAGER_HOSTNAME = ip;
}
console.log(`Expo host: ${env.REACT_NATIVE_PACKAGER_HOSTNAME || "(auto)"}`);

const child = spawn("npx", ["expo", "start", ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
