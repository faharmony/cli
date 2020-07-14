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

const { args, color, error, scope, commonPackages, paths, } = require("./constants");
const { execute, checkPackageInfo, getHelp } = require("./utilities");
const { installPackage } = require("./install");

/** Install/update module package and execute plop command to generate module template */
const generateModule = async () => {
    const moduleId = args[1] ? args[1].trim().toLowerCase() : "";
    if (moduleId === "") {
        console.log(error(`ModuleID was not provided in command.`));
        getHelp();
        return;
    }

    const module = "module";
    const modulePkg = checkPackageInfo(module);
    await installPackage(
        (modulePkg && modulePkg.tag) || "latest",
        commonPackages.find((pkg) => pkg.name === module),
        "--no-save"
    );

    console.log(color(`Initiating module generator script...`));
    const pathPlop = `${paths.nodeModules}${scope}/${module}/plop.js`;
    await execute(
        `npx plop --plopfile ${pathPlop} ${moduleId}`,
        `New module "${moduleId}" is generated.`,
        true
    );
    return;
};

module.exports = { generateModule };
