//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ImportDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

import {isDeclarativeModule, resolveImportedModule} from '../helpers/module';
import {NodeHandler, TraverseState} from './NodeHandler';
import {IDENTIFIER_DEFAULT_EXPORT} from '../helpers/consts';

export default class extends NodeHandler<ImportDeclaration> {

    handlePrepare(path: NodePath<ImportDeclaration>, state: TraverseState) {

        const module = state.module;
        if (!module) {
            throw Error('ImportDeclaration: No Module provided.');
        }

        const node = path.node;
        const importPath = node.source.value.toString();
        const importedModule = resolveImportedModule(importPath, module);
        if (!importedModule) {
            throw Error(`ImportDeclaration: Could not resolve module "${importPath}"`);
        }

        const polyfill = state.translator.polyfillFromFile(module, path, 'module.js');
        const importedScopeIdent = path.scope.generateUidIdentifier('_importScope');

        // Declare a temporary variable containing the module scope.
        const callExpressionNode = b.callExpression(
            b.identifier(polyfill.get('resolveModule')),
            [b.literal(importedModule.name)]
        );

        for (const specifier of node.specifiers) {

            if (is.importSpecifier(specifier)) {

                const importedSlot = importedModule.resolveExport(specifier.imported.name);
                if (!importedSlot) {
                    throw Error(`ImportDeclaration: Imported module does not provide an export named "${specifier.imported.name}"`);
                }

                path.insertBefore([b.variableDeclaration('const', [
                    b.variableDeclarator(
                        specifier.local,
                        b.memberExpression(
                            importedScopeIdent,
                            b.identifier(importedSlot)
                        )
                    ),
                ])]);

                continue;
            }

            if (is.importDefaultSpecifier(specifier)) {

                const importedSlot = importedModule.resolveExport(IDENTIFIER_DEFAULT_EXPORT);
                if (!importedSlot) {
                    throw Error('ImportDeclaration: Imported module does not provide a default export.');
                }

                path.insertBefore([b.variableDeclaration('const', [
                    b.variableDeclarator(
                        specifier.local,
                        b.memberExpression(importedScopeIdent, b.identifier(importedSlot))
                    ),
                ])]);


                continue;
            }

            if (is.importNamespaceSpecifier(specifier)) {

                path.insertBefore([b.variableDeclaration('const', [
                    b.variableDeclarator(specifier.local, callExpressionNode),
                ])]);
            }
        }

        path.remove();
        path.scope.crawl();
    }
}