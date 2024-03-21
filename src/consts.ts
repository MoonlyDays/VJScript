import fs from 'fs';
import path from 'path';

import {Translator} from './squirrel/translator';

export const HEADER_MESSAGE =
    'This code was automatically generated using VJScript.\n' +
    'VJScript is an automatic code translation tool from JavaScript to Squirrel\n' +
    'https://github.com/MoonlyDays/VJScript';

export const DEFAULT_WATCH_INTERVAL_MS = 500;

export type OptionsMap = {
    /**
     * Should the process work in watch mode?
     */
    watch?: boolean;
    /**
     * How often we should watch for file updates?
     */
    watchInterval: number;
    /**
     * What file are we processing?
     */
    file?: string;
    /**
     * What directory are we processing?
     */
    dir?: string;
    /**
     * Should we also generate a txt file of the AST?
     */
    tree?: boolean;
}

export type OptionsShortMap = { [key: string]: keyof OptionsMap };


/**
 * Validate user's options.
 */
export function validateOptions(options: OptionsMap) {

    // Watch Interval
    options.watchInterval = Number(options.watchInterval);
    if (options.watchInterval <= 0) {
        console.warn(`[WARNING] Watch interval must be a positive number. Resetting to default: ${DEFAULT_WATCH_INTERVAL_MS}ms`);
        options.watchInterval = DEFAULT_WATCH_INTERVAL_MS;
    }
}

/**
 * Generate header string for the file that is being processed.
 * @param filePath
 */
export const generateHeader = (filePath: string) => {
    const messageInfo = HEADER_MESSAGE.split('\n');
    const compileInfo: string[] = [];

    const parsedPath = path.parse(filePath);
    compileInfo.push(`Source Script Name: ${parsedPath.base}`);
    compileInfo.push(`Compile Time: ${new Date().toString()}`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    compileInfo.push(`VJScript Version: ${require('../package.json').version}`);

    const blocks = [messageInfo, compileInfo];

    const EXTRA_LINE_CHARS = 5;
    const maxLen = Math.max(...blocks.map(x => Math.max(...x.map(y => y.length)))) + EXTRA_LINE_CHARS;
    const headerLine = Array(maxLen).fill('-').join('') + '//';

    const lines = [headerLine];
    for (const block of blocks) {
        lines.push(...block.map(x => ' ' + x));
        lines.push(headerLine);
    }

    return lines.map(x => '//' + x).join('\n') + '\n\n';
};

/**
 * Accepts a JavaScript file and generates Squirrel code on out path.
 * @param sourcePath
 * @param outPath
 */
export function translate(sourcePath: string, outPath: string) {
    const translator = new Translator(sourcePath);
    const nutCode = translator.translate();

    const header = generateHeader(sourcePath);
    fs.writeFileSync(outPath, header + nutCode);
}


export const normalizeOptionName = (options: OptionsMap, option: string) => {
    option = option.toLowerCase();
    for (const key in options)
        if (key.toLowerCase() == option)
            return key;

    return option;
};

export const processShortOption = (
    option: string,
    value: string,
    options: OptionsMap,
    shortOptionMap: OptionsShortMap
) => {
    if (option in shortOptionMap) {
        processOption(shortOptionMap[option], value, options);
        return;
    }
};

export const processOption = (option: string, value: string | null, options: OptionsMap) => {
    const key = normalizeOptionName(options, option);
    options[key] = value || true;
};

export const processFile = (filePath: string, options: OptionsMap) => {
    try {
        const inputPath = path.parse(filePath);
        const baseDir = options.dir || inputPath.dir;
        const fileName = options.file || '';
        const outPath = path.format(
            {...inputPath, dir: baseDir, base: fileName, ext: '.nut'}
        );

        translate(filePath, outPath);
    } catch (e) {
        console.log(e);
    }
};
