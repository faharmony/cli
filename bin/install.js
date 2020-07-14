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

const {
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
} = require('./constants');

const {
  asyncForEach,
  execute,
  getLibraryName,
  getTypeLibraries,
  checkCore,
  checkPackageInfo,
  getHelp,
} = require("./utilities");

// INSTALL


/** Function to install one package depending on tag/version
 * @param {{pkg:Package; version:string; options?:string; messages?:{init?:string; success?:string; error?:string;}; }} config */
const install = async ({ pkg, version, options = "", messages }) => {
  const { name, types } = pkg;
  // Start
  console.log(color(messages.init));
  // Install exec
  await execute(
    `${commands.install()} ${getLibraryName(pkg.name)}@${version} ${options}`,
    `${getLibraryName(name)}@${version} installed successfully.`
  );
  // Install types
  /** @type string[] */
  const externalTypes = types || [];
  if (externalTypes.length > 0)
    await execute(
      `${commands.install()} --no-save ${getTypeLibraries(externalTypes)}`
    );
};


/** Function to install one package depending on tag/version
 * @param {string} tag @param {Package} pkg @param {string!} options */
const installPackage = async (tag, pkg, options = "") => {
  const { name, types } = pkg;
  // Install message
  const message = `Installing package ${getLibraryName(name)}@${tag} using ${outputs.manager()}`;
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



/** Function to install packages depending on tag
 * @param {string} tag @param {string[]} packages */
const installPackages = async (tag = "latest", packages = []) => {
  if (packages.length === 0) {
    mainPackages.forEach((pkg) => {
      if (checkPackageInfo(pkg.name)) packages.push(pkg.name);
    });
    if (!packages.includes(core)) packages.push(core);
  }

  /** @type Package[] */
  const toInstallPackages = mainPackages.filter((main) =>
    packages.includes(main.name)
  );

  await execute(`rm -rf ${paths.nodeModules}/${scope}`);

  for (const pkg of toInstallPackages) await installPackage(tag, pkg);

  // Update common deps to match tagged version
  for (const pkg of commonPackages) {
    const log = (name, version) =>
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

  await asyncForEach(
    commonPackages,
    /** @param {Package} pkg */
    async (pkg) => {
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
    }
  );

  if (!useYarn) await execute(`npm dedupe`);
};

/** Install a main package according to command param
 * @param {string} pkg */
const installMainPackage = async (pkg) => {
  const corePkg = checkCore();
  if (corePkg) await installPackages(corePkg.tag, [pkg]);
  else {
    console.log(
      error(
        `A version of @faharmony/core must be installed before installing other packages. 
Try running command again without any package parameters.`
      )
    );
    getHelp();
  }
  return 0;
};

const installerParam = async () => {
  const packageName = args[1] ? args[1].trim().toLowerCase() : "";
  if (packageName === "") {
    console.log(error(`Package name was not provided in command.`));
    return;
  }
  if (packageName === core)
    await installPackages()
  else if ((mainPackages).map((pkg) => (pkg.name)).includes(packageName)) {
    await installMainPackage(packageName);
    return;
  }
  else {
    console.log(error(`Package name is incorrect.`));
    getHelp();
    return;
  }
}

const installTagParam = async () => {
  const tag = args[1] ? args[1].trim().toLowerCase() : "";
  if (tag === "") {
    console.log(error(`Tag was not provided in command.`));
    console.log("[ " + tags.join(", ") + " ]");
    return;
  }
  switch (tag) {
    case "latest": case "stable":
      await installPackages("latest", [])
      return;
    case "rc": case "freeze":
      await installPackages("RC", [])
      return;
    case "snapshot": case "dev":
      await installPackages("SNAPSHOT", [])
      return;
    default: console.log(error(`Package name is incorrect.`));
      getHelp();
      return;
  }
}

module.exports = {
  checkPackageInfo,
  installPackages,
  installerParam,
  installTagParam
};
