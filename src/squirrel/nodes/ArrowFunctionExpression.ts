//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrowFunctionExpression} from 'estree';

import {NodeHandler} from './NodeHandler';
import {codeGen} from "../handler";
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<ArrowFunctionExpression> {

    * handleCodeGen(node: ArrowFunctionExpression): Generator<string, void, unknown> {
        yield "@(";
        yield* GeneratorHelpers.arguments(node.params);
        yield ") ";
        yield codeGen(node.body);
    }
}