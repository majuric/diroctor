let defaults = {
  SOURCE_PATH: "code-restore",
  DIROCTOR_LOCK_FILE: ".diroctor.lock",
  HOME_PATH: require("os").homedir()
};

/**
 * Override default values with the options passed from CLI arguments
 * @param {Object} cliOptions
 */
function mergeCLI(cliOptions) {
  defaults = { ...defaults, ...cliOptions };
}

/**
 * Return the config. Use this to get a fresh version of the config in case
 * config was changed through command line
 */
function get() {
  return defaults;
}

module.exports = {
  get,
  mergeCLI
};
