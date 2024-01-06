//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ImportDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

import {isDeclarativeModule, resolveImportedModule} from '../helpers/module';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<ImportDeclaration> {

    handlePrepare(path: NodePath<ImportDeclaration>, state: TraverseState) {

        const module = state.module;
        if (!module) {
            throw Error('ImportDeclaration: No Module provided.');
        }

        const node = path.node;
        let scopeIdent = path.scope.generateUidIdentifier();
        const polyfill = state.translator.polyfillFromFile(module, path, 'module.js');

        const importPath = node.source.value.toString();
        const declarativeModule = isDeclarativeModule(importPath);

        const importedModule = resolveImportedModule(importPath, module);
        if (!importedModule && !declarativeModule) {
            throw Error(`ImportDeclaration: Could not resolve module "${importPath}"`);
        }

        for (const specifier of node.specifiers) {

            if (is.importSpecifier(specifier)) {

                if (declarativeModule) {
                    path.remove();
                    return;
                }

                path.insertAfter([
                    b.variableDeclaration('const', [
                        b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, specifier.imported)),
                    ])
                ]);

            } else if (is.importDefaultSpecifier(specifier)) {

                const defaultImport = importedModule.defaultExportIdentifier;
                if (!defaultImport) {
                    throw Error('ImportDeclaration: Default specifier without a default export.');
                }

                path.insertAfter([
                    b.variableDeclaration('const', [
                        b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, defaultImport)),
                    ])
                ]);

            } else if (is.importNamespaceSpecifier(specifier)) {
                scopeIdent = specifier.local;
            }
        }

        path.replaceWith(b.variableDeclaration('const', [
            b.variableDeclarator(scopeIdent, b.callExpression(
                b.identifier(polyfill.get('resolveModule')),
                [b.literal(importedModule.name)]
            ))
        ]));
    }
}