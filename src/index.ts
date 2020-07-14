#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

import { args, color, bold, link, webLink } from "./constants";
import { checkCore } from "./utilities";
import { installPackages } from "./install";
import { checkParam } from "./params";
// Greetings
const message = "Welcome to FA harm☯️ny CLI ";
const length = message.length + 4;
const line = Array(length).join("━");
const space = Array(length).join(" ");
const params = args.length ? `Param: ${args.join(" ")}` : "No param";
const paramsSpace = Array(message.length - params.length).join(" ");
const topLine = `┏${line}┓`;
const messageLine = `┃  ${bold(message)}  ┃`;
const spaceLine = `┃${space}┃`;
const bottomLine = `┗${line}┛`;
const paramLine = `┃  ${params}${paramsSpace}  ┃`;

// START
(async () => {
  // Header
  console.log(`\n${topLine}\n${messageLine}\n${paramLine}\n${bottomLine}\n`);

  if (args.length > 0) {
    // Match command parameter and perform
    await checkParam();
  } else {
    const corePkg = checkCore();
    if (corePkg) {
      // Update preinstalled libraries
      await installPackages(corePkg.tag, []);
    } else {
      // If core package is not installed,
      // then install version with @latest tag.
      await installPackages("latest");
    }
  }

  // FOOTER
  console.log(
    `${color("\nMade with 💜 at FA Solutions Oy.")}\n${link(
      webLink
    )}\n${line}━━`
  );
})();
// END
