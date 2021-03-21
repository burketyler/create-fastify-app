#!/usr/bin/env node

import yargs, { Arguments } from "yargs";
import * as fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { sync } from "cross-spawn";
import { execSync } from "child_process";
import os from "os";

yargs
  .scriptName("create-fastify-boot")
  .usage("$0 <cmd> [args]")
  .command(
    "$0 [appName]",
    "Set up a Fastify Boot app with one command..",
    (args) => {
      args.positional("appName", {
        type: "string",
        describe: "The name of your application.",
      });
    },
    (args: Arguments<{ appName: string }>): void => {
      createProject(args.appName);
    }
  )
  .help().argv;

function createProject(appName: string): void {
  validateAppName(appName);
  console.log(chalk.cyan(`Creating new Fastify Boot project: ${appName}.`));
  const buildDir = fs.realpathSync(__dirname);
  const appDir = path.join(fs.realpathSync(process.cwd()), appName);
  makeAppDir(appDir, appName);
  copyTemplate(buildDir, appDir);
  install(appDir);
  outputInstructions(appName);
}

function validateAppName(appName: string): void {
  if (!appName) {
    console.error(
      chalk.redBright(
        `No app name argument provided. Did you mean to use:${os.EOL}${os.EOL}` +
          chalk.cyan(`$ create-fastify-boot {appName}${os.EOL}`)
      )
    );
    process.exit(1);
  }
}

function useYarn(): boolean {
  console.log(
    chalk.yellow(
      "Detected yarn installed on machine, using yarn instead of npm."
    )
  );
  return isRuntimeAvailable("yarn");
}

function isRuntimeAvailable(dep: string): boolean {
  return execCmd(`${dep} --version`) !== undefined;
}

function execCmd(command: string): string | undefined {
  try {
    return execSync(command).toString();
  } catch (e) {
    return undefined;
  }
}

function copyTemplate(buildDir: string, appDir: string): void {
  console.log(chalk.yellow(`Copying template files.`));
  fs.copySync(path.join(buildDir, "..", "template"), appDir);
}

function makeAppDir(appDir: string, appName: string): void {
  if (fs.existsSync(appDir)) {
    console.error(
      chalk.redBright(
        `A folder with name ${appName} already exists in this directory.`
      )
    );
    process.exit(1);
  } else {
    fs.mkdirSync(appDir);
  }
}

function install(appDir: string): void {
  console.log(chalk.yellow(`Installing node dependencies.`));
  process.chdir(appDir);
  const outcome = sync(useYarn() ? "yarn" : "npm", ["install"], {
    stdio: "inherit",
  });
  if (
    outcome.signal &&
    (outcome.signal === "SIGKILL" || outcome.signal === "SIGTERM")
  ) {
    console.log(
      chalk.redBright(
        "Script failed because the process exited too early. Something may be killing the process."
      )
    );
    process.exit(1);
  }
  console.log(chalk.yellow("Node dependencies installed."));
}

function outputInstructions(appName: string): void {
  console.log(
    chalk.green(
      `Fastify Boot application ${appName} created successfully.${os.EOL}`
    )
  );
  console.log(
    chalk.gray(
      `====================================================${os.EOL}${os.EOL}`
    )
  );
  console.log(chalk.bgBlackBright(`Next steps:${os.EOL}`));
  console.log(
    "1. " +
      chalk.yellow(
        `Go to your project folder and check out the README.md for further information on the different commands available to you.${os.EOL}`
      )
  );
  console.log(
    "2. " +
      chalk.yellow(
        "Go to the Fastify Boot github for tutorials and information on how to build a in a Fastify Boot project: " +
          chalk.blue(`https://github.com/burketyler/fastify-boot${os.EOL}`)
      )
  );
  console.log(
    "3. " +
      chalk.yellow(
        "If you encounter and problems please raise a ticket: " +
          chalk.blue(
            `https://github.com/burketyler/fastify-boot/issues${os.EOL}${os.EOL}`
          )
      )
  );
  console.log(
    chalk.magenta(`Thank you for using Create Fastify Boot! :)${os.EOL}`)
  );
}
