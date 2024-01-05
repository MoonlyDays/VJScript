//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Super} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<Super> {

    handlePrepare(path: NodePath<Super>) {

        // Is super is being directly invoked in a constructor
        if (is.callExpression(path.parent)) {
            const ctor = path.findParent(x => is.methodDefinition(x) && x.node.kind == 'constructor');
            if (ctor) {

                path.replaceWith(b.memberExpression(
                    b.super(),
                    b.identifier('constructor')
                ));
            }
        }
    }

    * handleGenerate(): Generator<string, void, unknown> {
        yield 'base';
    }

}