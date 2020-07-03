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
  args,
  color,
  bold,
  link,
  webLink,
  chalk,
  cfonts,
  core,
} = require("./common");
const {
  installMainPackage,
  installPackages,
  checkPackageInfo,
  generateModule,
} = require("./helpers");
const { harmonyAbout, harmonyInfo, harmonyVersion } = require("./info");

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
    case "about":
      await harmonyAbout();
      break;
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

    // Other param
    case "module":
      await generateModule();
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
  console.log(color("Made with 💜 at FA Solutions Oy."));
  console.log(link(webLink));
  console.log("");
})();
// END
