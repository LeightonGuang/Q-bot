import fs from "fs";
import { fileURLToPath } from "url";
import path from "node:path";

export function writeToFile(data: object) {
  const currentFilePath: string = fileURLToPath(import.meta.url);
  const dataFilePath: string = path.resolve(
    path.dirname(currentFilePath),
    "../../public/data.json"
  );
  const dataString: string = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataFilePath, dataString);
}
