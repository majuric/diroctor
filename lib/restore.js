/**
 * Restore the directory tree based on previouslt stored config
 */
const loadJsonFile = require("load-json-file");
const jetpack = require("fs-jetpack");
const PATH = require("path");
const git = require("simple-git/promise");
const config = require("./config");

function restoreChildren(path, children) {
  // Create the folder for the children if it does not exist already
  jetpack.dir(path);

  children.forEach(child => {
    /**
     * If a directory has 'children' that means it's not a git repo]
     * but a folder tree with potential subrepos
     */
    if (child.children) {
      const restorePath = PATH.resolve(config.HOME_PATH, config.RESTORE_PATH, child.path);
      // Recursion
      restoreChildren(path, child.children);
    } else {
      const remotes = child.remotes;

      /** There was a git repo but it was never pushed to remote */
      if (!remotes[0]) {
        // Skip this repo since we don't know the remote
        return;
      }

      // If the path of this repo exists on the filesystem skip clone since it'll fail
      const repoPath = PATH.resolve(path, child.path);
      if (!jetpack.exists(repoPath)) {
        const origin = remotes[0].refs.fetch;
        const repo = git(path);
        repo.clone(origin, repoPath);
      } else {
        console.log(`Skipping repo ${repoPath}. Repository already exists on this location.`);
      }
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
