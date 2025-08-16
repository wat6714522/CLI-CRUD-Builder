import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

export default async function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const data = await parseCSV(filePath);
    return data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

function parseCSV(filePath, encoding = "utf8") {
  return new Promise((resolve, reject) => {
    const results = {
      records: [],
      fields: [],
      metadata: {
        data: {},
        entityMapped: {},
        primaryKeyField: "",
        totalRecords: 0,
      },
    };
    const record = {};

    let isFirstRow = true;

    fs.createReadStream(filePath, { encoding })
      .pipe(csvParser({ trim: true, skip_empty_lines: true }))
      .on("data", (row) => {
        // csv-parser automatically handles headers, so every row here is a data row
        // Initialize fields and columns on first data row
        if (isFirstRow) {
          results.fields = Object.keys(row);
          results.metadata.primaryKeyField = Object.keys(row)[0];

          isFirstRow = false;
        }

        // Process the data row
        const record = {};

        Object.keys(row).forEach((field) => {
          const value = row[field];
          const typedValue = mapValueToType(value);
          const mapEntity = mapToEnity(typedValue);

          record[field] = typedValue;
          results.metadata.entityMapped[field] = mapEntity;
        });

        const primaryKey = record[results.metadata.primaryKeyField];
        if (primaryKey !== null && primaryKey !== undefined) {
          results.metadata.data[primaryKey] = record;
          results.records.push(record);
          results.metadata.totalRecords++;
        }
      })
      .on("error", (error) => {
        reject(new Error(`${error.message}`));
      })
      .on("end", () => {
        console.log(`${results.metadata.entityMapped}`);
        resolve(results);
      });
  });
}

function mapToEnity(values) {
  const type = typeof values;
  switch (type) {
    case "string":
      return "string";
      break;
    case "number":
      return "number";
      break;
    case "boolean":
      return "boolean";
      break;
    case null:
      return "null";
      break;
    case "":
      return "null";
      break;
    default:
      return "undefined";
      break;
  }
}

export function mapValueToType(value) {
  if (!value || value === "") {
    return null;
  }

  const stringValue = String(value).trim();

  // Handle explicit null values
  if (
    stringValue.toLowerCase() == "null" ||
    stringValue.toLowerCase() === "nil" ||
    stringValue.toLowerCase() == "undefined"
  ) {
    return null;
  }

  // Handle boolean values
  if (stringValue.toLowerCase() == "true") {
    return true;
  }
  if (stringValue.toLowerCase() == "false") {
    return false;
  }

  // Handle numbers (integer and float)
  if (/^-?\d+$/.test(stringValue)) {
    return parseInt(stringValue, 10);
  }
  if (/^-?\d*\.\d+$/.test(stringValue)) {
    return parseFloat(stringValue);
  }

  return stringValue;
}
