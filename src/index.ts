#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import { args, color, bold, link, webLink } from "./constants";
import { params } from "./params";
import { getHelp, checkCore } from "./utilities";
import { installPackages } from "./install";

// Greetings
const welcome = "FA harm☯️ny (react-framework) CLI";
const footer = "Made with 💜 at FA Solutions Oy.";
const length = footer.length + 1;
const line = Array(length).join("━");
const paramsList = args.length ? `Param: ${args.join(" ")}` : "(No param)";
const paramsSpace = Array(welcome.length - paramsList.length).join(" ");
// const space = Array(length).join(" ");
// const topLine = `┏${line}┓`;
// const messageLine = `┃ ${bold(welcome)} ┃`;
// const spaceLine = `┃${space}┃`;
// const bottomLine = `┗${line}┛`;
// const paramLine = `┃ ${params}${paramsSpace} ┃`;

// START
(async () => {
  // Header
  console.log(`\n${line}\n${bold(welcome)}\n${paramsList}${paramsSpace}\n`);
  // PARAM CHECK
  if (args.length > 0) {
    const param = args[0].trim().toLowerCase();
    let info = { name: "", exec: () => Promise.resolve() };
    Object.entries(params).forEach(([name, obj]) => {
      if (typeof obj !== "string" && obj.param.includes(param))
        info = { name, exec: obj.exec };
    });
    // If param found, execute function
    if (info.name !== "") await info.exec();
    // Else (no match)
    else getHelp("Error: The command is incorrect.");
  } else {
    const corePkg = checkCore();
    if (corePkg) {
      // Update preinstalled libraries
      await installPackages({ version: corePkg.tag });
    } else {
      // If core package is not installed,
      // then install version with @latest tag.
      await installPackages({ version: "latest" });
    }
  }
  // FOOTER
  console.log(`${color("\n" + footer)}\n${link(webLink)}\n${line}\n`);
})();
// END
