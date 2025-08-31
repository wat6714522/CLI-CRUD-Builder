import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ReadTemplate,
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from "../../utils/GeneratorHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

export default class ExpressJSCreator {
  constructor(options) {
    this.projectName = {
      toPascalCase: toPascalCase(options.projectName),
      toCamelCase: toCamelCase(options.projectName),
      toKebabCase: toKebabCase(options.projectName),
    };
    this.outputPath = options.projectPath;
  }

  async Initialize() {
    await this.GeneratePackageJson();
    await this.GenerateTsConfigJson();
  }

  async GeneratePackageJson() {
    const directory = path.join(this.outputPath, "");

    const template = await ReadTemplate(
      path.join(projectRoot, "template/ExpressJS/package.json.txt")
    );
    const content = this.replacePackageJson(template);
    const fileName = `package.json`;
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  replacePackageJson(template) {
    const variables = {
      "{{ProjectName}}": this.projectName.toKebabCase,
    };

    let content = String(template);

    for (const [placeholder, value] of Object.entries(variables)) {
      content = content.replace(
        new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
        value
      );
    }

    return content;
  }

  async GenerateTsConfigJson() {}
}
