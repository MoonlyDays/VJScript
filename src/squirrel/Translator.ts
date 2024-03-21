//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Statement} from 'estree';
import {builders as b, is} from 'estree-toolkit';
import fs from 'fs';
import path from 'path';

import {codeGen} from './handler';
import {Module} from './Module';
import {ModuleHelpers} from "./helpers/ModuleHelpers";
import {IDENTIFIER_HELPER_MODULE_DECLARE, IDENTIFIER_HELPER_MODULE_RESOLVE} from "./consts";
import {IdentifyHelpers} from "./helpers/IdentifyHelpers";
import {LookupHelpers} from "./helpers/LookupHelpers";

/**
 * Class that handles translating script file
 * from JavaScript to Squirrel.
 */
export class Translator {
    /**
     * Root directory of the package for the script that we're processing.
     */
    public packageDir: string;
    /**
     * List of modules that are involved in the current script.
     */
    public modules = new Map<string, Module>();
    /**
     * The entry module for the script.
     */
    public entryModule: Module;

    constructor(entryScript: string) {
        this.packageDir = ModuleHelpers.determinePackageRoot(entryScript);
        this.entryModule = this.includeModule(entryScript);
    }

    /**
     * Convert absolute path of the file to relative to the package directory.
     * @param absPath
     */
    public resolvePackageFile(absPath: string) {
        return absPath.replace(this.packageDir + '\\', '');
    }

    /**
     * Generate AST that contains all the module
     * declarations bundled together, with entry module
     * being resolved in the end.
     */
    public generateBundleAST() {
        const program = b.program([], 'module');

        for (const pair of this.modules) {
            const module = pair[1];
            const body = module.program.body as Statement[];

            program.body.push(b.expressionStatement(b.callExpression(
                b.identifier(IDENTIFIER_HELPER_MODULE_DECLARE),
                [
                    b.literal(module.name),
                    b.functionExpression(null, [], b.blockStatement(body))
                ]
            )));
        }

        program.body.push(b.expressionStatement(b.callExpression(
            b.identifier(IDENTIFIER_HELPER_MODULE_RESOLVE),
            [b.literal(this.entryModule.name)]
        )));

        return program;
    }

    public translate() {
        return codeGen(this.generateBundleAST());
    }

    /**
     * Add included module to the bundle.
     * @param modulePath
     */
    public includeModule(modulePath: string) {
        modulePath = path.resolve(process.cwd(), modulePath);
        let module = this.modules.get(modulePath);
        if (module) return module;

        if (!fs.existsSync(modulePath))
            return null;

        module = new Module(this, modulePath);
        return module;
    }
}