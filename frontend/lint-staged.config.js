// File: frontend/lint-staged.config.js
// Rationale: Configures linters/formatters to run on staged files via Husky pre-commit hook for the frontend.
// Task ID: FE-009
// Status: (Content remains as per baseline analysis, no changes mandated by Rec A.1 for *this file's content*)

module.exports = {
  // Lint & Prettify TS and JS files.
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `next lint --fix --file ${filenames
      .map((f) => f.replace(/\\/g, "/"))
      .join(" --file ")}`,
    `prettier --write ${filenames.map((f) => f.replace(/\\/g, "/")).join(" ")}`,
  ],

  // Prettify other file types like JSON, Markdown, CSS, SCSS, YAML.
  "**/*.{json,md,css,scss,yml,yaml}": (filenames) => [
    `prettier --write ${filenames.map((f) => f.replace(/\\/g, "/")).join(" ")}`,
  ],
};
