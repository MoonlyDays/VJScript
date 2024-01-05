//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {RestElement} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<RestElement> {

    handlePrepare(path: NodePath<RestElement>) {

        const node = path.node;
        if (is.identifier(node.argument)) {

            const arg = node.argument;
            if (is.identifier(arg)) {

                path.scope.renameBinding(arg.name, 'vargv');
            }
        }
    }

    * handleGenerate(): Generator<string, void, unknown> {
        yield '...';
    }
}