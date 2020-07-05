#!/usr/bin/env node
// @ts-check
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

// VARIABLES
/** @typedef {{name: string; types?: string[] }} Package */

const { args, color, bold, link, webLink, chalk, core } = require("./common");
const {
  installMainPackage,
  installPackages,
  checkPackageInfo,
  generateModule,
} = require("./install");
const {
  harmonyAbout,
  harmonyInfo,
  harmonyVersion,
  harmonyHelp,
} = require("./info");

const checkParameter = async () => {
  const param = args[0].trim().toLowerCase();
  switch (param) {
    // Tag params
    case "--rc":
      await installPackages("RC", []);
      break;
    case "--snapshot":
    case "-s":
      await installPackages("SNAPSHOT", []);
      break;
    case "--latest":
    case "--stable":
      await installPackages("latest", []);
      break;

    // Package params
    case "table":
    case "form":
    case "charts":
      await installMainPackage(args[0]);
      break;

    // Info params
    case "--about":
    case "-a":
      await harmonyAbout();
      break;
    case "--info":
    case "-i":
      await harmonyInfo();
      break;
    case "--version":
    case "-v":
      await harmonyVersion();
      break;
    case "--help":
    case "-h":
      await harmonyHelp();
      break;

    // Other param
    case "--module":
    case "-m":
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

const header = () => {
  const message = "Welcome to FA harm☯️ny CLI.";
  const length = message.length + 4;
  const line = Array(length).join("━");
  const space = Array(length).join(" ");
  const params = args.length ? `Param: ${args.join(" ")}` : "No param";
  const paramsSpace = Array(message.length - params.length).join(" ");
  const topLine = `┏${line}┓`;
  const middleLine = `┃  ${bold(message)}  ┃`;
  const spaceLine = `┃${space}┃`;
  const bottomLine = `┗${line}┛`;
  const paramLine = `┃  ${params}${paramsSpace}  ┃`;
  const box = `\n${topLine}\n${middleLine}\n${paramLine}\n${bottomLine}\n`;
  console.log(box);
};

const footer = () => {
  console.log(color("\nMade with 💜 at FA Solutions Oy."));
  console.log(link(webLink) + "\n");
};

// START
(async () => {
  header();

  if (args.length > 0) {
    // Match command parameter and perform
    await checkParameter();
  } else {
    const corePkg = checkPackageInfo(core);
    if (corePkg) {
      // Update preinstalled libraries
      await installPackages(corePkg.tag, []);
    } else {
      // If core package is not installed,
      // then install version with @latest tag.
      await installPackages("latest");
    }
  }

  footer();
})();
// END
