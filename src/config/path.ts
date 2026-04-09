import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const upload = join(__dirname, "../../media");
export const originalFiles = join(upload, "./original");
export const shakalFiles = join(upload, "./shakal");