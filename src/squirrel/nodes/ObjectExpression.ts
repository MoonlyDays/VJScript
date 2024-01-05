//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ObjectExpression} from 'estree';

import {generateBody, generateWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ObjectExpression> {
    * handleGenerate(node: ObjectExpression): Generator<string, void, unknown> {
        yield* generateWithScope(() => generateBody({body: node.properties}));
    }
}