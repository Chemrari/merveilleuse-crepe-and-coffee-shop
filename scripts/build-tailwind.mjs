import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const filesToScan = [
  "index.html",
  "about.html",
  "menu.html",
  "Gallery.html",
  "contact.html",
  "components/navbar.html",
  "components/footer.html",
  "components/components-loader.js",
  "assets/js/contact-reviews.js"
];

const themeCss = `
@import "tailwindcss";

@theme {
  --color-surface-variant: #e4e2de;
  --color-on-primary: #ffffff;
  --color-inverse-primary: #ffb4ab;
  --color-surface-container-high: #eae8e4;
  --color-primary-fixed: #ffdad6;
  --color-surface-container-lowest: #ffffff;
  --color-inverse-on-surface: #f2f0ed;
  --color-secondary-container: #ffd7ce;
  --color-inverse-surface: #30312e;
  --color-outline-variant: #e5bdb8;
  --color-on-surface: #1b1c1a;
  --color-on-error: #ffffff;
  --color-on-secondary-container: #7a5b54;
  --color-surface-container-highest: #e4e2de;
  --color-surface-tint: #be0e16;
  --color-on-tertiary-fixed: #320047;
  --color-error-container: #ffdad6;
  --color-on-tertiary-container: #fde9ff;
  --color-on-secondary: #ffffff;
  --color-secondary-fixed: #ffdad2;
  --color-surface-container: #efeeea;
  --color-on-secondary-fixed-variant: #5c403a;
  --color-tertiary-container: #9c44c3;
  --color-on-surface-variant: #5c403c;
  --color-primary-fixed-dim: #ffb4ab;
  --color-surface-bright: #fbf9f5;
  --color-on-tertiary-fixed-variant: #721199;
  --color-on-error-container: #93000a;
  --color-on-tertiary: #ffffff;
  --color-error: #ba1a1a;
  --color-on-secondary-fixed: #2b1611;
  --color-outline: #916f6b;
  --color-tertiary: #8127a8;
  --color-tertiary-fixed-dim: #ebb2ff;
  --color-secondary: #755750;
  --color-primary: #ad000f;
  --color-background: #fbf9f5;
  --color-on-primary-fixed-variant: #93000b;
  --color-surface-container-low: #f5f3ef;
  --color-surface-dim: #dbdad6;
  --color-surface: #fbf9f5;
  --color-primary-container: #d32323;
  --color-on-primary-container: #ffebe9;
  --color-tertiary-fixed: #f8d8ff;
  --color-on-primary-fixed: #410002;
  --color-secondary-fixed-dim: #e5beb5;
  --color-on-background: #1b1c1a;

  --radius: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  --spacing-sm: 12px;
  --spacing-gutter: 16px;
  --spacing-base: 8px;
  --spacing-lg: 40px;
  --spacing-xl: 64px;
  --spacing-margin-safe: 24px;
  --spacing-md: 24px;
  --spacing-xs: 4px;

  --font-headline-md: "Noto Serif", serif;
  --font-label-md: "Plus Jakarta Sans", sans-serif;
  --font-body-lg: "Plus Jakarta Sans", sans-serif;
  --font-headline-lg: "Noto Serif", serif;
  --font-display-lg: "Noto Serif", serif;
  --font-body-md: "Plus Jakarta Sans", sans-serif;
  --font-label-sm: "Plus Jakarta Sans", sans-serif;

  --text-headline-md: 24px;
  --text-headline-md--line-height: 1.3;
  --text-headline-md--font-weight: 600;

  --text-label-md: 14px;
  --text-label-md--line-height: 1.4;
  --text-label-md--letter-spacing: 0.05em;
  --text-label-md--font-weight: 600;

  --text-body-lg: 18px;
  --text-body-lg--line-height: 1.6;
  --text-body-lg--font-weight: 400;

  --text-headline-lg: 32px;
  --text-headline-lg--line-height: 1.2;
  --text-headline-lg--font-weight: 600;

  --text-display-lg: 48px;
  --text-display-lg--line-height: 1.1;
  --text-display-lg--font-weight: 700;

  --text-body-md: 16px;
  --text-body-md--line-height: 1.6;
  --text-body-md--font-weight: 400;

  --text-label-sm: 12px;
  --text-label-sm--line-height: 1.4;
  --text-label-sm--letter-spacing: 0.02em;
  --text-label-sm--font-weight: 500;
}
`;

const manualSafelist = [
  "text-red-700",
  "border-b-2",
  "border-red-700",
  "pb-1",
  "font-semibold",
  "text-stone-600",
  "hover:text-stone-900",
  "bg-white",
  "shadow-sm",
  "border-stone-200",
  "bg-transparent",
  "border-transparent",
  "transition-all",
  "duration-500",
  "hidden",
  "pointer-events-none",
  "opacity-0",
  "opacity-100",
  "close",
  "menu"
];

function extractClasses(content) {
  const candidates = new Set();
  const patterns = [
    /class\s*=\s*"([^"]+)"/g,
    /class\s*=\s*'([^']+)'/g,
    /className\s*=\s*"([^"]+)"/g,
    /className\s*=\s*'([^']+)'/g
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      for (const token of match[1].trim().split(/\s+/)) {
        if (token) candidates.add(token);
      }
    }
  }

  for (const match of content.matchAll(/classList\.(?:add|remove|toggle)\(([^)]+)\)/g)) {
    const quoted = match[1].match(/"([^"]+)"|'([^']+)'/g) || [];
    for (const raw of quoted) {
      const token = raw.slice(1, -1);
      if (token) candidates.add(token);
    }
  }

  return candidates;
}

async function build() {
  const candidates = new Set(manualSafelist);

  for (const relativeFile of filesToScan) {
    const absoluteFile = path.join(root, relativeFile);
    const content = await fs.readFile(absoluteFile, "utf8");
    for (const token of extractClasses(content)) {
      candidates.add(token);
    }
  }

  const compiler = await compile(themeCss, {
    base: root,
    from: path.join(root, "tailwind-source.css"),
    loadStylesheet: async (id) => {
      if (id === "tailwindcss") {
        const cssPath = path.join(root, "node_modules", "tailwindcss", "index.css");
        return {
          path: cssPath,
          base: path.dirname(cssPath),
          content: await fs.readFile(cssPath, "utf8")
        };
      }

      throw new Error(`Unsupported stylesheet import: ${id}`);
    }
  });

  const output = compiler.build(Array.from(candidates).sort());
  const outputPath = path.join(root, "assets", "css", "tailwind-built.css");
  await fs.writeFile(outputPath, output, "utf8");
  console.log(`Built ${outputPath}`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
