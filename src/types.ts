import type { PluginOption, ResolvedConfig } from 'vite'
export { PluginOption, ResolvedConfig }


export interface UnusedImagesPluginOptions {
    /** 图片目录，默认为 ['src/assets', 'public'] */
    imageDirs?: string[];      // 图片目录，默认为 ['src/assets', 'public']
    /** 源代码目录，默认为 ['src'] */
    sourceDirs?: string[];     // 源代码目录，默认为 ['src']
    /** 图片扩展名，默认为 ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'] */
    extensions?: Convert[];     // 图片扩展名，默认为 ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']
    /** 排除的文件或模式，默认为 [] */
    exclude?: string[];        // 排除的文件或模式
    /** 输出结果的文件名，默认为 'unused-images.json' */
    outputFile?: string;       // 输出结果的文件名
    /** 是否输出到控制台，默认为 false */
    failOnUnused?: boolean;    // 发现未使用图片时是否使构建失败
}

export type Convert =
    'png' | 'jpg' | 'jpeg' | 'gif' | 'svg' | 'webp'


export interface UnusedImageInfo {
    path: string;
    size: string;
    lastModified: string;
}