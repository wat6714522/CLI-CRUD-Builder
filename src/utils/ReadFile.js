import fs from 'fs';
import csvParser from 'csv-parser';
import path from 'path';

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

function parseCSV(filePath, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    const results = {
      records: [],
      fields: [],
      metadata: {
        data: {},
        entityMapped: {},
        primaryKeyField: '',
        totalRecords: 0,
      },
    };
    const record = {};

    let isFirstRow = true;

    fs.createReadStream(filePath, { encoding })
      .pipe(csvParser({ trim: true, skip_empty_lines: true }))
      .on('data', row => {
        // csv-parser automatically handles headers, so every row here is a data row
        // Initialize fields and columns on first data row
        if (isFirstRow) {
          results.fields = Object.keys(row);
          results.metadata.primaryKeyField = Object.keys(row)[0];

          isFirstRow = false;
        }

        // Process the data row
        const record = {};

        Object.keys(row).forEach(field => {
          const value = row[field];
          const typedValue = mapValueToType(value);
          const mapEntity = mapToEntity(typedValue);

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
      .on('error', error => {
        reject(new Error(`${error.message}`));
      })
      .on('end', () => {
        console.log(`${results.metadata.entityMapped}`);
        resolve(results);
      });
  });
}

function mapToEntity(values) {
  const type = typeof values;

  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case null:
      return 'null';
    case 'object':
      return values instanceof Date ? 'date' : 'object';
    case '':
      return 'null';
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function mapValueToType(value) {
  const stringValue = String(value).trim();

  if (
    !value ||
    value === '' ||
    stringValue.toLowerCase() == 'null' ||
    stringValue.toLowerCase() == 'nil'
  ) {
    return null;
  } else {
    return stringValue.toLowerCase() == 'true'
      ? true
      : stringValue.toLowerCase() == 'false'
        ? false
        : /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(stringValue)
          ? new Date(stringValue).getTime()
          : /^\d{13}$/.test(stringValue)
            ? parseInt(stringValue, 10)
            : /^-?\d*\.\d+$/.test(stringValue)
              ? parseFloat(stringValue)
              : 'undefined';
  }
}
