import readFile, { mapValueToType } from '../../src/utils/ReadFile.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

describe('Read File Utility', () => {
  const fixturePath = path.join(dirname, '../fixtures');
  const testDataPath = path.join(fixturePath, 'test-data.csv');
  const emptyDataPath = path.join(fixturePath, 'empty.csv');
  const invalidDataPath = path.join(fixturePath, 'invalid.csv');
  const nonExistentPath = path.join(fixturePath, 'non-existent.csv');

  describe('Scuessfuly Reading CSV File', () => {
    it('Should Read and Parse valid CSV File Correctly', async () => {
      const result = await readFile(testDataPath);
      const firstRow = result.records[0];

      //Check Result Properties
      expect(result).toHaveProperty('records');
      expect(result).toHaveProperty('fields');
      expect(result).toHaveProperty('metadata');

      //Check Structure of the Result's Properties
      expect(Array.isArray(result.records)).toBe(true);
      expect(Array.isArray(result.fields)).toBe(true);
      expect(typeof result.metadata).toBe('object');

      //Check Data Content of each Properties
      expect(result.records.length).toBeGreaterThan(0);
      expect(result.fields.length).toBeGreaterThan(0);
      expect(Object.keys(result.metadata.data).length).toBeGreaterThan(0);
      expect(firstRow).not.toBeNull();
      expect(result.metadata.primaryKeyField).not.toBeNull();
    });

    it('Should correctly map the CSV String to data types', async () => {
      const result = await readFile(testDataPath);
      const firstRecord = result.records[0];

      for (const key in firstRecord) {
        const valueMapped = mapValueToType(firstRecord[key]);

        expect(typeof valueMapped).toEqual(typeof firstRecord[key]);
      }
    });

    it('Should correctly map the data types to entity types', async () => {
      const result = await readFile(testDataPath);
      const firstRecord = result.records[0];

      for (const [field, type] of Object.entries(result.metadata.entityMapped)) {
        expect(typeof result.metadata.entityMapped[field]).toEqual(typeof type);
      }
    });
  });

  describe('Error Handling for Reading CSV File', () => {
    it('Should sucessfully throw error for non-existent file', async () => {
      await expect(readFile(nonExistentPath)).rejects.toThrow();
    });

    it('Should throw error for invalid file path', async () => {
      await expect(readFile('')).rejects.toThrow();
    });

    it('Should throw error for null file path', async () => {
      await expect(readFile(null)).rejects.toThrow();
    });

    it('Should throw error for undefined file path', async () => {
      await expect(readFile(undefined)).rejects.toThrow();
    });
  });
});
