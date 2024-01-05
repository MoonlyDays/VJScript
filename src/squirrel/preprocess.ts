//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {  MethodDefinition,     Node, } from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';

import {Module} from './module';

export function preprocess(node: Node, module?: Module) {

        ImportDeclaration: (nodePath, state) => {
            const module = state.module;
            if (!module) {
                throw Error('Import Declaration in preprocess without Module provided.');
            }

            const polyfill = module.translator.polyfillFromFile(module, nodePath, './polyfill/module.js');
            const node = nodePath.node;
            const scopeIdent = nodePath.scope.generateUidIdentifier();

            const importPath = node.source.value.toString();
            const importedModule = resolveImportedModule(importPath, module);
            if (!importedModule) {
                nodePath.remove();
                if (importPath.startsWith('./') || importPath.startsWith('../'))
                    return;

                throw Error(`Could not resolve module: ${importPath}`);
            }

            for (const specifier of node.specifiers) {
                if (is.importSpecifier(specifier)) {
                    nodePath.insertAfter([
                        b.variableDeclaration('const', [
                            b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, specifier.imported)),
                        ])
                    ]);
                }

                if (is.importDefaultSpecifier(specifier)) {
                    const defaultImport = importedModule.defaultExportIdent;
                    if (!defaultImport) {
                        throw Error('Import Default Specifier without a Default Export.');
                    }

                    nodePath.insertAfter([
                        b.variableDeclaration('const', [
                            b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, defaultImport)),
                        ])
                    ]);
                }
            }

            nodePath.replaceWith(b.variableDeclaration('const', [
                b.variableDeclarator(scopeIdent, b.callExpression(
                    b.identifier(polyfill.get('resolveModule')),
                    [b.literal(importedModule.name)]
                ))
            ]));
        },

        ExportDeclaration: (path, state) => {
            const node = path.node;
            if (is.exportNamedDeclaration(node)) {
                path.replaceWith(node.declaration);
            }

            if (is.exportDefaultDeclaration(node)) {
                const module = state.module;
                module.defaultExportIdent = path.scope.generateUidIdentifier('__js_export_default');

                let declaration = node.declaration;
                if (is.classDeclaration(declaration)) {
                    declaration = b.classExpression(declaration.id, declaration.body);
                }

                if (is.functionDeclaration(declaration)) {
                    declaration = b.functionExpression(declaration.id, declaration.params, declaration.body, declaration.generator, declaration.async);
                }

                path.replaceWith(b.expressionStatement(b.assignmentExpression(
                    '=',
                    module.defaultExportIdent,
                    declaration
                )));
            }
        }

    }, {module});
}

