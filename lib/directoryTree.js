"use strict";

const FS = require("fs");
const PATH = require("path");
const GIT = require("simple-git/promise");
const config = require("./config");
const homedir = config.HOME_PATH;

function safeReadDirSync(path) {
  let dirData = {};
  try {
    dirData = FS.readdirSync(path);
  } catch (ex) {
    if (ex.code == "EACCES")
      //User does not have permissions, ignore directory
      return null;
    else throw ex;
  }
  return dirData;
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp;
}

function cleanUpPath(path) {
  const stripSource = path.replace(config.SOURCE_PATH, "");
  let cleanPath = "";

  // If clean path is empty string means it's root of the code repo
  if (stripSource === "") {
    cleanPath = "/";
  } else if (stripSource.indexOf("/") === 0) {
    cleanPath = stripSource.substring(1);
  }

  return cleanPath;
}

/**
 *
 * @param {*} path - a RELATIVE SUB PATH from the root of the
 *                   directory tree parsing.
 * @param {*} options
 *  - exclude: Folders not to go into when parsing the directory tree
 */
async function directoryTree(path, options) {
  const basePath = homedir;
  const fullPath = PATH.resolve(homedir, path);
  const cleanPath = cleanUpPath(path);

  // Strip the source path from the beginning of the string
  const item = { path: cleanPath };
  let stats;

  try {
    stats = FS.statSync(fullPath);
  } catch (e) {
    return null;
  }

  // Skip if it matches the exclude regex
  if (options && options.exclude) {
    const excludes = isRegExp(options.exclude) ? [options.exclude] : options.exclude;
    if (excludes.some(exclusion => exclusion.test(fullPath))) {
      return null;
    }
  }

  if (stats.isDirectory()) {
    let dirData = safeReadDirSync(fullPath);
    if (dirData === null) return null;

    /**
     * This directory does not contain .git so keep going
     * On the first instance of .git in the tree we stop
     */
    if (!dirData.includes(".git")) {
      const children = await Promise.all(
        dirData.map(async child => {
          return await directoryTree(PATH.join(path, child), options);
        })
      );

      item.children = children.filter(e => !!e);
    } else {
      // Get git repo details
      const repo = GIT(fullPath);
      const remotes = await repo.getRemotes(true);
      item.remotes = remotes;
    }
  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }
  return item;
}

module.exports = directoryTree;
