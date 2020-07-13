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

/** @type {any} */
const chalk = require("chalk");
const fs = require("fs");
const { exec } = require("child_process");
const args = process.argv.slice(2);
const color = chalk.magenta; //32127A
const bold = color.bold;
const error = chalk.red;
const link = chalk.blue;
const webLink = "https://github.com/faharmony/cli";

// Harmony libraries
const scope = "@faharmony";
const core = "core";

/** @type Package[] */
const commonPackages = [
  { name: "components" },
  { name: "globalbar" },
  { name: "helpers", types: ["uuid"] },
  { name: "hooks" },
  { name: "icons" },
  { name: "layouts" },
  { name: "locale" },
  { name: "module" },
  { name: "navigation" },
  { name: "router", types: ["react-router-dom"] },
  { name: "service" },
  { name: "state", types: ["react-redux", "webpack-env"] },
  { name: "theme" },
  { name: "views" },
];
/** @type Package[] */
const mainPackages = [
  { name: core, types: ["node", "react"] },
  { name: "table", types: ["react-table"] },
  { name: "charts", types: ["lodash"] },
  { name: "form" },
];

const tags = ['stable', 'latest', 'snapshot', 'dev', 'rc', 'freeze'];

// Paths
const paths = {
  nodeModules: process.cwd() + "/node_modules/",
  yarnLock: process.cwd() + "/yarn.lock",
};

const useYarn = fs.existsSync(paths.yarnLock);

// Commands
const commands = {
  install: () => (useYarn ? `yarn add` : `npm install`),
  remove: () => (useYarn ? `yarn remove` : `npm uninstall`),
};

const outputs = {
  manager: () => (useYarn ? "Yarn" : "NPM"),
};

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
  chalk,
  fs,
  args,
  color,
  bold,
  error,
  link,
  webLink,
  scope,
  core,
  commonPackages,
  mainPackages,
  paths,
  commands,
  asyncForEach,
  execute,
  useYarn,
  outputs,
  getLibraryName,
  getTypeLibraries,
  checkPackageInfo,
  getHelp,
  tags
};
