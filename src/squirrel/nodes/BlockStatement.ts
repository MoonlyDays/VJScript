//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement} from 'estree';

import {generateBody, generateWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<BlockStatement> {
    handleGenerate(node: BlockStatement): Generator<string, void, unknown> {
        return generateWithScope(() => generateBody(node));
    }
}