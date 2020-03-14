const execa = require("execa");
const emoji = require("node-emoji");
const chalk = require("chalk");
const fs = require("fs");

const e_arrows = emoji.get("fast_forward");
const e_rocket = emoji.get("rocket");

(async () => {
  try {
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log(`${e_arrows} ${chalk.yellow("Building...")}`);
    await execa("npm", ["run", "build"]);
    // Understand if it's dist or build folder
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log(`${e_arrows} ${chalk.yellow("Pushing...")}`);
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", "master"]);
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log(
      `${e_rocket} ${chalk.green("Successfully deployed")} ${e_rocket}`
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
