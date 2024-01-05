//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Program} from 'estree';
import fs from 'fs';
import {Options, parseModule} from 'meriyah';
import path from 'path';

import {prepare} from './handler';
import {Translator} from './translator';

export const MeriyahParseOptions: Options = {
    next: true
};

export class Module {
    name: string;
    path: string;
    formattedPath: path.ParsedPath;
    scriptCode: string;

    program: Program;
    translator: Translator;
    defaultExportIdent?: Identifier;

    constructor(translator: Translator, scriptPath: string) {
        this.translator = translator;
        this.path = scriptPath;
        this.name = `import_${translator.modules.size}`;
        this.translator.modules.set(scriptPath, this);
        this.formattedPath = path.parse(scriptPath);

        let jsCode = fs.readFileSync(scriptPath).toString('utf-8');
        jsCode = jsCode.replace(/^#!.*$/, '');
        this.scriptCode = jsCode;

        this.program = parseModule(this.scriptCode, MeriyahParseOptions) as Program;
        prepare(this.program, this);
    }
}
