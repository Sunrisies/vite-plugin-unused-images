// src/core/collect.ts
import fs from 'node:fs';
import { glob } from 'glob';

export async function collectImageFiles(
    dirs: string[],
    extensions: string[],
    exclude: string[]
): Promise<string[]> {
    const files: string[] = [];
    const extPattern = extensions.join(',');
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const list = await glob(`${dir}/**/*.{${extPattern}}`, { ignore: exclude });
        files.push(...list);
    }
    return files;
}

export async function collectSourceFiles(
    dirs: string[],
    exclude: string[]
): Promise<string[]> {
    const extensions = ['js', 'jsx', 'ts', 'tsx', 'vue', 'svelte', 'html', 'css', 'scss', 'less'];
    const extPattern = extensions.join(',');
    const files: string[] = [];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const list = await glob(`${dir}/**/*.{${extPattern}}`, { ignore: exclude });
        files.push(...list);
    }
    return files;
}