import { Command } from "commander";
import ExpressJS from "../../../src/generators/ExpressJS/ExpressJSGenerator.js";

export const generate = new Command()
  .name("generate")
  .description(
    "A command that generate all files neccessary for CRUD operations"
  )
  .option(
    "-d, --directory <filePath>",
    "Specify directory to create the project in."
  )
  .argument("<csvPath>", "Specify the directory of the CSV File.")
  .action((csvPath, opts) => {
    try {
      console.log("===========================================");
      console.log("Generate Command\n");
      console.log(`CSV Path: ${csvPath}`);
      console.log(`Output Directory: ${opts.directory}\n`);

      console.log("===========================================");
      console.log("Initialize Generator...");
      const expressJSGenerator = new ExpressJS({ csvPath, ...opts });
      expressJSGenerator.Initialize();
      console.log("Finish Initalizing Generator");
      console.log("===========================================");

      expressJSGenerator.GenerateComponent();
      console.log("Generating Component....");
      console.log("Finish generating component");
      console.log("===========================================");
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  })
  .addHelpText(
    "after",
    `
    The CSV file should contain the following: 
        - First row: column headers to be use as field names.
        - First column: will be used as primary keys.
        - Subsequent rows: contains sample data used for analysis.

    For ExpressJS
        - Generate routes, controllers, entities, and repositories.
        - Create TypeORM entity based on csv structure.
    
    Example:
        $ crud expressjs --directory <filePath> [csvPath]
        $ crud expressjs [csvPath]
    `
  );
