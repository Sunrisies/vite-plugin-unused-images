import { type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

export interface UnusedImagesPluginOptions {
    imageDirs?: string[];      // 图片目录，默认为 ['src/assets', 'public']
    sourceDirs?: string[];     // 源代码目录，默认为 ['src']
    extensions?: string[];     // 图片扩展名，默认为 ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']
    exclude?: string[];        // 排除的文件或模式
    outputFile?: string;       // 输出结果的文件名
    failOnUnused?: boolean;    // 发现未使用图片时是否使构建失败
}

export default function unusedImagesPlugin(options: UnusedImagesPluginOptions = {}): Plugin {
    const {
        imageDirs = ['src/assets', 'public'],
        sourceDirs = ['src'],
        extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
        exclude = [],
        outputFile = 'unused-images.json',
        failOnUnused = false
    } = options;

    return {
        name: 'vite-plugin-unused-images',
        apply: 'build', // 通常在构建时运行

        async buildStart() {
            console.log('开始检测未使用的图片资源...');

            // 1. 收集所有图片文件
            const imageFiles = await collectImageFiles(imageDirs, extensions, exclude);

            // 2. 收集所有源代码文件
            const sourceFiles = await collectSourceFiles(sourceDirs, exclude);

            // 3. 分析代码中的图片引用
            const usedImages = await analyzeImageReferences(sourceFiles, imageFiles);

            // 4. 找出未使用的图片
            const unusedImages = imageFiles.filter(img => !usedImages.has(img));

            // 5. 输出结果
            await outputResults(unusedImages, outputFile);

            // 6. 如果有未使用的图片且配置了失败选项，使构建失败
            if (unusedImages.length > 0 && failOnUnused) {
                throw new Error(`发现 ${unusedImages.length} 个未使用的图片资源`);
            }
        }
    };
}

// 收集图片文件
async function collectImageFiles(dirs: string[], extensions: string[], exclude: string[]): Promise<string[]> {
    const imageFiles: string[] = [];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;

        const pattern = `${dir}/**/*.{${extensions.join(',')}}`;
        const files = await glob(pattern, { ignore: exclude });
        imageFiles.push(...files);
    }
    console.log(`共发现 ${imageFiles.length} 个图片文件`);
    return imageFiles;
}

// 收集源代码文件
async function collectSourceFiles(dirs: string[], exclude: string[]): Promise<string[]> {
    const sourceFiles: string[] = [];
    const extensions = ['js', 'jsx', 'ts', 'tsx', 'vue', 'svelte', 'html', 'css', 'scss', 'less'];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;

        const pattern = `${dir}/**/*.{${extensions.join(',')}}`;
        const files = await glob(pattern, { ignore: exclude });
        sourceFiles.push(...files);
    }
    return sourceFiles;
}

// 分析图片引用
async function analyzeImageReferences(sourceFiles: string[], imageFiles: string[]): Promise<Set<string>> {
    const usedImages = new Set<string>();

    for (const file of sourceFiles) {
        const content = await fs.promises.readFile(file, 'utf-8');
        // 检查每个图片是否在源代码中被引用
        console.log(content);
        for (const imageFile of imageFiles) {
            const imageName = path.basename(imageFile);
            const relativePath = getRelativePath(file, imageFile);

            // 多种引用方式的检测
            if (
                content.includes(imageName) || // 直接引用文件名
                content.includes(relativePath) || // 引用相对路径
                content.includes(`'${imageName}'`) || // 在字符串中引用
                content.includes(`"${imageName}"`) ||
                content.includes(`'${relativePath}'`) ||
                content.includes(`"${relativePath}"`) ||
                content.includes(`\`${relativePath}\``) || // 模板字符串
                isDynamicReference(content, imageName) // 动态引用检测
            ) {
                usedImages.add(imageFile);
            }
        }
    }

    return usedImages;
}

// 获取相对路径
function getRelativePath(sourceFile: string, targetFile: string): string {
    const sourceDir = path.dirname(sourceFile);
    return path.relative(sourceDir, targetFile);
}

// 检测动态引用（基础实现）
function isDynamicReference(content: string, imageName: string): boolean {
    // 简单的动态路径模式检测
    const baseName = path.basename(imageName, path.extname(imageName));
    const patterns = [
        new RegExp(`[\\w\\d_]*${baseName}[\\w\\d_]*`, 'i'), // 变量名中包含图片名
        new RegExp(`\\+\\s*['"\`]?${baseName}['"\`]?`, 'i'), // 字符串拼接
    ];

    return patterns.some(pattern => pattern.test(content));
}

// 输出结果
async function outputResults(unusedImages: string[], outputFile: string): Promise<void> {
    const result = {
        timestamp: new Date().toISOString(),
        unusedCount: unusedImages.length,
        unusedImages: unusedImages.map(file => ({
            path: file,
            size: getFileSize(file),
            lastModified: getLastModified(file)
        }))
    };

    await fs.promises.writeFile(outputFile, JSON.stringify(result, null, 2));
    console.log(`检测完成! 发现 ${unusedImages.length} 个未使用的图片资源`);
    console.log(`详细结果已保存到 ${outputFile}`);

    if (unusedImages.length > 0) {
        console.log('\n未使用的图片:');
        unusedImages.forEach(file => console.log(`  - ${file}`));
    }
}

// 获取文件大小
function getFileSize(filePath: string): string {
    try {
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024);
        return `${sizeInKB} KB`;
    } catch {
        return '未知';
    }
}

// 获取最后修改时间
function getLastModified(filePath: string): string {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
    } catch {
        return '未知';
    }
}