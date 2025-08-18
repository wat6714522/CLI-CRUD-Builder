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

export default class NestJS {
  constructor(options) {
    this.csvData = null;
    this.csvPath = options.csvPath;
    this.outputPath =
      options.directory &&
      typeof options.directory === "string" &&
      options.directory.trim() !== ""
        ? path.resolve(options.directory)
        : path.join(process.cwd(), "output");
    this.component = options.component?.toLowerCase() || "";
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
    const component = String(this.component);

    switch (component) {
      case "pipe":
        return await this.GeneratePipes();
      case "controller":
        return await this.GenerateController();
      case "service":
        return await this.GenerateService();
      case "module":
        return await this.GenerateModule();
      case "entity":
        return await this.GenerateEntity();
      case "dto":
        return await this.GenerateDto();
      case "all":
        const results = {
          pipe: await this.GeneratePipes(),
          controller: await this.GenerateController(),
          service: await this.GenerateService(),
          module: await this.GenerateModule(),
          entity: await this.GenerateEntity(),
          dto: await this.GenerateDto(),
        };

        return results;
      default:
        throw new Error("Unsupport Component! Please try Again.");
    }
  }

  async GenerateEntity() {
    const directory = path.join(this.outputPath, "entities");

    const template = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/entity.txt"),
    );
    const content = this.replaceTemplateEntity(template);
    const fileName = `${this.EntityName.toKebabCase}.entity.ts`;
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  GenerateEntityProperties() {
    // Filter out common timestamp fields that are auto-generated
    const timestampFields = ['createdAt', 'updatedAt', 'created_at', 'updated_at'];
    
    return this.fields
      .filter((field) => !timestampFields.includes(field))
      .map((field) => {
        const sampleValue = this.csvData.records[0]?.[field];
        const type = this.csvData.metadata.entityMapped[field];
        const isPrimaryKey = field === this.primaryKey;

        let decorator;
        let isType;

        if (isPrimaryKey) {
          decorator = "@PrimaryGeneratedColumn()";
          isType = "number";
        } else if (type == "date") {
          decorator = "    @Column('timestamp')";
          isType = "Date";
        } else {
          decorator = "    @Column()";
          isType = type;
        }

        return `${decorator}
    ${field}: ${isType};`;
      })
      .join("\n\n");
  }

  replaceTemplateEntity(template) {
    const variables = {
      "{{EntityName}}": this.EntityName.toPascalCase,
      "{{EntityProperties}}": this.GenerateEntityProperties(),
    };

    let content = String(template);

    for (const [placeholder, value] of Object.entries(variables)) {
      content = content.replace(
        new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
        value,
      );
    }

    // Debug: console.info(`Generated Content: ${content}`);

    return content;
  }

  async GenerateDto() {
    const directory = path.join(this.outputPath, "dto");

    const createTemplate = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/dto/create.txt"),
    );
    const createContent = this.replaceTemplateDTO(createTemplate);
    const createFileName = `create-${this.EntityName.toKebabCase}.dto.ts`;
    const createFilePath = path.join(directory, createFileName);

