#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

const chalk = require("chalk");
const ora = require("ora");
import fs from "fs";
import { exec } from "child_process";

import { IPackage } from "./types";

const args = process.argv.slice(2);
const color = chalk.magenta; //32127A
const bold = color.bold;
const error = chalk.red;
const success = chalk.green;
const link = chalk.blue;
const webLink = "https://github.com/faharmony/cli";
const pkgJsonCLI = require("../package.json");

// Harmony libraries
const scope = "@faharmony";
const core = "core";

const commonPackages: IPackage[] = [
  { name: "components" },
  { name: "form", types: ["react-select"] },
  { name: "helpers", types: ["uuid"] },
  { name: "icons" },
  { name: "locale" },
  { name: "module" },
  { name: "router", types: ["react-router-dom"] },
  { name: "service" },
  { name: "state", types: ["react-redux"] },
  { name: "theme" },
  { name: "views" },
];

const mainPackages: IPackage[] = [
  { name: core, types: ["node", "react"] },
  { name: "charts", types: ["lodash"] },
  { name: "table", types: ["react-table"] },
];

const tags = ["stable", "latest", "snapshot", "dev", "rc", "freeze"];

// Paths
const paths = {
  nodeModules: process.cwd() + "/node_modules/",
  yarnLock: process.cwd() + "/yarn.lock",
};

const useYarn = fs.existsSync(paths.yarnLock);

// Commands
const commands = {
  install: () => (useYarn ? `yarn add` : `npm install`),
  remove: () => (useYarn ? `yarn remove` : `npm uninstall`),
};

const outputs = {
  manager: () => (useYarn ? "Yarn" : "NPM"),
};

export {
  chalk,
  ora,
  fs,
  args,
  color,
  bold,
  success,
  error,
  link,
  webLink,
  scope,
  core,
  commonPackages,
  mainPackages,
  paths,
  commands,
  useYarn,
  outputs,
  tags,
  exec,
  pkgJsonCLI,
};
