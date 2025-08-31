import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ReadTemplate,
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from "../../utils/GeneratorHelper.js";
import readFile from "../../utils/ReadFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

export default class ExpressJS {
  constructor(options) {
    this.csvData = null;
    this.csvPath = options.csvPath;
    this.outputPath =
      options.directory &&
      typeof options.directory === "string" &&
      options.directory.trim() !== ""
        ? path.resolve(options.directory)
        : path.join(process.cwd(), "output");
    this.fields = [];
    this.EntityName = {
      toPascalCase: "",
      toCamelCase: "",
      toKebabCase: "",
    };
    this.primaryKey = "";
    this.generateAll = options.all;
  }

  async Initialize() {
    this.csvData = await readFile(this.csvPath);
    this.fields = this.csvData.fields;
    this.primaryKey = this.csvData.metadata.primaryKeyField;

    const fileName = path.basename(this.csvPath, ".csv");
    this.EntityName = {
      toPascalCase: toPascalCase(fileName),
      toCamelCase: toCamelCase(fileName),
      toKebabCase: toKebabCase(fileName),
    };
  }

  async GenerateComponent() {
    await this.GenerateRoute();
    await this.GenerataContoller();
    await this.GenerateEntity();
    await this.GenerateRepository();
  }

  async GenerateRoute() {}

  async GenerataContoller() {}

  async GenerateEntity() {}

  async GenerateRepository() {}
}
