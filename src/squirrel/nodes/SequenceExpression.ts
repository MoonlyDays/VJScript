//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {SequenceExpression} from 'estree';
import {builders as b,NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<SequenceExpression> {

    handlePrepare(path: NodePath<SequenceExpression>) {

        const node = path.node;
        const funcBody = [];
        for (let i = 0; i < node.expressions.length; i++) {
            const expr = node.expressions[i];

            if (i == (node.expressions.length - 1)) {
                funcBody.push(b.returnStatement(expr));
                continue;
            }

            funcBody.push(b.expressionStatement(expr));
        }

        path.replaceWith(b.callExpression(b.arrowFunctionExpression(
            [],
            b.blockStatement(funcBody)
        ), []));
    }
}