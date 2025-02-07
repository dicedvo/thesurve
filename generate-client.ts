import { $ } from "bun";
import { mkdir } from "fs/promises";
import { join } from "path";

const tempDir = join(import.meta.dir, '.temp');
const tempFile = join(tempDir, 'swagger.json');

async function isTempDirExists() {
  try {
    await mkdir(tempDir);
    return true;
  } catch (e) {
    return false;
  }
}

async function fetchAndSave() {
  // Fetch from NocoDB swagger
  const res = await fetch(import.meta.env.VITE_API_URL + "/server/specs/oas", {
    headers: {
      'Authorization': 'Bearer ' + import.meta.env.VITE_API_TOKEN
    },
  });

  const json = await res.text();

  if (!json) {
    console.error('Failed to fetch swagger.json');
    return;
  }

  if (!await isTempDirExists()) {
    await mkdir(tempDir, { recursive: true });
  }
  
  // Save to a temporary file
  await Bun.write(tempFile, json);

  const output = await $`openapi-ts`;
  console.log(output.text());
}

await fetchAndSave();