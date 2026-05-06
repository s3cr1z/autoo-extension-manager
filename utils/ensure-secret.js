// Bootstraps src/utils/secret.js from secret.demo.js when it's missing.
//
// secret.js holds Google Analytics credentials and is git-ignored; on a
// fresh checkout (CI in particular) the file doesn't exist and webpack
// fails resolving `./secret` from `src/utils/googleAnalyze.js`. This
// script copies the placeholder demo file into place so the build can
// proceed. Real builds with real credentials are unaffected because the
// existing `secret.js` is left in place.
const fs = require("fs")
const path = require("path")

const target = path.resolve(__dirname, "..", "src", "utils", "secret.js")
const demo = path.resolve(__dirname, "..", "src", "utils", "secret.demo.js")

if (fs.existsSync(target)) {
  process.exit(0)
}
if (!fs.existsSync(demo)) {
  console.error(`[ensure-secret] Neither ${target} nor ${demo} exists; cannot bootstrap secret.js`)
  process.exit(1)
}
fs.copyFileSync(demo, target)
console.log(
  `[ensure-secret] Created ${path.relative(
    process.cwd(),
    target
  )} from secret.demo.js (placeholder GA credentials).`
)
