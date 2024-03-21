//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayExpression} from 'estree';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<ArrayExpression> {

    * handleCodeGen(node: ArrayExpression): Generator<string, void, unknown> {

        yield '[';
        yield* GeneratorHelpers.arguments(node.elements);
        yield ']';
    }
}