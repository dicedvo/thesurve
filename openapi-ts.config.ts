import { defineConfig } from "@hey-api/openapi-ts";

const include = [
  '#/paths/items/thesurve_postings/get',
  '#/paths/items/thesurve_postings/post',
  '#/paths/items/thesurve_postings/{id}/get',
  '#/paths/items/thesurve_reports/post',
  '#/components/schemas/ItemsThesurvePostings',
  '#/components/schemas/ItemsThesurveReports',
  '#/components/schemas/x-metadata',
]

export default defineConfig({
  experimentalParser: true,
  input: {
    path: `./.temp/swagger.json`,
    include: `^(${include.join('|')})$`,
  },
  output: "./app/oapi_client",
  plugins: [
    "@hey-api/client-axios",
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
    {
      name: "@hey-api/sdk",
      asClass: false,
    },
    "@tanstack/react-query",
    "zod",
  ],
});
