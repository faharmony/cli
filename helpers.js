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
  useYarn,
  color,
  error,
  scope,
  core,
  commonPackages,
  mainPackages,
  paths,
  commands,
  asyncForEach,
  execute,
  outputs,
} = require("./common");

// HELPERS

/** @param {string} pkgName */
const getLibraryName = (pkgName) => `${scope}/${pkgName}`;

/** @param {string[]} packages */
const getTypeLibraries = (packages) =>
  packages.map((pkg) => `@types/${pkg}`).join(" ");

/** Get info from package.json of package
 *  @param {string} pkgName */
const checkPackageInfo = (pkgName) => {
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

/** Function to install one package depending on tag/version
 * @param {string} tag @param {Package} pkg @param {string!} options */
const installPackage = async (tag, pkg, options = "") => {
  const { name, types } = pkg;
  console.log(
    color(
      `Installing library ${getLibraryName(
        name
      )}@${tag} using ${outputs.manager()}`
    )
  );
  /** @type string[] */
  const externalTypesMain = types || [];
  await execute(
    `${commands.install()} ${getLibraryName(pkg.name)}@${tag} ${options}`,
    `${tag.toUpperCase()} version of ${getLibraryName(
      name
    )} and its dependencies installed successfully.`
  );
  if (externalTypesMain.length > 0)
    await execute(
      `${commands.install()} -D ${getTypeLibraries(externalTypesMain)}`
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
    const libraryName = getLibraryName(pkg.name);
    const externalTypes = pkg.types || [];

    const corePkg = checkPackageInfo(core);
    const pkgInfo = checkPackageInfo(pkg.name);

    const log = (name, version) =>
      console.log(
        color(
          `Installing library ${name}@${version} using ${outputs.manager()}`
        )
      );

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

      const corePkg = checkPackageInfo(core);
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
  const corePkg = checkPackageInfo(core);
  if (corePkg) await installPackages(corePkg.tag, [pkg]);
  else
    console.log(
      error(
        `A version of @faharmony/core must be installed before installing other packages. \nTry running command again without any package parameters.`
      )
    );
  return 0;
};

/** Install/update module package and execute plop command to generate module template */
const generateModule = async () => {
  const module = "module";
  const modulePkg = checkPackageInfo(module);
  await installPackage(
    (modulePkg && modulePkg.tag) || "latest",
    commonPackages.find((pkg) => pkg.name === module),
    "--no-save"
  );
  console.log(color(`Initiating module generator script...`));
  const pathPlop = `${paths.nodeModules}${scope}/${module}/plop.js`;
  const result = await execute(`npx plop --plopfile ${pathPlop}`, "", true);
  console.log(result);
  return 0;
};

module.exports = {
  checkPackageInfo,
  getLibraryName,
  getTypeLibraries,
  installPackages,
  installMainPackage,
  generateModule,
};
