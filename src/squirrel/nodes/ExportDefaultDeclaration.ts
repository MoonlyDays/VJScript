//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Declaration, ExportDefaultDeclaration, Identifier} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_DEFAULT_EXPORT} from '../helpers/consts';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<ExportDefaultDeclaration> {
    handlePrepare(path: NodePath<ExportDefaultDeclaration>, state: TraverseState) {
        const module = state.module;
        if (!module) {
            throw Error('ExportDefaultDeclaration: No module provided.');
        }

        const node = path.node;
        const declaration = node.declaration;

        const defaultIdent = path.scope.generateUidIdentifier(IDENTIFIER_DEFAULT_EXPORT);
        const defaultVacant = defaultIdent.name == IDENTIFIER_DEFAULT_EXPORT;

        let exportIdent: Identifier;
        let exportDeclaration: Declaration;

        // If we're just given an expression.

        if (is.declaration(declaration)) {
            declaration.id ??= defaultIdent;
            exportDeclaration = declaration;
            exportIdent = declaration.id;
        }

        if (is.expression(declaration)) {
            exportIdent = defaultIdent;
            exportDeclaration = b.variableDeclaration('let', [
                b.variableDeclarator(defaultIdent, declaration)
            ]);
        }

        if (defaultVacant) {
            path.replaceWith(b.exportNamedDeclaration(exportDeclaration));
            return;
        }

        path.insertBefore([exportDeclaration]);
        path.replaceWith(b.exportNamedDeclaration(null, [
            b.exportSpecifier(exportIdent, b.identifier(IDENTIFIER_DEFAULT_EXPORT))
        ]));
    }
}