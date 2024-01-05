//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program} from 'estree';

import {generateBody} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<Program> {
    handleGenerate(node: Program): Generator<string, void, unknown> {
        return generateBody(node);
    }
}