//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrowFunctionExpression} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

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