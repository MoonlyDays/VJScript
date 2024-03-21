//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayExpression} from 'estree';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrayExpression> {

    * handleCodeGen(node: ArrayExpression): Generator<string, void, unknown> {

        yield '[';
        yield* GeneratorHelpers.arguments(node.elements);
        yield ']';
    }
}