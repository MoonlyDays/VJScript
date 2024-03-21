//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForInStatement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {LoopHelpers} from '../helpers/LoopHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForInStatement> {

    handlePrepare(path: NodePath<ForInStatement>) {
        const node = path.node;
        LoopHelpers.normalizeStatement(path);

        if (is.variableDeclaration(node.left)) {
            throw Error('ForInStatement: "left" must not be VariableDeclaration! Something went wrong!');
        }

        let left = node.left;
        const leftPath = path.get('left');
        if (!is.arrayPattern(left)) {
            left = b.arrayPattern([left]);
            leftPath.replaceWith(left);
        }

        if (left.elements.length < 2) {
            const extraIdent = leftPath.scope.generateUidIdentifier();
            left.elements.push(extraIdent);
        }

        path.replaceWith(b.forOfStatement(left, node.right, node.body, false));
    }
}