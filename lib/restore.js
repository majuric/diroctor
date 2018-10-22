/**
 * Restore the directory tree based on previouslt stored config
 */
const loadJsonFile = require("load-json-file");
const jetpack = require("fs-jetpack");
const PATH = require("path");
const git = require("simple-git/promise");
const config = require("./config");

function restoreChildren(path, children) {
  console.log(`Directory ${path}`);
  // Create the folder for the children if it does not exist already
  jetpack.dir(path);

  children.forEach(child => {
    console.log("child :", child);

    /**
     * If a directory has 'children' that means it's not a git repo]
     * but a folder tree with potential subrepos
     */
    if (child.children) {
      const restorePath = PATH.resolve(config.HOME_PATH, config.RESTORE_PATH, child.path);
      restoreChildren(path, child.children);
    } else {
      // Check out the repo
      const remotes = child.remotes;

      /** There was a git repo but it was never pushed to remote */
      if (!remotes[0]) {
        // Skip this repo since we don't know the remote
        return;
      }

      const origin = remotes[0].refs.fetch;
      const repo = git(path);
      repo.clone(origin);
    }
  });
}

function restore() {
  // Read the config file, if file does not exist exit
  const diroctorJSONFile = PATH.resolve(config.HOME_PATH, config.RESTORE_DIRECTORY_TREE_FILE);

  if (!jetpack.exists(diroctorJSONFile)) {
    console.warn(
      "Repository directory file is not availabe. Check if the file location is good or run diroctor first to create the config file."
    );

    return;
  }

  const tree = loadJsonFile.sync(diroctorJSONFile);
  const restorePath = PATH.resolve(config.HOME_PATH, config.RESTORE_PATH);

  restoreChildren(restorePath, tree.children);
}

module.exports = restore;
