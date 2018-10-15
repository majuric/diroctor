"use strict";

const FS = require("fs");
const PATH = require("path");
const GIT = require("simple-git/promise");
const homedir = require("os").homedir();

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
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp;
}

async function directoryTree(path, options, onEachFile) {
  const basePath = homedir;
  const relativePath = PATH.resolve(homedir, path);
  path = options && options.normalizePath ? normalizePath(relativePath) : relativePath;
  const item = { path };
  let stats;

  try {
    stats = FS.statSync(path);
  } catch (e) {
    return null;
  }

  // Skip if it matches the exclude regex
  if (options && options.exclude) {
    const excludes = isRegExp(options.exclude) ? [options.exclude] : options.exclude;
    if (excludes.some(exclusion => exclusion.test(path))) {
      return null;
    }
  }

  if (stats.isDirectory()) {
    let dirData = safeReadDirSync(path);
    if (dirData === null) return null;

    /**
     * This directory does not contain .git so keep going
     * On the first instance of .git in the tree we stop
     */
    if (!dirData.includes(".git")) {
      const children = await Promise.all(
        dirData.map(async child => {
          return await directoryTree(PATH.join(path, child), options, onEachFile);
        })
      );

      item.children = children.filter(e => !!e);
    } else {
      // Get git repo details
      const repo = GIT(path);
      const remotes = await repo.getRemotes(true);
      item.remotes = remotes;
    }
  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }
  return item;
}

module.exports = directoryTree;
