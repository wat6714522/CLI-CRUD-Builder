#!/usr/bin/env node

import { Command } from "commander";
import { nestjs } from "./commands/NestJS/nestjs.js";
import { nextjs } from "./commands/NextJS/nextjs.js";
const program = new Command()
  .name("crud")
  .description(
    "A CLI tool to build and generate all files neccesary for NestJS CRUD operations"
  )
  .version("1.0.0")
  .addCommand(nestjs)
  .addCommand(nextjs);

program.parse();
