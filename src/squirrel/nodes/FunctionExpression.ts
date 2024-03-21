//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {FunctionExpression} from 'estree';
import {NodePath} from 'estree-toolkit';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<FunctionExpression> {

    handlePrepare(path: NodePath<FunctionExpression>) {
        // Function expression must not contain a name.
        const node = path.node;
        node.id = null;
    }

    handleCodeGen(node: FunctionExpression): Generator<string, void, unknown> {
        return GeneratorHelpers.function(node);
    }
}