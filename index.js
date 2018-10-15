const dirTree = require("./lib/directoryTree");
const treeFile = ".diroctor.lock";
const homedir = require("os").homedir();
const path = require("path");
const fs = require("fs");

// Get the tree as JSON
const tree = dirTree("code", { exclude: /node_modules/ })
  .then(tree => {
    const util = require("util");

    //   console.log(util.inspect(tree, false, null, true /* enable colors */));

    fs.writeFileSync(path.resolve(homedir, treeFile), JSON.stringify(tree, null, 2), "utf-8");
  })
  .catch(error => {
    console.error(error);
  });
