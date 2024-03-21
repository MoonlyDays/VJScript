//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {NewExpression} from 'estree';

import {generateCode} from '../handler';
import {generateArgumentsCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<NewExpression> {
    * handleCodeGen(node: NewExpression): Generator<string, void, unknown> {
        yield generateCode(node.callee);
        yield '(';
        yield* generateArgumentsCode(node.arguments);
        yield ')';
    }
}