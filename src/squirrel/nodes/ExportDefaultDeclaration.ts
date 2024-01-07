//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Declaration, ExportDefaultDeclaration, Expression, Identifier} from 'estree';
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
        let exportExpr = node.declaration;

        if (is.classDeclaration(exportExpr)) {

            exportExpr = b.classExpression(
                null,
                exportExpr.body,
                exportExpr.superClass
            );
        } else if (is.functionDeclaration(exportExpr)) {

            exportExpr = b.functionExpression(
                null,
                exportExpr.params,
                exportExpr.body,
                exportExpr.generator,
                exportExpr.async
            );
        }

        const defaultIdent = b.identifier(IDENTIFIER_DEFAULT_EXPORT);
        path.insertBefore([
            b.expressionStatement(b.assignmentExpression(
                '=',
                defaultIdent,
                exportExpr
            ))
        ]);

        path.replaceWith(b.exportNamedDeclaration(null, [
            b.exportSpecifier(defaultIdent, defaultIdent)
        ]));
    }
}