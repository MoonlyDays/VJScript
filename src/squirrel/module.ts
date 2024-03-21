//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as babel from '@babel/core';
import {Identifier, Program} from 'estree';
import fs from 'fs';
import {Options, parseModule} from 'meriyah';
import path from 'path';

import {prepareSyntaxTree} from './handler';
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
        prepareSyntaxTree(this.program, this);
    }

    private generateName() {
        let ident = this.relativePath.replace(/\\/g, '/');
        ident = ident.replace(/[^A-Za-z0-9\/]/g, '_');
        return `${ident}_${this.translator.modules.size - 1}`;
    }


    /**
     * Try to resolve an imported path into an actual Module instance. This is
     * used to figure out the path when we're using require() function.
     * @param importPath
     * @param currentModule
     */
    static resolveImportedPath(importPath: string, currentModule: Module): Module {

        // If module path doesn't start with a dot notation, we're most likely
        // trying to include a module inside node_modules directory.
        if (!importPath.startsWith('.')) {
            const pack = this.resolvePackageByName(importPath, currentModule);
            if (pack) {
                return pack;
            }
        }

        // Import path should be resolved relative to the module that is importing.
        importPath = path.resolve(currentModule.parsedPath.dir, importPath);
        const parsedPath = path.parse(importPath);
        importPath = path.format({...parsedPath, base: '', ext: currentModule.parsedPath.ext});
        return currentModule.translator.includeModule(importPath);
    }

    /**
     * Resolve the name of the package module (usually identified by its name)
     * into a Module instance.
     * @param packageName
     * @param currentModule
     */
    static resolvePackageByName(packageName: string, currentModule: Module): Module {
        const packageDir = path.resolve(currentModule.translator.packageDir, 'node_modules', packageName);
        const packageJson = path.resolve(packageDir, 'package.json');

        if (!fs.existsSync(packageJson))
            return;

        // Read that file and get the entry main file.
        const packageRaw = fs.readFileSync(packageJson, {encoding: 'utf-8'});
        const packageInfo = JSON.parse(packageRaw);

        const entryScript = packageInfo.main || './index.js';
        const entryScriptPath = path.resolve(packageDir, entryScript);

        if (!fs.existsSync(entryScriptPath)) {
            throw Error(`resolvePackageModule: Could not resolve entry script path for package "${packageName} (${entryScript})"`);
        }

        return currentModule.translator.includeModule(entryScriptPath);
    }

    /**
     * Determine the root directory for the package of the provided script file path.
     * @param modulePath
     */
    static determinePackageRoot(modulePath: string) {
        modulePath = path.resolve(process.cwd(), modulePath);
        modulePath = path.parse(modulePath).dir;
        const dirs = modulePath.split('\\');

        do {
            const curDir = dirs.join('\\');
            const packageDir = curDir + '\\package.json';

            if (fs.existsSync(packageDir))
                return curDir;

            dirs.pop();
        } while (dirs.length > 0);

        throw Error('Could not determine a package root directory.');
    }
}