    const updateTemplate = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/dto/update.txt"),
    );
    const updateContent = this.replaceTemplateDTO(updateTemplate);
    const updateFileName = `update-${this.EntityName.toKebabCase}.dto.ts`;
    const updateFilePath = path.join(directory, updateFileName);

    const idParamContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/dto/id-param.txt"),
    );
    const idParamFileName = "id-param.dto.ts";
    const idParamFilePath = path.join(directory, idParamFileName);

    const paginationContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/dto/pagination.txt"),
    );
    const paginationFileName = "pagination.dto.ts";
    const paginationFilePath = path.join(directory, paginationFileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(createFilePath, createContent, "utf8");
    await fs.promises.writeFile(updateFilePath, updateContent, "utf-8");
    await fs.promises.writeFile(idParamFilePath, idParamContent, "utf-8");
    await fs.promises.writeFile(paginationFilePath, paginationContent, "utf-8");
  }

  GenerateDTOProperties() {
    // Filter out primary key and common timestamp fields
    const timestampFields = ['createdAt', 'updatedAt', 'created_at', 'updated_at'];
    
    return this.fields
      .filter((field) => field !== this.primaryKey && !timestampFields.includes(field))
      .map((field) => {
        const sampleValue = this.csvData.records[0]?.[field];
        const type = this.csvData.metadata.entityMapped[field];

        let decorators = [];
        let integerDecorators = [];

        switch (type) {
          case "string":
            decorators.push("@IsString()");
            break;
          case "number":
            decorators.push("@IsInt()");

            if (sampleValue >= 0) {
              integerDecorators.push("@IsPositive()");
            } else {
              integerDecorators.push("@IsNegative()");
            }

            break;
          case "date":
            decorators.push("@IsDateString()");
            break;
          default:
            decorators.push("@IsBoolean()");
            break;
        }

        const isEmpty =
          sampleValue === null ||
          sampleValue === undefined ||
          sampleValue === "" ||
          (typeof sampleValue === "string" && sampleValue.trim() === "");

        let emptyDecorators = [];

        // For boolean fields, don't use @IsNotEmpty as it doesn't make sense
        if (type === "boolean") {
          emptyDecorators.push("@IsOptional()");
        } else if (!isEmpty) {
          emptyDecorators.push("@IsNotEmpty()");
        } else {
          emptyDecorators.push("@IsOptional()");
        }

        const dtoType = type === "date" ? "string" : type;

        return `${decorators}
    ${integerDecorators}
    ${emptyDecorators}
    ${field} : ${type};`;
      })
      .join("\n\n    ");
  }

  replaceTemplateDTO(template) {
    const variables = {
      "{{EntityName}}": this.EntityName.toPascalCase,
      "{{FileName}}": this.EntityName.toKebabCase,
      "{{DTOProperties}}": this.GenerateDTOProperties(),
    };

    let content = String(template);

    for (const [placeholder, value] of Object.entries(variables)) {
      content = content.replace(
        new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
        value,
      );
    }

    // Debug: console.log(`Generated Template:\n ${content}`);

    return content;
  }

  async GeneratePipes() {
    const directory = path.join(this.outputPath, "pipes");

    const parseIDPipeContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/Pipes/ParseIDPipe.txt"),
    );
    const parseIDPipeFileName = "parse-id.pipe.ts";
    const parseIDPipeFilePath = path.join(directory, parseIDPipeFileName);

    const parseBoolPipeContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/Pipes/ParseBoolPipe.txt"),
    );
    const parseBoolPipeFileName = "parse-bool.pipe.ts";
    const parseBoolPipeFilePath = path.join(directory, parseBoolPipeFileName);

    const parseArrayPipeContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/Pipes/ParseArrayPipe.txt"),
    );
    const parseArrayPipeFileName = "parse-array.pipe.ts";
    const parseArrayPipeFilePath = path.join(directory, parseArrayPipeFileName);

    const parseUuidPipeContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/Pipes/ParseUUIDPipe.txt"),
    );
    const parseUuidPipeFileName = "parse-uuid.pipe.ts";
    const parseUuidPipeFilePath = path.join(directory, parseUuidPipeFileName);

    const requestHeaderPipeContent = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/Pipes/RequestHeader.txt"),
    );
    const requestHeaderPipeFileName = "request-header.pipe.ts";
    const requestHeaderPipeFilePath = path.join(
      directory,
      requestHeaderPipeFileName,
    );

    await fs.promises.mkdir(directory, {
      recursive: true,
    });

    await fs.promises.writeFile(
      parseIDPipeFilePath,
      parseIDPipeContent,
      "utf8",
    );
    await fs.promises.writeFile(
      parseUuidPipeFilePath,
      parseUuidPipeContent,
      "utf8",
    );
    await fs.promises.writeFile(
      parseArrayPipeFilePath,
      parseArrayPipeContent,
      "utf8",
    );
    await fs.promises.writeFile(
      parseBoolPipeFilePath,
      parseBoolPipeContent,
      "utf8",
    );
    await fs.promises.writeFile(
      requestHeaderPipeFilePath,
      requestHeaderPipeContent,
      "utf8",
    );
  }

  async GenerateService() {
    const directory = path.join(this.outputPath, "services");

    const template = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/service.txt"),
    );
    const content = this.replaceTemplate(template);
    const fileName = `${this.EntityName.toKebabCase}.service.ts`;
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  async GenerateModule() {
    const directory = path.join(this.outputPath, "modules");

    const template = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/module.txt"),
    );
    const content = this.replaceTemplate(template);
    const fileName = `${this.EntityName.toKebabCase}.module.ts`;
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  async GenerateController() {
    const directory = path.join(this.outputPath, "controllers");

    const template = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/controller.txt"),
    );
    const content = this.replaceTemplate(template);
    const fileName = `${this.EntityName.toKebabCase}.controller.ts`;
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  async GenerateDBConnect() {
    const directory = path.join(this.outputPath, "configs");

    const content = await ReadTemplate(
      path.join(projectRoot, "template/NestJS/db-connect.txt"),
    );
    const fileName = "database.config.ts";
    const filePath = path.join(directory, fileName);

    await fs.promises.mkdir(directory, {
      recursive: true,
    });
    await fs.promises.writeFile(filePath, content, "utf8");
  }

  replaceTemplate(template) {
    const variables = {
      "{{EntityName}}": this.EntityName.toPascalCase,
      "{{FileName}}": this.EntityName.toKebabCase,
      "{{CamelCaseName}}": this.EntityName.toCamelCase,
    };

    let content = String(template);

    for (const [placeholder, value] of Object.entries(variables)) {
      content = content.replace(
        new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
        value,
      );
    }

    // Debug: console.log(`Generated Content: ${content}`);

    return content;
  }
}
