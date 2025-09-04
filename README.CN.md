# vite-plugin-unused-images

**中文** | [English](README.md)

> 轻量、可配置的 Vite 插件，用于自动检测项目里未被引用的图片资源，并以友好的方式输出报告。

---

## ✨ 特性

- ⚡ 构建时自动运行，零配置开箱即用
- 🎯 支持 PNG、JPG、SVG、WebP 等全部常见格式
- 🔧 可自定义扫描目录、排除规则、输出路径
- 🎨 CLI 彩色输出 + JSON 报告，CI/CD 友好
- 🚨 可配置“发现未使用图片即构建失败”

---

## 📦 安装

```bash
npm i -D vite-plugin-unused-images
# or
yarn add -D vite-plugin-unused-images
# or
pnpm add -D vite-plugin-unused-images
```

---

## 🚀 快速开始

### 1. 配置 Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import unusedImages from 'vite-plugin-unused-images'

export default defineConfig({
	plugins: [
		unusedImages({
			/* 可按需覆盖默认配置 */
		})
	]
})
```

### 2. 运行构建

```bash
npm run build
```

终端示例输出：

```
🔍 开始检测未使用的图片资源...
📦 共发现 3 个未使用的图片资源
📝 详细报告已保存: unused-images.json

未使用的图片列表:
  - src/assets/logo-old.png  12 KB  2024-06-01
  - public/bg-unused.webp   89 KB  2024-05-28
  - src/assets/icons/x.svg   3 KB  2024-05-25
```

---

## ⚙️ 配置项

| 参数           | 类型       | 默认值                                    | 说明                           |
| -------------- | ---------- | ----------------------------------------- | ------------------------------ |
| `imageDirs`    | `string[]` | `['src/assets','public']`                 | 需要扫描的图片目录             |
| `sourceDirs`   | `string[]` | `['src']`                                 | 需要分析的源码目录             |
| `extensions`   | `string[]` | `['png','jpg','jpeg','gif','svg','webp']` | 图片后缀                       |
| `exclude`      | `string[]` | `[]`                                      | glob 忽略规则                  |
| `outputFile`   | `string`   | `'unused-images.json'`                    | 报告输出路径                   |
| `failOnUnused` | `boolean`  | `false`                                   | 发现未使用图片时是否让构建失败 |

### 示例：自定义配置

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

## 📊 报告格式

生成的 JSON 报告示例如下：

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

## 🧰 常见问题

| 问题                                         | 原因                   | 解决方案                                          |
| -------------------------------------------- | ---------------------- | ------------------------------------------------- |
| 被 webpack/vite 动态导入的图片被误判为未使用 | 路径拼接或变量名引用   | 在 `exclude` 中排除该目录，或手动在代码中显式引用 |
| 某些远程 CDN 图片也被扫描                    | 插件只扫描本地文件系统 | 无需处理，远程地址不会被统计                      |

---

## 📄 License

MIT © 2024-present

---

## 🤝 贡献

欢迎提 Issue 与 PR！  
开发调试：

```bash
git clone https://github.com/your-org/vite-plugin-unused-images.git
cd vite-plugin-unused-images
pnpm i
pnpm dev            # 监听构建
pnpm test           # 单测
```
