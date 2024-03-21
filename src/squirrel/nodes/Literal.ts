//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Literal} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {IdentifyHelpers} from '../helpers/IdentifyHelpers';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<Literal> {

    handlePrepare(path: NodePath<Literal>) {

        // We're not wrapping null values in helper.
        if(this.isNullLiteral(path.node))
            return;

        // This literal is already wrapped in helper.
        if (IdentifyHelpers.wrappedInsideInteropHelper(path))
            return;

        path.replaceWith(b.callExpression(
            b.identifier('__'),
            [path.cloneNode()]
        ));
    }

    * handleCodeGen(node: Literal): Generator<string, void, unknown> {
        yield JSON.stringify(node.value);
    }

    isNullLiteral(node: Literal) {
        return node.value == null;
    }
}
