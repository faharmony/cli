#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import {
  chalk,
  args,
  bold,
  core,
  mainPackages,
  tags,
  color,
} from "./constants";
import { getHelp, checkCore } from "./utilities";
import {
  paramInstallPackage,
  paramInstallTag,
  installPackages,
} from "./install";
import { harmonyVersion } from "./version";
import { syncRepo } from "./sync";
import { generateModule } from "./module";
import { IParams } from "./types";

const params: IParams = {
  tag: {
    param: ["--tag", "-t"],
    description: "Install specific tagged version of harmony.",
    values: tags,
    usage: tags[0],
    exec: paramInstallTag,
  },
  install: {
    param: ["--install", "-i"],
    description: "Install harmony's packages.",
    values: mainPackages.map((pkg) => pkg.name).filter((pkg) => pkg !== core),
    usage: "charts",
    exec: paramInstallPackage,
  },
  module: {
    param: ["--module", "-m"],
    description: "Generate harmony module using plop.",
    values: ["a ModuleID (string with all-lowercase letters)"],
    usage: "sample",
    exec: generateModule,
  },
  sync: {
    param: ["--sync", "-s"],
    description: "Synchronize current branch with template repo.",
    exec: syncRepo,
  },
  version: {
    param: ["--version", "-v"],
    description: "Check installed version of harmony",
    exec: harmonyVersion,
  },
  help: {
    param: ["--help", "-h"],
    description: "Displays this message.",
    exec: help,
  },
};

/** Check version of installed harmony packages */
async function help() {
  console.log("Usage: " + bold("npx faharmony/cli [param]"));
  console.log(
    "where param (case-insensitive) is " +
      chalk.bold("one") +
      " of the following:"
  );
  const green = chalk.green;
  const blue = chalk.blue;
  const tab = "  ";
  for (const p in params) {
    const { param, description, values, usage } = params[p];
    console.log("" + color(param.join(", ")) + "\t" + description);
    values && console.log(tab + "param value:\t" + blue(values.join(", ")));
    const usageLine = `npx faharmony/cli ${param[0]} ${usage}`;
    usage && console.log("\t\t%s", green(usageLine));
  }
}

const checkParam = async () => {
  if (args.length > 0) {
    const param = args[0].trim().toLowerCase();
    let info = { name: "", exec: () => Promise.resolve() };
    Object.entries(params).forEach(([name, obj]) => {
      if (typeof obj !== "string" && obj.param.includes(param))
        info = { name, exec: obj.exec };
    });
    // If param found, execute function
    if (info.name !== "") await info.exec();
    // Else (no match)
    else {
      console.log(chalk.red.bold("Error: The command is incorrect."));
      getHelp();
    }
  } else {
    const corePkg = checkCore();
    if (corePkg) {
      // Update preinstalled libraries
      await installPackages({ version: corePkg.tag });
    } else {
      // If core package is not installed,
      // then install version with @latest tag.
      await installPackages({ version: "latest" });
    }
  }
  return;
};

export { params, checkParam };
