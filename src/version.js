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
  getHelp
} = require("./utilities");

/** Get information about installed packages */
// const harmonyInfo = async () => {
//   console.log(color(`Finding harmony libraries in this project...`));
//   let count = 0;
//   await asyncForEach(
//     mainPackages.concat(commonPackages),
//     /** @param {Package} pkg */
//     (pkg) => {
//       const pkgInfo = checkPackageInfo(pkg.name);
//       if (pkgInfo) {
//         count++;
//         console.log(
//           color(`[${pkgInfo.tag}] ${bold(pkgInfo.name)}@${pkgInfo.version}`)
//         );
//       }
//     }
//   );
//   if (count === 0) { console.log(error(`No harmony libraries found in this project.`)); getHelp(); }
//   else console.log(color(`${count} harmony libraries found in this project.`));
// };

/** Check version of installed harmony packages */
const harmonyVersion = async () => {
  const corePkg = checkPackageInfo(core);
  if (corePkg) {
    console.log(
      color(
        `Installed version of harmony is \n${bold(corePkg.version)} (tag:${
        corePkg.tag
        }).`
      )
    );
    // await harmonyInfo();
  }

  else {
    console.log(error(`No installed version of harmony \nfound in this application.`));
    getHelp();
  }

  // About
  console.log(
    `
Harmony is FA Solutions' framework
for React-based app development.

The CLI is made to manage harmony's 
packages and versioning in the apps.

Contributors:
  Siddhant Gupta (@guptasiddhant)`
  );
};

module.exports = { harmonyVersion };
