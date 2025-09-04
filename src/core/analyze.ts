import fs from 'node:fs/promises';
import path from 'node:path';

export async function analyzeImageReferences(
    sourceFiles: string[],
    imageFiles: string[]
): Promise<Set<string>> {
    const used = new Set<string>();

    for (const sf of sourceFiles) {
        const content = await fs.readFile(sf, 'utf-8');
        for (const img of imageFiles) {
            if (used.has(img)) continue;
            const name = path.basename(img);
            const rel = path.relative(path.dirname(sf), img);

            const patterns = [
                name,
                rel,
                `'${name}'`,
                `"${name}"`,
                `'${rel}'`,
                `"${rel}"`,
                `\`${rel}\``,
            ];

            const hit = patterns.some(p => content.includes(p)) || isDynamic(content, name);
            if (hit) used.add(img);
        }
    }
    return used;
}

function isDynamic(content: string, imageName: string): boolean {
    const base = path.basename(imageName, path.extname(imageName));
    const regList = [
        new RegExp(`[\\w\\d_]*${base}[\\w\\d_]*`, 'i'),
        new RegExp(`\\+\\s*['"\`]?${base}['"\`]?`, 'i'),
    ];
    return regList.some(r => r.test(content));
}