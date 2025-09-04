// src/core/reporter.ts
import fs from 'node:fs/promises';
import chalk from 'chalk';          // 终端彩色输出
import { UnusedImageInfo } from '../types';
import { getFileSize, getLastModified } from './utils';

export async function outputResults(
    unused: string[],
    outputFile: string
): Promise<void> {
    const data = {
        timestamp: new Date().toISOString(),
        unusedCount: unused.length,
        unusedImages: unused.map(p => ({
            path: p,
            size: getFileSize(p),
            lastModified: getLastModified(p),
        })),
    };

    await fs.writeFile(outputFile, JSON.stringify(data, null, 2));

    // 控制台美化
    console.log(chalk.green.bold('\n✅ 检测完成!'));
    console.log(chalk.yellow(`📦 共发现 ${unused.length} 个未使用的图片资源`));
    console.log(chalk.blue(`📝 详细报告已保存: ${outputFile}\n`));

    if (unused.length) {
        console.log(chalk.red.bold('未使用的图片列表:'));
        data.unusedImages.forEach(({ path, size, lastModified }) => {
            console.log(
                chalk.gray('  - ') +
                chalk.cyan(path) +
                chalk.gray(`  ${size}  ${lastModified}`)
            );
        });
        console.log('');
    }
}