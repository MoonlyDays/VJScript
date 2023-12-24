#!/usr/bin/env node

//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import {parseModule} from 'meriyah';
import * as path from 'path';

import {translate} from './index';

const options: {
    watch?: boolean;
    file?: string;
    dir?: string;
    tree?: boolean;
} = {};

const shortOptionMap = {w: 'watch', f: 'file', d: 'dir', t: 'tree'};
const HEADER =
    'This code was automatically generated using VJScript.\n' +
    'VJScript is an automatic code translation tool from JavaScript to Squirrel\n' +
    'https://github.com/MoonlyDays/VJScript';

const processShortOption = (option: string, value: string) => {
    if (option in shortOptionMap) {
        processOption(shortOptionMap[option], value);
        return;
    }
};

const processOption = (option: string, value?: string) => {
    option = option.toLowerCase();
    options[option] = value || true;
};

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

const processFile = (filePath: string) => {
    const jsCode = fs.readFileSync(filePath).toString('utf-8');

    const inputPath = path.parse(filePath);
    const baseDir = options.dir || inputPath.dir;
    const fileName = options.file || '';

    if (options.tree) {
        const treePath = path.format({...inputPath, dir: baseDir, base: fileName, ext: '.txt'});
        const jsTree = parseModule(jsCode);
        fs.writeFileSync(treePath, JSON.stringify(jsTree, undefined, 2));
    }

    const nutCode = translate(jsCode);
    const header = generateHeader(filePath);
    const outPath = path.format({...inputPath, dir: baseDir, base: fileName, ext: '.nut'});
    fs.writeFileSync(outPath, header + nutCode);
};

const paths = [];
const argv = process.argv;
for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('-')) {
        const value = argv[++i];
        if (arg.startsWith('--')) processOption(arg.slice(1), value);
        else processShortOption(arg.slice(1), value);

        continue;
    }

    paths.push(arg);
}

for (const path of paths) {
    processFile(path);
}