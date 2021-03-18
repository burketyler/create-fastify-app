#!/usr/bin/env node

import yargs, { Arguments } from "yargs";
import * as fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { sync } from "cross-spawn";

yargs
  .scriptName("create-fastify-app")
  .usage("$0 <cmd> [args]")
  .command(
    "create [appName]",
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
  console.log(chalk.cyan(`Creating new Fastify Boot project: ${appName}.`));
  const buildDir = fs.realpathSync(__dirname);
  const appDir = path.join(fs.realpathSync(process.cwd()), appName);
  makeAppDir(appDir, appName);
  copyTemplate(buildDir, appDir);
  install(appDir);
  outputInstructions(appName);
}

function copyTemplate(buildDir: string, appDir: string): void {
  console.log(chalk.yellow(`Copying template files.`));
  fs.copySync(path.join(buildDir, "../template"), appDir);
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
  const outcome = sync("yarn", ["install"], { stdio: "inherit" });
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
    chalk.green(`Fastify Boot application ${appName} created successfully.\n`)
  );
  console.log(
    chalk.gray(`====================================================\n\n`)
  );
  console.log(chalk.bgBlackBright("Next steps:\n"));
  console.log(
    "1. " +
      chalk.yellow(
        "Go to your project folder and check out the README.md for further information on the different commands available to you.\n"
      )
  );
  console.log(
    "2. " +
      chalk.yellow(
        "Go to the Fastify Boot github for tutorials and information on how to build a Fastify Boot app: " +
          chalk.blue("https://github.com/burketyler/fastify-boot\n")
      )
  );
  console.log(
    "3. " +
      chalk.yellow(
        "If you encounter and problems please raise a ticket: " +
          chalk.blue("https://github.com/burketyler/fastify-boot/issues\n\n")
      )
  );
  console.log(chalk.magenta("Thank you for using Create Fastify Boot! :)\n"));
}
