#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

const { args, chalk, bold, getHelp, mainPackages, tags, core } = require("./utilities");
const { installerParam, installTagParam } = require("./install");
const { harmonyVersion, } = require("./version");
const { syncRepo } = require("./sync");
const { generateModule } = require("./module");

const params = {
    version: {
        param: ["--version", "-v"],
        description: "Check installed version of harmony",
        exec: harmonyVersion
    },
    install: {
        param: ["--install", "-i",],
        description:
            "Install harmony's packages.",
        second: (mainPackages).map((pkg) => (pkg.name)).filter(pkg => pkg !== core),
        exec: installerParam
    },
    module: {
        param: ["--module", "-m",],
        description:
            "Generate harmony module using plop.",
        second: ['ModuleID (string with all-lowercase letters)'],
        example: "sample",
        exec: generateModule
    },
    tag: {
        param: ["--tag", "-t"],
        description:
            "Install specific tagged version of harmony.",
        second: tags,
        exec: installTagParam
    },
    sync: {
        param: ["--sync", "-s"],
        description:
            "Synchronize current branch with FA_REACT_APP repo template.",
        exec: syncRepo
    },

};

/** Check version of installed harmony packages */
const help = async () => {
    console.log("Usage: " + bold("npx faharmony/cli [param]"));
    console.log(
        "\nwhere param (optional, case-insensitive) is " + chalk.bold("one") + " of the following:"
    );
    const whiteBold = chalk.bold;
    const green = chalk.green;
    const blue = chalk.blue;
    const tab = "  ";
    for (const p in params) {
        const { param, description, second, example } = params[p];
        console.log('\n' + whiteBold(param.join(", ")));
        description && console.log(tab + description);
        second && console.log(tab + "Second param: " + blue(second.join(", ")));
        const exampleLine = `npx faharmony/cli ${param[0]} ${example ? example : second ? second[0] : ''}`;
        console.log(tab + "Eg.", green(exampleLine))
    }
};

const checkParam = async () => {
    const param = args[0].trim().toLowerCase();
    // Check for help
    if (['-h', '--help'].includes(param)) { await help(); return; }
    // Check other params
    let info = { name: '', exec: () => Promise.resolve() };
    Object.entries(params).forEach(([name, obj]) => {
        if (typeof obj !== 'string' && obj.param.includes(param))
            info = { name, exec: obj.exec };
    })
    // If param found, execute function
    if (info.name !== '') { await info.exec(); return; }
    // Else (no match)
    console.log(chalk.red.bold("Error: The command is incorrect."));
    getHelp();
}


module.exports = { params, checkParam }