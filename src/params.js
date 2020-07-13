#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

const { args, chalk, bold, getHelp } = require("./common");
const {
    installMainPackage,
    installPackages,
} = require("./install");
const {
    harmonyAbout,
    harmonyInfo,
    harmonyVersion,
} = require("./info");
const { syncRepo } = require("./sync");
const { generateModule } = require("./module");

const params = {
    tag: {
        description:
            "A tag param allows user to decide which tagged version of harmony to install.",
        stable: {
            param: ["--stable"],
            description: "Install latest STABLE (released) version of harmony",
            exec: async () => await installPackages("latest", [])
        },
        freeze: {
            param: ["--rc"],
            description: "Install latest RC (freeze) version of harmony",
            exec: async () => await installPackages("RC", [])
        },
        snapshot: {
            param: ["-s", "--snapshot"],
            description: "Install latest SNAPSHOT (development) version of harmony",
            exec: async () => await installPackages("SNAPSHOT", [])
        },
    },
    package: {
        description:
            "A package param allows user to install other main packages of harmony. Since these packages depend on `core` package, do run the command without package params before installing these packages.",
        table: {
            param: ["table"],
            description: "Install harmony's table package",
            exec: async () => await installMainPackage("table")
        },
        charts: {
            param: ["charts"],
            description: "Install harmony's charts package",
            exec: async () => await installMainPackage("charts")
        },
        form: {
            param: ["form"],
            description: "Install harmony's form package",
            exec: async () => await installMainPackage("form")
        },
    },
    info: {
        description:
            "An info param allows user retrieve some information about current setup.",
        about: {
            param: ["-a", "--about"],
            description: "Read about harmony",
            exec: harmonyAbout
        },
        info: {
            param: ["-i", "--info"],
            description: "Display installed harmony packages",
            exec: harmonyInfo
        },
        version: {
            param: ["-v", "--version"],
            description: "Check installed version of harmony",
            exec: harmonyVersion
        },
        help: {
            param: ["-h", "--help"],
            description: "Display help for harmony (this)",
            exec: () => Promise.resolve()
        },
    },
    other: {
        description: "Other params can be misc. like running other scripts.",
        module: {
            param: ["-m", "--module"],
            description:
                "Generate harmony module using plop. Requires `moduleId` as second param.",
            example: "npx faharmony/cli -m sample",
            exec: generateModule
        },
        sync: {
            param: ["--sync"],
            description:
                "Synchronize current branch with FA_REACT_APP repo template.",
            example: "npx faharmony/cli --sync",
            exec: syncRepo
        },
    },
};

/** Check version of installed harmony packages */
const help = async () => {
    console.log("Usage: " + bold("npx faharmony/cli [param]"));
    console.log(
        "\nwhere param (optional, case-insensitive) is one of the following:"
    );
    const whiteBold = chalk.bold;
    const green = chalk.green;
    const tab = "  ";
    for (const type in params) {
        console.log("\n" + whiteBold(type.toUpperCase() + " params"));
        const desc = params[type].description;
        desc && console.log(desc + "\n");
        for (const param in params[type]) {
            if (param !== "description") {
                const pObj = params[type][param];
                console.log(tab + whiteBold(pObj.param.join(", ")));
                pObj.description && console.log(tab + tab + pObj.description);
                pObj.example && console.log(tab + tab + "Eg. " + green(pObj.example));
            }
        }
    }
};

/** 
 * @param {string} param 
 * @returns {undefined | {name: string; type: string; exec: () => Promise<any>}}
 */
const getParamInfo = (param) => {
    let info = undefined;
    Object.entries(params).forEach(([type, typeObj]) =>
        Object.entries(typeObj).forEach(([name, nameObj]) => {
            if (typeof nameObj !== 'string' && nameObj.param.includes(param)) {
                info = { name, type, exec: nameObj.exec };
            }
        })
    );
    return info;
}

const checkParam = async () => {
    const param = args[0].trim().toLowerCase();
    // Check for help
    if (['-h', '--help'].includes(param)) { await help(); return; }
    // Check other params
    let info = { name: '', type: '', exec: () => Promise.resolve() };
    Object.entries(params).forEach(([type, typeObj]) =>
        Object.entries(typeObj).forEach(([name, nameObj]) => {
            if (typeof nameObj !== 'string' && nameObj.param.includes(param))
                info = { name, type, exec: nameObj.exec };
        })
    );
    // If param found, execute function
    if (info.name !== '') { await info.exec(); return; }
    // Else (no match)
    console.log(chalk.red.bold("Error: The command is incorrect."));
    getHelp();
}


module.exports = { params, checkParam }