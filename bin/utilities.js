#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

// VARIABLES
/** @typedef {{name: string; types?: string[] }} Package */

const { bold, error, scope, paths, exec } = require('./constants');

/** Makes the script silently ignore them error. */
process.on("unhandledRejection", console.log); // throw err;

/** Custom async forEach method
 * @param {any[]} a @param {Function} c */
async function asyncForEach(a, c) {
  for (let i = 0; i < a.length; i++) await c(a[i], i, a);
}

/** Execute shell command with success message
 * @param {object} command @param {string!} message @return {Promise<string>} */
const execute = (command, message = "", showError = true) =>
  new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        showError && console.error(error(`error: ${err.message}`));
        resolve(err.message);
        return;
      }
      if (message !== "") console.log(bold(message + "\n"));
      resolve(stdout ? stdout : stderr);
    });
  });

/** @param {string} pkgName */
const getLibraryName = (pkgName) => `${scope}/${pkgName}`;

/** @param {string[]} packages */
const getTypeLibraries = (packages) =>
  packages.map((pkg) => `@types/${pkg}`).join(" ");



/** Check core */
const checkCore = () => {
  try {
    const pkgJson = require(process.cwd() + "/package.json")
    const version = (pkgJson.dependencies['@faharmony/core'].replace('^', ''))
    const tag = version.includes("RC")
      ? "RC"
      : version.includes("SNAPSHOT")
        ? "SNAPSHOT"
        : "latest";
    return { version, tag, name: pkgJson.name };
  } catch {
    return null;
  }
}

/** Get info from package.json of package
 *  @param {string} pkgName */
const checkPackageInfo = (pkgName) => {
  try {
    const pkgJson = require(paths.nodeModules +
      getLibraryName(pkgName) +
      "/package.json");
    const version = pkgJson.version;
    const tag = version.includes("RC")
      ? "RC"
      : version.includes("SNAPSHOT")
        ? "SNAPSHOT"
        : "latest";
    return { version, tag, name: pkgJson.name };
  } catch {
    return null;
  }
};

// getHelp function
const getHelp = () => console.log("Use param --help or -h for help.");

module.exports = {
  asyncForEach,
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
};
