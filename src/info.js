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

const {
  commonPackages,
  mainPackages,
  core,
  color,
  bold,
  error,
  asyncForEach,
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
Use param --help / -h for help.`)
    );
  else console.log(color(`${count} harmony libraries found in this project.`));
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
Use param --help / -h for help.`)
    );
};


// const { params } = require('./params');

// /** Check version of installed harmony packages */
// const harmonyHelp = async () => {
//   console.log("Usage: " + bold("npx faharmony/cli [param]"));
//   console.log(
//     "\nwhere param (optional, case-insensitive) is one of the following:"
//   );
//   const whiteBold = chalk.bold;
//   const green = chalk.green;
//   const tab = "  ";
//   console.log(params)
//   for (const type in params) {
//     console.log("\n" + whiteBold(type.toUpperCase() + " params"));
//     const desc = params[type].description;
//     desc && console.log(desc + "\n");
//     for (const param in params[type]) {
//       if (param !== "description") {
//         const pObj = params[type][param];
//         console.log(tab + whiteBold(pObj.param.join(", ")));
//         pObj.description && console.log(tab + tab + pObj.description);
//         pObj.example && console.log(tab + tab + "Eg. " + green(pObj.example));
//       }
//     }
//   }
// };

module.exports = { harmonyAbout, harmonyInfo, harmonyVersion };
