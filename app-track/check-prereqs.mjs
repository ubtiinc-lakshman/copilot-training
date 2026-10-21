// Run before Day 2:  node app-track/check-prereqs.mjs
// Checks what the optional Order Desk app track needs on this machine.
import { execSync } from "node:child_process";

const run = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 20000 }).trim();
  } catch {
    return null;
  }
};
const atLeast = (v, [maj, min]) => {
  const [a, b] = v.replace(/^v/, "").split(".").map(Number);
  return a > maj || (a === maj && b >= min);
};

let failed = 0;
const report = (ok, label, info = "", warnOnly = false, fix = "") => {
  if (!ok && !warnOnly) failed++;
  const detail = ok ? info : fix || info;
  console.log(`${ok ? "PASS" : warnOnly ? "WARN" : "FAIL"}  ${label}${detail ? " - " + detail : ""}`);
};

const node = process.version;
report(atLeast(node, [22, 12]), "Node.js 22.12 or newer", `found ${node}`);

const npm = run("npm -v");
report(!!npm && Number(npm.split(".")[0]) >= 10, "npm 10 or newer", npm ? `found ${npm}` : "npm not found");

const git = run("git --version");
report(!!git, "Git installed", git ?? "git not found");
report(!!run("git config user.name") && !!run("git config user.email"), "Git user.name and user.email set", "", false, 'run: git config --global user.name "Your Name" and git config --global user.email you@company.com');

const ping = run("npm ping");
report(ping !== null, "Can reach the npm registry", "", false, "set your proxy: npm config set proxy <url> and npm config set https-proxy <url>");

report(!/onedrive|sharepoint/i.test(process.cwd()), "Not inside a OneDrive/SharePoint synced folder", "", true, `you are in ${process.cwd()}. Create the app in a plain folder like C:\\work (sync breaks node_modules)`);

console.log(failed ? `\n${failed} check(s) failed. Fix them before Day 2.` : "\nAll required checks passed.");
process.exit(failed ? 1 : 0);
