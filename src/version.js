#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

const { color, bold, error } = require("./constants");
const { checkCore, getHelp } = require("./utilities");

/** Check version of installed harmony packages */
const harmonyVersion = async () => {
  const corePkg = checkCore();
  if (corePkg) {
    console.log(
      color(
        `Installed version of harmony is \n${bold(corePkg.version)} (tag:${
        corePkg.tag
        }).`
      )
    );
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
