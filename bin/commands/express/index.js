import { Command } from "commander";
import { generate } from "./generate.js";
import { create } from "./create.js";

export const expressjs = new Command()
  .name("expressjs")
  .description("CLIs for ExpressJS.")
  .addCommand(create)
  .addCommand(generate);
