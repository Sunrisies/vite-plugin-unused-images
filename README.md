# vite-plugin-unused-images

**English** | [中文](README.CN.md)

> A lightweight, zero-config Vite plugin that finds unused image assets in your project and reports them in a developer-friendly way.

---

## ✨ Features

- ⚡ Runs automatically at build time, works out-of-the-box
- 🎯 Supports PNG, JPG, SVG, WebP and all common formats
- 🔧 Customizable scan directories, exclude rules and output path
- 🎨 Colorized CLI output + detailed JSON report, perfect for CI
- 🚨 Optional “fail the build when unused images are found”

---

## 📦 Installation

```bash
npm i -D vite-plugin-unused-images
# or
yarn add -D vite-plugin-unused-images
# or
pnpm add -D vite-plugin-unused-images
```

---

## 🚀 Quick Start

### 1. Add to your Vite config

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import unusedImages from 'vite-plugin-unused-images'

export default defineConfig({
	plugins: [
		unusedImages({
			/* override any defaults if needed */
		})
	]
})
```

### 2. Run build

```bash
npm run build
```

Example terminal output:

```
🔍 Scanning for unused images...
📦 Found 3 unused images
📝 Report saved to unused-images.json

Unused images:
  - src/assets/logo-old.png  12 KB  2024-06-01
  - public/bg-unused.webp   89 KB  2024-05-28
  - src/assets/icons/x.svg   3 KB  2024-05-25
```

---

## ⚙️ Options

| Option         | Type       | Default                                   | Description                                |
| -------------- | ---------- | ----------------------------------------- | ------------------------------------------ |
| `imageDirs`    | `string[]` | `['src/assets','public']`                 | Directories to scan for images             |
| `sourceDirs`   | `string[]` | `['src']`                                 | Directories to scan for source code        |
| `extensions`   | `string[]` | `['png','jpg','jpeg','gif','svg','webp']` | Image extensions to check                  |
| `exclude`      | `string[]` | `[]`                                      | Glob patterns to ignore                    |
| `outputFile`   | `string`   | `'unused-images.json'`                    | Path to save the JSON report               |
| `failOnUnused` | `boolean`  | `false`                                   | Throw error if any unused images are found |

### Custom example

```ts
unusedImages({
	imageDirs: ['src/assets/images', 'src/assets/icons'],
	sourceDirs: ['src', 'docs'],
	extensions: ['png', 'svg'],
	exclude: ['**/node_modules/**', '**/*.d.ts'],
	outputFile: 'reports/unused-images.json',
	failOnUnused: true
})
```

---

## 📊 Report Format

Generated JSON looks like:

```jsonc
{
	"timestamp": "2024-09-04T12:00:00.000Z",
	"unusedCount": 2,
	"unusedImages": [
		{
			"path": "src/assets/banner.png",
			"size": "42 KB",
			"lastModified": "2024-08-30"
		},
		{
			"path": "public/icons/close.svg",
			"size": "1 KB",
			"lastModified": "2024-08-28"
		}
	]
}
```

## 🧰 FAQ

| Problem                                           | Cause                                     | Solution                                                             |
| ------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| Dynamically imported images are flagged as unused | Path concatenation or variable references | Exclude the directory in `exclude` or explicitly reference the asset |
| Remote CDN images are scanned                     | Plugin only scans local filesystem        | No action needed—remote URLs are ignored                             |

---

## 📄 License

MIT © 2024-present

---

## 🤝 Contributing

Issues and PRs are welcome!  
To develop locally:

```bash
git clone https://github.com/your-org/vite-plugin-unused-images.git
cd vite-plugin-unused-images
pnpm i
pnpm dev          # watch build
pnpm test         # unit tests
```
