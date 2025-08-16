import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ReadTemplate,
  toPascalCase,
  toCamelCase,
  toKebabCase,
} from '../../src/utils/GeneratorHelper';

describe('Generator Utility', () => {
  const fileName = fileURLToPath(import.meta.url);
  const dirname = path.dirname(fileName);

  const templatePath = path.join(dirname, '../../template/NestJS/DTO/UpdateDTO.txt');

  const str = 'My Name is Pawat';

  describe('Read template function', () => {
    it('Should correctly read the template file', async () => {
      const template = await ReadTemplate(templatePath);
      const templateContent = String('export class Something(){console.log(Please to meet you)}');

      expect(template).not.toBeNull();
    });

    it('Error Handling', () => {});
  });

  describe('Convert to different naming Scheme', () => {
    it('Should correctly convert to cammel case', () => {
      const cammelCase = toCamelCase(str);

      expect(cammelCase).toEqual('myNameIsPawat');
    });

    it('Should correctly convert to pascal case', () => {
      const pasalCase = toPascalCase(str);

      expect(pasalCase).toEqual('MyNameIsPawat');
    });

    it('Should correct convert to kebab case', () => {
      const kebabCase = toKebabCase(str);

      expect(kebabCase).toEqual('my-name-is-pawat');
    });
  });
});
