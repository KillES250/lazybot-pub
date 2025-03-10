import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importAll(directory) {
  const dirPath = path.resolve(__dirname, directory);
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => path.extname(file) === '.js');

  const modules = [];
  for (const file of files) {
    const absolutePath = path.join(dirPath, file);
    const fileUrl = pathToFileURL(absolutePath).href;
    modules.push(await import(fileUrl));
  }
  return modules;
}

export default importAll;
