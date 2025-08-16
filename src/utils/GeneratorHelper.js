import fs from "fs";

export async function ReadTemplate(templatePath) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  return await fs.promises.readFile(templatePath, "utf8");
}

export function toPascalCase(str) {
  return str
    .replace(/(?:^|[\s-_])(\w)/g, (_match, letter) => letter.toUpperCase())
    .replace(/[\s-_]/g, "");
}

export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
