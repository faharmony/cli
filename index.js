#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 */
// @ts-check

// VARIABLES
/** @typedef {{name: string; types?: string[] }} Package */

/** @type {any} */
let chalk;
try {
  chalk = require("chalk");
} catch {
  chalk = null;
}
const fs = require("fs");
const { exec } = require("child_process");
let useYarn = false;
const args = process.argv.slice(2);

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

// Paths
const paths = { nodeModules: "../node_modules/", yarnLock: "../yarn.lock" };

// Commands
const commands = {
  install: () => (useYarn ? `yarn add` : `npm install`),
  remove: () => (useYarn ? `yarn remove` : `npm uninstall`),
};

// HELPERS

/** Makes the script silently ignore them error. */
process.on("unhandledRejection", () => {}); // throw err;

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

/** Execute shell command with success message
 * @param {object} command @param {string!} message @return {Promise<string>} */
const execute = (command, message = "", showError = true) =>
  new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        showError &&
          console.error(
            chalk
              ? chalk.red(`error: ${error.message}`)
              : `error: ${error.message}`
          );
        resolve(error.message);
        return;
      }
      if (message !== "")
        console.log(
          chalk ? chalk.magenta.bold(message + "\n") : message + "\n"
        );
      resolve(stdout ? stdout : stderr);
    });
  });

/** Custom async forEach method
 * @param {any[]} array @param {Function} callback */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++)
    await callback(array[index], index, array);
}

/** Function to install packages depending on tag
 * @param {object} tag @param {string[]} packages */
const installPackages = async (tag = "latest", packages = []) => {
  if (packages.length === 0) {
    mainPackages.forEach((pkg) => {
      if (checkPackageInfo(pkg.name)) packages.push(pkg.name);
    });
    if (!packages.includes(core)) packages.push(core);
  }

  /** @type Package[] */
  const toInstallPackages = mainPackages.filter((main) =>
    packages.includes(main.name)
  );

  await asyncForEach(
    toInstallPackages,
    /** @param {Package} pkg */
    async (pkg) => {
      const messageInstallStart = `Installing library ${getLibraryName(
        pkg.name
      )}@${tag} using ${useYarn ? "Yarn" : "NPM"}:`;
      console.log(
        chalk ? chalk.magenta(messageInstallStart) : messageInstallStart
      );
      const externalTypesMain = pkg.types || [];
      await execute(
        `${commands.install()} ${getLibraryName(pkg.name)}@${tag}`,
        `${tag.toUpperCase()} version of ${getLibraryName(
          pkg.name
        )} and its dependencies installed successfully.`
      );
      if (externalTypesMain.length > 0)
        await execute(
          `${commands.install()} -D ${getTypeLibraries(externalTypesMain)}`
        );
    }
  );

  // Update common deps to match tagged version
  const version = checkPackageInfo(core).version;
  await asyncForEach(
    commonPackages,
    /** @param {Package} pkg */
    async (pkg) => {
      const libraryName = getLibraryName(pkg.name);
      const externalTypes = pkg.types || [];
      const messageLibraryUpdate = `Installing library ${libraryName}@${tag} using ${
        useYarn ? "Yarn" : "NPM"
      }`;
      console.log(
        chalk ? chalk.magenta(messageLibraryUpdate) : messageLibraryUpdate
      );
      try {
        if (checkPackageInfo(pkg.name).version !== version) {
          await execute(`${commands.remove()} ${libraryName}`);
          await execute(`${commands.install()} ${libraryName}@${version}`);
        }
      } catch {
        await execute(`${commands.install()} ${libraryName}@${tag}`);
      } finally {
        if (externalTypes.length > 0)
          await execute(
            `${commands.install()} -D ${getTypeLibraries(externalTypes)}`
          );
      }
    }
  );
};

const checkParameter = async () => {
  switch (args[0].trim()) {
    // Tags
    case "RC":
    case "rc":
      await installPackages("RC", []);
      break;
    case "SNAPSHOT":
    case "snapshot":
      await installPackages("SNAPSHOT", []);
      break;
    case "LATEST":
    case "latest":
      await installPackages("latest", []);
      break;

    // Other libraries
    case "table":
    case "form":
    case "charts":
      const corePkg = checkPackageInfo(core);
      if (corePkg) await installPackages(corePkg.tag, [args[0]]);
      else
        console.log(
          chalk.red(
            `A version of @faharmony/core must be installed before installing other packages. Try running command again without any parameters.`
          )
        );
      break;
    // No match
    default:
      console.log(chalk.red.bold("The command is incorrect."));
  }
};

// START
(async () => {
  console.log(chalk.magenta.bold("\n=== Welcome to Harmony installer === \n"));

  // CHECK YARN
  const yarnVersion = await execute(`yarn --version`, "", false);
  if (yarnVersion.length < 20) useYarn = fs.existsSync(paths.yarnLock);

  if (args.length > 0) {
    // Match command parameter and perform
    await checkParameter();
  } else {
    const corePkg = checkPackageInfo(core);
    if (corePkg) {
      // Update preinstalled libraries
      await installPackages(corePkg.tag, []);
    } else {
      // If core package is not installed, then install version with @latest tag.
      await installPackages("latest");
    }
  }

  console.log(chalk.magenta("Wrapping up Harmony installer...\n"));
})();
// END
