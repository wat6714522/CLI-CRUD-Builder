import { Command } from "commander";
import NestJS from "../../../src/generators/NestJS/NestJSGenerator.js";

export const dBconnect = new Command("connect")
  .description("A command that initailize the project for target framework")
  .option(
    "--directory <path>, -d",
    "Specify the output path of the database config file."
  )
  .option(
    "--envPath <path>, -e",
    "Specify the path of the .env file of database environment variable"
  )
  .action((opts) => {
    try {
      console.log("===========================================");
      console.log("Connect Command\n");
      console.log(`Database Connection: ${opts.directory}`);
      console.log(`Env File Path: ${opts.envPath}`);

      const nestJS = new NestJS(opts);
      nestJS.GenerateDBConnect();

      console.log("===========================================");
    } catch (error) {
      throw new Error(`Something went wrong: ${error.message}`);
    }
  })
  .addHelpText(
    "after",
    `
        Examples: 
            1. $crud-builder connect --directory <filePath>
            2. $crud-builder connect --directory <filePath> --envPath <filePath> 
            3. $crud-builder connect

          The .env file should contain following variable with exact names:
            1. DB_TYPE
            2. DB_HOST
            3. DB_PORT
            4. DB_USERNAME
            5. DB_PASSWORD
            6. DB_NAME
        `
  );