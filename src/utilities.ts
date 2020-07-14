#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import { IPackage } from "./types";
import { bold, error, scope, paths, exec, mainPackages } from "./constants";

/** Makes the script silently ignore them error. */
process.on("unhandledRejection", console.log); // throw err;

/** Custom async forEach method */
const asyncForEach = async (a: any[], c: Function) => {
  for (let i = 0; i < a.length; i++) await c(a[i], i, a);
};

/** Execute shell command with success message */
const execute = (
  command: string,
  message: string = "",
  showError: boolean = true
): Promise<string> =>
  new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        showError && console.error(error(`error: ${err.message}`));
        resolve(err.message);
        return;
      }
      if (message !== "") console.log(bold(message + "\n"));
      resolve(stdout ? stdout : stderr);
    });
  });

const getLibraryName = (pkgName: string) => `${scope}/${pkgName}`;

const getTypeLibraries = (packages: string[]) =>
  packages.map((pkg) => `@types/${pkg}`).join(" ");

/** Check core */
const checkCore = () => {
  try {
    const pkgJson = require(process.cwd() + "/package.json");
    const version = pkgJson.dependencies["@faharmony/core"].replace("^", "");
    const tag = version.includes("RC")
      ? "RC"
      : version.includes("SNAPSHOT")
      ? "SNAPSHOT"
      : "latest";
    return { version, tag, name: pkgJson.name };
  } catch {
    return null;
  }
};

/** Get info from package.json of package */
const checkPackageInfo = (pkgName: string) => {
  try {
    const pkgJson = require(paths.nodeModules +
      getLibraryName(pkgName) +
      "/package.json");
    const version = pkgJson.version;
    const tag = version.includes("RC")
      ? "RC"
      : version.includes("SNAPSHOT")
      ? "SNAPSHOT"
      : "latest";
    return { version, tag, name: pkgJson.name };
  } catch {
    return null;
  }
};

// getHelp function
const getHelp = () => console.log("Use param --help or -h for help.");

const getPackageObject = (packageName: string) =>
  mainPackages.find((p) => p.name === packageName);

export {
  asyncForEach,
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
  getPackageObject,
};