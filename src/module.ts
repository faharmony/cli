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

import { args, color, error, scope, commonPackages, paths } from "./constants";
import {
  execute,
  checkPackageInfo,
  getHelp,
  getPackageObject,
} from "./utilities";
import { installPackage } from "./install";

/** Install/update module package and execute plop command to generate module template */
const generateModule = async () => {
  const moduleId = args[1] ? args[1].trim().toLowerCase() : "";
  if (moduleId === "") {
    console.log(error(`ModuleID was not provided in command.`));
    getHelp();
    return;
  }

  const Module = "module";
  const modulePkgInfo = checkPackageInfo(Module);
  const pkgObj = getPackageObject(Module);
  pkgObj &&
    (await installPackage(
      (modulePkgInfo && modulePkgInfo.tag) || "latest",
      pkgObj,
      "--no-save"
    ));

  console.log(color(`Initiating module generator script...`));
  const pathPlop = `${paths.nodeModules}${scope}/${Module}/plop.js`;
  await execute(
    `npx plop --plopfile ${pathPlop} ${moduleId}`,
    `New module "${moduleId}" is generated.`,
    true
  );
  return;
};

export { generateModule };
