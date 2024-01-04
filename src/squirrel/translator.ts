//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program, Statement} from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';
import fs from 'fs';
import {parseScript} from 'meriyah';
import path from 'path';

import {generate} from './generate';
import {MeriyahParseOptions, Module} from './module';
import {normalizePolyfillStatement, Polyfill} from './polyfill';
import {preprocess} from './preprocess';

export class Translator {
    public polyfill: Polyfill[] = [];
    public modules = new Map<string, Module>();
    public entryModule: Module;

    constructor(entryScript: string) {
        this.entryModule = this.addModule(entryScript);
    }

    public bundle() {

        if (this.modules.size == 1) {
            return this.entryModule.program;
        }

        const program = b.program([], 'module');
        const modulePolyfill = this.polyfillFor('./polyfill/module.js');
        if (!modulePolyfill) {
            throw Error('Multiple modules with no Polyfill for its support?');
        }

        for (const polyfill of this.polyfill) {
            program.body.push(...polyfill.declaration.body);
        }

        for (const pair of this.modules) {
            const module = pair[1];
            const body = module.program.body.filter(x => is.statement(x)) as Statement[];

            program.body.push(b.expressionStatement(b.callExpression(
                b.identifier(modulePolyfill.get('declareModule')),
                [
                    b.literal(module.name),
                    b.functionExpression(null, [], b.blockStatement(body))
                ]
            )));
        }

        program.body.push(b.expressionStatement(b.callExpression(
            b.identifier(modulePolyfill.get('resolveModule')),
            [b.literal(this.entryModule.name)]
        )));

        return program;
    }

    public translate() {
        return generate(this.bundle());
    }

    public addModule(modulePath: string) {
        modulePath = path.resolve(process.cwd(), modulePath);
        let module = this.modules.get(modulePath);
        if (module) return module;

        // console.log(`Exploring new module: ${modulePath}`);
        module = new Module(this, modulePath);
        return module;
    }

    public polyfillFor(name: string) {
        return this.polyfill.find(x => x.name == name);
    }

    public polyfillFromFile(module: Module, nodePath: NodePath, file: string) {
        const polyfill = this.polyfillFor(file);
        if (polyfill) {
            return polyfill;
        }

        const absFile = path.resolve(__dirname, '../../', file);
        const code = fs.readFileSync(absFile, {encoding: 'utf-8'});

        return this.polyfillFromString(module, nodePath, file, code);
    }

    public polyfillFromString(module: Module, modulePath: NodePath, name: string, code: string) {
        let polyfill = this.polyfillFor(name);
        if (polyfill) {
            return polyfill;
        }

        const program = parseScript(code, MeriyahParseOptions) as Program;

        const moduleProgramPath = modulePath.scope.getProgramScope().path;
        if (!is.program(moduleProgramPath))
            return;

        polyfill = new Polyfill();
        let polyfillPath: NodePath<Program>;
        traverse(program, {$: {scope: true}, Program: path => polyfillPath = path});

        program.body = program.body.map(x => normalizePolyfillStatement(x, modulePath, polyfillPath, polyfill));

        preprocess(program, module);
        polyfill.name = name;
        polyfill.declaration = program;
        this.polyfill.push(polyfill);
        return polyfill;
    }
}