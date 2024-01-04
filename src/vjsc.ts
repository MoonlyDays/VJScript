#!/usr/bin/env node

//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';

import {Translator} from './squirrel/translator';

const HEADER = 'This code was automatically generated using VJScript.\n' + 'VJScript is an automatic code translation tool from JavaScript to Squirrel\n' + 'https://github.com/MoonlyDays/VJScript';

const generateHeader = (filePath: string) => {
    const messageInfo = HEADER.split('\n');
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

export function translate(sourcePath: string, outPath: string) {
    const translator = new Translator(sourcePath);
    const nutCode = translator.translate();

    const header = generateHeader(sourcePath);
    fs.writeFileSync(outPath, header + nutCode);
}


const WATCH_INTERVAL = 500;
const g_kOptions: {
    watch?: boolean; watchInterval: number; file?: string; dir?: string; tree?: boolean;
} = {
    watchInterval: WATCH_INTERVAL
};

const validateOptions = () => {
    g_kOptions.watchInterval = Number(g_kOptions.watchInterval) || WATCH_INTERVAL;
};

const shortOptionMap: { [key: string]: keyof typeof g_kOptions } = {
    w: 'watch', f: 'file', d: 'dir', t: 'tree', i: 'watchInterval'
};

const findOptionKey = (option: string) => {
    option = option.toLowerCase();
    for (const key in g_kOptions) if (key.toLowerCase() == option) return key;

    return option;
};

const processShortOption = (option: string, value: string) => {
    if (option in shortOptionMap) {
        processOption(shortOptionMap[option], value);
        return;
    }
};

const processOption = (option: string, value?: string) => {
    const key = findOptionKey(option);
    g_kOptions[key] = value || true;
};


const processFile = (filePath: string) => {

    try {
        const inputPath = path.parse(filePath);
        const baseDir = g_kOptions.dir || inputPath.dir;
        const fileName = g_kOptions.file || '';
        const outPath = path.format({...inputPath, dir: baseDir, base: fileName, ext: '.nut'});

        translate(filePath, outPath);
    } catch (e) {
        console.log(e);
    }
};

const paths = [];
const argv = process.argv;
for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('-')) {
        let value = argv[++i];
        if (value && value.startsWith('-')) {
            value = undefined;
            i--;
        }

        if (arg.startsWith('--')) {
            processOption(arg.slice(1), value);
        } else {
            processShortOption(arg.slice(1), value);
        }

        continue;
    }

    paths.push(arg);
}

validateOptions();

for (const path of paths) {
    console.log(`Translating ${path}...`);
    processFile(path);

    if (g_kOptions.watch) {
        fs.watchFile(path, {
            persistent: true, interval: g_kOptions.watchInterval
        }, () => {
            console.log(`[Watch Mode]: ${path} has updated. Translating...`);
            processFile(path);
        });
    }
}

if (g_kOptions.watch) {
    console.log(`[Watch Mode]: Watch Mode enabled! (interval: ${g_kOptions.watchInterval}ms)`);
}