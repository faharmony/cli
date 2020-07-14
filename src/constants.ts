#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

// @ts-ignore
import chalk from "chalk";
import fs from "fs";
import { exec } from "child_process";

import { IPackage } from "./types";

const args = process.argv.slice(2);
const color = chalk.magenta; //32127A
const bold = color.bold;
const error = chalk.red;
const link = chalk.blue;
const webLink = "https://github.com/faharmony/cli";
const pkgJsonCLI = require("../package.json");

// Harmony libraries
const scope = "@faharmony";
const core = "core";

const commonPackages: IPackage[] = [
  { name: "components" },
  { name: "globalbar" },
  { name: "helpers", types: ["uuid"] },
  { name: "hooks" },
  { name: "icons" },
  { name: "layouts" },
  { name: "locale" },
  { name: "module" },
  { name: "navigation" },
  { name: "router", types: ["react-router-dom"] },
  { name: "service" },
  { name: "state", types: ["react-redux", "webpack-env"] },
  { name: "theme" },
  { name: "views" },
];

const mainPackages: IPackage[] = [
  { name: core, types: ["node", "react"] },
  { name: "table", types: ["react-table"] },
  { name: "charts", types: ["lodash"] },
  { name: "form" },
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
  fs,
  args,
  color,
  bold,
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
