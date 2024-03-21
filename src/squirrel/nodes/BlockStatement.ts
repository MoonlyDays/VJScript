//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement} from 'estree';
import {NodePath} from 'estree-toolkit';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<BlockStatement> {

    handlePrepare(path: NodePath<BlockStatement>, state: TraverseState) {
        const node = path.node;
    }

    handleCodeGen(node: BlockStatement): Generator<string, void, unknown> {
        return GeneratorHelpers.withScope(() => GeneratorHelpers.body(node));
    }
}