const dirTree = require("./lib/directoryTree");

// Get the tree as JSON
const tree = dirTree("code", { exclude: /node_modules/ });

// alternative shortcut
const util = require("util");

console.log(util.inspect(tree, false, null, true /* enable colors */));
