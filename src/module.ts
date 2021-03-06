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

import { args, color, error, scope, paths, success } from "./constants";
import { execute, getHelp } from "./utilities";

/** Install/update module package and execute plop command to generate module template */
const generateModule = async () => {
  const moduleId = args[1] ? args[1].trim().toLowerCase() : "";
  if (moduleId === "") getHelp(`ModuleID was not provided in command.`);
  else {
    console.log(`Fetching latest module template...`);
    await execute(`yarn add faharmony/cli --no-save`);

    console.log(color(`Initiating module generator script...`));
    const pathPlop = `${paths.nodeModules}${scope}/cli/bin/modulePlop.js`;
    await execute(`npx plop --plopfile ${pathPlop} ${moduleId}`, true);
    console.log(success(`New module "${moduleId}" is generated.`));
  }
  return;
};

export { generateModule };
