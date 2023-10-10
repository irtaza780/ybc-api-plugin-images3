import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const fs = require("fs");

function myStartup(context) {
  context.simpleSchemas.ProductVariant.extend({
    uploadedBy: {
      type: Number,
      min: 0,
      optional: true,
    },
  });

  context.simpleSchemas.CatalogProductVariant.extend({
    uploadedBy: {
      type: Number,
      min: 0,
      optional: true,
    },
  });
}

const specificVariables = [
  "type",
  "project_id",
  "private_key_id",
  "private_key",
  "client_email",
  "client_id",
  "auth_uri",
  "token_uri",
  "auth_provider_x509_cert_url",
  "client_x509_cert_url",
  "universe_domain",
];

function createGCPConfig() {
  if (process.env.BUCKET_PLATFORM !== "GCP") {
    return;
  }

  const envVariables = {};

  specificVariables.forEach((item) => {
    if (item === "private_key") {
      const myEnvVar = process.env.private_key;

      const formattedEnvVar = myEnvVar?.replace(/\\n/g, "\n");
      envVariables["private_key"] = formattedEnvVar;
    } else {
      envVariables[item] = process.env[item];
    }
  });

  const filePath = path.join(__dirname, "specific_env_variables.json");
  const jsonContent = JSON.stringify(envVariables, null, 2);

  // Replace "\n" with actual newline character

  // Write JSON content to a file
  fs.writeFileSync(filePath, jsonContent, "utf-8");

  console.log(`JSON file (${filePath}) created successfully.`);
}

export { myStartup, createGCPConfig };
