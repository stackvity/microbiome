/** @type {import('tailwindcss').Config} */
module.exports = {
  // No 'content' array needed for Tailwind v4 with automatic detection.
  theme: {
    extend: {
      // References CSS variables defined in globals.css for theming
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))", // Focus ring color
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Assuming a '--secondary' var is defined based on theme needs
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Add other semantic colors if defined (e.g., success, warning)
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
      },
      fontFamily: {
        // References the CSS variable for the main project font
        sans: ["var(--font-inter)", "sans-serif"],
        // mono: ['var(--font-mono)', 'monospace'], // Uncomment if a mono font is defined
      },
      spacing: {
        // Directly maps to Tailwind scale, referencing CSS vars if needed for consistency (less common)
        // Example: '1': 'var(--spacing-1)' // Generally not needed if using standard scale
      },
      borderRadius: {
        // Example if needing non-standard radii based on design system tokens
        // lg: "var(--radius)",
        // md: "calc(var(--radius) - 2px)",
        // sm: "calc(var(--radius) - 4px)",
      },
      // Extend other theme properties like keyframes, animation, etc. as needed
    },
  },
  plugins: [
    // require('tailwindcss-animate'), // Often used with shadcn/ui, verify if needed
    // Add other Tailwind plugins here
  ],
};
