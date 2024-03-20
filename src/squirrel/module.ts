//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as babel from '@babel/core';
import {Identifier, Program} from 'estree';
import fs from 'fs';
import {Options, parseModule} from 'meriyah';
import path from 'path';

import {prepare} from './handler';
import {Translator} from './translator';

export const MeriyahParseOptions: Options = {
    next: true,
    lexical: true
};

export const BabelTransformOptions: babel.TransformOptions = {
    plugins: [
        ['@babel/plugin-transform-modules-commonjs', {
            importInterop: 'none',
            strict: true,
            strictMode: false
        }]
    ]
};

interface ModuleExport {
    ScopeIdentifier: string;
    ExportIdentifier: string;
}

export class Module {
    /** The name of the module will be used as the identifier for module resolution. */
    name: string;
    /** Absolute path, relative to the root OS directory. */
    absolutePath: string;
    /** Parsed absolute path. */
    parsedPath: path.ParsedPath;
    /** Path to the module, relative to the package root dir. */
    relativePath: string;

    defaultExportIdentifier?: Identifier;
    exports: ModuleExport[] = [];

    scriptCode: string;
    program: Program;
    translator: Translator;

    constructor(translator: Translator, scriptPath: string) {
        this.translator = translator;
        this.translator.modules.set(scriptPath, this);

        this.absolutePath = scriptPath;
        this.relativePath = this.absolutePath.replace(this.translator.packageDir + '\\', '');
        this.parsedPath = path.parse(scriptPath);
        this.name = this.generateName();

        this.scriptCode = fs.readFileSync(scriptPath).toString('utf-8');
        this.scriptCode = this.scriptCode.replace(/^#!.*$/, '');

        this.babelTransform();
        this.prepareProgram();
    }

    private babelTransform() {

        const result = babel.transformSync(this.scriptCode, BabelTransformOptions);

        this.scriptCode = result.code;
    }

    private prepareProgram() {
        this.program = parseModule(this.scriptCode, MeriyahParseOptions) as Program;
        prepare(this.program, this);
    }

    private generateName() {
        let ident = this.relativePath.replace(/\\/g, "/");
        ident = ident.replace(/[^A-Za-z0-9\/]/g, '_');
        return `${ident}_${this.translator.modules.size - 1}`;
    }

    public resolveExport(exported: string) {
        return this.exports.find(x => x.ExportIdentifier == exported)?.ScopeIdentifier;
    }

    public registerExport(local: string, exported: string) {
        console.log(`[${this.name}]: exported ${local} as ${exported}`);
        this.exports.push({ScopeIdentifier: local, ExportIdentifier: exported});
    }
}
