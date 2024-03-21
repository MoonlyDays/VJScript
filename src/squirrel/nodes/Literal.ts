//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Literal} from 'estree';
import {NodePath} from 'estree-toolkit';

import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<Literal> {

    handlePrepare(path: NodePath<Literal>, state: TraverseState) {
        super.handlePrepare(path, state);
    }

    * handleCodeGen(node: Literal): Generator<string, void, unknown> {
        yield JSON.stringify(node.value);
    }
}