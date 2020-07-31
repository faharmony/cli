#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import { color, bold, pkgJsonCLI } from "./constants";
import { checkCore, getHelp } from "./utilities";

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
  } else
    getHelp(`No installed version of harmony \nfound in this application.`);

  // About
  console.log(
    `
harmony CLI contributors:`
  );
  pkgJsonCLI.contributors.forEach((n: string | { name: string }) =>
    console.log(`- %s`, typeof n === "string" ? n : n.name)
  );
};

export { harmonyVersion };
