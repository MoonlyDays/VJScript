//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression} from 'estree';

import {generateCode} from '../handler';
import {generateArgumentsCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<CallExpression> {

    * handleCodeGen(node: CallExpression): Generator<string, void, unknown> {

        yield generateCode(node.callee);
        yield '(';
        yield* generateArgumentsCode(node.arguments);
        yield ')';
    }
}