//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExportNamedDeclaration, Pattern} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {Module} from '../module';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<ExportNamedDeclaration> {
    handlePrepare(path: NodePath<ExportNamedDeclaration>, state: TraverseState) {

        const module = state.module;
        if (!module) {
            throw Error('ExportNamedDeclaration: No module provided.');
        }

        const node = path.node;
        const declaration = node.declaration;


        if (declaration) {
            if (is.variableDeclaration(declaration)) {

                path.insertAfter(declaration.declarations.map(x => {

                    crawlRegisterExports(module, x.id);
                    return b.expressionStatement(b.assignmentExpression(
                        '=', x.id, x.init || b.literal(null)
                    ));
                }));

                // We have to crawl the scope, because we removed the assignment
                // of the exported variables.

            } else if (is.functionDeclaration(declaration) || is.classDeclaration(declaration)) {
                const id = declaration.id;
                crawlRegisterExports(module, id);
                path.insertAfter([declaration]);
            }
        }

        // If we got any specifiers we want to run, replace us with them.
        // They will be deleted as soon as they are traversed anyway, so why bother.
        if (node.specifiers.length > 0) {
            path.replaceWithMultiple(node.specifiers);
        } else {
            path.remove();
            path.scope.crawl();
        }
    }

    * handleGenerate(): Generator<string, void, unknown> {
        yield '';
    }
}

export function crawlRegisterExports(module: Module, pattern: Pattern, alias?: string) {

    if (is.identifier(pattern)) {
        module.registerExport(pattern.name, alias || pattern.name);
        return;
    }

    if (is.arrayPattern(pattern)) {
        for (const element of pattern.elements) {
            crawlRegisterExports(module, element, alias);
        }
        return;
    }

    if (is.objectPattern(pattern)) {
        for (const prop of pattern.properties) {
            if (is.restElement(prop)) {
                throw Error('Rest Element export is not supported yet.');
            }

            crawlRegisterExports(module, prop.value, alias);
        }
        return;
    }

    throw Error(`Unhandled export pattern ${pattern.type}`);
}