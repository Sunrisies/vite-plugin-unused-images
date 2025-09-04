// src/index.ts
import { UnusedImagesPluginOptions } from './types';
import { collectImageFiles, collectSourceFiles } from './core/collect';
import { analyzeImageReferences } from './core/analyze';
import { outputResults } from './core/reporter';
import { deleteFiles } from './core/delete';
export default function unusedImagesPlugin(
    options: UnusedImagesPluginOptions = {}
) {
    const {
        imageDirs = ['src/assets', 'public'],
        sourceDirs = ['src'],
        extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
        exclude = [],
        outputFile = 'unused-images.json',
        failOnUnused = false,
        deleteUnused = false
    } = options;

    return {
        name: 'vite-plugin-unused-images',
        apply: 'build',

        async buildStart() {
            console.log('🔍 开始检测未使用的图片资源...');

            const imageFiles = await collectImageFiles(imageDirs, extensions, exclude);
            const sourceFiles = await collectSourceFiles(sourceDirs, exclude);
            const usedImages = await analyzeImageReferences(sourceFiles, imageFiles);
            const unusedImages = imageFiles.filter(img => !usedImages.has(img));

            await outputResults(unusedImages, outputFile);

            if (unusedImages.length && failOnUnused) {
                throw new Error(`❌ 发现 ${unusedImages.length} 个未使用的图片资源`);
            }
            if (deleteUnused && unusedImages.length > 0) {
                await deleteFiles(unusedImages);
            }
        },
    };
}