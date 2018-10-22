const homedir = require("os").homedir();
const path = require("path");
const fs = require("fs");
const program = require("commander");
const treeFile = ".diroctor.lock";
const dirTree = require("./lib/directoryTree");
const restore = require("./lib/restore");
const config = require("./lib/config");

program
  .version("0.1.0")
  .option("-i, --install", "Re-install repository directory tree")
  .parse(process.argv);

if (program.install) {
  console.log("Re installing the repository directory tree");
  restore();
} else {
  console.log("Storing the new repository directory tree");
  // Get the tree as JSON
  dirTree(config.SOURCE_PATH, { exclude: /node_modules/ })
    .then(tree => {
      fs.writeFileSync(path.resolve(homedir, treeFile), JSON.stringify(tree, null, 2), "utf-8");
    })
    .catch(error => {
      console.error(error);
    });
}
