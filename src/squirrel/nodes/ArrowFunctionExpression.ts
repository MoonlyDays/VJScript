//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrowFunctionExpression} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrowFunctionExpression> {
    handlePrepare(path: NodePath<ArrowFunctionExpression>) {

        const node = path.node;
        if (!is.blockStatement(node.body)) {
            node.body = b.blockStatement([b.returnStatement(node.body)]);
        }

        path.replaceWith(b.functionExpression(null, node.params, node.body, node.generator, node.async));
    }
}