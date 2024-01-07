//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {SequenceExpression} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<SequenceExpression> {

    handlePrepare(path: NodePath<SequenceExpression>) {

        if (handleVoidExpressions(path))
            return;

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

function handleVoidExpressions(path: NodePath<SequenceExpression>) {

    const node = path.node;
    if (node.expressions.length != 2)
        return false;

    const first = node.expressions[0];
    if (!is.literal(first))
        return false;

    if (first.value !== 0)
        return false;

    path.replaceWith(node.expressions[1]);
    return true;
}