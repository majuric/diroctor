const path = require("path");
const fs = require("fs");
const program = require("commander");
const dirTree = require("./lib/directoryTree");
const restore = require("./lib/restore");
const config = require("./lib/config");
const pjson = require("./package.json");

program
  .version(pjson.version, "-v, --version") // TODO - read version from package.json
  .option("-f, --force", "Delete the contents of a restore directory if the directory is not empty") // TODO - still not implemented
  .option("-r, --restore", "Re-install repository directory tree. To specify a path use -s <path>")
  .option("-d, --diroctor-lock <path>]", "Location of the diroctor.lock file relative to the HOME directory")
  .option("-s, --source <path>", "Path to the root of git repositories relative to the HOME directory")
  .parse(process.argv);

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

const configDefaults = config.get();

const configCLIParams = {
  SOURCE_PATH: isString(program.source) ? program.source : configDefaults.SOURCE_PATH,
  DIROCTOR_LOCK_FILE: isString(program.diroctorLock) ? program.diroctorLock : configDefaults.DIROCTOR_LOCK_FILE,
  FORCE: !!program.force
};

// Override default config options to be used elsewhere
config.mergeCLI(configCLIParams);

if (program.restore) {
  console.log("Re installing the repository directory tree");
  restore();
} else {
  console.log("Storing the new repository directory tree");
  // Get the tree as JSON recursivelly, don't traverse node_modules
  dirTree(config.get().SOURCE_PATH, { exclude: /node_modules/ })
    .then(tree => {
      fs.writeFileSync(
        path.resolve(config.get().HOME_PATH, config.get().DIROCTOR_LOCK_FILE),
        JSON.stringify(tree, null, 2),
        "utf-8"
      );
    })
    .catch(error => {
      console.error(error);
    });
}
