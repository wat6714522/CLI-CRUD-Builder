import { Command } from "commander";
import { nextjsCreate } from "./create";

export const nextjs = new Command("NextJS")
  .name("NextJS")
  .description("CLIs for NextJS")
  .version("1.0.0")
  .addCommand(nextjsCreate);
