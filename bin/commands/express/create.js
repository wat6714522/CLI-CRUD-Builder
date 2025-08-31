import { Command } from "commander";
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";
import ExpressJSCreator from "../../../src/generators/ExpressJS/ExpressJSCreator.js";

const dependencies = [
  "class-transformer",
  "class-validator",
  "cors",
  "dotenv",
  "express",
  "helmet",
  "morgan",
  "pg",
  "reflect-metadata",
  "typeorm",
];

const devDependencies = [
  "@types/cors",
  "@types/express",
  "@types/morgan",
  "@types/node",
  "@types/pg",
  "nodemon",
  "rimraf",
  "ts-node",
  "typescript",
];

export const create = new Command()
  .name("create")
  .description("A command that create the project for ExpressJS framework")
  .argument("<projectName>", "Specify the name of the project")
  .action(async (projectName) => {
    try {
      console.log("===========================================");
      console.log("Create Command!\n");
      console.log(`Project Name: ${projectName}`);

      const projectPath = join(process.cwd(), projectName);

      // Create project directory
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
      }

      console.log("Generating Project... ");
      const expressJSCreator = new ExpressJSCreator({
        projectName,
        projectPath,
      });
      await expressJSCreator.Initialize();

      console.log("Installing Additional Packages... ");
      const dependenciesStr = dependencies.join(" ");
      execSync(`npm install ${dependenciesStr} --save`, {
        stdio: "inherit",
        cwd: projectPath,
      });

      const devDependenciesStr = devDependencies.join(" ");
      execSync(`npm install ${devDependenciesStr} --save-dev`, {
        stdio: "inherit",
        cwd: projectPath,
      });

      console.log("Finished Generating Project...");
      console.log("===========================================");
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  })
  .addHelpText(
    "after",
    `
        Examples: 
            $ crud expressjs create my-app
            $ crud expressjs create my-express-project
        `
  );
