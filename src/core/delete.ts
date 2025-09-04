import fs from 'node:fs/promises';
import chalk from 'chalk';

export async function deleteFiles(files: string[]): Promise<void> {
    if (files.length === 0) return;

    console.log(chalk.red.bold('\n🗑  Deleting unused images...'));
    for (const file of files) {
        await fs.unlink(file);
        console.log(chalk.gray('  deleted: ') + chalk.cyan(file));
    }
}