//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ObjectExpression} from 'estree';

import {generateBodyCode, generateCodeWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ObjectExpression> {
    * handleCodeGen(node: ObjectExpression): Generator<string, void, unknown> {
        yield* generateCodeWithScope(() => generateBodyCode({
            body: node.properties
        }));
    }
}