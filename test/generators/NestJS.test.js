import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import fs from "fs";
import path from "path";
import NestJS from "../../src/generators/NestJS/NestJSGenerator.js";

const mockCSVData = {
  fields: ["productID", "productName", "price", "stock", "stockShelf"],
  records: [
    {
      productID: "1a",
      productName: "ASUS-D553ua",
      price: 24000,
      stock: 10,
      stockShelf: "0001ab",
    },
    {
      productID: "2a",
      productName: "MacBookPro-14 M4 Pro (12 Cores) 24 GB Ram 1Tb SSD",
      price: 50000,
      stock: 15,
      stockShelf: "0002ab",
    },
    {
      productID: "3b",
      productName: "Lenovo IdeaPad 3",
      price: 18000,
      stock: 8,
      stockShelf: "0003bc",
    },
    {
      productID: "4c",
      productName: "HP Pavilion x360",
      price: 22000,
      stock: 12,
      stockShelf: "0004cd",
    },
    {
      productID: "5d",
      productName: "Dell Inspiron 15",
      price: 20000,
      stock: 9,
      stockShelf: "0005de",
    },
  ],
  metadata: {
    data: {
      "1a": {
        productID: "1a",
        productName: "ASUS-D553ua",
        price: 24000,
        stock: 10,
        stockShelf: "0001ab",
      },
      "2a": {
        productID: "2a",
        productName: "MacBookPro-14 M4 Pro (12 Cores) 24 GB Ram 1Tb SSD",
        price: 50000,
        stock: 15,
        stockShelf: "0002ab",
      },
      "3b": {
        productID: "3b",
        productName: "Lenovo IdeaPad 3",
        price: 18000,
        stock: 8,
        stockShelf: "0003bc",
      },
      "4c": {
        productID: "4c",
        productName: "HP Pavilion x360",
        price: 22000,
        stock: 12,
        stockShelf: "0004cd",
      },
      "5d": {
        productID: "5d",
        productName: "Dell Inspiron 15",
        price: 20000,
        stock: 9,
        stockShelf: "0005de",
      },
    },
    entityMapped: {
      productID: "string",
      productName: "string",
      price: "number",
      stock: "number",
      stockShelf: "string",
    },
    primaryKeyField: "productID",
    totalRecords: 30,
  },
};

const NestJSGenerator = new NestJS("test-user.csv", "DTO", "output");

const outDirectory = NestJSGenerator.outputPath;

