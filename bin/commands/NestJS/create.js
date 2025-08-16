import { Command } from "commander";
import { execSync } from "child_process";

const dependencies = [
  "@nestjs/typeorm",
  "@nestjs/mapped-types",
  "@nestjs/config",
  "class-validator",
  "class-transformer",
  "typeorm",
];

export const create = new Command("create")
  .description("A command that create the project for NestJS framework")
  .argument("<projectName>", "Specify the name of the project")
  .action((projectName) => {
    try {
      console.log("===========================================");
      console.log("Create Command!\n");
      console.log(`Project Name: ${projectName}`);

      console.log("Generating Project... ");
      const commandNestJS = `nest new ${projectName}`;

      execSync(commandNestJS, {
        stdio: "inherit",
        cwd: process.cwd(),
      });

      console.log("Installing Additional Packages... ");
      const dependenciesStr = dependencies.join(" ");
      const commandInstallDependencies = `npm install ${dependenciesStr} --save`;

      execSync(commandInstallDependencies, {
        stdio: "inherit",
        cwd: `${process.cwd()}\\${projectName}`,
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
            $crud-builder build [projectName]
        `,
  );
