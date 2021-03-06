#!/usr/bin/env node
/**
 * Harmony CLI
 * ---
 * Script to install and update Harmony framework.
 * @author Siddhant Gupta <siddhant@fasolutions.com> https://github.com/guptasiddhant
 */

import { bold, color } from "./constants";
import { execute } from "./utilities";

/** Synchronize current branch with FA_REACT_APP repo template. */
const syncRepo = async () => {
  console.log(color("Stating sync...\n"));

  await execute(
    `git remote add upstream git@bitbucket.org:fasolutions-ondemand/fa-react-app.git`
  );
  await execute(`git fetch upstream`);
  const res = await execute(`git merge upstream/master`);

  if (res) console.log(bold(`The app is in sync.`));
  else
    console.log(
      color(`Syncing may require resolving some merge conflicts.
Resolve the conflicts and commit the changes.`)
    );
};

export { syncRepo };
