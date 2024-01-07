//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExportNamedDeclaration, Identifier, Pattern} from 'estree';
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

        let sourceImportIdent: Identifier;
        if (node.source) {
            sourceImportIdent = path.scope.generateUidIdentifier('_import');

            path.insertBefore([b.importDeclaration([
                b.importNamespaceSpecifier(sourceImportIdent)
            ], node.source)]);
        }

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

        for (const specifier of node.specifiers) {

            if (node.source && sourceImportIdent) {
                const exportIdent = path.scope.generateUidIdentifier('_export');
                path.insertAfter([b.expressionStatement(b.assignmentExpression(
                    '=',
                    exportIdent,
                    b.memberExpression(sourceImportIdent, specifier.local)
                ))]);

                specifier.local = exportIdent;
            }

            const local = specifier.local;
            const exported = specifier.exported;
            module.registerExport(local.name, exported.name);
        }

        path.remove();
        path.scope.crawl();
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