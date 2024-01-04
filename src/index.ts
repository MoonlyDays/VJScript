//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import {Translator} from './squirrel/translator';

export function translate(sourcePath: string, outPath: string) {

    const translator = new Translator(sourcePath);
    const nutCode = translator.translate();

    const header = generateHeader(sourcePath);
    fs.writeFileSync(outPath, header + nutCode);
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
