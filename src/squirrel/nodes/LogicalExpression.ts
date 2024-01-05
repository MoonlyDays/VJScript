//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {LogicalExpression} from 'estree';

import {generateBinaryOperatorExpression} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<LogicalExpression> {

    handleGenerate(node: LogicalExpression): Generator<string, void, unknown> {
        return generateBinaryOperatorExpression(node);
    }

}