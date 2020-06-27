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
const chalk = require("chalk");
const cfonts = require("cfonts");
const fs = require("fs");
const { exec } = require("child_process");
let useYarn = false;
const args = process.argv.slice(2);
const color = chalk.magenta;

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
const paths = {
  nodeModules: process.cwd() + "/node_modules/",
  yarnLock: process.cwd() + "/yarn.lock",
};

// Commands
const commands = {
  install: () => (useYarn ? `yarn add` : `npm install`),
  remove: () => (useYarn ? `yarn remove` : `npm uninstall`),
};

// HELPERS

/** Makes the script silently ignore them error. */
process.on("unhandledRejection", console.log); // throw err;

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
        showError && console.error(chalk.red(`error: ${error.message}`));
        resolve(error.message);
        return;
      }
      if (message !== "") console.log(color.bold(message + "\n"));
      resolve(stdout ? stdout : stderr);
    });
  });

/** Custom async forEach method
 * @param {any[]} a @param {Function} c */
async function asyncForEach(a, c) {
  for (let i = 0; i < a.length; i++) await c(a[i], i, a);
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
      console.log(
        color(
          `Installing library ${getLibraryName(pkg.name)}@${tag} using ${
            useYarn ? "Yarn" : "NPM"
          }`
        )
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
  await asyncForEach(
    commonPackages,
    /** @param {Package} pkg */
    async (pkg) => {
      const libraryName = getLibraryName(pkg.name);
      const externalTypes = pkg.types || [];
      console.log(
        color(
          `Installing library ${libraryName}@${tag} using ${
            useYarn ? "Yarn" : "NPM"
          }`
        )
      );
      try {
        const version = checkPackageInfo(core).version;
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

/** Install a main package according to command param
 * @param {string} pkg */
const installMainPackage = async (pkg) => {
  const corePkg = checkPackageInfo(core);
  if (corePkg) await installPackages(corePkg.tag, [pkg]);
  else
    console.log(
      chalk.red(
        `A version of @faharmony/core must be installed before installing other packages. \nTry running command again without any package parameters.`
      )
    );
  return 0;
};

const harmonyVersion = async () => {
  const corePkg = checkPackageInfo(core);
  if (corePkg)
    console.log(
      color(
        `Current version of harmony is ${color.bold(corePkg.version)} (tag:${
          corePkg.tag
        }).`
      )
    );
  else
    console.log(
      chalk.red(`No installed version of harmony found in this project.`)
    );
};

const checkParameter = async () => {
  switch (args[0].trim().toLowerCase()) {
    // Tag params
    case "rc":
      await installPackages("RC", []);
      break;
    case "snapshot":
      await installPackages("SNAPSHOT", []);
      break;
    case "latest":
    case "stable":
      await installPackages("latest", []);
      break;

    // Package params
    case "table":
    case "form":
    case "charts":
      await installMainPackage(args[0]);
      break;

    // Info params
    case "version":
      await harmonyVersion();
      break;

    // No match
    default:
      console.log(
        chalk.red.bold(
          "The command is incorrect. Check the param or run command without any param."
        )
      );
  }
};

// START
(async () => {
  console.log("\n");
  cfonts.say("harmony", {
    font: "tiny",
    colors: ["magenta"],
    space: false,
  });
  console.log(
    color.bold(` ${Array(31).join("—")}\n welcome to ☯️ harmony installer\n`)
  );

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

  console.log(color("\nWrapping up Harmony installer...\n"));
})();
// END
