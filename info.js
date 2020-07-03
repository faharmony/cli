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
  color,
  bold,
  error,
  asyncForEach,
} = require("./common");
const { checkPackageInfo } = require("./helpers");

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
    console.log(error(`No harmony libraries found in this project.`));
  else console.log(color(`${count} harmony libraries found in this project.`));
  return 0;
};

/** Check version of installed harmony packages */
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

module.exports = { harmonyAbout, harmonyInfo, harmonyVersion };
