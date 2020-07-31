#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import { IPackageInfo } from "./types";
import { error, scope, core, exec, mainPackages } from "./constants";

/** Makes the script silently ignore them error. */
process.on("unhandledRejection", console.log); // throw err;

/** Execute shell command with success message */
const execute = (
  command: string,
  showError: boolean = true
): Promise<boolean> =>
  new Promise((resolve) => {
    exec(command, (err, _, stderr) => {
      if (err) {
        showError && console.error(error(`error: ${err.message}`));
        resolve(false);
        return;
      }
      resolve(stderr ? false : true);
    });
  });

const getLibraryName = (pkgName: string) => `${scope}/${pkgName}`;

const getTypeLibraries = (packages: string[]) =>
  packages.map((pkg) => `@types/${pkg}`).join(" ");

/** Get info from package.json of package */
const checkPackageInfo = (
  packageName: string
): IPackageInfo | null | undefined => {
  try {
    const pkgJson = require(process.cwd() + "/package.json");
    const lib = getLibraryName(packageName);
    const version = pkgJson.dependencies[lib].replace("^", "");
    const tag = version.includes("RC")
      ? "RC"
      : version.includes("SNAPSHOT")
      ? "SNAPSHOT"
      : "latest";
    if (version === "0.0.1") return undefined;
    return { version, tag, name: pkgJson.name };
  } catch {
    return null;
  }
};

/** Check core */
const checkCore = () => checkPackageInfo(core);

// getHelp function
const getHelp = (err: string = "") =>
  console.log(`${error(err)}\nUse param --help or -h for help.`);

const getPackageObject = (packageName: string) =>
  mainPackages.find((p) => p.name === packageName);

export {
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
  getPackageObject,
};
