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
const cfonts = require("cfonts");
const fs = require("fs");
const { exec } = require("child_process");
let useYarn = false;
const args = process.argv.slice(2);
const color = chalk.magenta;
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

  await execute(`rm -rf ${paths.nodeModules}/${scope}`);

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

      const corePkg = checkPackageInfo(core);
      const pkgInfo = checkPackageInfo(pkg.name);

      if (pkgInfo && corePkg) {
        const version = corePkg.version;
        if (pkgInfo.version !== version) {
          console.log(
            color(
              `Installing library ${libraryName}@${version} using ${
                useYarn ? "Yarn" : "NPM"
              }`
            )
          );
          // await execute(`${commands.remove()} ${libraryName}`);
          await execute(`${commands.install()} ${libraryName}@${version}`);
        }
      } else {
        console.log(
          color(
            `Installing library ${libraryName}@${tag} using ${
              useYarn ? "Yarn" : "NPM"
            }`
          )
        );
        await execute(`${commands.install()} ${libraryName}@${tag}`);
      }

      if (externalTypes.length > 0)
        await execute(
          `${commands.install()} -D ${getTypeLibraries(externalTypes)}`
        );
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
      error(
        `A version of @faharmony/core must be installed before installing other packages. \nTry running command again without any package parameters.`
      )
    );
  return 0;
};

const harmonyInfo = async () => {
  console.log(color(`Finding harmony libraries in this project...`));
  let count = 0;
  await asyncForEach(
    mainPackages.concat(commonPackages),
    /** @param {Package} pkg */
    (pkg) => {
      const pkgInfo = checkPackageInfo(pkg.name);
      if (pkgInfo) {
        count++;
        console.log(
          color(`[${pkgInfo.tag}] ${bold(pkgInfo.name)}@${pkgInfo.version}`)
        );
      }
    }
  );
  if (count === 0)
    console.log(error(`No harmony libraries found in this project.`));
  else console.log(color(`${count} harmony libraries found in this project.`));
  return 0;
};

const harmonyVersion = async () => {
  const corePkg = checkPackageInfo(core);
  if (corePkg)
    console.log(
      color(
        `Currently, installed version of harmony is ${bold(
          corePkg.version
        )} (tag:${corePkg.tag}).`
      )
    );
  else
    console.log(
      error(`No installed version of harmony found in this project.`)
    );
};

const checkParameter = async () => {
  const param = args[0].trim().toLowerCase();
  console.log(color(`Param: ${bold(param)}\n`));
  switch (param) {
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
    case "info":
      await harmonyInfo();
      break;
    case "version":
      await harmonyVersion();
      break;
    case "help":
      console.log(color("Read about the CLI on GitHub at"));
      console.log(link(webLink));
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
  // HEADER
  console.log("\n");
  cfonts.say("harmony", {
    font: "tiny",
    colors: ["magenta"],
    space: false,
  });
  console.log(
    bold(` ${Array(31).join("—")}\n  welcome to harm☯️ny installer\n`)
  );

  // CHECK YARN
  const yarnVersion = await execute(`yarn --version`, "", false);
  if (yarnVersion.length < 20) useYarn = fs.existsSync(paths.yarnLock);

  // BODY
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

  // FOOTER
  console.log(color("\nWrapping up Harmony installer...\n"));
  if (!useYarn) await execute(`npm dedupe`);
  console.log(color("Made with 💜 at FA Solutions Oy."));
  console.log(link(webLink));
  console.log("");
})();
// END
