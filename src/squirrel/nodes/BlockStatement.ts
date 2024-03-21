//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement} from 'estree';

import {generateBodyCode, generateCodeWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<BlockStatement> {

    handleCodeGen(node: BlockStatement): Generator<string, void, unknown> {
        return generateCodeWithScope(() => generateBodyCode(node));
    }
}