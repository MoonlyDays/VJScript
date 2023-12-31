//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import fs from 'fs';
import {parseModule} from 'meriyah';
import path from 'path';

import {generate} from './squirrel/generate';
import {MeriyahParseOptions} from './squirrel/helpers';
import {preprocess} from './squirrel/preprocess';

export function translate(sourcePath: string, outPath: string, options?: {
    tree: boolean
}) {

    const program = preprocess(sourcePath);
    const nutCode = generate(program);
    console.log(JSON.stringify(program));

    const header = generateHeader(sourcePath);
    fs.writeFileSync(outPath, header + nutCode);

    if (options?.tree) {
        const parsedPath = path.parse(sourcePath);
        const treePath = path.format({dir: parsedPath.dir, name: parsedPath.name, ext: '.txt'});
        fs.writeFileSync(treePath, JSON.stringify(program, undefined, 2));
    }
}


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