describe("NestJS Generator", () => {
  beforeEach(() => {
    jest.spyOn(fs.promises, "mkdir").mockResolvedValue();
    jest.spyOn(fs.promises, "writeFile").mockResolvedValue();
    jest.spyOn(fs.promises, "readFile").mockResolvedValue;

    NestJSGenerator.csvData = mockCSVData;
    NestJSGenerator.fields = mockCSVData.fields;
    NestJSGenerator.primaryKey = mockCSVData.metadata.primaryKeyField;
    NestJSGenerator.EntityName = "Product";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("DTO File Generation ", () => {
    it("Should correctly generate DTO Content", async () => {
      await NestJSGenerator.GenerateDto();

      const createDTOContent = fs.promises.writeFile.mock.calls[0];

      expect(createDTOContent[1]).not.toContain("{{DTOProperties}}");
      expect(createDTOContent[1]).not.toContain("{{EntityName}}");
      expect(createDTOContent[1]).toContain(
        "import {IsInt, IsPositive, IsString, Length, IsNotEmpty, IsOptional, IsBoolean}",
      );
      expect(createDTOContent[1]).toContain("class-validator");
      expect(createDTOContent[1]).toContain("export class CreateProductDTO");

      const updateDTOContent = fs.promises.writeFile.mock.calls[1];

      expect(updateDTOContent[1]).toContain("{ PartialType }");
      expect(updateDTOContent[1]).toContain("@nestjs/mapped-types");
      expect(updateDTOContent[1]).toContain("{ CreateProductDTO }");
      expect(updateDTOContent[1]).toContain("./CreateProduct.dto.ts");
      expect(updateDTOContent[1]).toContain(
        "export class UpdateProductDTO extends PartialType(CreateProductDTO){}",
      );
      expect(updateDTOContent[1]).not.toContain("{{EntityName}}");

      const idParamContent = fs.promises.writeFile.mock.calls[2];

      expect(idParamContent[1]).toContain("import { IsInt, IsPositive } from ");
      expect(idParamContent[1]).toContain("class-validator");
      expect(idParamContent[1]).toContain("export class IdParamDTO");
      expect(idParamContent[1]).toContain("@IsInt()");
      expect(idParamContent[1]).toContain("@IsPositive()");
      expect(idParamContent[1]).toContain("id: number");

      const paginationContent = fs.promises.writeFile.mock.calls[3];

      expect(paginationContent[1]).toContain(
        "import { IsInt, IsOptional, IsPositive } from ",
      );
      expect(paginationContent[1]).toContain("class-validator");
    });

    it("Should correctly replace DTO Properties", async () => {
      await NestJSGenerator.GenerateDto();

      const createDTOContent = fs.promises.writeFile.mock.calls[0];

      expect(createDTOContent[1]).not.toContain("@PrimaryGeneratedColumn");
      expect(createDTOContent[1]).not.toContain("productID : string");

      expect(createDTOContent[1]).toContain("@IsString()");
      expect(createDTOContent[1]).toContain("productName : string");

      expect(createDTOContent[1]).toContain("@IsInt()");
      expect(createDTOContent[1]).toContain("price : number");

      expect(createDTOContent[1]).toContain("@IsInt()");
      expect(createDTOContent[1]).toContain("stock : number");

      expect(createDTOContent[1]).toContain("@IsString()");
      expect(createDTOContent[1]).toContain("stockShelf : string");
    });

    it("Should successfully write DTO Files", async () => {
      await NestJSGenerator.GenerateDto();

      const createDtoFilePath = fs.promises.writeFile.mock.calls[0];
      const updateDtoFilePath = fs.promises.writeFile.mock.calls[1];
      const idParamDtoFilePath = fs.promises.writeFile.mock.calls[2];
      const paginationDtoFilePath = fs.promises.writeFile.mock.calls[3];

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        createDtoFilePath[0],
        expect.any(String),
        "utf8",
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        updateDtoFilePath[0],
        expect.any(String),
        "utf-8",
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        idParamDtoFilePath[0],
        expect.any(String),
        "utf-8",
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        paginationDtoFilePath[0],
        expect.any(String),
        "utf-8",
      );
    });
  });

  describe("Entity File Generation", () => {
    it("Should correctly generate entity file content", async () => {
      await NestJSGenerator.GenerateEntity();

      const entityContent = fs.promises.writeFile.mock.calls[0];

      expect(entityContent[1]).not.toContain("{{EntityName}}");
      expect(entityContent[1]).not.toContain("{{EntityProperties}}");

      expect(entityContent[1]).toContain(
        "{Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn}",
      );
      expect(entityContent[1]).toContain("typeorm");
    });

    it("Should correctly replace entity properties", async () => {
      await NestJSGenerator.GenerateEntity();

      const entityContent = fs.promises.writeFile.mock.calls[0];

      expect(entityContent[1]).not.toContain("{{EntityName}}");
      expect(entityContent[1]).not.toContain("{{EntityProperties}}");

      expect(entityContent[1]).toContain("export class Product");

      expect(entityContent[1]).toContain("@PrimaryGeneratedColumn");
      expect(entityContent[1]).toContain("productID: string");

      expect(entityContent[1]).toContain("@Column()");
      expect(entityContent[1]).toContain("productName: string");

      expect(entityContent[1]).toContain("@Column()");
      expect(entityContent[1]).toContain("price: number");

      expect(entityContent[1]).toContain("@Column()");
      expect(entityContent[1]).toContain("stock: number");

      expect(entityContent[1]).toContain("@Column");
      expect(entityContent[1]).toContain("stockShelf: string");
    });

    it("Should sucessfully generate entity file", async () => {
      await NestJSGenerator.GenerateEntity();

      const entityContent = fs.promises.writeFile.mock.calls[0];

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        entityContent[0],
        expect.any(String),
        "utf8",
      );
    });

    it("Should successfuly generate entity output directory", async () => {
      await NestJSGenerator.GenerateEntity();

      const entityContent = fs.promises.writeFile.mock.calls[0];

      const outputPath = path.join(outDirectory, "entities");

      expect(fs.promises.mkdir).toHaveBeenCalledWith(outputPath, {
        recursive: true,
      });
    });
  });

  describe("Validation Pipes File Generation", () => {
    it("Should Generate pipe file content correctly", async () => {
      await NestJSGenerator.GeneratePipes();

      const parseIDContent = fs.promises.writeFile.mock.calls[0];
      const parseBoolContent = fs.promises.writeFile.mock.calls[1];
      const parseArrayContent = fs.promises.writeFile.mock.calls[2];
      const parseUuidPipeConent = fs.promises.writeFile.mock.calls[3];
      const requestHeaderPipeContent = fs.promises.writeFile.mock.calls[4];

      expect(parseIDContent[1]).toMatchSnapshot();
      expect(parseBoolContent[1]).toMatchSnapshot();
      expect(parseArrayContent[1]).toMatchSnapshot();
      expect(parseUuidPipeConent).toMatchSnapshot();
      expect(requestHeaderPipeContent).toMatchSnapshot();
    });

    it("Should successfully generate pipe validation file", async () => {
      await NestJSGenerator.GeneratePipes();

      const parseIDPipe = fs.promises.writeFile.mock.calls[0];
      const parseBoolPipe = fs.promises.writeFile.mock.calls[1];
      const parseArrayPipe = fs.promises.writeFile.mock.calls[2];
      const parseUuidPipe = fs.promises.writeFile.mock.calls[3];
      const requestHeaderPipe = fs.promises.writeFile.mock.calls[4];

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        parseIDPipe[0],
        expect.any(String),
        "utf8",
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        parseBoolPipe[0],
        expect.any(String),
        "utf8",
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        parseArrayPipe[0],
        expect.any(String),
        "utf8",
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        parseUuidPipe[0],
        expect.any(String),
        "utf8",
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        requestHeaderPipe[0],
        expect.any(String),
        "utf8",
      );
    });

    it("Should successfully generate pipe validation output directory", async () => {
      await NestJSGenerator.GeneratePipes();

      const pipesContent = fs.promises.writeFile.mock.calls[0];

      const pipesDirectory = path.join(outDirectory, "pipes");

      expect(fs.promises.mkdir).toHaveBeenCalledWith(pipesDirectory, {
        recursive: true,
      });
    });
  });

  describe("Controller File Generation", () => {
    it("Should generate controller file content properly", async () => {
      await NestJSGenerator.GenerateController();

      const controllerContent = fs.promises.writeFile.mock.calls[0];

      expect(controllerContent[1]).not.toContain("{{EntityName}}");

      expect(controllerContent[1]).toContain("@Controller('property')");
      expect(controllerContent[1]).toContain(
        "export class PropertyController ",
      );

      expect(controllerContent[1]).toContain("@Get()");
      expect(controllerContent[1]).toContain("@Post()");
      expect(controllerContent[1]).toContain("@Patch(':id')");
      expect(controllerContent[1]).toContain("@Delete(':id')");
    });

    it("Should successfully generate controller file", async () => {
      await NestJSGenerator.GenerateController();

      const controllerContent = fs.promises.writeFile.mock.calls[0];

      expect(fs.promises.mkdir).toHaveBeenCalledWith(outDirectory, {
        recursive: true,
      });
    });
  });

  describe("Service File Generation", () => {
    it("Should correctly generate service file contents correctly", async () => {
      await NestJSGenerator.GenerateService();

      const serviceContent = fs.promises.writeFile.mock.calls[0];

      expect(serviceContent[1]).not.toContain("{{EntityName}}");

      expect(serviceContent[1]).toContain("{ Injectable, NotFoundException }");
      expect(serviceContent[1]).toContain("{ InjectRepository }");
      expect(serviceContent[1]).toContain("{ Product }");
      expect(serviceContent[1]).toContain("{ Repository }");
      expect(serviceContent[1]).toContain("{ CreateProductDTO }");
      expect(serviceContent[1]).toContain("{ UpdateProductDTO }");
      expect(serviceContent[1]).toContain("{ PaginationDTO }");

      expect(serviceContent[1]).toContain("async findOne(id: number)");
      expect(serviceContent[1]).toContain(
        "async findAll(paginationDTO: PaginationDTO)",
      );
      expect(serviceContent[1]).toContain(
        "async create(dto: CreateProductDTO)",
      );
      expect(serviceContent[1]).toContain(
        "async update(id: number, dto: UpdateProductDTO)",
      );
      expect(serviceContent[1]).toContain("async delete(id: number)");
    });

    it("Should successfully generated service file", async () => {
      await NestJSGenerator.GenerateService();

      const serviceContent = fs.promises.writeFile.mock.calls[0];

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        serviceContent[0],
        expect.any(String),
        "utf8",
      );
    });

    it("Should successfully make service's output directory", async () => {
      await NestJSGenerator.GenerateService();

      const serviceContent = fs.promises.writeFile.mock.calls[0];
      const serviceOutputPath = expect(fs.promises.mkdir).toHaveBeenCalledWith(
        outDirectory,
        {
          recursive: true,
        },
      );
    });
  });

  describe("Module File Generation", () => {
    it("Should correctly make module file content", async () => {
      await NestJSGenerator.GenerateModule();

      const moduleContent = fs.promises.writeFile.mock.calls[0];

      expect(moduleContent[1]).not.toContain("{{EntityName}}");

      expect(moduleContent[1])
        .toContain(`import { Module, ValidationPipe } from '@nestjs/common';
import {ProductController} from './Product.controller.ts';
import { APP_PIPE } from '@nestjs/core';
import {ProductService} from './Product.service.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Product} from 'src/Entities/Product.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    ProductService,
  ],
})
export class ProductModule {}`);
    });
  });

  it("Should successfully write module file ", async () => {
    await NestJSGenerator.GenerateModule();

    const moduleContent = fs.promises.writeFile.mock.calls[0];

    expect(fs.promises.writeFile).toHaveBeenCalledWith[
      (outDirectory, expect.any(String), "utf8")
    ];
  });

  it("Should successfully create module directory", async () => {
    await NestJSGenerator.GenerateModule();

    const moduleContent = fs.promises.writeFile.mock.calls[0];

    expect(fs.promises.mkdir).toHaveBeenCalledWith(outDirectory, {
      recursive: true,
    });
  });

  describe("Database Configuration File Generation", () => {
    it("Should correctly generate database configuration config file", async () => {
      await NestJSGenerator.GenerateDBConnect();

      const dBConfigContent = fs.promises.writeFile.mock.calls[0];
      expect(dBConfigContent[1]).toMatchSnapshot();
    });

    it("Should successfully generate database configuration file", async () => {
      await NestJSGenerator.GenerateDBConnect();

      const dBConfigContent = fs.promises.writeFile.mock.calls[0];
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        dBConfigContent[0],
        expect.any(String),
        "utf8",
      );
    });

    it("Should successfully creaate configuration directory", async () => {
      await NestJSGenerator.GenerateDBConnect();

      expect(fs.promises.mkdir).toHaveBeenCalledWith(outDirectory, {
        recursive: true,
      });
    });
  });
});
