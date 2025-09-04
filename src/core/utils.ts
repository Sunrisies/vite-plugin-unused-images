// src/core/utils.ts
import fs from 'node:fs';
import path from 'node:path';

export function getFileSize(filePath: string): string {
    try {
        const sizeInKB = Math.round(fs.statSync(filePath).size / 1024);
        return `${sizeInKB} KB`;
    } catch {
        return '未知';
    }
}

export function getLastModified(filePath: string): string {
    try {
        return fs.statSync(filePath).mtime.toISOString().split('T')[0];
    } catch {
        return '未知';
    }
}