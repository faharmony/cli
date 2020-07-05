#!/usr/bin/env node
// INFO PARAMS
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

// VARIABLES
/** @typedef {{name: string; types?: string[] }} Package */

const {
  commonPackages,
  mainPackages,
  core,
  chalk,
  color,
  bold,
  error,
  asyncForEach,
  link,
  webLink,
  checkPackageInfo,
} = require("./common");

/** Learn about harmony */
const harmonyAbout = async () => {
  console.log(
    `Harmony is FA Solutions' framework
for React-based app development.

The CLI is made to manage harmony's 
packages and versioning in the apps.

Contributors:
  Siddhant Gupta (@guptasiddhant)`
  );
};

/** Get information about installed packages */
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
    console.log(
      error(`No harmony libraries found in this project.
Use param --help / -h to know more about other options.`)
    );
  else console.log(color(`${count} harmony libraries found in this project.`));
  return 0;
};

/** Check version of installed harmony packages */
const harmonyVersion = async () => {
  const corePkg = checkPackageInfo(core);
  if (corePkg)
    console.log(
      color(
        `Installed version of harmony is \n${bold(corePkg.version)} (tag:${
          corePkg.tag
        }).`
      )
    );
  else
    console.log(
      error(`No installed version of harmony found in this project.
Use param --help / -h to know more about other options.`)
    );
};

/** Check version of installed harmony packages */
const harmonyHelp = async () => {
  const help = {
    tag: {
      description:
        "A tag param allows user to decide which tagged version of harmony to install.",
      stable: {
        cmd: "--stable",
        description: "Install latest STABLE (released) version of harmony",
      },
      freeze: {
        cmd: "--rc",
        description: "Install latest RC (freeze) version of harmony",
      },
      snapshot: {
        cmd: "-s | --snapshot",
        description: "Install latest SNAPSHOT (development) version of harmony",
      },
    },
    package: {
      description:
        "A package param allows user to install other main packages of harmony. Since these packages depend on `core` package, do run the command without package params before installing these packages.",
      table: {
        cmd: "table",
        description: "Install harmony's table package",
      },
      charts: {
        cmd: "charts",
        description: "Install harmony's charts package",
      },
      form: {
        cmd: "form",
        description: "Install harmony's form package",
      },
    },
    info: {
      description:
        "An info param allows user retrieve some information about current setup.",
      about: {
        cmd: "-a | --about",
        description: "Read about harmony",
      },
      info: {
        cmd: "-i | --info",
        description: "Display installed harmony packages",
      },
      version: {
        cmd: "-v | --version",
        description: "Check installed version of harmony",
      },
      help: {
        cmd: "-h | --help",
        description: "Display help for harmony (this)",
      },
    },
    other: {
      description: "Other params can be misc. like running other scripts.",
      module: {
        cmd: "-m | --module <moduleName>",
        description:
          "Generate harmony module using plop. Requires `moduleName` as second param.",
        example: "npx faharmony/cli -m sample",
      },
    },
  };
  console.log("Usage: " + bold("npx faharmony/cli [param]"));
  console.log(
    "\nwhere param (optional, case-insensitive) is one of the following:"
  );
  const whiteBold = chalk.bold;
  const green = chalk.green;
  const tab = "  ";
  for (const type in help) {
    console.log("\n" + whiteBold(type.toUpperCase() + " params"));
    const desc = help[type].description;
    desc && console.log(desc + "\n");
    for (const param in help[type]) {
      if (param !== "description") {
        const pObj = help[type][param];
        console.log(tab + whiteBold(pObj.cmd));
        pObj.description && console.log(tab + tab + pObj.description);
        pObj.example && console.log(tab + tab + "Eg. " + green(pObj.example));
      }
    }
  }
};

module.exports = { harmonyAbout, harmonyInfo, harmonyVersion, harmonyHelp };
