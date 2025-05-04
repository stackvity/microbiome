/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Monitors app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Monitors pages directory (if Pages Router used alongside App)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Monitors components directory
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Monitors src directory (alternative common structure)
  ],
  // Theme configuration primarily happens in globals.css via @theme
  // with CSS variables per Tailwind v4 practices.
  theme: {
    extend: {
      // Add other specific extensions here if needed beyond CSS variables...
    },
  },
  plugins: [
    // Plugin added proactively as it's commonly required by shadcn/ui components (FE-BL-005).
    require("tailwindcss-animate"),
  ],
};
