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
  asyncForEach,
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
  getPackageObject,
} from "./utilities";

import { IPackage, IInstallOptions, IMessages } from "./types";

// INSTALL

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
    const typesCommand = `${commands.install()} --no-save ${typeLibraries}`;
    if (types.length > 0) await execute(typesCommand);
  } catch {
    console.log(error(messages?.error || "Error occurred."));
  }
};

/** Function to install one package depending on tag/version */
const installPackage = async (tag: string, pkg: IPackage, options = "") => {
  const { name, types } = pkg;
  // Install message
  const message = `Installing package ${getLibraryName(
    name
  )}@${tag} using ${outputs.manager()}`;
  console.log(color(message));
  // Install exec
  await execute(
    `${commands.install()} ${getLibraryName(pkg.name)}@${tag} ${options}`,
    `${getLibraryName(name)}@${tag.toUpperCase()} installed successfully.`
  );
  // Install types
  /** @type string[] */
  const externalTypes = types || [];
  if (externalTypes.length > 0)
    await execute(
      `${commands.install()} --no-save ${getTypeLibraries(externalTypes)}`
    );
};

/** Function to install packages depending on tag */
const installPackages = async (
  tag: string = "latest",
  packageNames: string[] = []
) => {
  if (packageNames.length === 0) {
    mainPackages.forEach((pkg) => {
      if (checkPackageInfo(pkg.name)) packageNames.push(pkg.name);
    });
    if (!packageNames.includes(core)) packageNames.push(core);
  }

  /** @type Package[] */
  const toInstallPackages = mainPackages.filter((main) =>
    packageNames.includes(main.name)
  );

  await execute(`rm -rf ${paths.nodeModules}/${scope}`);

  for (const pkg of toInstallPackages) await installPackage(tag, pkg);

  // Update common deps to match tagged version
  for (const pkg of commonPackages) {
    const log = (name: string, version: string) =>
      console.log(
        color(
          `Installing library ${name}@${version} using ${outputs.manager()}`
        )
      );
    const libraryName = getLibraryName(pkg.name);
    const externalTypes = pkg.types || [];

    const corePkg = checkCore();
    const pkgInfo = checkPackageInfo(pkg.name);

    if (pkgInfo && corePkg) {
      const version = corePkg.version;
      if (pkgInfo.version !== version) {
        log(libraryName, version);
        await execute(
          `${commands.install()} ${libraryName}@${version} --no-save`
        );
      }
    } else {
      log(libraryName, tag);
      await execute(`${commands.install()} ${libraryName}@${tag} --no-save`);
    }

    if (externalTypes.length > 0)
      await execute(
        `${commands.install()} -D ${getTypeLibraries(externalTypes)}`
      );
  }

  await asyncForEach(commonPackages, async (pkg: IPackage) => {
    const libraryName = getLibraryName(pkg.name);
    const externalTypes = pkg.types || [];

    const corePkg = checkCore();
    const pkgInfo = checkPackageInfo(pkg.name);

    if (pkgInfo && corePkg) {
      const version = corePkg.version;
      if (pkgInfo.version !== version) {
        console.log(
          color(
            `Installing library ${libraryName}@${version} using ${outputs.manager()}`
          )
        );
        // await execute(`${commands.remove()} ${libraryName}`);
        await execute(`${commands.install()} ${libraryName}@${version}`);
      }
    } else {
      console.log(
        color(
          `Installing library ${libraryName}@${tag} using ${outputs.manager()}`
        )
      );
      await execute(`${commands.install()} ${libraryName}@${tag}`);
    }

    if (externalTypes.length > 0)
      await execute(
        `${commands.install()} -D ${getTypeLibraries(externalTypes)}`
      );
  });

  if (!useYarn) await execute(`npm dedupe`);
};

/** Install a main package according to command param */
const installMainPackage = async (packageName: string) => {
  const corePkg = checkCore();
  const pkg = getPackageObject(packageName);
  if (corePkg && pkg) {
    const messages: IMessages = {
      init: `Installing package ${getLibraryName(packageName)}@${
        corePkg.tag
      } using ${outputs.manager()}`,
      success: `${getLibraryName(packageName)}@${
        corePkg.tag
      } installed successfully.`,
    };
    await install({ messages, version: corePkg.tag, pkg });
  } else {
    console.log(
      error(
        `A version of @faharmony/core must be installed before installing other packages. 
Try running command again with tag params or no params (for latest).`
      )
    );
    getHelp();
  }
  return;
};

// PARAM based installers

const paramInstallPackage = async () => {
  const packageName = args[1] ? args[1].trim().toLowerCase() : "";
  if (packageName === "")
    console.log(error(`Package name was not provided in command.`));
  else if (packageName === core) await installPackages();
  else if (getPackageObject(packageName)) await installMainPackage(packageName);
  else {
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
      await installPackages("latest", []);
      return;
    case "rc":
    case "freeze":
      await installPackages("RC", []);
      return;
    case "snapshot":
    case "dev":
      await installPackages("SNAPSHOT", []);
      return;
    default:
      console.log(error(`Package name is incorrect.`));
      getHelp();
      return;
  }
};

export {
  installPackages,
  installPackage,
  paramInstallPackage,
  paramInstallTag,
};
