#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */
// @ts-check

// VARIABLES
const { execute } = require("./common");

const syncRepo = async () => {
    console.log("Syncing...")

    await execute(`git remote add upstream git@bitbucket.org:fasolutions-ondemand/fa-react-app.git`);
    await execute(`git fetch upstream`);
    const res = await execute(`git merge upstream/master`);

    console.log(res);
}

module.exports = { syncRepo };