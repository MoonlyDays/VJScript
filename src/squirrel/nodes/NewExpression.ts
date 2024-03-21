//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {NewExpression} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<NewExpression> {
    * handleCodeGen(node: NewExpression): Generator<string, void, unknown> {
        yield codeGen(node.callee);
        yield '(';
        yield* GeneratorHelpers.arguments(node.arguments);
        yield ')';
    }
}