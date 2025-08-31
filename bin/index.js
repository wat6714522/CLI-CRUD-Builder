#!/usr/bin/env node

import { Command } from "commander";
import { nestjs } from "./commands/NestJS/nestjs.js";
import { expressjs } from "./commands/express/index.js";

const program = new Command()
  .name("crud")
  .description(
    "A CLI tool to build and generate all files neccesary for NestJS and ExpressJS CRUD operations"
  )
  .version("1.0.1")
  .addCommand(nestjs)
  .addCommand(expressjs);

program.parse();
