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

import {
  args,
  color,
  error,
  scope,
  core,
  commonPackages,
  mainPackages,
  paths,
  commands,
  useYarn,
  outputs,
  tags,
} from "./constants";

import {
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
  getPackageObject,
} from "./utilities";

import { IInstallOptions, IMessages, IInstallPackagesOptions } from "./types";

// INSTALL

const getInstallMessages = (name: string, version: string): IMessages => ({
  init: `[${outputs.manager()}] Install: ${getLibraryName(name)}@${version}`,
  success: `✓ Successfully installed`,
  error: `× Error occurred during installation`,
});

const noCoreErrorLog = () => {
  console.log(
    error(
      `A version of @faharmony/core must be installed before installing other packages. 
Try running command again with tag params or no params (for latest).`
    )
  );
  getHelp();
};

/** Function to install one package depending on tag/version */
const install = async ({
  pkg: { name, types = [] },
  version,
  options = "",
  messages,
}: IInstallOptions) => {
  try {
    // Init
    console.log(color(messages?.init));
    // Install exec
    const library = getLibraryName(name) + "@" + version;
    const command = `${commands.install()} ${library} ${options}`;
    await execute(command, messages?.success);
    // Install types
    const typeLibraries = getTypeLibraries(types);
    const typesCommand = `${commands.install()} -D ${typeLibraries}`;
    if (types.length > 0) await execute(typesCommand);
  } catch {
    console.log(error(messages?.error || "Error occurred."));
  }
};

const installCommonPackages = async (version: string = "latest") => {
  const corePkg = checkCore();
  if (corePkg) {
    // If core is installed
    const coreVersion = corePkg.version;
    console.log("Version:", coreVersion, "\n");
    // Update common deps to match tagged version
    for (const pkg of commonPackages) {
      const { name: cName, types: cTypes = [] } = pkg;
      const pkgInfo = checkPackageInfo(cName);

      const toInstallVersion = pkgInfo
        ? // If common package is installed.
          coreVersion !== pkgInfo.version
          ? // If installed cPackage doesn't match core version.
            coreVersion
          : // Package matched coreVersion
            undefined
        : // If cPackage is not found
          version;

      if (toInstallVersion) {
        await install({
          pkg,
          version: toInstallVersion,
          messages: getInstallMessages(cName, toInstallVersion),
        });
      }

      // Install cTypes
      if (cTypes.length > 0)
        await execute(`${commands.install()} -D ${getTypeLibraries(cTypes)}`);
    }
  } else {
    noCoreErrorLog();
  }
};

/** Function to install multiple packages */
const installPackages = async ({
  packageNames = [core],
  version = "latest",
}: IInstallPackagesOptions) => {
  // Prepare a list of installed packages
  mainPackages.forEach(({ name }) => {
    if (checkPackageInfo(name) && name !== core) packageNames.push(name);
  });
  // Get package objects for installed packages
  const packagesToInstall = mainPackages.filter((main) =>
    packageNames.includes(main.name)
  );

  // Remove harmony's node_modules
  await execute(`rm -rf ${paths.nodeModules}/${scope}`);

  // Install main packages
  for (const pkg of packagesToInstall)
    await install({
      version,
      pkg,
      messages: getInstallMessages(pkg.name, version),
    });

  // Update common deps to match tagged version
  await installCommonPackages(version);

  // Dedupe
  if (!useYarn) await execute(`npm dedupe`);
};

// PARAM based installers

const paramInstallPackage = async () => {
  const packageName = args[1] ? args[1].trim().toLowerCase() : "";
  if (packageName === "")
    // No package name provided
    console.log(error(`Package name was not provided in command.`));
  else if (packageName === core)
    // Package name is core
    await installPackages({ version: checkCore()?.version || "latest" });
  else if (getPackageObject(packageName)) {
    // Any other main package name than core
    const corePkg = checkCore();
    const pkg = getPackageObject(packageName);
    if (corePkg && pkg) {
      // Install main package
      await install({
        messages: getInstallMessages(packageName, corePkg.tag),
        version: corePkg.tag,
        pkg,
      });
    } else noCoreErrorLog();
  } else {
    // No match for package name
    console.log(error(`Package name is incorrect.`));
    getHelp();
  }
};

const paramInstallTag = async () => {
  const tag = args[1] ? args[1].trim().toLowerCase() : "";
  if (tag === "") {
    console.log(error(`Tag was not provided in command.`));
    console.log("[ " + tags.join(", ") + " ]");
    return;
  }
  switch (tag) {
    case "latest":
    case "stable":
      await installPackages({ version: "latest" });
      return;
    case "rc":
    case "freeze":
      await installPackages({ version: "RC" });
      return;
    case "snapshot":
    case "dev":
      await installPackages({ version: "SNAPSHOT" });
      return;
    default:
      console.log(error(`Package name is incorrect.`));
      getHelp();
      return;
  }
};

export { paramInstallPackage, paramInstallTag, installPackages, install };
