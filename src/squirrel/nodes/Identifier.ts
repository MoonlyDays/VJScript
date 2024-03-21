//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {NodeHandler, TraverseState} from './NodeHandler';
import {Attributes} from "../Attributes";

export default class extends NodeHandler<Identifier> {
    handlePrepare(path: NodePath<Identifier>, state: TraverseState) {

        const node = path.node;

        // base is a reserved keyword, and we're only allowed to use it if we're
        // inside a call and base is the deepest identifier.
        if (node.name == 'base') {
            node.name = '_base';
        }

        const isProperty = is.memberExpression(path.parentPath) && path.parentKey == 'property';
        if (isProperty)
            return;

        Attributes.process(path, state.module);
    }

    * handleCodeGen(node: Identifier): Generator<string, void, unknown> {
        yield node.name;
    }
}