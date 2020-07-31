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
  if (moduleId === "") {
    console.log(error(`ModuleID was not provided in command.`));
    getHelp();
    return;
  }

  // const Module = "module";
  // const modulePkgInfo = checkPackageInfo(Module);
  // const pkgObj = getPackageObject(Module);
  // pkgObj &&
  //   (await install({
  //     pkg: pkgObj,
  //     version: (modulePkgInfo && modulePkgInfo.tag) || "latest",
  //     options: "--no-save",
  //   }));
  console.log(color(`Initiating module generator script...`));

  const pathPlop = `${paths.nodeModules}${scope}/cli/bin/plop.js`;
  // const pathPlop = `${paths.nodeModules}.bin/faharmony/cli/bin/plop.js`;
  // const pathPlop = `./plop.js`;
  if (await execute(`npx plop --plopfile ${pathPlop} ${moduleId}`, true))
    console.log(success(`New module "${moduleId}" is generated.`));
  return;
};

export { generateModule };
